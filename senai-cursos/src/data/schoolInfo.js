export const schoolInfo = {
  shortName: 'SENAI Santo Amaro',
  fullName: 'SENAI Santo Amaro - Suíço-Brasileira "Paulo Ernesto Tolle"',
  unitName: 'SENAI Santo Amaro - Suíço-Brasileira',
  address: 'Rua Bento Branco de Andrade Filho, 379 - Santo Amaro - São Paulo/SP',
  cep: '04757-000',
  phone: '(11) 5642-3400',
  whatsapp: '(11) 5642-3407',
  whatsappDigits: '551156423407',
  email: 'contato.senai@sp.senai.br',
};

export const teachers = [
  {
    name: 'Prof. Fiama',
    specialties:
      'Docente responsável pelas unidades curriculares relacionadas ao desenvolvimento back-end com Java, lógica de programação e projetos integradores. Sua atuação prioriza a aplicação de boas práticas de desenvolvimento, organização do código e construção de soluções alinhadas a situações reais do mercado.',
  },
  {
    name: 'Prof. Atila',
    specialties:
      'Docente com atuação nas áreas de front-end, desenvolvimento mobile, banco de dados e lógica de programação. Orienta os estudantes na criação de interfaces, estruturação de dados, persistência local e desenvolvimento de aplicações funcionais e bem organizadas.',
  },
  {
    name: 'Prof. Lucas',
    specialties:
      'Docente responsável por conteúdos de front-end, desenvolvimento mobile, lógica de programação e projetos. Sua abordagem valoriza o planejamento, a implementação progressiva e a apresentação de soluções digitais com foco em clareza, usabilidade e qualidade técnica.',
  },
];

export const teacherNames = ['Todos', ...teachers.map((teacher) => teacher.name)];
