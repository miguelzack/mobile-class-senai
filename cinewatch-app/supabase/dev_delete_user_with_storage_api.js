/**
 * DEV ONLY: remove arquivos do Storage e apaga usuário Auth por e-mail.
 *
 * Rode localmente, fora do app:
 *   npm install @supabase/supabase-js dotenv
 *   node supabase/dev_delete_user_with_storage_api.js mzsilvaw@gmail.com
 *
 * Crie um .env.local na raiz com:
 *   SUPABASE_URL=https://SEU-PROJETO.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
 *
 * NUNCA coloque a service_role key dentro do app React Native/Expo.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const email = process.argv[2];
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'profile-photos';

if (!email) {
  console.error('Informe o e-mail. Ex: node supabase/dev_delete_user_with_storage_api.js email@exemplo.com');
  process.exit(1);
}

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Faltou SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function listAllFiles(prefix, page = 0, all = []) {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 100,
    offset: page * 100,
  });

  if (error) {
    // Se o bucket não existir ou não houver pasta, apenas segue.
    console.warn('Aviso ao listar Storage:', error.message);
    return all;
  }

  const files = (data || []).filter((item) => item.name && !item.id?.startsWith('folder'));
  all.push(...files.map((file) => `${prefix}/${file.name}`));

  if ((data || []).length === 100) {
    return listAllFiles(prefix, page + 1, all);
  }

  return all;
}

async function main() {
  const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;

  const user = usersPage.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
  if (!user) {
    console.log(`Nenhum usuário encontrado com o e-mail ${email}.`);
    return;
  }

  const userId = user.id;
  const files = await listAllFiles(userId);

  if (files.length > 0) {
    const { error: removeError } = await supabase.storage.from(BUCKET).remove(files);
    if (removeError) throw removeError;
    console.log(`Arquivos removidos do Storage: ${files.length}`);
  } else {
    console.log('Nenhum arquivo encontrado no Storage para esse usuário.');
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId, false);
  if (deleteError) throw deleteError;

  console.log(`Usuário ${email} apagado. Agora você pode criar a conta novamente.`);
}

main().catch((error) => {
  console.error('Erro ao apagar usuário:', error.message || error);
  process.exit(1);
});
