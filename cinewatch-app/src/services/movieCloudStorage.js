import { initialMovieState } from "../storage/movieStorage";
import { isSupabaseConfigured, supabase } from "./supabase";

export async function loadCloudMovieState(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  const { data, error } = await supabase
    .from("user_movie_data")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data?.data || null;
}

export async function saveCloudMovieState(userId, state) {
  if (!isSupabaseConfigured || !supabase || !userId) return null;

  const payload = {
    user_id: userId,
    data: { ...initialMovieState, ...(state || {}) },
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_movie_data")
    .upsert(payload, { onConflict: "user_id" })
    .select("user_id, updated_at")
    .single();

  if (error) throw error;
  return data;
}
