import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/training", "Training"],
  ["/courses", "Courses"],
  ["/team", "Team"],
  ["/contact", "Contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <>
      <style>{`
        .techdea-logo {
          width: 58px;
          height: 58px;
          object-fit: contain;
          display: block;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        @media (max-width: 600px) {
          .techdea-logo {
            width: 52px;
            height: 52px;
          }

          .brand-logo {
            gap: 9px;
          }
        }
      `}</style>

      <header className="navbar">
        <div className="nav-inner">

          {/* Brand */}
          <Link
            to="/"
            className="brand"
            onClick={close}
          >
            <div className="brand-logo">

              <img
                src="https://www.techdea.in/assets/logo-fhwAVZjG.png"
                alt="TechDea"
                className="techdea-logo"
              />

              <div className="brand-text">

                <div className="brand-name">
                  <span className="tech">Tech</span>
                  <span className="dea">Dea</span>
                </div>

                <span className="brand-tagline">
                  Converts Ideas Into Technologies
                </span>

              </div>

            </div>
          </Link>

          {/* Mobile Menu */}
          <button
            className="mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            type="button"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>

          {open && (
            <div
              className="nav-overlay"
              onClick={close}
            />
          )}

          {/* Navigation */}
          <nav
            className={`nav-menu ${open ? "open" : ""}`}
            aria-label="Primary"
          >

            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={navClass}
                onClick={close}
              >
                {label}
              </NavLink>
            ))}

            {user ? (
              <>
                <button
                  type="button"
                  className="nav-button"
                  onClick={() => {
                    close();
                    navigate(
                      user.role === "admin"
                        ? "/admin"
                        : "/dashboard"
                    );
                  }}
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => {
                    logout();
                    close();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="nav-login"
                  to="/login"
                  onClick={close}
                >
                  Login
                </Link>

                <Link
                  className="btn btn-primary btn-small"
                  to="/register"
                  onClick={close}
                >
                  Get Started
                </Link>
              </>
            )}

          </nav>

        </div>
      </header>
    </>
  );
}