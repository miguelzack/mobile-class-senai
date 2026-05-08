import { discoverMoviesPage } from "./tmdb";
import { isSupabaseConfigured, supabase } from "./supabase";

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase não configurado. Preencha as variáveis do .env.");
  }
}

export const MOVIE_GENRES = [
  { id: 28, name: "Ação" },
  { id: 12, name: "Aventura" },
  { id: 16, name: "Animação" },
  { id: 35, name: "Comédia" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentário" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Família" },
  { id: 14, name: "Fantasia" },
  { id: 36, name: "História" },
  { id: 27, name: "Terror" },
  { id: 10402, name: "Música" },
  { id: 9648, name: "Mistério" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Ficção científica" },
  { id: 53, name: "Suspense" },
  { id: 10752, name: "Guerra" },
  { id: 37, name: "Faroeste" },
];

export const DEFAULT_ALLOWED_GENRES = [28, 12, 16, 35, 18, 10751, 14, 27, 9648, 10749, 878, 53];

export function getCurrentWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

export function createInviteCode() {
  return Math.random().toString(36).replace(/[^a-z0-9]/gi, "").slice(2, 8).toUpperCase();
}

export function isAdminRole(role) {
  return role === "owner" || role === "admin";
}

export async function listMyClubs(userId) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("club_members")
    .select("id, role, nickname, joined_at, movie_clubs(*)")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  if (error) throw error;

  return (data || [])
    .map((item) => ({
      ...(item.movie_clubs || {}),
      myRole: item.role,
      myNickname: item.nickname,
      myMembershipId: item.id,
    }))
    .filter((club) => club.id);
}

export async function createClub({ name, description, ownerId, allowedGenres = DEFAULT_ALLOWED_GENRES }) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("movie_clubs")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      owner_id: ownerId,
      invite_code: createInviteCode(),
      allowed_genres: allowedGenres,
      is_private: true,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function joinClubByCode(inviteCode) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("join_club_by_code", {
    p_invite_code: inviteCode.trim().toUpperCase(),
  });

  if (error) throw error;
  return data;
}

export async function getClub(clubId) {
  ensureSupabase();

  const { data, error } = await supabase.from("movie_clubs").select("*").eq("id", clubId).single();
  if (error) throw error;
  return data;
}

export async function updateClubSettings({ clubId, name, description, allowedGenres }) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("movie_clubs")
    .update({
      name: name.trim(),
      description: description?.trim() || null,
      allowed_genres: allowedGenres?.length ? allowedGenres : DEFAULT_ALLOWED_GENRES,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clubId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClub({ clubId }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("delete_movie_club", {
    p_club_id: clubId,
  });

  if (error) throw error;
  return data;
}

export async function regenerateClubInviteCode(clubId) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("regenerate_club_invite_code", {
    p_club_id: clubId,
    p_invite_code: createInviteCode(),
  });

  if (error) throw error;
  return data;
}

export async function listClubMembers(clubId) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("club_members")
    .select("id, role, nickname, joined_at, user_id, profiles(username, full_name, avatar_url)")
    .eq("club_id", clubId)
    .order("joined_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateClubMemberNickname({ clubId, memberId, nickname }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("update_club_member_nickname", {
    p_club_id: clubId,
    p_member_id: memberId,
    p_nickname: nickname?.trim() || null,
  });

  if (error) throw error;
  return data;
}

export async function setClubMemberRole({ clubId, memberId, role }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("set_club_member_role", {
    p_club_id: clubId,
    p_member_id: memberId,
    p_role: role,
  });

  if (error) throw error;
  return data;
}

export async function removeClubMember({ clubId, memberId }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("remove_club_member", {
    p_club_id: clubId,
    p_member_id: memberId,
  });

  if (error) throw error;
  return data;
}

export async function leaveClub({ clubId }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("leave_movie_club", {
    p_club_id: clubId,
  });

  if (error) throw error;
  return data;
}

