import { createSlice } from "@reduxjs/toolkit";

// Demo users (in a real app this would come from an auth service/API)
const DEMO_USERS = [
  { id: "u_1", email: "alex@example.com", name: "Alex Rider", password: "demo123" },
  { id: "u_2", email: "sam@example.com", name: "Sam Driver", password: "demo123" },
];

function getStoredUser() {
  try {
    const raw = localStorage.getItem("rideshare.auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialState = {
  user: getStoredUser(), // { id, email, name } | null
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const found = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (found) {
        const { password: _, ...safe } = found;
        state.user = safe;
        state.error = null;
        localStorage.setItem("rideshare.auth", JSON.stringify(safe));
      } else {
        state.error = "Invalid email or password.";
      }
    },
    register: (state, action) => {
      const { email, password, name } = action.payload;
      if (!email || !password || !name) {
        state.error = "Name, email, and password are all required.";
        return;
      }
      if (password.length < 6) {
        state.error = "Password must be at least 6 characters.";
        return;
      }
      const exists = DEMO_USERS.find((u) => u.email === email);
      if (exists) {
        state.error = "That email is already registered.";
        return;
      }
      // In a real app this hits a backend; here we add to the in-memory list.
      const user = {
        id: "u_" + Math.random().toString(36).slice(2, 10),
        email,
        name,
      };
      DEMO_USERS.push({ ...user, password });
      state.user = user;
      state.error = null;
      localStorage.setItem("rideshare.auth", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("rideshare.auth");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { login, register, logout, clearError } = authSlice.actions;
export default authSlice.reducer;