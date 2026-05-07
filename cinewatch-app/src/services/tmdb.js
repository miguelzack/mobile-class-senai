const API_KEY = "0971c4ecf31c2d8a5e2aad5c9de745c0";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p";
const LANGUAGE = "pt-BR";
const REGION = "BR";

async function request(path, params = {}) {
  const query = new URLSearchParams({
    api_key: API_KEY,
    language: LANGUAGE,
    region: REGION,
    include_adult: "false",
    ...params,
  });

  const response = await fetch(`${BASE_URL}${path}?${query.toString()}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar dados na TMDB");
  }

  return response.json();
}

export function getPosterUrl(path, size = "w500") {
  if (!path) return null;
  return `${IMAGE_URL}/${size}${path}`;
}

export function getBackdropUrl(path, size = "w780") {
  if (!path) return null;
  return `${IMAGE_URL}/${size}${path}`;
}

export async function getTrendingMovies() {
  const data = await request("/trending/movie/day");
  return data.results || [];
}

export async function getPopularMovies(page = 1) {
  const data = await request("/movie/popular", { page: String(page) });
  return data.results || [];
}

export async function searchMovies(query) {
  if (!query?.trim()) return [];

  const data = await request("/search/movie", {
    query: query.trim(),
    page: "1",
  });

  return data.results || [];
}

export async function getMovieDetails(movieId) {
  return request(`/movie/${movieId}`, {
    append_to_response: "credits,videos",
  });
}

export async function getMovieGenres() {
  const data = await request("/genre/movie/list");
  return data.genres || [];
}

export async function discoverMoviesPage(params = {}, page = 1) {
  const data = await request("/discover/movie", {
    sort_by: "popularity.desc",
    "vote_count.gte": "150",
    ...params,
    page: String(page),
  });

  return {
    results: data.results || [],
    page: data.page || page,
    totalPages: data.total_pages || 1,
  };
}

export async function discoverMovies(params = {}) {
  const data = await discoverMoviesPage(params, 1);
  return data.results;
}

export const homeSections = [
  {
    id: "popular",
    title: "Sugestões populares 🍿",
    subtitle: "Filmes conhecidos para escolher sem pensar muito.",
    type: "popular",
  },
  {
    id: "family",
    title: "Para ver com a família 👨‍👩‍👧",
    subtitle: "Animação, aventura e filmes leves para todo mundo.",
    params: {
      with_genres: "16|10751|12",
      sort_by: "popularity.desc",
      "vote_count.gte": "250",
    },
  },
  {
    id: "sleep",
    title: "Antes de dormir 🌙",
    subtitle: "Comédias, romances e histórias mais tranquilas.",
    params: {
      with_genres: "35|10749|18",
      without_genres: "27,53,28,80",
      sort_by: "vote_average.desc",
      "vote_count.gte": "400",
    },
  },
  {
    id: "weekend",
    title: "Para o fim de semana 🎬",
    subtitle: "Aventura e ação para uma sessão mais animada.",
    params: {
      with_genres: "28|12|878",
      sort_by: "popularity.desc",
      "vote_count.gte": "300",
    },
  },
  {
    id: "couple",
    title: "Para ver de casal 💖",
    subtitle: "Romances e dramas com histórias envolventes.",
    params: {
      with_genres: "10749|18|35",
      sort_by: "popularity.desc",
      "vote_count.gte": "250",
    },
  },
  {
    id: "rated",
    title: "Bem avaliados ⭐",
    subtitle: "Notas altas com boa quantidade de votos.",
    params: {
      sort_by: "vote_average.desc",
      "vote_count.gte": "1000",
    },
  },
];

export const suggestionOptions = [
  {
    id: "happy",
    title: "Estou feliz",
    subtitle: "Comédias e aventuras leves",
    emoji: "😄",
    params: { with_genres: "35|12|10751", sort_by: "popularity.desc", "vote_count.gte": "120" },
  },
  {
    id: "action",
    title: "Quero adrenalina",
    subtitle: "Ação, aventura e ficção científica",
    emoji: "🔥",
    params: { with_genres: "28|12|878", sort_by: "popularity.desc", "vote_count.gte": "120" },
  },
  {
    id: "romance",
    title: "Quero romance",
    subtitle: "Histórias românticas e emocionantes",
    emoji: "💖",
    params: { with_genres: "10749|35|18", sort_by: "popularity.desc", "vote_count.gte": "120" },
  },
  {
    id: "fear",
    title: "Quero sentir medo",
    subtitle: "Terror, suspense e mistério",
    emoji: "👻",
    params: { with_genres: "27|53|9648", sort_by: "popularity.desc", "vote_count.gte": "120" },
  },
  {
    id: "thinking",
    title: "Quero pensar",
    subtitle: "Mistério, drama e ficção científica para refletir",
    emoji: "🧠",
    params: { with_genres: "9648|18|878", sort_by: "popularity.desc", "vote_count.gte": "60" },
    fallbackParams: { with_genres: "9648|18|878", sort_by: "popularity.desc", "vote_count.gte": "10" },
  },
  {
    id: "family",
    title: "Ver com a família",
    subtitle: "Animações e filmes família",
    emoji: "👨‍👩‍👧",
    params: { with_genres: "16|10751|14", sort_by: "popularity.desc", "vote_count.gte": "100" },
  },
  {
    id: "sleep",
    title: "Antes de dormir",
    subtitle: "Filmes leves e tranquilos",
    emoji: "🌙",
    params: { with_genres: "35|10749|18", without_genres: "27,53,28,80", sort_by: "popularity.desc", "vote_count.gte": "100" },
  },
  {
    id: "friends",
    title: "Com os amigos",
    subtitle: "Ação, comédia e aventura",
    emoji: "🎮",
    params: { with_genres: "35|28|12", sort_by: "popularity.desc", "vote_count.gte": "120" },
  },
];

export const suggestionQuizQuestions = [
  {
    id: "mood",
    title: "Como você está hoje?",
    subtitle: "Escolha o clima principal da sessão.",
    xp: 25,
    options: [
      { id: "happy", emoji: "😄", title: "Leve", subtitle: "Quero rir ou relaxar", genres: [35, 12, 10751], excludeGenres: [27] },
      { id: "adrenaline", emoji: "🔥", title: "Elétrico", subtitle: "Quero ação e ritmo", genres: [28, 12, 878] },
      { id: "thinking", emoji: "🧠", title: "Reflexivo", subtitle: "Quero pensar", genres: [9648, 18, 878], voteCount: 60 },
      { id: "fear", emoji: "👻", title: "Tenso", subtitle: "Terror ou suspense", genres: [27, 53, 9648] },
    ],
  },
  {
    id: "company",
    title: "Com quem você vai assistir?",
    subtitle: "Isso ajuda a ajustar o tipo de filme.",
    xp: 20,
    options: [
      { id: "alone", emoji: "🎧", title: "Sozinho", subtitle: "Pode ser mais imersivo", genres: [18, 9648, 878] },
      { id: "family", emoji: "👨‍👩‍👧", title: "Família", subtitle: "Algo seguro para todos", genres: [16, 10751, 12], excludeGenres: [27, 53] },
      { id: "friends", emoji: "🎮", title: "Amigos", subtitle: "Diversão e energia", genres: [35, 28, 12] },
      { id: "couple", emoji: "💖", title: "Casal", subtitle: "Romance, comédia ou drama", genres: [10749, 35, 18] },
    ],
  },
  {
    id: "pace",
    title: "Qual ritmo combina mais?",
    subtitle: "Rápido, calmo ou equilibrado?",
    xp: 20,
    options: [
      { id: "fast", emoji: "⚡", title: "Rápido", subtitle: "Sem enrolação", genres: [28, 53, 12], sortBy: "popularity.desc" },
      { id: "calm", emoji: "🌙", title: "Calmo", subtitle: "Para assistir tranquilo", genres: [35, 10749, 18], excludeGenres: [27, 28, 53] },
      { id: "balanced", emoji: "🎬", title: "Equilibrado", subtitle: "História boa e acessível", genres: [18, 12, 35], sortBy: "vote_average.desc", voteCount: 300 },
      { id: "surprise", emoji: "🎁", title: "Surpresa", subtitle: "Pode misturar tudo", genres: [12, 14, 878, 9648] },
    ],
  },
  {
    id: "time",
    title: "Quanto tempo você quer investir?",
    subtitle: "Não consigo filtrar duração sem detalhes individuais, então uso isso para ajustar popularidade/nota.",
    xp: 15,
    options: [
      { id: "short", emoji: "⏱️", title: "Pouco tempo", subtitle: "Escolhas fáceis", sortBy: "popularity.desc", voteCount: 180 },
      { id: "normal", emoji: "🍿", title: "Sessão normal", subtitle: "Filmes conhecidos", sortBy: "popularity.desc", voteCount: 120 },
      { id: "deep", emoji: "📚", title: "Pode ser longo", subtitle: "Quero algo mais forte", sortBy: "vote_average.desc", voteCount: 700 },
    ],
  },
  {
    id: "ending",
    title: "Que sensação você quer no final?",
    subtitle: "Último toque para fechar a recomendação.",
    xp: 20,
    options: [
      { id: "smile", emoji: "😊", title: "Sair sorrindo", subtitle: "Final mais leve", genres: [35, 10751, 12], excludeGenres: [27] },
      { id: "wow", emoji: "🤯", title: "Ficar impactado", subtitle: "Mistério, sci-fi ou suspense", genres: [9648, 878, 53] },
      { id: "cry", emoji: "🥹", title: "Me emocionar", subtitle: "Drama e romance", genres: [18, 10749] },
      { id: "classic", emoji: "🏆", title: "Ver algo bom", subtitle: "Mais bem avaliados", sortBy: "vote_average.desc", voteCount: 900 },
    ],
  },
];

function uniqueNumbers(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function buildQuizSuggestion(answers) {
  const selectedOptions = suggestionQuizQuestions
    .map((question) => question.options.find((option) => option.id === answers[question.id]))
    .filter(Boolean);

  const genres = uniqueNumbers(selectedOptions.flatMap((option) => option.genres || []));
  const excludeGenres = uniqueNumbers(selectedOptions.flatMap((option) => option.excludeGenres || []));
  const lastSort = [...selectedOptions].reverse().find((option) => option.sortBy)?.sortBy;
  const maxVoteCount = Math.max(...selectedOptions.map((option) => option.voteCount || 0), 80);
  const main = selectedOptions[0] || { emoji: "🎲", title: "Resultado" };
  const totalXp = suggestionQuizQuestions.reduce((sum, question) => sum + question.xp, 0);

  const params = {
    sort_by: lastSort || "popularity.desc",
    "vote_count.gte": String(maxVoteCount),
  };

  if (genres.length) params.with_genres = genres.join("|");
  if (excludeGenres.length) params.without_genres = excludeGenres.join(",");

  return {
    id: `quiz-${Date.now()}`,
    title: `Seu combo: ${main.title}`,
    subtitle: `Quiz completo • ${totalXp} XP • ${selectedOptions.map((option) => option.title).join(" + ")}`,
    emoji: main.emoji || "🎲",
    params,
    fallbackParams: {
      sort_by: "popularity.desc",
      "vote_count.gte": "20",
      ...(genres.length ? { with_genres: genres.slice(0, 4).join("|") } : {}),
    },
  };
}

export async function discoverMoviesBySuggestion(option, page = 1) {
  const data = await discoverMoviesPage({
    sort_by: "popularity.desc",
    "vote_count.gte": "120",
    ...(option.params || {}),
  }, page);

  if (data.results.length > 0 || !option.fallbackParams) {
    return data;
  }

  return discoverMoviesPage(option.fallbackParams, page);
}

export const franchiseCollections = [
  {
    id: "mcu",
    title: "Marvel Studios / MCU",
    emoji: "🦸",
    description: "Filmes principais do Universo Cinematográfico Marvel.",
    movieIds: [1726, 1724, 10138, 10195, 1771, 24428, 68721, 76338, 100402, 118340, 99861, 102899, 271110, 284052, 283995, 315635, 284053, 284054, 299536, 363088, 299537, 299534, 429617, 497698, 566525, 524434, 634649, 453395, 616037, 505642, 640146, 447365, 609681, 533535, 822119, 986056, 617126],
    storyOrder: [1771, 299537, 1726, 10138, 1724, 10195, 24428, 76338, 68721, 100402, 118340, 283995, 99861, 102899, 271110, 497698, 284054, 315635, 284052, 284053, 363088, 299536, 299534, 566525, 524434, 429617, 634649, 453395, 505642, 616037, 640146, 447365, 609681, 533535, 822119, 986056, 617126],
  },
  {
    id: "dc-universe",
    title: "DC / DCEU",
    emoji: "🦇",
    description: "Filmes do universo compartilhado da DC e derivados recentes.",
    movieIds: [49521, 209112, 297761, 297762, 141052, 791373, 297802, 287947, 495764, 464052, 436969, 436270, 594767, 298618, 565770, 572802, 1061474],
    storyOrder: [297762, 464052, 49521, 209112, 297761, 141052, 791373, 297802, 287947, 495764, 436969, 436270, 594767, 298618, 565770, 572802, 1061474],
  },
  {
    id: "dc-elseworlds",
    title: "DC Elseworlds",
    emoji: "🃏",
    description: "Histórias independentes da DC, como Coringa e The Batman.",
    movieIds: [475557, 889737, 414906],
    storyOrder: [475557, 889737, 414906],
  },
  {
    id: "spider-man",
    title: "Homem-Aranha",
    emoji: "🕷️",
    description: "Raimi, Amazing, MCU, Aranhaverso e filmes relacionados.",
    movieIds: [557, 558, 559, 1930, 102382, 315635, 429617, 634649, 324857, 569094, 335983, 580489, 912649],
    storyOrder: [557, 558, 559, 1930, 102382, 315635, 429617, 634649, 324857, 569094, 335983, 580489, 912649],
  },
  {
    id: "x-men",
    title: "X-Men / Mutantes",
    emoji: "❌",
    description: "X-Men, Wolverine, Deadpool e derivados mutantes.",
    collectionIds: [748, 453993, 448150],
    movieIds: [36657, 567604, 533535],
    storyOrder: [36657, 127585, 2080, 36658, 246655, 76170, 1724, 49538, 320288, 340102, 567604, 293660, 533535],
  },
  {
    id: "batman",
    title: "Batman",
    emoji: "🦇",
    description: "Batman clássico, trilogia Nolan e versões modernas.",
    collectionIds: [120794, 263],
    movieIds: [414906],
    storyOrder: [268, 364, 415, 414, 272, 155, 49026, 414906],
  },
  {
    id: "superman",
    title: "Superman",
    emoji: "🦸‍♂️",
    description: "Filmes principais do Superman em diferentes fases.",
    movieIds: [1924, 8536, 9531, 11411, 1452, 49521, 1061474],
    storyOrder: [1924, 8536, 9531, 11411, 1452, 49521, 1061474],
  },
  {
    id: "star-wars",
    title: "Star Wars",
    emoji: "🌌",
    description: "Saga Skywalker e derivados principais.",
    collectionIds: [10],
    storyOrder: [1893, 1894, 1895, 348350, 330459, 11, 1891, 1892, 140607, 181808, 181812],
  },
  {
    id: "wizarding-world",
    title: "Mundo Bruxo",
    emoji: "🪄",
    description: "Harry Potter e Animais Fantásticos.",
    collectionIds: [1241, 435259],
    storyOrder: [259316, 338952, 338953, 671, 672, 673, 674, 675, 767, 12444, 12445],
  },
  {
    id: "middle-earth",
    title: "Terra Média",
    emoji: "🧙",
    description: "O Hobbit e O Senhor dos Anéis.",
    collectionIds: [121938, 119],
    storyOrder: [49051, 57158, 122917, 120, 121, 122],
  },
  {
    id: "jurassic",
    title: "Jurassic Park / World",
    emoji: "🦖",
    description: "Dinossauros, parques e caos.",
    collectionIds: [328],
    storyOrder: [329, 330, 331, 135397, 351286, 507086, 1234821],
  },
  {
    id: "fast-furious",
    title: "Velozes e Furiosos",
    emoji: "🏎️",
    description: "Corridas, ação e família.",
    collectionIds: [9485],
    movieIds: [384018],
    storyOrder: [9799, 584, 9615, 13804, 51497, 82992, 168259, 337339, 385128, 384018],
  },
  {
    id: "mission-impossible",
    title: "Missão: Impossível",
    emoji: "🧗",
    description: "Ethan Hunt e missões impossíveis.",
    collectionIds: [87359],
    storyOrder: [954, 955, 956, 56292, 177677, 353081, 575264, 575265],
  },
  {
    id: "james-bond",
    title: "007 / James Bond",
    emoji: "🍸",
    description: "A longa franquia do agente secreto mais famoso do cinema.",
    collectionIds: [645],
  },
  {
    id: "indiana-jones",
    title: "Indiana Jones",
    emoji: "🤠",
    description: "Aventura, arqueologia e relíquias lendárias.",
    collectionIds: [84],
    storyOrder: [87, 85, 89, 217, 335977],
  },
  {
    id: "matrix",
    title: "Matrix",
    emoji: "🟩",
    description: "Realidade, máquinas e escolhas.",
    collectionIds: [2344],
    storyOrder: [603, 604, 605, 624860],
  },
  {
    id: "pirates",
    title: "Piratas do Caribe",
    emoji: "🏴‍☠️",
    description: "Jack Sparrow e aventuras no mar.",
    collectionIds: [295],
    storyOrder: [22, 58, 285, 1865, 166426],
  },
  {
    id: "hunger-games",
    title: "Jogos Vorazes",
    emoji: "🏹",
    description: "Panem, arena e revolução.",
    collectionIds: [131635],
    movieIds: [695721],
    storyOrder: [695721, 70160, 101299, 131631, 131634],
  },
  {
    id: "john-wick",
    title: "John Wick",
    emoji: "🕴️",
    description: "Ação, vingança e o Continental.",
    collectionIds: [404609],
    storyOrder: [245891, 324552, 458156, 603692],
  },
  {
    id: "avatar",
    title: "Avatar",
    emoji: "🌊",
    description: "Pandora e os Na'vi.",
    collectionIds: [87096],
    storyOrder: [19995, 76600],
  },
  {
    id: "transformers",
    title: "Transformers",
    emoji: "🤖",
    description: "Autobots, Decepticons e batalhas gigantes.",
    collectionIds: [8650],
    movieIds: [424783, 667538],
    storyOrder: [424783, 667538, 1858, 8373, 38356, 91314, 335988],
  },
  {
    id: "monsterverse",
    title: "MonsterVerse",
    emoji: "🦍",
    description: "Godzilla, Kong e outros titãs gigantes.",
    movieIds: [124905, 293167, 373571, 399566, 823464],
    storyOrder: [124905, 293167, 373571, 399566, 823464],
  },
  {
    id: "alien",
    title: "Alien / Prometheus",
    emoji: "👽",
    description: "Xenomorfos, exploração espacial e terror sci-fi.",
    collectionIds: [8091, 135416],
    movieIds: [945961],
    storyOrder: [70981, 126889, 945961, 348, 679, 8077, 8078],
  },
  {
    id: "predator",
    title: "Predador",
    emoji: "🎯",
    description: "Caçadores alienígenas e sobrevivência.",
    collectionIds: [399, 115762],
    movieIds: [766507],
    storyOrder: [766507, 106, 169, 34851, 346910, 395, 440],
  },
  {
    id: "terminator",
    title: "O Exterminador do Futuro",
    emoji: "💀",
    description: "Skynet, viagens no tempo e resistência humana.",
    collectionIds: [528],
    storyOrder: [218, 280, 296, 534, 87101, 290859],
  },
  {
    id: "mad-max",
    title: "Mad Max",
    emoji: "🏜️",
    description: "Estradas, caos e sobrevivência pós-apocalíptica.",
    collectionIds: [8945],
    movieIds: [786892],
    storyOrder: [9659, 8810, 9355, 76341, 786892],
  },
  {
    id: "rocky-creed",
    title: "Rocky / Creed",
    emoji: "🥊",
    description: "Boxe, superação e legado.",
    collectionIds: [1575, 553717],
    storyOrder: [1366, 1367, 1371, 1374, 1375, 1246, 312221, 480530, 677179],
  },
  {
    id: "bourne",
    title: "Bourne",
    emoji: "🕵️",
    description: "Espionagem, identidade e perseguições.",
    collectionIds: [31562],
  },
  {
    id: "ocean",
    title: "Onze Homens e um Segredo",
    emoji: "💎",
    description: "Golpes, cassinos e equipes estilosas.",
    collectionIds: [304],
    movieIds: [402900],
    storyOrder: [161, 163, 298, 402900],
  },
  {
    id: "men-in-black",
    title: "Homens de Preto",
    emoji: "😎",
    description: "Agentes secretos e aliens na Terra.",
    collectionIds: [86055],
    movieIds: [479455],
    storyOrder: [607, 608, 41154, 479455],
  },
  {
    id: "back-to-the-future",
    title: "De Volta para o Futuro",
    emoji: "⏰",
    description: "Viagens no tempo com Marty e Doc Brown.",
    collectionIds: [264],
    storyOrder: [105, 165, 196],
  },
  {
    id: "ghostbusters",
    title: "Os Caça-Fantasmas",
    emoji: "👻",
    description: "Fantasmas, comédia e equipamentos malucos.",
    collectionIds: [2980],
    movieIds: [43074, 967847],
    storyOrder: [620, 2978, 43074, 425909, 967847],
  },
  {
    id: "godfather",
    title: "O Poderoso Chefão",
    emoji: "🌹",
    description: "A saga da família Corleone.",
    collectionIds: [230],
    storyOrder: [238, 240, 242],
  },
  {
    id: "star-trek",
    title: "Star Trek",
    emoji: "🖖",
    description: "Exploração espacial, tripulações e linhas do tempo.",
    collectionIds: [151, 115575],
  },
  {
    id: "blade-runner",
    title: "Blade Runner",
    emoji: "🌃",
    description: "Cyberpunk, replicantes e futuro sombrio.",
    collectionIds: [422837],
    storyOrder: [78, 335984],
  },
  {
    id: "tron",
    title: "Tron",
    emoji: "💿",
    description: "Mundo digital, luzes neon e programas vivos.",
    collectionIds: [63043],
    storyOrder: [97, 20526],
  },
  {
    id: "narnia",
    title: "As Crônicas de Nárnia",
    emoji: "🦁",
    description: "Fantasia, magia e aventuras em Nárnia.",
    collectionIds: [420],
    storyOrder: [411, 2454, 10140],
  },
  {
    id: "twilight",
    title: "Crepúsculo",
    emoji: "🧛",
    description: "Romance sobrenatural entre vampiros e lobisomens.",
    collectionIds: [33514],
    storyOrder: [8966, 18239, 24021, 50619, 50620],
  },
  {
    id: "maze-runner",
    title: "Maze Runner",
    emoji: "🏃",
    description: "Labirintos, distopia e sobrevivência.",
    collectionIds: [295130],
    storyOrder: [198663, 294254, 336843],
  },
  {
    id: "divergent",
    title: "Divergente",
    emoji: "🧬",
    description: "Facções, escolhas e rebelião.",
    collectionIds: [283579],
    storyOrder: [157350, 262500, 262504],
  },
  {
    id: "percy-jackson",
    title: "Percy Jackson",
    emoji: "⚡",
    description: "Mitologia grega em aventura adolescente.",
    collectionIds: [179919],
    storyOrder: [32657, 76285],
  },
  {
    id: "sherlock-holmes",
    title: "Sherlock Holmes",
    emoji: "🔎",
    description: "Mistério, investigação e ação com Holmes e Watson.",
    collectionIds: [102322],
    storyOrder: [10528, 58574],
  },
  {
    id: "knives-out",
    title: "Entre Facas e Segredos",
    emoji: "🗡️",
    description: "Mistérios modernos com Benoit Blanc.",
    collectionIds: [722971],
    storyOrder: [546554, 661374],
  },
  {
    id: "quiet-place",
    title: "Um Lugar Silencioso",
    emoji: "🤫",
    description: "Terror/suspense com monstros guiados por som.",
    collectionIds: [521226],
    movieIds: [762441],
    storyOrder: [762441, 447332, 520763],
  },
  {
    id: "conjuring",
    title: "Invocação do Mal",
    emoji: "🕯️",
    description: "Warrens, Annabelle, A Freira e casos sobrenaturais.",
    collectionIds: [313086, 402074, 968051],
    storyOrder: [439079, 396422, 250546, 138843, 423108, 259693, 521029, 460019, 1038392],
  },
  {
    id: "it",
    title: "It: A Coisa",
    emoji: "🎈",
    description: "Pennywise e o terror em Derry.",
    collectionIds: [477962],
    storyOrder: [346364, 474350],
  },
  {
    id: "scream",
    title: "Pânico",
    emoji: "🔪",
    description: "Ghostface e o terror meta-slasher.",
    collectionIds: [2602],
  },
  {
    id: "saw",
    title: "Jogos Mortais",
    emoji: "🪚",
    description: "Armadilhas, suspense e Jigsaw.",
    collectionIds: [656],
  },
  {
    id: "final-destination",
    title: "Premonição",
    emoji: "💥",
    description: "A morte sempre encontra um caminho.",
    collectionIds: [8864],
    movieIds: [574475],
  },
  {
    id: "nightmare-elm",
    title: "A Hora do Pesadelo",
    emoji: "😴",
    description: "Freddy Krueger e pesadelos fatais.",
    collectionIds: [8581],
  },
  {
    id: "friday-13",
    title: "Sexta-Feira 13",
    emoji: "🏕️",
    description: "Jason Voorhees e Crystal Lake.",
    collectionIds: [9735],
  },
  {
    id: "halloween",
    title: "Halloween",
    emoji: "🎃",
    description: "Michael Myers e várias linhas temporais.",
    collectionIds: [91361, 1262092],
  },
  {
    id: "shrek",
    title: "Shrek / Gato de Botas",
    emoji: "🟢",
    description: "Contos de fadas zoeiros e aventuras animadas.",
    collectionIds: [2150, 94602],
    storyOrder: [808, 809, 810, 10192, 417859, 315162],
  },
  {
    id: "toy-story",
    title: "Toy Story",
    emoji: "🧸",
    description: "Woody, Buzz e amizade.",
    collectionIds: [10194],
    movieIds: [718789],
    storyOrder: [862, 863, 10193, 301528, 718789],
  },
  {
    id: "despicable-me",
    title: "Meu Malvado Favorito / Minions",
    emoji: "🍌",
    description: "Gru, minions e confusão em família.",
    collectionIds: [86066, 544669],
    storyOrder: [211672, 438148, 20352, 93456, 324852, 519182],
  },
  {
    id: "dragon",
    title: "Como Treinar o seu Dragão",
    emoji: "🐉",
    description: "Soluço, Banguela e Berk.",
    collectionIds: [89137],
    movieIds: [1087192],
    storyOrder: [10191, 82702, 166428, 1087192],
  },
  {
    id: "kung-fu-panda",
    title: "Kung Fu Panda",
    emoji: "🐼",
    description: "Po, mestres e artes marciais.",
    collectionIds: [77816],
    storyOrder: [9502, 49444, 140300, 1011985],
  },
  {
    id: "ice-age",
    title: "A Era do Gelo",
    emoji: "🧊",
    description: "Manny, Sid, Diego e Scrat.",
    collectionIds: [8354],
  },
  {
    id: "cars",
    title: "Carros",
    emoji: "🏁",
    description: "Relâmpago McQueen e Radiator Springs.",
    collectionIds: [87118],
    storyOrder: [920, 49013, 260514],
  },
  {
    id: "monsters-inc",
    title: "Monstros S.A.",
    emoji: "🚪",
    description: "Sustos, risadas e amizade.",
    collectionIds: [137696],
    storyOrder: [62211, 585],
  },
  {
    id: "finding-nemo",
    title: "Procurando Nemo / Dory",
    emoji: "🐠",
    description: "Aventuras no oceano da Pixar.",
    collectionIds: [137697],
    storyOrder: [12, 127380],
  },
  {
    id: "incredibles",
    title: "Os Incríveis",
    emoji: "🦸‍♀️",
    description: "Família super-heroica da Pixar.",
    collectionIds: [468222],
    storyOrder: [9806, 260513],
  },
  {
    id: "frozen",
    title: "Frozen",
    emoji: "❄️",
    description: "Elsa, Anna e Arendelle.",
    collectionIds: [386382],
    storyOrder: [109445, 330457],
  },
  {
    id: "jumanji",
    title: "Jumanji",
    emoji: "🎲",
    description: "Jogos perigosos e aventuras fantásticas.",
    collectionIds: [495527],
    movieIds: [8844],
    storyOrder: [8844, 353486, 512200],
  },
  {
    id: "sonic",
    title: "Sonic",
    emoji: "💨",
    description: "Velocidade, anéis e aventuras com Sonic.",
    collectionIds: [720879],
    storyOrder: [454626, 675353, 939243],
  },
  {
    id: "lego-movie",
    title: "Uma Aventura LEGO",
    emoji: "🧱",
    description: "Humor, peças e criatividade sem limite.",
    collectionIds: [325470],
    movieIds: [324849, 274862],
    storyOrder: [137106, 324849, 280217, 274862],
  },
  {
    id: "hotel-transylvania",
    title: "Hotel Transilvânia",
    emoji: "🧛‍♂️",
    description: "Monstros, família e comédia.",
    collectionIds: [185103],
    storyOrder: [76492, 159824, 400155, 585083],
  },
  {
    id: "paddington",
    title: "Paddington",
    emoji: "🐻",
    description: "Aventuras fofas e familiares do ursinho Paddington.",
    collectionIds: [488924],
    storyOrder: [116149, 346648],
  },
  {
    id: "mummy",
    title: "A Múmia",
    emoji: "🏺",
    description: "Aventura, maldições e múmias no Egito.",
    collectionIds: [1733],
    storyOrder: [564, 1734, 1735],
  },
  {
    id: "national-treasure",
    title: "A Lenda do Tesouro Perdido",
    emoji: "🗺️",
    description: "Mistérios históricos e caça ao tesouro.",
    collectionIds: [52984],
    storyOrder: [2059, 6637],
  },
  {
    id: "kingsman",
    title: "Kingsman",
    emoji: "☂️",
    description: "Espiões elegantes, ação e humor ácido.",
    collectionIds: [391860],
    storyOrder: [476669, 207703, 343668],
  },
  {
    id: "planet-apes",
    title: "Planeta dos Macacos",
    emoji: "🦧",
    description: "Clássicos e reboot moderno dos macacos inteligentes.",
    collectionIds: [173710, 1709],
    movieIds: [653346],
    storyOrder: [61791, 119450, 281338, 653346, 869, 1688, 1687, 1689, 1705, 8698],
  },
];

function normalizeCollectionMovie(movie) {
  return {
    id: movie.id,
    title: movie.title || movie.name || "Filme sem título",
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    vote_average: movie.vote_average || 0,
    release_date: movie.release_date || "",
    overview: movie.overview || "",
    genre_ids: movie.genre_ids || [],
  };
}

function sortByReleaseDate(movies) {
  return [...movies].sort((a, b) => {
    const dateA = a.release_date || "9999-99-99";
    const dateB = b.release_date || "9999-99-99";
    return dateA.localeCompare(dateB);
  });
}

function sortByStoryOrder(movies, storyOrder = []) {
  if (!storyOrder.length) return sortByReleaseDate(movies);
  const orderMap = new Map(storyOrder.map((movieId, index) => [movieId, index]));

  return [...movies].sort((a, b) => {
    const orderA = orderMap.has(a.id) ? orderMap.get(a.id) : 9999;
    const orderB = orderMap.has(b.id) ? orderMap.get(b.id) : 9999;

    if (orderA !== orderB) return orderA - orderB;
    return (a.release_date || "9999-99-99").localeCompare(b.release_date || "9999-99-99");
  });
}

export async function getCollectionDetails(collectionId) {
  return request(`/collection/${collectionId}`);
}

async function getMovieForFranchise(movieId) {
  return request(`/movie/${movieId}`);
}

export async function getFranchiseMovies(franchise, orderMode = "release") {
  const movieMap = new Map();
  const collectionIds = franchise.collectionIds || [];
  const movieIds = franchise.movieIds || [];

  const collectionResults = await Promise.allSettled(
    collectionIds.map((collectionId) => getCollectionDetails(collectionId))
  );

  collectionResults.forEach((result) => {
    if (result.status !== "fulfilled") return;
    const collection = result.value;
    (collection.parts || []).forEach((movie) => {
      if (!movieMap.has(movie.id)) {
        movieMap.set(movie.id, normalizeCollectionMovie(movie));
      }
    });
  });

  const movieResults = await Promise.allSettled(
    movieIds.map((movieId) => getMovieForFranchise(movieId))
  );

  movieResults.forEach((result) => {
    if (result.status !== "fulfilled") return;
    const movie = normalizeCollectionMovie(result.value);
    if (!movieMap.has(movie.id)) {
      movieMap.set(movie.id, movie);
    }
  });

  const movies = Array.from(movieMap.values()).filter((movie) => movie.id);

  if (orderMode === "story") {
    return sortByStoryOrder(movies, franchise.storyOrder || []);
  }

  return sortByReleaseDate(movies);
}
