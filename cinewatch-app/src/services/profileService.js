import { decode } from "base64-arraybuffer";
import { isSupabaseConfigured, supabase } from "./supabase";

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase não configurado. Preencha as variáveis do .env.");
  }
}

export async function getMyProfile(userId) {
  ensureSupabase();

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw error;
  return data;
}

export async function updateMyProfile(userId, values) {
  ensureSupabase();

  const payload = {
    id: userId,
    username: values.username?.trim() || "usuário",
    full_name: values.full_name?.trim() || null,
    bio: values.bio?.trim() || null,
    favorite_genres: Array.isArray(values.favorite_genres)
      ? values.favorite_genres.map((id) => Number(id)).filter(Boolean)
      : [],
    streaming_platforms: Array.isArray(values.streaming_platforms)
      ? values.streaming_platforms.filter(Boolean)
      : [],
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" }).select("*").single();
  if (error) throw error;
  return data;
}

export async function uploadProfilePhoto({ userId, asset }) {
  ensureSupabase();
  if (!asset?.base64) throw new Error("Não foi possível ler a imagem selecionada.");

  const extension = asset.fileName?.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = ["jpg", "jpeg", "png", "webp"].includes(extension) ? extension : "jpg";
  const contentType = asset.mimeType || (safeExtension === "png" ? "image/png" : "image/jpeg");
  const path = `${userId}/avatar-${Date.now()}.${safeExtension}`;

  const { error: uploadError } = await supabase.storage.from("profile-photos").upload(path, decode(asset.base64), {
    contentType,
    upsert: true,
  });
  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage.from("profile-photos").getPublicUrl(path);
  const avatarUrl = publicData?.publicUrl;

  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, avatar_path: path, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
