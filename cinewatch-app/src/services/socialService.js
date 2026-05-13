import { isSupabaseConfigured, supabase } from './supabase';

function ensure() { if (!isSupabaseConfigured || !supabase) throw new Error('Backend não configurado.'); }

export async function searchProfiles(query) {
  ensure();
  const q = query.trim();
  if (!q) return [];
  const { data, error } = await supabase.from('profiles').select('id, username, full_name, avatar_url, bio').or(`username.ilike.%${q}%,full_name.ilike.%${q}%`).limit(20);
  if (error) throw error;
  return data || [];
}

export async function followUser(targetUserId) {
  ensure();
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from('user_follows').upsert({ follower_id: userData.user.id, following_id: targetUserId }, { onConflict: 'follower_id,following_id' });
  if (error) throw error;
}

export async function unfollowUser(targetUserId) {
  ensure();
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from('user_follows').delete().eq('follower_id', userData.user.id).eq('following_id', targetUserId);
  if (error) throw error;
}

export async function listFriends() {
  ensure();
  const { data, error } = await supabase.from('user_follows').select('following:profiles!user_follows_following_id_fkey(id, username, full_name, avatar_url, bio)').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => row.following).filter(Boolean);
}

export async function getPublicProfile(userId) {
  ensure();
  const { data, error } = await supabase.from('profiles').select('id, username, full_name, avatar_url, bio, privacy').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function publishActivity(type, movie = null, payload = {}) {
  ensure();
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from('activity_feed').insert({ user_id: userData.user.id, type, movie, payload });
  if (error) throw error;
}

export async function listFeed() {
  ensure();
  const { data, error } = await supabase.from('activity_feed').select('*, profiles(username, full_name, avatar_url)').order('created_at', { ascending: false }).limit(60);
  if (error) throw error;
  return data || [];
}

export async function createPublicReview(movie, rating, text) {
  ensure();
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('public_reviews').upsert({ user_id: userData.user.id, movie_tmdb_id: movie.id, movie, rating, text }, { onConflict: 'user_id,movie_tmdb_id' }).select('*').single();
  if (error) throw error;
  await publishActivity('review', movie, { reviewId: data.id, rating });
  return data;
}

export async function listPublicReviews(movieId) {
  ensure();
  const { data, error } = await supabase.from('public_reviews').select('*, profiles(username, full_name, avatar_url)').eq('movie_tmdb_id', movieId).order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  return data || [];
}

export async function likeReview(reviewId) {
  ensure();
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from('review_likes').upsert({ review_id: reviewId, user_id: userData.user.id }, { onConflict: 'review_id,user_id' });
  if (error) throw error;
}

export async function addReviewComment(reviewId, text) {
  ensure();
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('review_comments').insert({ review_id: reviewId, user_id: userData.user.id, text }).select('*, profiles(username, full_name, avatar_url)').single();
  if (error) throw error;
  return data;
}

export async function recommendMovieToFriend(friendId, movie, message = '') {
  ensure();
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('friend_recommendations').insert({ from_user_id: userData.user.id, to_user_id: friendId, movie, message }).select('*').single();
  if (error) throw error;
  return data;
}

export function calculateCompatibility(myState, friendState) {
  const myLiked = new Set([...(myState?.favorites || []).map((m) => m.id), ...Object.values(myState?.reactions || {}).filter((r) => r.type === 'like').map((r) => r.movie?.id)]);
  const friendLiked = new Set([...(friendState?.favorites || []).map((m) => m.id), ...Object.values(friendState?.reactions || {}).filter((r) => r.type === 'like').map((r) => r.movie?.id)]);
  const common = [...myLiked].filter((id) => friendLiked.has(id)).length;
  const total = new Set([...myLiked, ...friendLiked]).size || 1;
  return Math.round((common / total) * 100);
}
