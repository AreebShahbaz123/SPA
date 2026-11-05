import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, clearError } from "../store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    // Already logged in, redirect home
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(login({ email, password }));
  };

  return (
    <section className="page page--login">
      <div className="login-card">
        <h1>Sign in to RideShare</h1>
        <p className="login-hint">
          Demo accounts: alex@example.com / demo123  ·  sam@example.com / demo123
        </p>

        {error && <div className="notice notice--error" role="alert">{error}</div>}

        <form className="ride-form ride-form--single" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn--primary btn--lg" style={{ width: "100%" }}>
            Sign in
          </button>
        </form>

        <p className="login-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  );
}