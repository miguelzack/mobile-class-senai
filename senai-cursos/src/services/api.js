import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 6000,
});

export async function getSchoolOnlineNotice() {
  const response = await api.get('/posts/1');

  return {
    title: 'API conectada com sucesso',
    message:
      response.data?.id
        ? 'O Axios realizou uma requisição HTTP e o app está preparado para receber avisos online da escola quando houver uma API oficial disponível.'
        : 'Novidades dos cursos SENAI disponíveis no aplicativo.',
  };
}

export default api;
