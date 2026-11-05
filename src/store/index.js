import { configureStore } from "@reduxjs/toolkit";
import ridesReducer from "./slices/ridesSlice";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    rides: ridesReducer,
    ui: uiReducer,
    auth: authReducer,
  },
});

export default store;