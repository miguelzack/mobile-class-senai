import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialMovieState, loadMovieState, saveMovieState } from "../storage/movieStorage";

const MovieContext = createContext(null);

function normalizeMovie(movie) {
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

function existsById(list, movieId) {
  return list.some((item) => item.id === movieId);
}

function removeById(list, movieId) {
  return list.filter((item) => item.id !== movieId);
}

export function MovieProvider({ children }) {
  const [state, setState] = useState(initialMovieState);
  const [loadingLocalData, setLoadingLocalData] = useState(true);

  useEffect(() => {
    async function load() {
      const saved = await loadMovieState();
      setState(saved);
      setLoadingLocalData(false);
    }

    load();
  }, []);

  function updateState(callback) {
    setState((current) => {
      const updated = callback({ ...initialMovieState, ...current });
      saveMovieState(updated);
      return updated;
    });
  }

  function toggleFavorite(movie) {
    const item = normalizeMovie(movie);

    updateState((current) => ({
      ...current,
      favorites: existsById(current.favorites, item.id)
        ? removeById(current.favorites, item.id)
        : [item, ...current.favorites],
    }));
  }

  function toggleWatchlist(movie) {
    const item = normalizeMovie(movie);

    updateState((current) => ({
      ...current,
      watchlist: existsById(current.watchlist, item.id)
        ? removeById(current.watchlist, item.id)
        : [item, ...current.watchlist],
    }));
  }

  function markMovieAsWatched(movie) {
    const item = normalizeMovie(movie);

    updateState((current) => {
      const currentInfo = current.watched[item.id];

      return {
        ...current,
        watched: {
          ...current.watched,
          [item.id]: {
            movie: item,
            rating: currentInfo?.rating || 0,
            watchedAt: currentInfo?.watchedAt || new Date().toISOString(),
          },
        },
      };
    });
  }

  function removeMovieFromWatched(movieId) {
    updateState((current) => {
      const updatedWatched = { ...current.watched };
      delete updatedWatched[movieId];

      return {
        ...current,
        watched: updatedWatched,
      };
    });
  }

  function toggleWatched(movie) {
    const item = normalizeMovie(movie);

    if (state.watched[item.id]) {
      removeMovieFromWatched(item.id);
    } else {
      markMovieAsWatched(item);
    }
  }

  function saveMovieRating(movie, rating) {
    const item = normalizeMovie(movie);
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

    updateState((current) => {
      const currentInfo = current.watched[item.id] || {
        movie: item,
        watchedAt: new Date().toISOString(),
      };

      return {
        ...current,
        watched: {
          ...current.watched,
          [item.id]: {
            ...currentInfo,
            movie: item,
            rating: safeRating,
            watchedAt: currentInfo.watchedAt || new Date().toISOString(),
          },
        },
      };
    });
  }

  function addMovieNote(movie, text) {
    const cleanText = text.trim();
    if (!cleanText) return;

    const item = normalizeMovie(movie);

    updateState((current) => {
      const currentNotesInfo = current.movieNotes?.[item.id] || {
        movie: item,
        notes: [],
      };

      const note = {
        id: `${Date.now()}`,
        text: cleanText,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };

      return {
        ...current,
        movieNotes: {
          ...(current.movieNotes || {}),
          [item.id]: {
            ...currentNotesInfo,
            movie: item,
            notes: [note, ...(currentNotesInfo.notes || [])],
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }

  function updateMovieNote(movieId, noteId, text) {
    const cleanText = text.trim();
    if (!cleanText) return;

    updateState((current) => {
      const currentNotesInfo = current.movieNotes?.[movieId];
      if (!currentNotesInfo) return current;

      return {
        ...current,
        movieNotes: {
          ...(current.movieNotes || {}),
          [movieId]: {
            ...currentNotesInfo,
            notes: (currentNotesInfo.notes || []).map((note) => {
              if (note.id !== noteId) return note;

              return {
                ...note,
                text: cleanText,
                updatedAt: new Date().toISOString(),
              };
            }),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }

  function removeMovieNote(movieId, noteId) {
    updateState((current) => {
      const currentNotesInfo = current.movieNotes?.[movieId];
      if (!currentNotesInfo) return current;

      const updatedNotes = (currentNotesInfo.notes || []).filter((note) => note.id !== noteId);
      const updatedMovieNotes = { ...(current.movieNotes || {}) };

      if (updatedNotes.length === 0) {
        delete updatedMovieNotes[movieId];
      } else {
        updatedMovieNotes[movieId] = {
          ...currentNotesInfo,
          notes: updatedNotes,
          updatedAt: new Date().toISOString(),
        };
      }

      return {
        ...current,
        movieNotes: updatedMovieNotes,
      };
    });
  }

  function getMovieNotes(movieId) {
    return state.movieNotes?.[movieId]?.notes || [];
  }

  function setMovieReaction(movie, reaction) {
    const item = normalizeMovie(movie);

    updateState((current) => {
      const currentReaction = current.reactions?.[item.id]?.type;
      const reactions = { ...(current.reactions || {}) };

      if (currentReaction === reaction) {
        delete reactions[item.id];
      } else {
        reactions[item.id] = {
          type: reaction,
          movie: item,
          createdAt: new Date().toISOString(),
        };
      }

      return {
        ...current,
        reactions,
      };
    });
  }

  function createCustomList(name) {
    const cleanName = name.trim();
    if (!cleanName) return;

    updateState((current) => ({
      ...current,
      customLists: [
        {
          id: `${Date.now()}`,
          name: cleanName,
          movies: [],
          createdAt: new Date().toISOString(),
          updatedAt: null,
        },
        ...current.customLists,
      ],
    }));
  }

  function updateCustomListName(listId, name) {
    const cleanName = name.trim();
    if (!cleanName) return;

    updateState((current) => ({
      ...current,
      customLists: current.customLists.map((list) => {
        if (list.id !== listId) return list;

        return {
          ...list,
          name: cleanName,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }

  function deleteCustomList(listId) {
    updateState((current) => ({
      ...current,
      customLists: current.customLists.filter((list) => list.id !== listId),
    }));
  }

  function toggleMovieInCustomList(listId, movie) {
    const item = normalizeMovie(movie);

    updateState((current) => ({
      ...current,
      customLists: current.customLists.map((list) => {
        if (list.id !== listId) return list;

        const alreadyAdded = existsById(list.movies, item.id);

        return {
          ...list,
          movies: alreadyAdded ? removeById(list.movies, item.id) : [item, ...list.movies],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }

  function isFavorite(movieId) {
    return existsById(state.favorites, movieId);
  }

  function isInWatchlist(movieId) {
    return existsById(state.watchlist, movieId);
  }

  function isWatched(movieId) {
    return !!state.watched[movieId];
  }

  function getMovieReaction(movieId) {
    return state.reactions?.[movieId]?.type || null;
  }

  function isInCustomList(listId, movieId) {
    const list = state.customLists.find((item) => item.id === listId);
    if (!list) return false;
    return existsById(list.movies, movieId);
  }

  const watchedList = useMemo(() => {
    return Object.values(state.watched)
      .filter((item) => item?.movie)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [state.watched]);

  const likedMovies = useMemo(() => {
    return Object.values(state.reactions || {})
      .filter((item) => item.type === "like" && item.movie)
      .map((item) => item.movie);
  }, [state.reactions]);

  const dislikedMovies = useMemo(() => {
    return Object.values(state.reactions || {})
      .filter((item) => item.type === "dislike" && item.movie)
      .map((item) => item.movie);
  }, [state.reactions]);

  const value = {
    state,
    loadingLocalData,
    watchedList,
    likedMovies,
    dislikedMovies,
    toggleFavorite,
    toggleWatchlist,
    markMovieAsWatched,
    removeMovieFromWatched,
    toggleWatched,
    saveMovieRating,
    addMovieNote,
    updateMovieNote,
    removeMovieNote,
    getMovieNotes,
    setMovieReaction,
    createCustomList,
    updateCustomListName,
    deleteCustomList,
    toggleMovieInCustomList,
    isFavorite,
    isInWatchlist,
    isWatched,
    getMovieReaction,
    isInCustomList,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies() {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error("useMovies precisa ser usado dentro de MovieProvider");
  }

  return context;
}
