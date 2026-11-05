import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  browseQuery: "",
  browseStatus: "all",
  notice: null, // { message, kind } | null
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setBrowseQuery: (state, action) => {
      state.browseQuery = action.payload;
    },
    setBrowseStatus: (state, action) => {
      state.browseStatus = action.payload;
    },
    showNotice: (state, action) => {
      state.notice = action.payload; // { message, kind? }
    },
    clearNotice: (state) => {
      state.notice = null;
    },
  },
});

export const { setBrowseQuery, setBrowseStatus, showNotice, clearNotice } =
  uiSlice.actions;

export default uiSlice.reducer;