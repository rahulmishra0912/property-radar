export function StarRating({
  value,
  count,
}: {
  value: number | null;
  count?: number;
}) {
  const shown = value ?? 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex" aria-label={value == null ? "No ratings" : `${value} stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={n <= Math.round(shown) ? "text-star" : "text-line"}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-muted">
        {value == null ? "No ratings yet" : `${value.toFixed(1)}`}
        {count != null ? ` · ${count} review${count === 1 ? "" : "s"}` : ""}
      </span>
    </div>
  );
}
