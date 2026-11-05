import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const links = [
  { to: "/", label: "Home" },
  { to: "/rides", label: "Browse rides" },
  { to: "/post", label: "Post a ride" },
  { to: "/activity", label: "My activity" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
    setOpen(false);
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
        <span className="navbar__logo" aria-hidden="true">
          🚗
        </span>
        <span>RideShare</span>
      </Link>

      <nav
        className={`navbar__nav ${open ? "navbar__nav--open" : ""}`}
        aria-label="Primary"
      >
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
            onClick={() => setOpen(false)}
          >
            {label}
          </NavLink>
        ))}

        {user && (
          <>
            <span className="navbar__user">
              👤 {user.name}
            </span>
            <button
              type="button"
              className="btn btn--ghost btn--sm navbar__logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        )}
      </nav>

      <button
        type="button"
        className="navbar__toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}