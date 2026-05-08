-- DEV ONLY: apaga uma conta específica para poder recriar com o mesmo e-mail.
-- IMPORTANTE:
-- Este script NÃO apaga arquivos do Supabase Storage.
-- O Supabase bloqueia delete direto em storage.objects.
-- Se o usuário tiver foto/arquivo no Storage, apague antes pelo painel Storage
-- ou use o script Node dev_delete_user_with_storage_api.js.

DO $$
DECLARE
  v_email text := 'troque-este-email@exemplo.com';
  v_user_id uuid;
BEGIN
  SELECT id
    INTO v_user_id
  FROM auth.users
  WHERE lower(email) = lower(v_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Nenhum usuário encontrado com o e-mail %', v_email;
    RETURN;
  END IF;

  -- As FKs públicas foram criadas com ON DELETE CASCADE.
  -- Isso apaga profiles, dados pessoais, clubes relacionados quando aplicável etc.
  -- Não tente apagar storage.objects por SQL.
  DELETE FROM auth.users WHERE id = v_user_id;

  RAISE NOTICE 'Usuário % apagado. Você já pode criar a conta novamente.', v_email;
END $$;
