export function ratingLabel(rating) {
  const value = Number(rating || 0).toFixed(1);
  return `⭐ ${value}`;
}
