export const sortOptions = [
  { id: 'best', label: 'Melhor nota' },
  { id: 'worst', label: 'Pior nota' },
  { id: 'recent', label: 'Mais recente' },
  { id: 'alpha', label: 'Ordem alfabética' },
  { id: 'watchedDate', label: 'Data assistida' },
];

export function sortMovieEntries(entries = [], sort = 'recent') {
  const copy = [...entries];
  if (sort === 'best') return copy.sort((a, b) => (b.rating || b.movie?.vote_average || b.vote_average || 0) - (a.rating || a.movie?.vote_average || a.vote_average || 0));
  if (sort === 'worst') return copy.sort((a, b) => (a.rating || a.movie?.vote_average || a.vote_average || 0) - (b.rating || b.movie?.vote_average || b.vote_average || 0));
  if (sort === 'alpha') return copy.sort((a, b) => String(a.movie?.title || a.title).localeCompare(String(b.movie?.title || b.title)));
  if (sort === 'watchedDate') return copy.sort((a, b) => String(b.watchedAt || b.createdAt || '').localeCompare(String(a.watchedAt || a.createdAt || '')));
  return copy.sort((a, b) => String(b.updatedAt || b.createdAt || b.watchedAt || '').localeCompare(String(a.updatedAt || a.createdAt || a.watchedAt || '')));
}

export function filterWatchedByRating(entries = [], minRating = 0) {
  return entries.filter((entry) => (Number(entry.rating) || 0) >= Number(minRating || 0));
}

export function filterWatchedByGenre(entries = [], genreId) {
  if (!genreId) return entries;
  return entries.filter((entry) => (entry.movie?.genre_ids || []).includes(Number(genreId)));
}
