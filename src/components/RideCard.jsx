import Button from "./Button";

const STATUS_LABELS = {
  open: "Open",
  full: "Full",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function RideCard({
  id,
  from: origin,
  to: destination,
  date,
  time,
  driver,
  price,
  seats,
  status,
  onBook,
  alreadyBooked = false,
}) {
  const canBook = status === "open" && !alreadyBooked;
  const buttonLabel = alreadyBooked
    ? "Booked"
    : status === "open"
      ? "Book seat"
      : status === "full"
        ? "Full"
        : "Closed";

  return (
    <article className="ride-card">
      <div className="ride-card__top">
        <span className="ride-card__route">
          <strong>{origin}</strong>
          <span className="ride-card__arrow" aria-hidden="true">
            →
          </span>
          <strong>{destination}</strong>
        </span>
        <span className={`badge badge--${status}`}>
          {STATUS_LABELS[status] ?? status}
        </span>
      </div>

      <div className="ride-card__meta">
        <span>📅 {date}</span>
        <span>⏰ {time}</span>
        <span>👤 {driver}</span>
        <span>🪑 {seats} seat{seats === 1 ? "" : "s"} left</span>
      </div>

      <div className="ride-card__bottom">
        <span className="ride-card__price">£{price.toFixed(2)}</span>
        <Button
          variant={alreadyBooked ? "secondary" : "primary"}
          size="sm"
          disabled={!canBook}
          onClick={() => onBook?.(id)}
        >
          {buttonLabel}
        </Button>
      </div>
    </article>
  );
}