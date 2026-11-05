import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import RideCard from "../components/RideCard";

export default function MyActivity() {
  const { rides, bookings } = useSelector((s) => s.rides);

  const booked = bookings
    .map((b) => rides.find((r) => r.id === b.rideId))
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const upcoming = booked.filter((r) => new Date(r.date) >= new Date(new Date().toDateString()));
  const past = booked.filter((r) => new Date(r.date) < new Date(new Date().toDateString()));

  return (
    <section className="page">
      <div className="page__head">
        <h1>My activity</h1>
        <p>{booked.length} ride{booked.length === 1 ? "" : "s"} booked</p>
      </div>

      {booked.length === 0 ? (
        <div className="empty">
          <p>You haven't booked any rides yet.</p>
          <Link to="/rides" className="btn btn--primary btn--md">
            Browse rides
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="section">
              <div className="section__head">
                <h2>Upcoming</h2>
              </div>
              <div className="ride-grid">
                {upcoming.map((ride) => (
                  <RideCard key={ride.id} {...ride} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div className="section">
              <div className="section__head">
                <h2>Past</h2>
              </div>
              <div className="ride-grid">
                {past.map((ride) => (
                  <RideCard key={ride.id} {...ride} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}