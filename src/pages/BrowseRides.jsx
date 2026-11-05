import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setBrowseQuery,
  setBrowseStatus,
  showNotice,
  clearNotice,
} from "../store/slices/uiSlice";
import { bookRide } from "../store/slices/ridesSlice";
import RideCard from "../components/RideCard";
import SearchBar from "../components/SearchBar";

const STATUSES = ["all", "open", "full", "completed"];

export default function BrowseRides() {
  const dispatch = useDispatch();
  const { rides, bookings } = useSelector((s) => s.rides);
  const { user } = useSelector((s) => s.auth);
  const { browseQuery: query, browseStatus: status, notice } = useSelector(
    (s) => s.ui
  );

  const bookerId = user?.id;

  const filtered = rides.filter((r) => {
    const matchesQuery =
      !query ||
      r.from.toLowerCase().includes(query.toLowerCase()) ||
      r.to.toLowerCase().includes(query.toLowerCase()) ||
      r.driver.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || r.status === status;
    return matchesQuery && matchesStatus;
  });

  const alreadyBooked = (rideId) =>
    bookings.some(
      (b) => b.rideId === rideId && b.bookerId === bookerId
    );

  // Auto-clear transient notices.
  useEffect(() => {
    if (!notice) return undefined;
    const id = setTimeout(() => dispatch(clearNotice()), 3500);
    return () => clearTimeout(id);
  }, [notice, dispatch]);

  const handleBook = (rideId) => {
    if (!bookerId) {
      dispatch(
        showNotice({
          message: "Please sign in to book a ride.",
          kind: "warning",
        })
      );
      return;
    }
    if (alreadyBooked(rideId)) {
      dispatch(
        showNotice({
          message: "You already booked this ride — one booking per person.",
          kind: "warning",
        })
      );
      return;
    }
    dispatch(bookRide({ rideId, bookerId }));
  };

  return (
    <section className="page">
      <div className="page__head">
        <h1>Browse rides</h1>
        <p>{filtered.length} ride{filtered.length === 1 ? "" : "s"} found</p>
      </div>

      {notice && (
        <div className={`notice notice--${notice.kind ?? "info"}`} role="status">
          {notice.message}
        </div>
      )}

      <div className="toolbar">
        <SearchBar
          value={query}
          onChange={(v) => dispatch(setBrowseQuery(v))}
          placeholder="Search city, driver, or route…"
        />
        <div className="filter" role="group" aria-label="Filter by status">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={`filter__chip ${status === s ? "filter__chip--active" : ""}`}
              onClick={() => dispatch(setBrowseStatus(s))}
            >
              {s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>No rides match your search.</p>
        </div>
      ) : (
        <div className="ride-grid">
          {filtered.map((ride) => (
            <RideCard
              key={ride.id}
              {...ride}
              alreadyBooked={alreadyBooked(ride.id)}
              onBook={() => handleBook(ride.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}