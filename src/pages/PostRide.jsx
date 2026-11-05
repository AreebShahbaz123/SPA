import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  postRide,
  updateDraft,
  resetDraft,
} from "../store/slices/ridesSlice";

const EMPTY = {
  from: "",
  to: "",
  date: "",
  time: "",
  driver: "",
  price: "",
  seats: "",
};

function validate(draft) {
  const errors = {};
  if (!draft.from.trim()) errors.from = "Departure city is required.";
  if (!draft.to.trim()) errors.to = "Destination is required.";
  if (!draft.date) errors.date = "Date is required.";
  else if (new Date(draft.date) < new Date(new Date().toDateString()))
    errors.date = "Date must be today or later.";
  if (!draft.time) errors.time = "Departure time is required.";
  if (!draft.driver.trim()) errors.driver = "Driver name is required.";
  if (draft.price === "" || draft.price === null) {
    errors.price = "Price is required.";
  } else if (Number(draft.price) <= 0) {
    errors.price = "Price must be greater than 0.";
  } else if (Number.isNaN(Number(draft.price))) {
    errors.price = "Price must be a number.";
  }
  if (draft.seats === "" || draft.seats === null) {
    errors.seats = "Seats is required.";
  } else if (!Number.isInteger(Number(draft.seats)) || Number(draft.seats) <= 0) {
    errors.seats = "Seats must be a positive whole number.";
  }
  return errors;
}

export default function PostRide() {
  const dispatch = useDispatch();
  const draft = useSelector((s) => s.rides.draft);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const field = (key) => ({
    name: key,
    value: draft[key] ?? "",
    onChange: (e) => {
      const val = e.target.value;
      dispatch(updateDraft({ [key]: val }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    dispatch(
      postRide({
        from: draft.from.trim(),
        to: draft.to.trim(),
        date: draft.date,
        time: draft.time,
        driver: draft.driver.trim(),
        price: Number(draft.price),
        seats: Number(draft.seats),
      })
    );
    dispatch(resetDraft());
    setErrors({});
    setSubmitted(true);
  };

  const errorCount = useMemo(
    () => Object.keys(errors).filter((k) => errors[k]).length,
    [errors]
  );

  if (submitted) {
    return (
      <section className="page page--post">
        <div className="success">
          <span className="success__emoji" aria-hidden="true">
            ✅
          </span>
          <h2>Ride posted!</h2>
          <p>Your ride is now live on the Browse rides board.</p>
          <button
            type="button"
            className="btn btn--primary btn--md"
            onClick={() => {
              setSubmitted(false);
              dispatch(resetDraft());
            }}
          >
            Post another ride
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page page--post">
      <div className="page__head">
        <h1>Post a ride</h1>
        <p>Fill in the details — every field is validated before it goes live.</p>
      </div>

      <form className="ride-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="from">From</label>
          <input id="from" type="text" placeholder="Manchester" {...field("from")} />
          {errors.from && <span className="field__error">{errors.from}</span>}
        </div>

        <div className="field">
          <label htmlFor="to">To</label>
          <input id="to" type="text" placeholder="Liverpool" {...field("to")} />
          {errors.to && <span className="field__error">{errors.to}</span>}
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" {...field("date")} />
          {errors.date && <span className="field__error">{errors.date}</span>}
        </div>

        <div className="field">
          <label htmlFor="time">Departure time</label>
          <input id="time" type="time" {...field("time")} />
          {errors.time && <span className="field__error">{errors.time}</span>}
        </div>

        <div className="field">
          <label htmlFor="driver">Driver name</label>
          <input id="driver" type="text" placeholder="Priya Sharma" {...field("driver")} />
          {errors.driver && <span className="field__error">{errors.driver}</span>}
        </div>

        <div className="field">
          <label htmlFor="price">Price per seat (£)</label>
          <input id="price" type="number" min="0" step="0.01" placeholder="12.50" {...field("price")} />
          {errors.price && <span className="field__error">{errors.price}</span>}
        </div>

        <div className="field">
          <label htmlFor="seats">Seats available</label>
          <input id="seats" type="number" min="1" step="1" placeholder="2" {...field("seats")} />
          {errors.seats && <span className="field__error">{errors.seats}</span>}
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary btn--lg">
            Post ride
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--md"
            onClick={() => {
              dispatch(resetDraft());
              setErrors({});
            }}
          >
            Clear
          </button>
          {errorCount > 0 && (
            <span className="form__error-count">
              {errorCount} field{errorCount === 1 ? "" : "s"} need fixing
            </span>
          )}
        </div>
      </form>
    </section>
  );
}