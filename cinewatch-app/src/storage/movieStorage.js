import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_PREFIX = "@cinemood_data_v4";
const OLD_STORAGE_KEYS = ["@cinewatch_data_v3", "@cinewatch_data_v2", "@cinewatch_data_v1"];

export const initialMovieState = {
  favorites: [],
  watchlist: [],
  watched: {},
  movieNotes: {},
  reactions: {},
  customLists: [],
};

function getStorageKey(userId) {
  return userId ? `${STORAGE_PREFIX}_${userId}` : `${STORAGE_PREFIX}_guest`;
}

function normalizeState(savedState) {
  return {
    ...initialMovieState,
    ...(savedState || {}),
    favorites: Array.isArray(savedState?.favorites) ? savedState.favorites : [],
    watchlist: Array.isArray(savedState?.watchlist) ? savedState.watchlist : [],
    watched: savedState?.watched || {},
    movieNotes: savedState?.movieNotes || {},
    reactions: savedState?.reactions || {},
    customLists: Array.isArray(savedState?.customLists) ? savedState.customLists : [],
  };
}

function migrateState(savedState) {
  const migrated = normalizeState(savedState);

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

function uniqueMovies(...lists) {
  const map = new Map();
  lists.flat().forEach((movie) => {
    if (!movie?.id) return;
    map.set(String(movie.id), { ...map.get(String(movie.id)), ...movie });
  });
  return Array.from(map.values());
}

function mergeNotes(localNotes = {}, cloudNotes = {}) {
  const result = { ...localNotes };

  Object.entries(cloudNotes || {}).forEach(([movieId, info]) => {
    const existing = result[movieId];
    if (!existing) {
      result[movieId] = info;
      return;
    }

    const noteMap = new Map();
    [...(existing.notes || []), ...(info.notes || [])].forEach((note) => {
      if (!note?.id) return;
      noteMap.set(String(note.id), { ...noteMap.get(String(note.id)), ...note });
    });

    result[movieId] = {
      ...existing,
      ...info,
      notes: Array.from(noteMap.values()).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
      updatedAt: info.updatedAt || existing.updatedAt || new Date().toISOString(),
    };
  });

  return result;
}

function mergeWatched(localWatched = {}, cloudWatched = {}) {
  const result = { ...localWatched };

  Object.entries(cloudWatched || {}).forEach(([movieId, cloudInfo]) => {
    const localInfo = result[movieId];
    if (!localInfo) {
      result[movieId] = cloudInfo;
      return;
    }

    result[movieId] = {
      ...localInfo,
      ...cloudInfo,
      rating: Math.max(Number(localInfo.rating) || 0, Number(cloudInfo.rating) || 0),
      watchedAt: cloudInfo.watchedAt || localInfo.watchedAt || new Date().toISOString(),
      movie: { ...(localInfo.movie || {}), ...(cloudInfo.movie || {}) },
    };
  });

  return result;
}

function mergeCustomLists(localLists = [], cloudLists = []) {
  const map = new Map();

  [...localLists, ...cloudLists].forEach((list) => {
    if (!list?.id) return;
    const current = map.get(String(list.id));

    if (!current) {
      map.set(String(list.id), { ...list, movies: uniqueMovies(list.movies || []) });
      return;
    }

    map.set(String(list.id), {
      ...current,
      ...list,
      movies: uniqueMovies(current.movies || [], list.movies || []),
      updatedAt: list.updatedAt || current.updatedAt || null,
    });
  });

  return Array.from(map.values()).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function mergeMovieStates(localState, cloudState) {
  const local = normalizeState(localState);
  const cloud = normalizeState(cloudState);

  return {
    ...initialMovieState,
    ...local,
    ...cloud,
    favorites: uniqueMovies(local.favorites, cloud.favorites),
    watchlist: uniqueMovies(local.watchlist, cloud.watchlist),
    watched: mergeWatched(local.watched, cloud.watched),
    movieNotes: mergeNotes(local.movieNotes, cloud.movieNotes),
    reactions: { ...local.reactions, ...cloud.reactions },
    customLists: mergeCustomLists(local.customLists, cloud.customLists),
  };
}

export async function loadMovieState(userId) {
  try {
    const storageKey = getStorageKey(userId);
    const rawCurrent = await AsyncStorage.getItem(storageKey);
    let raw = rawCurrent;

    if (!raw && userId) {
      for (const key of OLD_STORAGE_KEYS) {
        raw = await AsyncStorage.getItem(key);
        if (raw) break;
      }
    }

    if (!raw) return initialMovieState;

    const parsed = JSON.parse(raw);
    const migrated = migrateState(parsed);

    if (!rawCurrent) {
      await saveMovieState(migrated, userId);
    }

    return migrated;
  } catch (error) {
    
    return initialMovieState;
  }
}

export async function saveMovieState(state, userId) {
  try {
    await AsyncStorage.setItem(getStorageKey(userId), JSON.stringify({ ...initialMovieState, ...(state || {}) }));
  } catch (error) {
    
  }
}
