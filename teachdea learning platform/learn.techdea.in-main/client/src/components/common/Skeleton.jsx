export default function Skeleton({ count = 3 }) {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton skeleton-card" key={i} />
      ))}
    </div>
  );
}