export async function listClubMovies(clubId) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("club_movies")
    .select("*")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function listClubReviews(clubId) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("club_reviews")
    .select("*, profiles(username, full_name, avatar_url)")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function listClubVotes(clubId) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("club_movie_votes")
    .select("*, profiles(username, full_name, avatar_url)")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function listMyClubPersonalComments(clubId) {
  ensureSupabase();

  const { data, error } = await supabase
    .from("club_private_comments")
    .select("*")
    .eq("club_id", clubId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function generateWeeklySuggestions({ clubId, userId, allowedGenres = DEFAULT_ALLOWED_GENRES }) {
  ensureSupabase();

  const weekStart = getCurrentWeekStart();
  const genres = allowedGenres?.length ? allowedGenres : DEFAULT_ALLOWED_GENRES;
  const { data: existingMovies, error: existingError } = await supabase
    .from("club_movies")
    .select("movie_tmdb_id,status")
    .eq("club_id", clubId);

  if (existingError) throw existingError;

  const existingIds = new Set((existingMovies || []).map((item) => Number(item.movie_tmdb_id)).filter(Boolean));
  const watchedIds = new Set(
    (existingMovies || [])
      .filter((item) => item.status === "watched")
      .map((item) => Number(item.movie_tmdb_id))
      .filter(Boolean)
  );

  const randomPages = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5).slice(0, 4);

  const batches = await Promise.all(
    randomPages.map(async (page) => {
      const data = await discoverMoviesPage(
        {
          sort_by: "popularity.desc",
          with_genres: genres.join("|"),
          "vote_count.gte": "180",
          "vote_average.gte": "5.8",
        },
        page
      );
      return data.results;
    })
  );

  const seen = new Set();
  const movies = batches
    .flat()
    .filter((movie) => {
      if (!movie?.id || !movie.poster_path || seen.has(movie.id)) return false;
      if (existingIds.has(Number(movie.id)) || watchedIds.has(Number(movie.id))) return false;
      seen.add(movie.id);
      return true;
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  const payload = movies.map((movie) => ({
    club_id: clubId,
    movie,
    movie_tmdb_id: movie.id,
    suggested_by: userId,
    week_start: weekStart,
    status: "suggested",
  }));

  if (!payload.length) return [];

  const { data, error } = await supabase.from("club_movies").insert(payload).select("*");
  if (error) throw error;
  return data || [];
}

export async function suggestMovieToClub({ clubId, movie }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("add_club_movie_suggestion", {
    p_club_id: clubId,
    p_movie: movie,
    p_movie_tmdb_id: Number(movie.id),
    p_week_start: getCurrentWeekStart(),
  });

  if (error) throw error;
  return data;
}

export async function clearClubSuggestions({ clubId }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("clear_club_suggestions", {
    p_club_id: clubId,
  });

  if (error) throw error;
  return data;
}

export async function setVotingCandidates({ clubId, clubMovieIds, weekStart }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("set_club_voting_candidates", {
    p_club_id: clubId,
    p_club_movie_ids: clubMovieIds,
    p_week_start: weekStart || getCurrentWeekStart(),
  });

  if (error) throw error;
  return data || [];
}

export async function voteForClubMovie({ clubId, clubMovieId }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("vote_for_club_movie", {
    p_club_id: clubId,
    p_club_movie_id: clubMovieId,
  });

  if (error) throw error;
  return data;
}

export async function selectWeeklyMovie({ clubId, clubMovie }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("select_weekly_movie", {
    p_club_id: clubId,
    p_club_movie_id: clubMovie.id,
  });

  if (error) throw error;
  return data;
}

export async function markClubMovieWatched(clubMovieId) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("mark_club_movie_watched", {
    p_club_movie_id: clubMovieId,
  });

  if (error) throw error;
  return data;
}

export async function deleteClubMovie({ clubMovieId }) {
  ensureSupabase();

  const { data, error } = await supabase.rpc("remove_club_movie_suggestion", {
    p_club_movie_id: clubMovieId,
  });

  if (error) throw error;
  return data;
}

export async function submitClubReview({ clubId, clubMovieId, userId, rating, comment }) {
  ensureSupabase();

  const payload = {
    club_id: clubId,
    club_movie_id: clubMovieId,
    user_id: userId,
    rating,
    comment: comment?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("club_reviews")
    .upsert(payload, { onConflict: "club_movie_id,user_id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function submitClubPersonalComment({ clubId, clubMovieId, userId, note }) {
  ensureSupabase();

  const payload = {
    club_id: clubId,
    club_movie_id: clubMovieId,
    user_id: userId,
    note: note?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("club_private_comments")
    .upsert(payload, { onConflict: "club_movie_id,user_id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
