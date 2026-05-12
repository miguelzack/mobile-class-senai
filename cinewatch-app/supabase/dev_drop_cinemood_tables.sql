-- DEV ONLY: derruba as tabelas públicas do CineMood para refazer o banco do zero.
-- Use somente em ambiente de teste. Isso NÃO apaga auth.users nem arquivos do Storage.
-- Depois rode supabase/schema.sql novamente.

drop table if exists public.club_private_comments cascade;
drop table if exists public.club_reviews cascade;
drop table if exists public.club_movie_seen cascade;
drop table if exists public.club_movie_votes cascade;
drop table if exists public.club_movies cascade;
drop table if exists public.club_members cascade;
drop table if exists public.movie_clubs cascade;
drop table if exists public.user_movie_data cascade;
drop table if exists public.profiles cascade;
