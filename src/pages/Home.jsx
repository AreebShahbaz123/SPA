import { Link } from "react-router-dom";
import { rides } from "../data/seedRides";
import RideCard from "../components/RideCard";
import StatCard from "../components/StatCard";

const openRides = rides.filter((r) => r.status === "open");

export default function Home() {
  const stats = [
    { label: "Active rides", value: openRides.length, hint: "open right now" },
    { label: "Total drivers", value: new Set(rides.map((r) => r.driver)).size, hint: "trusted community" },
    { label: "Avg. price", value: `£${avgPrice().toFixed(2)}`, hint: "per trip" },
    { label: "Seats saved", value: totalSeats(), hint: "carbon saved" },
  ];

  return (
    <section className="page page--home">
      <div className="hero">
        <h1>Get where you're going, together</h1>
        <p>
          Carpool with neighbours, split the cost, and cut your commute.
          Post a ride or grab a seat before it's gone.
        </p>
        <div className="hero__actions">
          <Link to="/rides" className="btn btn--primary btn--lg">
            Browse rides
          </Link>
          <Link to="/post" className="btn btn--secondary btn--lg">
            Post a ride
          </Link>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="section">
        <div className="section__head">
          <h2>Featured rides</h2>
          <Link to="/rides" className="link">
            View all →
          </Link>
        </div>
        <div className="ride-grid">
          {openRides.slice(0, 3).map((ride) => (
            <RideCard key={ride.id} {...ride} />
          ))}
        </div>
      </div>
    </section>
  );
}

function avgPrice() {
  const sum = rides.reduce((a, r) => a + r.price, 0);
  return sum / rides.length;
}

function totalSeats() {
  return rides.reduce((a, r) => a + r.seats, 0);
}