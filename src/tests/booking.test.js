import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../store/slices/authSlice";
import ridesReducer from "../store/slices/ridesSlice";
import { register } from "../store/slices/authSlice";
import { bookRide } from "../store/slices/ridesSlice";

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
  return `booker${emailCounter}@example.com`;
}

describe("rides — bookRide (prevent duplicate bookings)", () => {
  let store;
  let userId;

  beforeEach(() => {
    store = makeStore();
    store.dispatch(
      register({ email: uniqueEmail(), password: "pw123456", name: "Booker Bob" })
    );
    userId = store.getState().auth.user.id;
  });

  it("allows a user to book a ride once", () => {
    // Use seed ride r1 (has 2 seats initially)
    const initialSeats = store.getState().rides.rides.find((r) => r.id === "r1").seats;

    store.dispatch(bookRide({ rideId: "r1", bookerId: userId }));

    const state = store.getState().rides;
    const ride = state.rides.find((r) => r.id === "r1");
    const bookingsForR1 = state.bookings.filter((b) => b.rideId === "r1" && b.bookerId === userId);

    expect(ride.seats).toBe(initialSeats - 1);
    expect(bookingsForR1).toHaveLength(1);
    expect(bookingsForR1[0].bookerId).toBe(userId);
  });

  it("rejects a second booking for the same ride by the same user", () => {
    const initialSeats = store.getState().rides.rides.find((r) => r.id === "r1").seats;

    // First booking
    store.dispatch(bookRide({ rideId: "r1", bookerId: userId }));

    // Second booking for the SAME ride by the SAME user
    store.dispatch(bookRide({ rideId: "r1", bookerId: userId }));

    const state = store.getState().rides;
    const ride = state.rides.find((r) => r.id === "r1");
    const bookingsForR1 = state.bookings.filter((b) => b.rideId === "r1" && b.bookerId === userId);

    // Seats must NOT be decremented again.
    expect(ride.seats).toBe(initialSeats - 1);
    // Only ONE booking record should exist for this user+ride.
    expect(bookingsForR1).toHaveLength(1);
  });

  it("allows the same user to book a DIFFERENT ride", () => {
    // Book r1
    store.dispatch(bookRide({ rideId: "r1", bookerId: userId }));
    // Book r2
    store.dispatch(bookRide({ rideId: "r2", bookerId: userId }));

    const state = store.getState().rides;
    const bookingsForUser = state.bookings.filter((b) => b.bookerId === userId);

    expect(bookingsForUser).toHaveLength(2);
    expect(bookingsForUser.some((b) => b.rideId === "r1")).toBe(true);
    expect(bookingsForUser.some((b) => b.rideId === "r2")).toBe(true);
  });

  it("allows DIFFERENT users to book the SAME ride", () => {
    // Book r1 as user A
    store.dispatch(bookRide({ rideId: "r1", bookerId: userId }));

    // Register a second user (unique email to avoid module-level DEMO_USERS collision)
    const otherEmail = uniqueEmail();
    store.dispatch(
      register({ email: otherEmail, password: "pw123456", name: "Other Olivia" })
    );
    const otherId = store.getState().auth.user.id;

    // Book r1 as user B
    store.dispatch(bookRide({ rideId: "r1", bookerId: otherId }));

    const state = store.getState().rides;
    const ride = state.rides.find((r) => r.id === "r1");
    const bookingsForR1 = state.bookings.filter((b) => b.rideId === "r1");

    // Both bookings should exist.
    expect(bookingsForR1).toHaveLength(2);
    // Seats decremented twice (one per user).
    expect(ride.seats).toBe(0); // seed has 2 seats, two bookings = 0
    // Both bookerIds present
    expect(bookingsForR1.map((b) => b.bookerId).sort()).toEqual(
      [userId, otherId].sort()
    );
  });
});