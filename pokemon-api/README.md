# Pokédex Pokémon API

Aplicativo mobile desenvolvido em **React Native com Expo** para consumo da **PokeAPI**. O projeto apresenta uma Pokédex interativa com listagem de Pokémon, busca por nome ou número, filtros por geração, filtros por tipo, carregamento visual, tratamento de erro e organização de arquivos pensada para facilitar manutenção e evolução do código.

## Link do repositório

```txt
https://github.com/miguelzack/mobile-class-senai
```

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Objetivo do MVP](#objetivo-do-mvp)
- [API utilizada](#api-utilizada)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Requisitos funcionais](#requisitos-funcionais)
- [Requisitos não funcionais](#requisitos-não-funcionais)
- [Style Guide](#style-guide)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Principais componentes](#principais-componentes)
- [Como executar o projeto](#como-executar-o-projeto)
- [Como testar no Android](#como-testar-no-android)
- [Como gerar APK](#como-gerar-apk)
- [Versionamento](#versionamento)
- [Validação final](#validação-final)

---

## Sobre o projeto

O **Pokédex Pokémon API** é um MVP de aplicativo mobile que consome dados de uma API REST externa e apresenta informações de Pokémon em uma interface moderna, responsiva e organizada.

A aplicação permite explorar Pokémon de diferentes formas:

- Pokédex geral com listagem paginada/carregamento progressivo.
- Busca por nome ou número.
- Filtro por geração.
- Filtro por tipo.
- Exibição de imagem, número, nome e tipos de cada Pokémon.
- Feedback visual de carregamento e mensagens de erro.

O tema escolhido foi Pokémon por ser uma API pública, gratuita e com grande volume de dados para demonstrar consumo de API, filtros, renderização de listas e estados de interface.

---

## Objetivo do MVP

Desenvolver uma aplicação mobile funcional que demonstre domínio dos principais conceitos trabalhados na sprint:

- Consumo de API REST externa.
- Uso de React Native com Expo.
- Organização modular de pastas.
- Renderização performática com `FlatList`.
- Manipulação de estados com `useState`.
- Requisições no carregamento com `useEffect`.
- Feedback visual para carregamento e erro.
- Interface responsiva e fiel a um Style Guide definido.

---

## API utilizada

A API utilizada foi a **PokeAPI**.

Base URL configurada no projeto:

```js
https://pokeapi.co/api/v2/
```

Arquivo responsável pela configuração do Axios:

```txt
src/services/api.js
```

Exemplo da configuração:

```js
import axios from "axios";

const api = axios.create({
    baseURL: "https://pokeapi.co/api/v2/"
});

export default api;
```

Principais recursos consumidos:

- `/pokemon`
- `/pokemon/{nome-ou-id}`
- `/generation/{id}`
- `/type/{tipo}`

---

## Tecnologias utilizadas

- **React Native**: desenvolvimento mobile multiplataforma.
- **Expo**: criação, execução e build do projeto.
- **Axios**: consumo da API REST.
- **PokeAPI**: API externa utilizada no projeto.
- **React Hooks**: uso de `useState`, `useEffect`, `useRef`, `forwardRef` e `useImperativeHandle`.
- **FlatList**: renderização otimizada de listas grandes.
- **KeyboardAwareFlatList**: melhor comportamento da lista com teclado aberto.
- **Expo Font**: carregamento de fonte local personalizada.
- **Expo Linear Gradient**: criação do banner com gradiente.
- **React Native SVG**: uso de ícone SVG do GitHub.
- **Android Studio / Expo Go**: testes em ambiente Android.
- **GitHub**: versionamento e entrega do projeto.

---

## Requisitos funcionais

### RF01 — Listagem de Pokémon

O aplicativo deve listar Pokémon consumidos diretamente da PokeAPI, exibindo dados básicos como nome, número, imagem oficial e tipos.

### RF02 — Busca por nome ou número

O aplicativo deve permitir que o usuário pesquise um Pokémon informando seu nome ou ID.

### RF03 — Visualização de dados básicos

O aplicativo deve apresentar informações visuais dos Pokémon em cards, incluindo:

- Nome.
- Número na Pokédex.
- Imagem oficial.
- Tipos com ícones.

### RF04 — Filtro por geração

O aplicativo deve permitir filtrar Pokémon por geração, da geração 1 até a geração 9.

### RF05 — Filtro por tipo

O aplicativo deve permitir filtrar Pokémon por tipo, como água, fogo, grama, elétrico, psíquico, dragão, fada, entre outros.

### RF06 — Retorno para Pokédex geral

O aplicativo deve permitir voltar para a listagem geral de Pokémon sem filtros ativos.

### RF07 — Botão de voltar ao topo

O aplicativo deve possuir um botão flutuante para retornar rapidamente ao topo da lista.

### RF08 — Acesso ao GitHub do desenvolvedor

O aplicativo deve disponibilizar um botão/link para abrir o perfil do GitHub do desenvolvedor.

---

## Requisitos não funcionais

### RNF01 — Uso de React Native com Expo

A aplicação deve ser criada utilizando Expo, facilitando execução, testes e build.

### RNF02 — Consumo de API com Axios

Todas as requisições HTTP devem ser realizadas com Axios, centralizando a base URL em `src/services/api.js`.

### RNF03 — Feedback de carregamento

A aplicação deve apresentar `ActivityIndicator` durante carregamentos iniciais, buscas e trocas de filtros.

### RNF04 — Tratamento de erros

A aplicação deve tratar falhas de conexão ou erro de resposta da API, exibindo mensagens adequadas ao usuário.

### RNF05 — Performance na listagem

A renderização de listas deve utilizar `FlatList`, evitando renderizações pesadas e melhorando a performance com muitos itens.

### RNF06 — Cache básico em memória

O projeto utiliza variáveis globais internas para reaproveitar listas e ícones já carregados, reduzindo chamadas repetidas à API durante o uso.

### RNF07 — Interface responsiva

A interface deve se adaptar a diferentes tamanhos de tela usando porcentagens, `flexWrap`, espaçamentos relativos e componentes flexíveis.

### RNF08 — Área segura da tela

A aplicação utiliza `SafeAreaView` e controle de `StatusBar` para evitar que o conteúdo fique sobreposto pela barra de status.

### RNF09 — Organização modular

O código deve ser separado em pastas de assets, componentes, serviços e estilos globais para facilitar manutenção.

### RNF10 — Código limpo

O código deve estar indentado, organizado e sem erros no console durante a execução.

---

## Style Guide

### Identidade visual

A interface foi inspirada no universo Pokémon, com foco em cores fortes, contraste alto e aparência de Pokédex.

### Cores principais

As cores principais estão centralizadas em `src/styles/global.js`.

| Nome | Hexadecimal | Uso |
|---|---:|---|
| Background | `#1E1E1E` | Fundo escuro geral |
| Primary | `#3C8527` | Cor primária de apoio |
| Secondary | `#8B8B8B` | Cor secundária |
| Accent | `#FFD700` | Destaques, botões ativos e textos importantes |
| Text | `#FFFFFF` | Texto claro |
| Text Dark | `#000000` | Texto escuro e bordas |
| Danger | `#AA0000` | Seções principais em vermelho |
| Red Secondary | `#4e0e0e` | Botões e cards em tons escuros |

### Tipografia

O projeto utiliza uma fonte local chamada **Minecraft**, carregada com `expo-font`.

Arquivo da fonte:

```txt
src/assets/fonts/Minecraft.ttf
```

Configuração:

```js
export const FONTS = {
    minecraft: 'Minecraft',
};
```

### Componentes visuais padronizados

#### Botões

- Bordas arredondadas.
- Borda preta grossa.
- Texto com fonte personalizada.
- Cor amarela para botão ativo.
- Tons vermelhos escuros para botões inativos.

#### Cards

- Exibição visual do Pokémon.
- Nome em destaque.
- ID formatado.
- Imagem oficial.
- Tipos com ícones.

#### Inputs

- Campo de busca para nome ou número.
- Placeholder claro.
- Integração com botão de busca.
- Validação para retorno ao modo lista quando vazio.

#### Loading

- Uso de `ActivityIndicator`.
- Overlay de carregamento ao trocar filtros.
- Mensagem textual: `Carregando Pokémon...`.

---

## Estrutura de pastas

Estrutura principal do projeto:

```txt
pokemon-api/
├── App.js
├── appStyles.js
├── app.json
├── index.js
├── package.json
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   │   └── Minecraft.ttf
│   │   ├── icons/
│   │   │   └── logoGitHub.js
│   │   └── images/
│   │       └── pokedexFont.png
│   ├── components/
│   │   ├── ActionButtons/
│   │   │   ├── index.js
│   │   │   └── styles.js
│   │   ├── CardAll/
│   │   │   ├── index.js
│   │   │   └── style.js
│   │   ├── CardGen/
│   │   │   ├── CardGen.js
│   │   │   └── style.js
│   │   ├── CardType/
│   │   │   ├── CardType.js
│   │   │   └── style.js
│   │   └── Search/
│   │       ├── search.js
│   │       └── searchStyle.js
│   ├── services/
│   │   └── api.js
│   └── styles/
│       └── global.js
```

### `App.js`

Arquivo principal da aplicação. Ele controla o modo atual da Pokédex:

- `all`: Pokédex geral.
- `gen`: filtro por geração.
- `type`: filtro por tipo.

Também concentra o cabeçalho principal, os botões de modo, o botão flutuante de voltar ao topo e o overlay de carregamento.

### `appStyles.js`

Arquivo de estilos principais usados no `App.js`, incluindo:

- Header.
- Banner inicial.
- Botões de modo.
- Botões de geração.
- Botões de tipo.
- Loading em tela cheia.
- Botão flutuante.

### `src/assets`

Armazena arquivos estáticos do projeto.

#### `src/assets/fonts`

Guarda fontes locais utilizadas pela aplicação.

#### `src/assets/icons`

Guarda ícones personalizados, como o ícone SVG do GitHub.

#### `src/assets/images`

Guarda imagens locais, como a imagem/título da Pokédex.

Essa separação facilita a substituição de recursos visuais sem alterar a lógica dos componentes.

### `src/components`

Armazena componentes reutilizáveis da interface.

Essa divisão é importante porque evita que todo o código fique concentrado em apenas um arquivo, facilitando manutenção, testes e reutilização.

### `src/components/ActionButtons`

Componente responsável por botões de ação exibidos na tela inicial.

### `src/components/CardAll`

Componente responsável pela listagem geral de Pokémon.

Funções principais:

- Buscar lista de Pokémon.
- Buscar detalhes individuais.
- Renderizar cards com `FlatList`.
- Realizar busca.
- Exibir estados de carregamento e erro.
- Usar cache básico em memória.

### `src/components/CardGen`

Componente responsável pela listagem de Pokémon filtrados por geração.

Funções principais:

- Consumir o endpoint de geração.
- Carregar Pokémon pertencentes à geração selecionada.
- Renderizar a lista filtrada.
- Permitir busca dentro do contexto de geração.

### `src/components/CardType`

Componente responsável pela listagem de Pokémon filtrados por tipo.

Funções principais:

- Consumir o endpoint de tipo.
- Carregar Pokémon pertencentes ao tipo selecionado.
- Renderizar a lista filtrada.
- Permitir busca dentro do contexto de tipo.

### `src/components/Search`

Componente de busca reutilizável.

Responsável por receber o termo digitado pelo usuário e disparar a função de busca recebida por props.

### `src/services`

Armazena configurações relacionadas a serviços externos.

No projeto, contém o arquivo `api.js`, responsável por criar a instância do Axios com a base URL da PokeAPI.

Essa separação evita repetição de URL em vários arquivos e facilita manutenção caso a API seja alterada.

### `src/styles`

Armazena configurações globais de estilo.

No projeto, contém:

- Cores globais.
- Nome das fontes.
- Função de carregamento da fonte local.

Centralizar o tema em um único arquivo melhora a padronização visual e facilita mudanças futuras.

### Navegação da aplicação

A aplicação possui navegação entre áreas principais da Pokédex por meio de estados de tela controlados no `App.js`. Essa navegação permite alternar entre diferentes visualizações sem recarregar o aplicativo inteiro:

```txt
Pokédex Geral -> Pokédex por Geração -> Pokédex por Tipo
```

O controle de navegação é feito pela variável de estado `mode`, que define qual tela/componente será exibido no momento:

- `all`: tela da Pokédex geral.
- `gen`: tela com filtro por geração.
- `type`: tela com filtro por tipo.

---

## Principais componentes

### `CardAll`

Componente da Pokédex geral.

Responsabilidades:

- Listar Pokémon da API.
- Controlar busca geral.
- Renderizar cards.
- Gerenciar loading e erro.
- Controlar rolagem até o topo via `ref`.

### `CardGen`

Componente de filtro por geração.

Responsabilidades:

- Receber a geração selecionada por props.
- Buscar Pokémon daquela geração.
- Atualizar a lista quando a geração muda.
- Avisar o componente pai sobre carregamento usando `onLoadingChange`.

### `CardType`

Componente de filtro por tipo.

Responsabilidades:

- Receber o tipo selecionado por props.
- Buscar Pokémon daquele tipo.
- Atualizar a lista quando o tipo muda.
- Exibir o nome do tipo selecionado.

### `ActionButtons`

Componente de botões iniciais da interface.

### `Search`

Componente de campo de busca.

---

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/miguelzack/mobile-class-senai.git
```

### 2. Entrar na pasta do projeto

```bash
cd mobile-class-senai
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o Expo

```bash
npx expo start
```

Ou usando o script do projeto:

```bash
npm start
```

### 5. Executar no Android

Com o emulador aberto no Android Studio:

```bash
npm run android
```

Ou, pelo terminal do Expo, pressionar:

```txt
a
```

---

## Como testar no Android

O aplicativo pode ser testado de duas formas:

### Opção 1 — Android Studio Emulator

1. Abrir o Android Studio.
2. Iniciar um dispositivo virtual no Device Manager.
3. Rodar o projeto com:

```bash
npm run android
```

### Opção 2 — Expo Go no celular

1. Instalar o aplicativo Expo Go no celular.
2. Rodar:

```bash
npx expo start
```

3. Escanear o QR Code exibido no terminal ou no navegador.

---

## Como gerar APK

### Build local após prebuild

Caso o projeto já tenha a pasta `android`, é possível gerar um APK local com Gradle:

```bash
cd android
./gradlew assembleRelease
```

O APK gerado ficará em:

```txt
android/app/build/outputs/apk/release/app-release.apk
```

### Build com EAS

Também é possível gerar o APK usando EAS Build:

```bash
npx eas build -p android --profile preview
```

Após finalizar, o Expo disponibiliza o link para download do APK.

---

## Versionamento

O projeto deve ser versionado no GitHub com commits semânticos.

Exemplos de commits utilizados ou recomendados:

```bash
git add .
git commit -m "feat: cria estrutura inicial do projeto Expo"
git commit -m "feat: adiciona consumo da PokeAPI com Axios"
git commit -m "feat: implementa listagem geral de pokemons"
git commit -m "feat: adiciona filtro por geração"
git commit -m "feat: adiciona filtro por tipo"
git commit -m "style: aplica style guide da pokedex"
git commit -m "docs: adiciona documentação do projeto"
```

---

## Validação final

Checklist de entrega:

- [x] Projeto criado com Expo.
- [x] Consumo de API externa com Axios.
- [x] Uso de `useEffect` para carregamento de dados.
- [x] Uso de `useState` para gerenciamento de estado.
- [x] Renderização de listas com `FlatList`.
- [x] Interface estilizada com `StyleSheet`.
- [x] Uso de fonte local.
- [x] Uso de imagem local.
- [x] Uso de `SafeAreaView`.
- [x] Uso de `ActivityIndicator`.
- [x] Tratamento de carregamento.
- [x] Tratamento de erro de API.
- [x] Filtro por geração.
- [x] Filtro por tipo.
- [x] Busca por Pokémon.
- [x] Organização modular de pastas.
- [x] README com instruções para rodar o projeto.
- [x] Link do repositório GitHub adicionado no README.
- [x] Navegação entre telas/áreas principais da aplicação.

---

## Possíveis melhorias futuras

- Criar tela de detalhes mais completa para cada Pokémon.
- Evoluir a navegação para React Navigation em versões futuras, caso o app cresça.
- Criar sistema de favoritos com persistência local.
- Adicionar AsyncStorage para salvar favoritos.
- Melhorar cache com persistência em armazenamento local.
- Adicionar testes automatizados.
- Adicionar animações de transição entre telas.

---

## Autor

Desenvolvido por **Miguel Zack**.

GitHub:

```txt
https://github.com/miguelzack
```
