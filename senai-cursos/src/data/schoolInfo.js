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
    role: 'Docente de Back-end, Lógica e Projetos',
    specialties: 'Backend em Java, lógica de programação e projetos integradores.',
    specialtyAreas: ['Back-end em Java', 'Lógica de programação', 'Projetos integradores'],
    shortDescription:
      'Atua no desenvolvimento de competências relacionadas à programação back-end, estruturação lógica e construção de projetos aplicados.',
    fullDescription:
      'A Prof. Fiama atua nas unidades curriculares relacionadas ao desenvolvimento back-end com Java, lógica de programação e projetos integradores. Sua prática docente prioriza a construção de bases sólidas de raciocínio lógico, a organização do código, o uso de boas práticas de programação e a aplicação dos conhecimentos em situações próximas à realidade do mercado de trabalho. Nas atividades de projeto, orienta os estudantes na análise de problemas, definição de soluções, implementação progressiva e apresentação técnica dos resultados.',
  },
  {
    name: 'Prof. Atila',
    role: 'Docente de Front-end, Mobile, Banco de Dados e Lógica',
    specialties: 'Front-end, desenvolvimento mobile, banco de dados e lógica de programação.',
    specialtyAreas: ['Front-end', 'Mobile', 'Banco de dados', 'Lógica'],
    shortDescription:
      'Orienta o desenvolvimento de interfaces, aplicações mobile e soluções com persistência de dados, integrando teoria e prática.',
    fullDescription:
      'O Prof. Atila atua nas áreas de front-end, desenvolvimento mobile, banco de dados e lógica de programação. Sua abordagem contribui para que os estudantes compreendam a criação de interfaces, a estruturação de componentes, a persistência de informações e a organização de aplicações funcionais. Durante as aulas, incentiva a construção de soluções completas, com atenção à usabilidade, clareza visual, organização de arquivos, integração com serviços e armazenamento de dados.',
  },
  {
    name: 'Prof. Lucas',
    role: 'Docente de Front-end, Mobile, Lógica e Projetos',
    specialties: 'Front-end, lógica de programação, projetos e desenvolvimento mobile.',
    specialtyAreas: ['Front-end', 'Mobile', 'Lógica', 'Projetos'],
    shortDescription:
      'Acompanha a criação de soluções digitais com foco em planejamento, experiência do usuário e qualidade técnica.',
    fullDescription:
      'O Prof. Lucas atua em conteúdos de front-end, desenvolvimento mobile, lógica de programação e projetos. Sua prática pedagógica valoriza o planejamento das etapas de desenvolvimento, a implementação incremental, a clareza na escrita do código e a construção de experiências digitais funcionais. Em projetos, orienta os estudantes na definição de requisitos, estruturação da solução, organização visual, testes e apresentação do produto final com foco em qualidade técnica e boa experiência do usuário.',
  },
];

export const teacherNames = ['Todos', ...teachers.map((teacher) => teacher.name)];
