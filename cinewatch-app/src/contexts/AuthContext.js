import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Linking } from "react-native";
import { authRedirectTo, isSupabaseConfigured, supabase } from "../services/supabase";

const AuthContext = createContext(null);

function getFriendlyAuthError(message = "") {
  const text = String(message || "").toLowerCase();

  if (text.includes("invalid login") || text.includes("invalid credentials")) {
    return "E-mail ou senha incorretos.";
  }

  if (text.includes("email not confirmed") || text.includes("not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Se não encontrar a mensagem, aguarde um pouco antes de reenviar.";
  }

  if (text.includes("already registered") || text.includes("user already")) {
    return "Esse e-mail já tem uma conta. Tente entrar ou use outro e-mail.";
  }

  if (
    text.includes("rate limit") ||
    text.includes("too many") ||
    text.includes("email rate") ||
    text.includes("over_email_send_rate_limit") ||
    text.includes("otp_disabled")
  ) {
    return "O envio de e-mails ou tentativas de acesso foi pausado por segurança. Aguarde alguns minutos antes de tentar novamente.";
  }

  if (text.includes("network") || text.includes("fetch")) {
    return "Não foi possível conectar agora. Verifique sua internet e tente novamente.";
  }

  return message || "Não foi possível concluir a ação agora.";
}

function extractParamsFromUrl(url = "") {
  const params = {};
  const [, queryString = ""] = url.split("?");
  const [, hashString = ""] = url.split("#");
  const combined = [queryString.split("#")[0], hashString].filter(Boolean).join("&");

  combined.split("&").forEach((item) => {
    if (!item) return;
    const [rawKey, rawValue = ""] = item.split("=");
    if (!rawKey) return;
    params[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue.replace(/\+/g, " "));
  });

  return params;
}

async function ensureProfile(user) {
  if (!user || !supabase) return;

  const username = user.email?.split("@")[0] || "usuário";
  const { error } = await supabase.from("profiles").insert({ id: user.id, username }).select("id").single();

  // Código 23505 = registro já existe. Não sobrescrevemos o perfil salvo pelo usuário.
  if (error && error.code !== "23505") {
    // Evita expor erro técnico no app. O perfil também é criado pelo trigger do banco.
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authNotice, setAuthNotice] = useState(null);

  async function createSessionFromUrl(url) {
    if (!supabase || !url) return { session: null, error: null };

    const params = extractParamsFromUrl(url);

    if (params.error || params.error_code) {
      const message = getFriendlyAuthError(params.error_description || params.error || params.error_code);
      setAuthError(message);
      return { session: null, error: { message } };
    }

    if (params.code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);

      if (error) {
        const message = getFriendlyAuthError(error.message);
        setAuthError(message);
        return { session: null, error: { message } };
      }

      setAuthNotice("E-mail confirmado! Você já está conectado ao CineMood.");
      return { session: data?.session || null, error: null };
    }

    if (params.access_token && params.refresh_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });

      if (error) {
        const message = getFriendlyAuthError(error.message);
        setAuthError(message);
        return { session: null, error: { message } };
      }

      setAuthNotice("E-mail confirmado! Você já está conectado ao CineMood.");
      return { session: data?.session || null, error: null };
    }

    if (params.token_hash && params.type) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: params.token_hash,
        type: params.type,
      });

      if (error) {
        const message = getFriendlyAuthError(error.message);
        setAuthError(message);
        return { session: null, error: { message } };
      }

      setAuthNotice("E-mail confirmado! Você já está conectado ao CineMood.");
      return { session: data?.session || null, error: null };
    }

    return { session: null, error: null };
  }

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      if (!isSupabaseConfigured || !supabase) {
        setLoadingAuth(false);
        return;
      }

      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await createSessionFromUrl(initialUrl);
      }

      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) setAuthError(getFriendlyAuthError(error.message));
      setSession(data?.session || null);
      if (data?.session?.user) await ensureProfile(data.session.user);
      setLoadingAuth(false);
    }

    loadSession();

    if (!isSupabaseConfigured || !supabase) return () => {};

    const linkingSubscription = Linking.addEventListener("url", async ({ url }) => {
      const result = await createSessionFromUrl(url);
      if (result?.session) {
        setSession(result.session);
        await ensureProfile(result.session.user);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSession(data?.session || null);
      if (data?.session?.user) await ensureProfile(data.session.user);
    });

    const { data } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession || null);
      if (currentSession?.user) await ensureProfile(currentSession.user);
    });

    return () => {
      mounted = false;
      linkingSubscription?.remove?.();
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  async function signIn(email, password) {
    setAuthError(null);
    setAuthNotice(null);
    if (!isSupabaseConfigured || !supabase) {
      const message = "Configure as variáveis do Supabase no arquivo .env antes de entrar.";
      setAuthError(message);
      return { error: { message } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const message = getFriendlyAuthError(error.message);
      setAuthError(message);
      return { data, error: { ...error, message } };
    }
    return { data, error: null };
  }

  async function signUp(email, password) {
    setAuthError(null);
    setAuthNotice(null);
    if (!isSupabaseConfigured || !supabase) {
      const message = "Configure as variáveis do Supabase no arquivo .env antes de criar conta.";
      setAuthError(message);
      return { error: { message } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      const message = getFriendlyAuthError(error.message);
      setAuthError(message);
      return { data, error: { ...error, message } };
    }

    if (data?.session) {
      setAuthNotice("Conta criada! Você já está conectado ao CineMood.");
    } else {
      setAuthNotice("Conta criada. Se o app pedir confirmação, desative a confirmação de e-mail no painel do Supabase para testes.");
    }

    return { data, error: null };
  }

  async function resendConfirmation(email) {
    setAuthError(null);
    setAuthNotice(null);
    if (!isSupabaseConfigured || !supabase) {
      const message = "Configure as variáveis do Supabase no arquivo .env antes de reenviar o e-mail.";
      setAuthError(message);
      return { error: { message } };
    }

    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: authRedirectTo },
    });

    if (error) {
      const message = getFriendlyAuthError(error.message);
      setAuthError(message);
      return { data, error: { ...error, message } };
    }

    setAuthNotice("E-mail de confirmação reenviado. Confira sua caixa de entrada e o spam.");
    return { data, error: null };
  }

  async function updatePassword(newPassword) {
    setAuthError(null);
    if (!supabase) return { error: { message: "Conexão da conta não configurada." } };
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      const message = getFriendlyAuthError(error.message);
      setAuthError(message);
      return { data, error: { ...error, message } };
    }
    return { data, error: null };
  }

  async function signOut() {
    setAuthError(null);
    setAuthNotice(null);
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setAuthError(getFriendlyAuthError(error.message));
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      loadingAuth,
      authError,
      authNotice,
      authRedirectTo,
      isSupabaseConfigured,
      signIn,
      signUp,
      resendConfirmation,
      updatePassword,
      signOut,
    }),
    [session, loadingAuth, authError, authNotice]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider");
  }
  return context;
}
