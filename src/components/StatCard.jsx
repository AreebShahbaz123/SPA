export default function StatCard({ label, value, hint, accent = "primary" }) {
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      <span className={`stat-card__value stat-card__value--${accent}`}>
        {value}
      </span>
      {hint ? <span className="stat-card__hint">{hint}</span> : null}
    </div>
  );
}