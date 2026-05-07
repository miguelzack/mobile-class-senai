import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@cinewatch_data_v3";
const OLD_STORAGE_KEYS = ["@cinewatch_data_v2", "@cinewatch_data_v1"];

export const initialMovieState = {
  favorites: [],
  watchlist: [],
  watched: {},
  movieNotes: {},
  reactions: {},
  customLists: [],
};

function migrateState(savedState) {
  const migrated = {
    ...initialMovieState,
    ...(savedState || {}),
    movieNotes: savedState?.movieNotes || {},
  };

  // Migração para quem já tinha anotações dentro de "watched" nas versões anteriores.
  // Agora as anotações ficam separadas, então remover dos assistidos não apaga mais elas.
  Object.entries(savedState?.watched || {}).forEach(([movieId, watchedInfo]) => {
    const oldNotes = watchedInfo?.notes || [];
    if (!oldNotes.length) return;

    const currentNotes = migrated.movieNotes?.[movieId]?.notes || [];
    if (currentNotes.length) return;

    migrated.movieNotes = {
      ...migrated.movieNotes,
      [movieId]: {
        movie: watchedInfo.movie,
        notes: oldNotes,
        updatedAt: new Date().toISOString(),
      },
    };
  });

  return migrated;
}

export async function loadMovieState() {
  try {
    const rawCurrent = await AsyncStorage.getItem(STORAGE_KEY);
    let raw = rawCurrent;

    if (!raw) {
      for (const key of OLD_STORAGE_KEYS) {
        raw = await AsyncStorage.getItem(key);
        if (raw) break;
      }
    }

    if (!raw) return initialMovieState;

    const parsed = JSON.parse(raw);
    const migrated = migrateState(parsed);

    if (!rawCurrent) {
      await saveMovieState(migrated);
    }

    return migrated;
  } catch (error) {
    console.log("Erro ao carregar dados locais:", error);
    return initialMovieState;
  }
}

export async function saveMovieState(state) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.log("Erro ao salvar dados locais:", error);
  }
}
