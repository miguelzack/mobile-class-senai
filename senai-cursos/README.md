# SENAI Cursos

Aplicativo mobile desenvolvido em **React Native com Expo** para divulgação dos cursos de desenvolvimento da escola **SENAI Santo Amaro - Suíço-Brasileira "Paulo Ernesto Tolle"**.

O projeto foi criado para atender à sprint **"Criação de app com consumo de API"**, contemplando listagem de cursos, detalhes em modal, persistência local com SQLite, consumo de API com Axios, informações institucionais da escola, formulário de contato e uma interface agradável para dispositivos móveis.

---

## Sumário

- [Objetivo do projeto](#objetivo-do-projeto)
- [Resultado esperado](#resultado-esperado)
- [Link do repositório](#link-do-repositório)
- [Protótipo](#protótipo)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Justificativa da biblioteca de interface](#justificativa-da-biblioteca-de-interface)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
- [Requisitos atendidos](#requisitos-atendidos)
- [Informações da escola](#informações-da-escola)
- [Professores cadastrados](#professores-cadastrados)
- [Cursos cadastrados](#cursos-cadastrados)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Banco de dados SQLite](#banco-de-dados-sqlite)
- [Consumo de API com Axios](#consumo-de-api-com-axios)
- [Instalação e configuração do ambiente](#instalação-e-configuração-do-ambiente)
- [Criação do app](#criação-do-app)
- [Instalação e configuração dos pacotes](#instalação-e-configuração-dos-pacotes)
- [Configurações do app](#configurações-do-app)
- [Como executar](#como-executar)
- [Como testar](#como-testar)
- [Como subir no GitHub](#como-subir-no-github)
- [Possíveis problemas e soluções](#possíveis-problemas-e-soluções)
- [Autor](#autor)

---

## Objetivo do projeto

A escola **SENAI Suíço-Brasileira** precisa divulgar seus cursos de desenvolvimento em um aplicativo para dispositivos móveis.

O objetivo do app **SENAI Cursos** é proporcionar ao usuário uma experiência agradável e interativa para consultar cursos, visualizar detalhes, conhecer a escola e entrar em contato para solicitar matrícula ou informações adicionais.

O aplicativo foi pensado para ser simples de usar, mas completo tecnicamente, utilizando:

- interface organizada em cards;
- busca textual;
- filtros avançados opcionais;
- modal com detalhes dos cursos;
- persistência local com SQLite;
- consumo de API com Axios;
- navegação por abas;
- formulário de contato.

---

## Resultado esperado

O resultado esperado é um aplicativo mobile funcional, organizado e visualmente agradável, capaz de divulgar os cursos de desenvolvimento do SENAI, permitindo que o usuário:

1. visualize todos os cursos disponíveis;
2. filtre os cursos por área, nível, professor, classificação e ordenação;
3. abra os detalhes de cada curso em uma modal;
4. realize uma solicitação de matrícula;
5. entre em contato com a escola por WhatsApp, e-mail ou formulário;
6. consulte informações institucionais da unidade SENAI Santo Amaro - Suíço-Brasileira.

---

## Link do repositório


[https://github.com/miguelzack/senai-cursos-app](COLE_AQUI_O_LINK_DO_REPOSITORIO)

---

## Protótipo

O protótipo completo do projeto está documentado no arquivo:

[docs/prototipo.md](docs/prototipo.md)

Esse arquivo apresenta a proposta visual, estrutura das telas, fluxo de navegação, componentes, interações, telas previstas e justificativas de UX/UI.

---

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
|---|---|
| **React Native** | Desenvolvimento da interface mobile com componentes reutilizáveis. |
| **Expo** | Criação, execução e configuração do ambiente mobile. |
| **Axios** | Consumo de API externa para simular integração online. |
| **SQLite / expo-sqlite** | Armazenamento local dos cursos e mensagens de contato. |
| **React Native Paper** | Biblioteca de interface para Cards, Buttons, Modals, Chips, Lists e BottomNavigation. |
| **Safe Area Context** | Ajuste da interface em dispositivos com notch, barra de status ou áreas seguras. |
| **Expo Vector Icons** | Ícones visuais usados nos cards, filtros, contatos e menus. |

---

## Justificativa da biblioteca de interface

A biblioteca de interface escolhida foi o **React Native Paper**.

A escolha se justifica porque o React Native Paper fornece componentes prontos, consistentes e baseados em Material Design, permitindo construir uma interface mais profissional em menos tempo. No projeto, a biblioteca foi usada em botões, cards, campos de texto, modais, chips de filtro, listas, indicadores de carregamento e navegação inferior.

### Benefícios técnicos

- Reduz a necessidade de criar componentes visuais do zero.
- Mantém consistência visual entre telas.
- Facilita a criação de temas com cores padronizadas.
- Possui componentes adequados para aplicativos mobile.
- Melhora a produtividade do desenvolvimento.
- Permite criar interfaces responsivas e organizadas.

### Componentes do React Native Paper usados

- `PaperProvider`
- `BottomNavigation`
- `Card`
- `Button`
- `Modal`
- `Portal`
- `TextInput`
- `Searchbar`
- `Chip`
- `List.Item`
- `Divider`
- `Text`
- `ActivityIndicator`

---

## Funcionalidades implementadas

### Tela principal de cursos

A tela principal apresenta todos os cursos cadastrados no SQLite. Cada curso é exibido em um card com informações essenciais.

Cada card mostra:

- título;
- subtítulo;
- área;
- nível;
- duração;
- professor responsável;
- classificação;
- botão **Ver detalhes**.

### Busca textual

A busca permite pesquisar cursos por:

- nome do curso;
- subtítulo;
- área;
- nível;
- professor;
- descrição.

### Filtros avançados

Os filtros avançados são opcionais e ficam acessíveis pelo botão **Filtros**, evitando que a tela inicial fique visualmente poluída.

Filtros disponíveis:

- área do curso;
- nível;
- professor;
- classificação mínima;
- ordenação dos resultados.

A modal de filtros só fecha quando o usuário toca no botão **Filtro concluído**, melhorando a experiência de uso e evitando fechamentos acidentais.

### Modal de detalhes do curso

Ao clicar em um curso, uma modal é aberta com informações completas:

- título;
- subtítulo;
- área;
- nível;
- duração;
- classificação;
- professor;
- descrição;
- dados de atendimento da escola;
- botão de matrícula;
- botão de WhatsApp;
- botão de e-mail.

### Solicitação de matrícula

O botão **Realizar matrícula** exibe uma confirmação para o usuário, simulando o registro de interesse no curso.

### Contato com a escola

O app permite contato por:

- WhatsApp;
- e-mail;
- telefone;
- formulário interno.

### Formulário de contato

A tela de contato possui campos para:

- nome;
- e-mail;
- mensagem.

Ao enviar, os dados são validados e salvos no banco SQLite na tabela `contacts`.

### Informações sobre a escola

A tela **Escola** apresenta:

- nome completo da unidade;
- endereço;
- CEP;
- telefone;
- WhatsApp;
- informações institucionais;
- professores responsáveis;
- diferenciais do aplicativo.

### Consumo de API com Axios

A tela **Escola** possui uma seção de integração online. Ela usa Axios para realizar uma requisição HTTP de exemplo, demonstrando que o app está preparado para consumir dados externos.

### Armazenamento local com SQLite

Os cursos são armazenados em SQLite. Na primeira execução, o banco é criado automaticamente e os cursos iniciais são inseridos.

---

## Requisitos atendidos

| Requisito da sprint | Status | Implementação no projeto |
|---|:---:|---|
| React Native | ✅ | Projeto desenvolvido com React Native. |
| Axios | ✅ | Arquivo `src/services/api.js` com configuração Axios. |
| Expo | ✅ | Projeto executado com Expo e configurado em `app.json`. |
| SQLite | ✅ | Banco local configurado em `src/database/database.js`. |
| Página principal com todos os cursos | ✅ | `HomeScreen.js` lista os cursos com `FlatList`. |
| Clicar no curso abre modal | ✅ | `CourseDetailsModal.js` exibe os detalhes do curso. |
| Exibir título | ✅ | Campo `title` nos cursos e cards. |
| Exibir subtítulo | ✅ | Campo `subtitle` nos cursos e cards. |
| Exibir nível | ✅ | Campo `level`. |
| Exibir duração | ✅ | Campo `duration`. |
| Exibir áreas | ✅ | Campo `area` com as áreas exigidas. |
| Exibir professor | ✅ | Campo `teacher`. |
| Botão para matrícula | ✅ | Botão **Realizar matrícula** na modal. |
| Botão para contato | ✅ | Botões de WhatsApp e e-mail na modal. |
| Exibir classificação | ✅ | Campo `rating`. |
| Informações armazenadas no SQLite | ✅ | Cursos salvos na tabela `courses`. |
| Biblioteca de interface | ✅ | React Native Paper. |
| Justificativa técnica da biblioteca | ✅ | Documentada neste README. |
| Informações sobre a escola | ✅ | Tela `SchoolScreen.js`. |
| Informações de contato | ✅ | Tela `ContactScreen.js` e modal de curso. |
| Formulário e e-mail | ✅ | Formulário salva no SQLite e botão abre e-mail. |
| Mínimo de 3 cursos por área | ✅ | 18 cursos no total, sendo 3 por área. |
| Protótipo | ✅ | Arquivo `docs/prototipo.md`. |
| Link do repositório em markdown | ✅ | Seção criada para adicionar o link real do GitHub. |
| Tutorial detalhado | ✅ | Documentado neste README. |

---

## Informações da escola

**Unidade:** SENAI Santo Amaro - Suíço-Brasileira "Paulo Ernesto Tolle"  
**Endereço:** Rua Bento Branco de Andrade Filho, 379 - Santo Amaro - São Paulo/SP  
**CEP:** 04757-000  
**Telefone:** (11) 5642-3400  
**WhatsApp:** (11) 5642-3407  
**E-mail usado no projeto:** contato.senai@sp.senai.br

---

## Professores cadastrados

### Prof. Fiama

Docente responsável pelas unidades curriculares relacionadas ao desenvolvimento back-end com Java, lógica de programação e projetos integradores. Sua atuação prioriza a aplicação de boas práticas de desenvolvimento, organização do código e construção de soluções alinhadas a situações reais do mercado.

### Prof. Atila

Docente com atuação nas áreas de front-end, desenvolvimento mobile, banco de dados e lógica de programação. Orienta os estudantes na criação de interfaces, estruturação de dados, persistência local e desenvolvimento de aplicações funcionais e bem organizadas.

### Prof. Lucas

Docente responsável por conteúdos de front-end, desenvolvimento mobile, lógica de programação e projetos. Sua abordagem valoriza o planejamento, a implementação progressiva e a apresentação de soluções digitais com foco em clareza, usabilidade e qualidade técnica.

---

## Cursos cadastrados

O projeto possui **18 cursos**, atendendo ao requisito de no mínimo **3 cursos por área**.

### Front-end

| Curso | Nível | Duração | Professor | Classificação |
|---|---|---:|---|---:|
| HTML, CSS e JavaScript | Iniciante | 40 horas | Prof. Atila | 4.8 |
| React Native Fundamentos | Intermediário | 60 horas | Prof. Lucas | 4.9 |
| Interfaces Responsivas | Intermediário | 36 horas | Prof. Lucas | 4.7 |

### Back-end

| Curso | Nível | Duração | Professor | Classificação |
|---|---|---:|---|---:|
| Lógica com Java | Iniciante | 44 horas | Prof. Fiama | 4.8 |
| Java para Back-end | Intermediário | 60 horas | Prof. Fiama | 4.7 |
| APIs com Java e Spring | Avançado | 64 horas | Prof. Fiama | 4.9 |

### Banco de dados

| Curso | Nível | Duração | Professor | Classificação |
|---|---|---:|---|---:|
| SQLite para Aplicativos | Iniciante | 32 horas | Prof. Atila | 4.8 |
| Modelagem de Banco de Dados | Iniciante | 40 horas | Prof. Atila | 4.6 |
| SQL na Prática | Intermediário | 48 horas | Prof. Atila | 4.9 |

### UI/UX

| Curso | Nível | Duração | Professor | Classificação |
|---|---|---:|---|---:|
| Fundamentos de UI/UX | Iniciante | 36 horas | Prof. Lucas | 4.7 |
| Prototipação com Figma | Intermediário | 42 horas | Prof. Lucas | 4.8 |
| Design Mobile | Intermediário | 40 horas | Prof. Atila | 4.6 |

### Projetos com Scrum

| Curso | Nível | Duração | Professor | Classificação |
|---|---|---:|---|---:|
| Scrum Essencial | Iniciante | 24 horas | Prof. Fiama | 4.6 |
| Gestão de Sprints | Intermediário | 30 horas | Prof. Lucas | 4.8 |
| Projeto Integrador com Scrum | Avançado | 52 horas | Prof. Fiama | 4.9 |

### DevOps com nuvem

| Curso | Nível | Duração | Professor | Classificação |
|---|---|---:|---|---:|
| Introdução à Nuvem | Iniciante | 32 horas | Prof. Lucas | 4.7 |
| Deploy de Aplicações Mobile e Web | Intermediário | 44 horas | Prof. Atila | 4.8 |
| DevOps com GitHub Actions | Avançado | 48 horas | Prof. Lucas | 4.9 |

---

## Estrutura de pastas

```txt
senai-cursos/
├── App.js
├── app.json
├── babel.config.js
├── index.js
├── package.json
├── README.md
├── .gitignore
├── assets/
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash.png
│   ├── senai-logo-horizontal.png
│   ├── senai-logo-symbol.png
│   └── senai-logo-white.png
├── docs/
│   └── prototipo.md
└── src/
    ├── components/
    │   ├── AdvancedFilters.js
    │   ├── AreaFilter.js
    │   ├── CourseCard.js
    │   ├── CourseDetailsModal.js
    │   ├── Header.js
    │   └── InfoPill.js
    ├── data/
    │   ├── coursesSeed.js
    │   └── schoolInfo.js
    ├── database/
    │   └── database.js
    ├── screens/
    │   ├── ContactScreen.js
    │   ├── HomeScreen.js
    │   └── SchoolScreen.js
    ├── services/
    │   └── api.js
    ├── styles/
    │   ├── colors.js
    │   └── theme.js
    └── utils/
        ├── courseVisuals.js
        └── format.js
```

---

## Arquitetura do projeto

O projeto foi organizado com separação de responsabilidades, facilitando manutenção, entendimento e evolução do código.

### `App.js`

Arquivo principal do aplicativo. Responsável por:

- configurar o `PaperProvider`;
- aplicar o tema visual;
- configurar a navegação inferior;
- carregar as telas principais: Cursos, Escola e Contato.

### `src/screens`

Contém as telas principais do app.

| Arquivo | Responsabilidade |
|---|---|
| `HomeScreen.js` | Tela principal com listagem, busca, filtros e modal de curso. |
| `SchoolScreen.js` | Tela com informações da escola, professores, atendimento e integração Axios. |
| `ContactScreen.js` | Tela com formulário de contato e opções de atendimento. |

### `src/components`

Contém componentes reutilizáveis da interface.

| Componente | Responsabilidade |
|---|---|
| `Header.js` | Cabeçalho visual com logo SENAI, título e subtítulo. |
| `AdvancedFilters.js` | Busca textual e filtros avançados em modal. |
| `CourseCard.js` | Card usado para exibir cada curso na listagem. |
| `CourseDetailsModal.js` | Modal com informações completas do curso. |
| `InfoPill.js` | Pequenos indicadores visuais usados na modal. |
| `AreaFilter.js` | Componente auxiliar de filtro por área mantido no projeto. |

### `src/data`

Contém dados estáticos usados para popular o aplicativo.

| Arquivo | Responsabilidade |
|---|---|
| `coursesSeed.js` | Lista inicial de cursos, áreas, níveis, avaliações e ordenações. |
| `schoolInfo.js` | Dados da escola, contato e professores. |

### `src/database`

Contém a configuração do SQLite.

| Arquivo | Responsabilidade |
|---|---|
| `database.js` | Criação do banco, criação das tabelas, seed dos cursos, filtros e salvamento de contatos. |

### `src/services`

Contém a configuração do Axios.

| Arquivo | Responsabilidade |
|---|---|
| `api.js` | Configuração da base URL e função de consumo de aviso online. |

### `src/styles`

Contém padrões visuais.

| Arquivo | Responsabilidade |
|---|---|
| `colors.js` | Paleta de cores do app. |
| `theme.js` | Tema do React Native Paper. |

### `src/utils`

Contém funções auxiliares.

| Arquivo | Responsabilidade |
|---|---|
| `format.js` | Formatação da classificação dos cursos. |
| `courseVisuals.js` | Ícones e cores de cada área de curso. |

---

## Banco de dados SQLite

O banco é criado automaticamente na primeira execução do aplicativo.

Arquivo responsável:

```txt
src/database/database.js
```

Nome do banco:

```txt
senai_cursos.db
```

### Tabela `courses`

Armazena os cursos exibidos na tela principal.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER | Identificador automático. |
| `title` | TEXT | Título do curso. |
| `subtitle` | TEXT | Subtítulo do curso. |
| `level` | TEXT | Nível do curso. |
| `duration` | TEXT | Duração do curso. |
| `area` | TEXT | Área do curso. |
| `teacher` | TEXT | Professor responsável. |
| `rating` | REAL | Classificação do curso. |
| `description` | TEXT | Descrição completa do curso. |

### Tabela `contacts`

Armazena as mensagens enviadas pelo formulário de contato.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | INTEGER | Identificador automático. |
| `name` | TEXT | Nome do usuário. |
| `email` | TEXT | E-mail informado. |
| `message` | TEXT | Mensagem enviada. |
| `created_at` | TEXT | Data e hora de criação do registro. |

### Tabela `app_meta`

Controla metadados internos do aplicativo.

| Campo | Tipo | Descrição |
|---|---|---|
| `key` | TEXT | Nome da configuração. |
| `value` | TEXT | Valor da configuração. |

O campo `seed_version` é usado para controlar a versão dos dados iniciais. Quando a versão muda, os cursos podem ser recriados automaticamente.

### Funções principais do banco

| Função | Finalidade |
|---|---|
| `getDatabase()` | Abre ou reutiliza a conexão com o SQLite. |
| `initDatabase()` | Cria as tabelas e executa o seed inicial. |
| `seedCourses()` | Insere os cursos iniciais. |
| `resetAndSeedDatabase()` | Limpa e recria os cursos. |
| `getAllCourses()` | Lista todos os cursos. |
| `getCoursesByFilter()` | Lista cursos aplicando busca, filtros e ordenação. |
| `saveContactMessage()` | Salva uma mensagem do formulário de contato. |

---

## Consumo de API com Axios

O projeto possui uma estrutura de serviço usando Axios no arquivo:

```txt
src/services/api.js
```

A API configurada usa uma base URL de exemplo:

```js
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 6000,
});
```

A função `getSchoolOnlineNotice()` realiza uma requisição HTTP para demonstrar o consumo de API e retorna uma mensagem usada na tela **Escola**.

Esse recurso mostra que o app está preparado para consumir dados externos futuramente, como:

- avisos da escola;
- atualização remota de cursos;
- horários de atendimento;
- eventos;
- campanhas de matrícula.

Caso não haja conexão ou a requisição falhe, a tela exibe um aviso offline, mantendo o funcionamento principal com os dados locais do SQLite.

---

## Instalação e configuração do ambiente

Para executar o projeto, é necessário ter o ambiente de desenvolvimento React Native com Expo configurado.

### 1. Instalar o Node.js

Instale uma versão atual do Node.js no computador.

Para verificar se foi instalado corretamente:

```bash
node -v
```

Também verifique o npm:

```bash
npm -v
```

### 2. Instalar um editor de código

Recomendação:

- Visual Studio Code.

### 3. Instalar o Expo Go no celular

Para testar no celular físico, instale o aplicativo **Expo Go**.

### 4. Configurar emulador Android opcional

Também é possível testar em um emulador Android. Para isso, configure o Android Studio ou tenha o ADB disponível no computador.

---

## Criação do app

O projeto pode ser criado do zero com:

```bash
npx create-expo-app senai-cursos
cd senai-cursos
```

Depois disso, os arquivos do projeto foram organizados em pastas, separando telas, componentes, serviços, banco de dados, estilos, dados e utilitários.

---

## Instalação e configuração dos pacotes

Instale as dependências principais:

```bash
npm install axios react-native-paper
```

Instale os pacotes compatíveis com Expo:

```bash
npx expo install expo-sqlite react-native-safe-area-context @expo/vector-icons expo-status-bar
```

Caso esteja usando este projeto já pronto, basta rodar:

```bash
npm install
```

---

## Configurações do app

### `app.json`

O arquivo `app.json` define informações do app, como:

- nome exibido;
- slug;
- versão;
- orientação;
- ícone;
- splash screen;
- adaptive icon do Android.

No projeto, o app foi configurado como:

```json
{
  "expo": {
    "name": "SENAI Cursos",
    "slug": "senai-cursos"
  }
}
```

### `babel.config.js`

Arquivo de configuração do Babel usado pelo Expo:

```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

### `package.json`

Define scripts e dependências do projeto.

Scripts principais:

| Script | Comando | Função |
|---|---|---|
| `start` | `expo start` | Inicia o projeto. |
| `android` | `expo start --android` | Abre no Android. |
| `ios` | `expo start --ios` | Abre no iOS. |
| `web` | `expo start --web` | Abre na web. |
| `doctor` | `npx expo-doctor` | Verifica problemas de dependências. |

---

## Como executar

Na pasta do projeto, rode:

```bash
npm install
```

Depois:

```bash
npx expo start -c
```

O parâmetro `-c` limpa o cache do Metro Bundler, ajudando a evitar erros após alterações em arquivos, imagens ou dependências.

Depois de iniciar:

- escaneie o QR Code no Expo Go; ou
- pressione `a` para abrir no Android; ou
- pressione `w` para abrir no navegador.

---

## Como testar

### Teste 1 — Inicialização

1. Execute `npx expo start -c`.
2. Abra o app no Expo Go ou emulador.
3. Verifique se a tela inicial carrega com o cabeçalho vermelho do SENAI.
4. Aguarde a mensagem de preparação do SQLite, caso apareça.

Resultado esperado: a lista de cursos deve aparecer.

### Teste 2 — Listagem de cursos

1. Abra a aba **Cursos**.
2. Confira se os cards são exibidos.
3. Verifique se cada card contém título, subtítulo, área, nível, duração, professor e classificação.

Resultado esperado: todos os cursos aparecem corretamente.

### Teste 3 — Busca textual

1. Digite `Java` no campo de busca.
2. Verifique se aparecem cursos relacionados a Java.
3. Apague o texto.
4. Digite `Atila`, `Lucas` ou `Fiama`.

Resultado esperado: a lista deve ser filtrada conforme o termo pesquisado.

### Teste 4 — Filtros avançados

1. Toque no botão **Filtros**.
2. Escolha uma área, por exemplo **Banco de dados**.
3. Escolha um nível, por exemplo **Iniciante**.
4. Escolha uma classificação mínima.
5. Toque em **Filtro concluído**.

Resultado esperado: a modal fecha somente após tocar em **Filtro concluído** e a listagem é atualizada.

### Teste 5 — Limpar filtros

1. Aplique filtros.
2. Toque em **Limpar** ou **Limpar filtros**.
3. Verifique se a lista volta a mostrar todos os cursos.

Resultado esperado: filtros removidos e listagem completa novamente.

### Teste 6 — Modal de detalhes

1. Toque em um card de curso ou em **Ver detalhes**.
2. Confira se a modal abre.
3. Verifique se aparecem descrição, nível, duração, professor, avaliação e botões de contato.

Resultado esperado: detalhes completos do curso são exibidos.

### Teste 7 — Matrícula

1. Abra um curso.
2. Toque em **Realizar matrícula**.

Resultado esperado: o app exibe uma mensagem confirmando a solicitação de matrícula.

### Teste 8 — Contato pelo WhatsApp

1. Abra um curso.
2. Toque em **Contato pelo WhatsApp**.

Resultado esperado: o app tenta abrir o WhatsApp com uma mensagem pronta sobre o curso escolhido.

### Teste 9 — Contato por e-mail

1. Abra um curso.
2. Toque em **Enviar e-mail**.

Resultado esperado: o app tenta abrir o app de e-mail com assunto e mensagem preenchidos.

### Teste 10 — Tela Escola

1. Acesse a aba **Escola**.
2. Confira nome da escola, endereço, CEP, telefone, WhatsApp e professores.
3. Aguarde a seção de integração online carregar.

Resultado esperado: informações institucionais são exibidas e a integração Axios apresenta uma mensagem.

### Teste 11 — Tela Contato

1. Acesse a aba **Contato**.
2. Preencha nome, e-mail e mensagem.
3. Toque em enviar.

Resultado esperado: a mensagem é salva no SQLite e o app exibe confirmação.

### Teste 12 — Validação do formulário

1. Tente enviar o formulário vazio.
2. Tente enviar com e-mail sem `@`.

Resultado esperado: o app exibe alertas de validação.

---

## Como subir no GitHub

### 1. Inicializar o Git

```bash
git init
```

### 2. Adicionar os arquivos

```bash
git add .
```

### 3. Criar o primeiro commit

```bash
git commit -m "Cria aplicativo SENAI Cursos"
```

### 4. Criar o repositório no GitHub

Crie um repositório chamado, por exemplo:

```txt
senai-cursos
```

### 5. Conectar o repositório local ao GitHub

```bash
git remote add origin https://github.com/SEU-USUARIO/senai-cursos.git
```

### 6. Enviar para o GitHub

```bash
git branch -M main
git push -u origin main
```

### 7. Atualizar o link neste README

Depois de publicar, substitua:

```md
[Repositório do projeto no GitHub](COLE_AQUI_O_LINK_DO_REPOSITORIO)
```

por:

```md
[Repositório do projeto no GitHub](https://github.com/SEU-USUARIO/senai-cursos)
```

---

## Possíveis problemas e soluções

### Erro de dependências incompatíveis

Execute:

```bash
npx expo install --fix
npx expo-doctor
```

Depois:

```bash
npx expo start -c
```

### Erro de cache do Metro

Execute:

```bash
npx expo start -c
```

### Erro no Android ao abrir o app

Tente fechar o Expo, limpar o cache e iniciar novamente:

```bash
Ctrl + C
npx expo start -c
```

### Banco SQLite não atualizou os cursos

O projeto possui controle de versão do seed pelo campo `SEED_VERSION` no arquivo `database.js`.

Para forçar recriação dos dados, altere o valor de `SEED_VERSION` ou limpe os dados do app no dispositivo/emulador.

### WhatsApp ou e-mail não abre

Os botões usam `Linking.openURL`. Para funcionar corretamente, o dispositivo precisa ter:

- WhatsApp instalado para links `wa.me`;
- app de e-mail configurado para links `mailto`.

---

## Checklist final para entrega

Antes de entregar, confirme:

- [x] O app usa React Native.
- [x] O app usa Expo.
- [x] O app usa Axios.
- [x] O app usa SQLite.
- [x] Os cursos são exibidos na página principal.
- [x] Cada curso abre uma modal de detalhes.
- [x] Todos os campos obrigatórios aparecem nos cursos.
- [x] Existe botão de matrícula.
- [x] Existe botão de contato.
- [x] Os dados dos cursos ficam salvos no SQLite.
- [x] Foi usada uma biblioteca de UI.
- [x] A biblioteca de UI foi justificada tecnicamente.
- [x] O app apresenta informações sobre a escola.
- [x] O app apresenta formulário e e-mail de contato.
- [x] O app possui pelo menos 3 cursos por área.
- [x] O protótipo está documentado em `docs/prototipo.md`.
- [x] O README possui tutorial detalhado.
- [x] O link real do GitHub foi colocado no README.

---

## Autor

**Miguel Zack**

Projeto desenvolvido para atividade escolar da sprint **Criação de app com consumo de API**.
