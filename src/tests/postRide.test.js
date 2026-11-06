import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../store/slices/authSlice";
import ridesReducer from "../store/slices/ridesSlice";
import { register } from "../store/slices/authSlice";
import { postRide } from "../store/slices/ridesSlice";

function makeStore() {
  return configureStore({
    reducer: { auth: authReducer, rides: ridesReducer },
  });
}

// The register reducer appends new users to a module-level list, so the same
// email can only be registered once per process. Give every test a fresh email
// to keep them fully isolated.
let emailCounter = 0;
function uniqueEmail() {
  emailCounter += 1;
  return `driver${emailCounter}@example.com`;
}

describe("rides — postRide", () => {
  let store;
  let userId;

  beforeEach(() => {
    store = makeStore();
    // Register + login a fresh user for each test.
    store.dispatch(
      register({ email: uniqueEmail(), password: "pw123456", name: "Driver Dan" })
    );
    userId = store.getState().auth.user.id;
  });

  it("adds a new ride to the Redux store with all its details", () => {
    const ride = {
      from: "Manchester",
      to: "Liverpool",
      date: "2026-12-01",
      time: "08:30",
      driver: "Driver Dan",
      price: 15.5,
      seats: 3,
    };

    store.dispatch(postRide(ride));

    const state = store.getState().rides;
    expect(state.rides.length).toBeGreaterThanOrEqual(6); // seed rides + new one

    const added = state.rides[0]; // unshifted to front
    expect(added.from).toBe("Manchester");
    expect(added.to).toBe("Liverpool");
    expect(added.date).toBe("2026-12-01");
    expect(added.time).toBe("08:30");
    expect(added.driver).toBe("Driver Dan");
    expect(added.price).toBe(15.5);
    expect(added.seats).toBe(3);
    expect(added.status).toBe("open");
    expect(added.id).toBeDefined();
    expect(added.id).toMatch(/^r\d+$/);
  });

  it("does not attach the bookerId to the posted ride (that belongs to bookings, not rides)", () => {
    const ride = {
      from: "Leeds",
      to: "York",
      date: "2026-12-02",
      time: "10:00",
      driver: "Driver Dan",
      price: 8.0,
      seats: 2,
    };

    store.dispatch(postRide(ride));

    const added = store.getState().rides.rides[0];
    // The ride itself has no bookerId; bookings track who booked what.
    expect(added.bookerId).toBeUndefined();
    expect(store.getState().rides.bookings.length).toBe(2); // seed has 2 bookings
  });

  it("posts multiple rides and they all appear in the list", () => {
    store.dispatch(
      postRide({ from: "A", to: "B", date: "2026-12-03", time: "09:00", driver: "Dan", price: 10, seats: 1 })
    );
    store.dispatch(
      postRide({ from: "C", to: "D", date: "2026-12-04", time: "11:00", driver: "Dan", price: 12, seats: 2 })
    );

    const rides = store.getState().rides.rides;
    expect(rides.length).toBeGreaterThanOrEqual(8);
    expect(rides[0].from).toBe("C");
    expect(rides[1].from).toBe("A");
  });
});