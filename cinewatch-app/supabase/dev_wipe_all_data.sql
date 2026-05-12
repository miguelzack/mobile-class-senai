-- DEV ONLY: limpa dados do app para testes.
-- Não apaga arquivos do Supabase Storage.
-- Se houver arquivos no bucket profile-photos, apague pelo painel Storage
-- ou use o script Node dev_delete_user_with_storage_api.js por usuário.

TRUNCATE TABLE
  public.club_private_comments,
  public.club_reviews,
  public.club_movie_seen,
  public.club_movie_votes,
  public.club_movies,
  public.club_members,
  public.movie_clubs,
  public.user_movie_data,
  public.profiles
RESTART IDENTITY CASCADE;

-- CUIDADO: apaga todas as contas Auth.
-- Pode falhar se algum usuário ainda for dono de objeto no Storage.
DELETE FROM auth.users;
