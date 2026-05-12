import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../styles/theme";

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  returnKeyType = "next",
  onSubmitEditing,
  inputRef,
}) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ color: colors.text, fontWeight: "900", marginBottom: 8 }}>{label}</Text>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={returnKeyType === "done"}
        style={{
          backgroundColor: colors.surface,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: 13,
          fontSize: 15,
        }}
      />
    </View>
  );
}

function MessageBox({ type = "info", children }) {
  const isError = type === "error";
  const borderColor = isError ? colors.danger : colors.primary;
  const backgroundColor = isError ? "rgba(239,68,68,0.10)" : "rgba(139,92,246,0.12)";

  return (
    <View style={{ borderWidth: 1, borderColor, backgroundColor, borderRadius: 16, padding: 12, marginTop: 14 }}>
      <Text style={{ color: colors.text, lineHeight: 20 }}>{children}</Text>
    </View>
  );
}

export default function AuthScreen() {
  const { signIn, signUp, loadingAuth, authError, authNotice, isSupabaseConfigured } = useAuth();
  const insets = useSafeAreaInsets();
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const cleanEmail = email.trim().toLowerCase();
  const isSignup = mode === "signup";

  function switchMode(nextMode) {
    setMode(nextMode);
    setConfirmPassword("");
  }

  async function handleSubmit() {
    if (!cleanEmail || !password) {
      Alert.alert("Campos obrigatórios", "Digite seu e-mail e senha para continuar.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Senha curta", "Use uma senha com pelo menos 6 caracteres.");
      return;
    }

    if (isSignup && password !== confirmPassword) {
      Alert.alert("Senhas diferentes", "Digite a mesma senha nos dois campos.");
      return;
    }

    setBusy(true);
    try {
      const action = isSignup ? signUp : signIn;
      const { error } = await action(cleanEmail, password);

      if (error) {
        Alert.alert("Não foi possível continuar", error.message);
        return;
      }

      if (isSignup) {
        const message = data?.session
          ? "Sua conta foi criada com sucesso e você já está conectado ao CineMood."
          : "Sua conta foi criada. Verifique seu e-mail para confirmar antes de entrar. Para testes, você pode desativar a confirmação de e-mail no painel Authentication do Supabase.";
        Alert.alert("Conta criada", message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 22,
          paddingTop: Math.max(insets.top + 24, 44),
          paddingBottom: Math.max(insets.bottom + 28, 44),
        }}
      >
        <Text style={{ color: colors.text, fontSize: 38, fontWeight: "900" }}>CineMood</Text>
        <Text style={{ color: colors.muted, marginTop: 8, fontSize: 15, lineHeight: 22 }}>
          Entre para manter seus filmes, listas, anotações, notas e clubes salvos na sua conta.
        </Text>

        {!isSupabaseConfigured && (
          <MessageBox type="error">
            A conexão da conta ainda não foi configurada. Crie o arquivo .env com a URL e a chave pública do seu projeto.
          </MessageBox>
        )}

        {!!authNotice && <MessageBox>{authNotice}</MessageBox>}
        {!!authError && <MessageBox type="error">{authError}</MessageBox>}

        <View
          style={{
            marginTop: 24,
            backgroundColor: colors.surfaceLight,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 24,
            padding: 16,
          }}
        >
          <View style={{ flexDirection: "row", backgroundColor: colors.background, borderRadius: 999, padding: 4 }}>
            <TouchableOpacity
              onPress={() => switchMode("login")}
              style={{ flex: 1, backgroundColor: mode === "login" ? colors.primary : "transparent", borderRadius: 999, padding: 10 }}
            >
              <Text style={{ color: colors.text, textAlign: "center", fontWeight: "900" }}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => switchMode("signup")}
              style={{ flex: 1, backgroundColor: mode === "signup" ? colors.primary : "transparent", borderRadius: 999, padding: 10 }}
            >
              <Text style={{ color: colors.text, textAlign: "center", fontWeight: "900" }}>Criar conta</Text>
            </TouchableOpacity>
          </View>

          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            onSubmitEditing={() => passwordRef.current?.focus?.()}
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            inputRef={passwordRef}
            returnKeyType={isSignup ? "next" : "done"}
            onSubmitEditing={() => (isSignup ? confirmPasswordRef.current?.focus?.() : handleSubmit())}
          />

          {isSignup && (
            <Field
              label="Confirmar senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repita sua senha"
              secureTextEntry
              inputRef={confirmPasswordRef}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          )}

          <TouchableOpacity
            disabled={busy || loadingAuth}
            activeOpacity={0.85}
            onPress={handleSubmit}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 18,
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 15 }}>
                {mode === "login" ? "Entrar no CineMood" : "Criar minha conta"}
              </Text>
            )}
          </TouchableOpacity>

        </View>

        <Text style={{ color: colors.muted, marginTop: 14, fontSize: 12, lineHeight: 18 }}>
          Para testes sem bloqueio por e-mail, desative a confirmação de e-mail no Supabase. Assim a conta entra direto após o cadastro.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
