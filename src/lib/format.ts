const DATE = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const MONTH = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

export function formatDate(value: Date | string) {
  return DATE.format(new Date(value));
}

export function formatMonth(value: Date | string) {
  return MONTH.format(new Date(value));
}

export function averageRating(ratings: number[]) {
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

export function starsLabel(value: number | null) {
  if (value == null) return "No ratings yet";
  return `${value.toFixed(1)} / 5`;
}
