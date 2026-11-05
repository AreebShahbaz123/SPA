import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, clearError } from "../store/slices/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (password !== confirm) {
      // Show a local mismatch error without touching Redux state.
      return;
    }
    dispatch(register({ email, password, name }));
  };

  const mismatch = password !== "" && confirm !== "" && password !== confirm;

  return (
    <section className="page page--login">
      <div className="login-card">
        <h1>Create your RideShare account</h1>
        <p className="login-hint">
          Demo accounts already exist: alex@example.com / sam@example.com (password demo123)
        </p>

        {error && <div className="notice notice--error" role="alert">{error}</div>}
        {mismatch && (
          <div className="notice notice--error" role="alert">
            Passwords do not match.
          </div>
        )}

        <form className="ride-form ride-form--single" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rider"
              required
            />
          </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn--primary btn--lg" style={{ width: "100%" }}>
            Create account
          </button>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}