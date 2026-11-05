import { createSlice } from "@reduxjs/toolkit";
import { rides, bookings } from "../../data/seedRides.js";

const initialState = {
  rides,
  bookings, // { rideId, bookedAt, bookerId }[]
  draft: {
    from: "",
    to: "",
    date: "",
    time: "",
    driver: "",
    price: "",
    seats: "",
  },
};

export const ridesSlice = createSlice({
  name: "rides",
  initialState,
  reducers: {
    postRide: (state, action) => {
      const newRide = {
        id: "r" + Date.now(),
        ...action.payload,
        status: "open",
      };
      state.rides.unshift(newRide);
    },
    bookRide: (state, action) => {
      const { rideId, bookerId } = action.payload;
      // One person can only book once — per ride.
      const already = state.bookings.some(
        (b) => b.rideId === rideId && b.bookerId === bookerId
      );
      if (already) return; // idempotent no-op, UI decides what to show

      state.bookings.push({
        rideId,
        bookedAt: new Date().toISOString(),
        bookerId,
      });
      const ride = state.rides.find((r) => r.id === rideId);
      if (ride && ride.seats > 0) {
        ride.seats -= 1;
        if (ride.seats === 0) ride.status = "full";
      }
    },
    updateDraft: (state, action) => {
      state.draft = { ...state.draft, ...action.payload };
    },
    resetDraft: (state) => {
      state.draft = initialState.draft;
    },
  },
});

export const { postRide, bookRide, updateDraft, resetDraft } =
  ridesSlice.actions;

export default ridesSlice.reducer;