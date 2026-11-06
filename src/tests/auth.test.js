import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../store/slices/authSlice";
import { login, register, logout } from "../store/slices/authSlice";

function makeStore() {
  return configureStore({
    reducer: { auth: authReducer },
  });
}

describe("auth — register + login", () => {
  it("registers a new user and logs them in", () => {
    const store = makeStore();

    store.dispatch(
      register({ email: "newbie@example.com", password: "secret123", name: "Newbie" })
    );

    const state = store.getState().auth;
    expect(state.user).not.toBeNull();
    expect(state.user.email).toBe("newbie@example.com");
    expect(state.user.name).toBe("Newbie");
    // The password must never leak into the auth state.
    expect(state.user.password).toBeUndefined();
    expect(state.error).toBeNull();
    // Session persists to localStorage.
    expect(localStorage.getItem("rideshare.auth")).toContain("newbie@example.com");
  });

  it("lets a registered user log in with the same credentials", () => {
    const store = makeStore();

    store.dispatch(
      register({ email: "login@example.com", password: "pw123456", name: "Login User" })
    );
    // Log out, then log back in.
    store.dispatch(logout());
    expect(store.getState().auth.user).toBeNull();

    store.dispatch(
      login({ email: "login@example.com", password: "pw123456" })
    );

    const state = store.getState().auth;
    expect(state.user).not.toBeNull();
    expect(state.user.email).toBe("login@example.com");
    expect(state.user.name).toBe("Login User");
    expect(state.error).toBeNull();
  });

  it("rejects login with the wrong password", () => {
    const store = makeStore();

    store.dispatch(
      login({ email: "alex@example.com", password: "wrong" })
    );

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.error).toBe("Invalid email or password.");
  });

  it("rejects registration for an email that is already registered", () => {
    const store = makeStore();

    store.dispatch(
      register({ email: "dup@example.com", password: "secret123", name: "First" })
    );
    store.dispatch(logout());

    store.dispatch(
      register({ email: "dup@example.com", password: "secret123", name: "Second" })
    );

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.error).toBe("That email is already registered.");
  });

  it("rejects a password that is too short", () => {
    const store = makeStore();

    store.dispatch(
      register({ email: "short@example.com", password: "123", name: "Short" })
    );

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.error).toBe("Password must be at least 6 characters.");
  });

  it("logs out and clears the persisted session", () => {
    const store = makeStore();

    store.dispatch(
      register({ email: "bye@example.com", password: "secret123", name: "Bye" })
    );
    expect(localStorage.getItem("rideshare.auth")).not.toBeNull();

    store.dispatch(logout());

    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
    expect(localStorage.getItem("rideshare.auth")).toBeNull();
  });
});