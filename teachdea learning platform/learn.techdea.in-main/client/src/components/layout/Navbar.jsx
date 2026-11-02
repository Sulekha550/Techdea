import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiShield, FiUser, FiLogOut, FiArrowRight, FiGrid, FiLayers } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  ["/", "Home"],
  ["/courses", "Courses"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/training", "Training"],
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
        .navbar-modern {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(11, 10, 16, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
          transition: all 0.3s ease;
        }

        .nav-inner-modern {
          width: min(1320px, calc(100% - 36px));
          height: 78px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #fff;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }

        .brand-link:hover {
          transform: translateY(-1px);
        }

        .techdea-logo-modern {
          width: 44px;
          height: 44px;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.5));
          border-radius: 10px;
        }

        .brand-text-box {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 21px;
          font-weight: 850;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .brand-title .tech-text {
          color: #FFFFFF;
        }

        .brand-title .dea-text {
          background: linear-gradient(135deg, #A78BFA 0%, #C084FC 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-subtitle {
          color: #94A3B8;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .nav-links-center {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .navbar-modern .nav-link {
          color: #CBD5E1;
          font-size: 14.5px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 999px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
        }

        .navbar-modern .nav-link:hover {
          color: #FFFFFF;
          background: rgba(139, 92, 246, 0.15);
        }

        .navbar-modern .nav-link.active {
          color: #FFFFFF;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(99, 102, 241, 0.25) 100%);
          border: 1px solid rgba(167, 139, 250, 0.4);
          box-shadow: 0 0 16px rgba(124, 58, 237, 0.25);
        }

        .nav-actions-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        /* ADMIN PANEL HERO BUTTON */
        .btn-admin-panel {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 750;
          letter-spacing: 0.01em;
          color: #FFFFFF !important;
          background: linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #4F46E5 100%);
          border: 1px solid rgba(196, 181, 253, 0.5);
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-admin-panel::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: skewX(-20deg);
          animation: adminShimmer 3.5s infinite;
        }

        @keyframes adminShimmer {
          0% { left: -100%; }
          30% { left: 140%; }
          100% { left: 140%; }
        }

        .btn-admin-panel:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 0 28px rgba(124, 58, 237, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          border-color: #DDD6FE;
        }

        .admin-icon-shield {
          font-size: 16px;
          color: #FDF4FF;
          filter: drop-shadow(0 0 6px #C084FC);
        }

        .admin-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 7px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(52, 211, 153, 0.5);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          color: #A7F3D0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
          animation: dotPulse 1.8s infinite;
        }

        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }

        .btn-nav-login {
          color: #E2E8F0;
          font-size: 14px;
          font-weight: 650;
          padding: 8px 14px;
          text-decoration: none;
          transition: color 0.2s;
        }

        .btn-nav-login:hover {
          color: #C084FC;
        }

        .btn-nav-register {
          display: inline-flex;
          align-items: center;
          padding: 7px 18px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 700;
          color: #FFFFFF;
          background: rgba(109, 40, 217, 0.15);
          border: 1px solid #7C3AED;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-nav-register:hover {
          background: #6D28D9;
          border-color: #6D28D9;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(109, 40, 217, 0.45);
        }

        .btn-student-portal {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 700;
          color: #FFFFFF;
          background: rgba(124, 58, 237, 0.2);
          border: 1px solid rgba(167, 139, 250, 0.4);
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-student-portal:hover {
          background: rgba(124, 58, 237, 0.35);
        }

        .btn-nav-logout {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #FCA5A5;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-nav-logout:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
        }

        .mobile-hamburger {
          display: none;
          border: 0;
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          font-size: 22px;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        /* ========================================================
           RESPONSIVE NAVBAR MEDIA QUERIES (FLUID FOR ALL PHONES)
           ======================================================== */
        @media (max-width: 1024px) {
          .nav-links-center {
            display: none !important;
          }
          .btn-nav-login,
          .btn-nav-register,
          .btn-student-portal,
          .btn-nav-logout {
            display: none !important;
          }
          .mobile-hamburger {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .navbar-modern {
            height: 64px;
          }
          .nav-inner-modern {
            height: 64px;
            width: calc(100% - 24px);
            gap: 10px;
          }
          .techdea-logo-modern {
            width: 36px;
            height: 36px;
          }
          .brand-title {
            font-size: 19px;
          }
          .brand-subtitle {
            display: none !important;
          }
          .btn-admin-panel {
            padding: 6px 12px;
            font-size: 12.5px;
            gap: 6px;
          }
          .admin-live-pill {
            display: none !important;
          }
          .mobile-menu-drawer {
            top: 64px;
            height: calc(100vh - 64px);
            padding: 18px 16px 36px;
          }
        }

        @media (max-width: 480px) {
          .nav-inner-modern {
            width: calc(100% - 16px);
            gap: 8px;
          }
          .brand-title {
            font-size: 18px;
          }
          .brand-link {
            gap: 8px;
          }
          .btn-admin-panel {
            padding: 5px 10px;
            font-size: 11.5px;
          }
          .admin-btn-word-panel {
            display: none;
          }
          .mobile-hamburger {
            padding: 6px 8px;
            font-size: 20px;
          }
        }

        /* MOBILE OVERLAY & MENU */
        .mobile-menu-drawer {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0B0A12;
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          padding: 20px 16px 36px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          z-index: 9999;
          border-top: 1px solid rgba(139, 92, 246, 0.25);
          animation: drawerSlide 0.25s ease;
        }

        @keyframes drawerSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-admin-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(79, 70, 229, 0.25) 100%);
          border: 1px solid rgba(167, 139, 250, 0.4);
          text-decoration: none;
          color: #fff;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
          margin-bottom: 8px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 10px;
          color: #E2E8F0;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s;
        }

        .mobile-nav-link.active,
        .mobile-nav-link:hover {
          background: rgba(139, 92, 246, 0.15);
          color: #C084FC;
          border-color: rgba(139, 92, 246, 0.3);
        }
      `}</style>

      <header className="navbar-modern">
        <div className="nav-inner-modern">
          {/* Brand Logo */}
          <Link to="/" className="brand-link" onClick={close}>
            <img
              src="/logo.png"
              alt="TechDea Logo"
              className="techdea-logo-modern"
              style={{
                borderRadius: "50%",
                boxShadow: "0 0 16px rgba(124, 58, 237, 0.55)",
                border: "1px solid rgba(167, 139, 250, 0.4)"
              }}
            />
            <div className="brand-text-box">
              <div className="brand-title">
                <span className="tech-text">Tech</span>
                <span className="dea-text">Dea</span>
              </div>
              <span className="brand-subtitle">Converts Ideas Into Technologies</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="nav-links-center" aria-label="Main Navigation">
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
          </nav>

          {/* Right Action Buttons */}
          <div className="nav-actions-right">
            {/* PROMINENT ADMIN PANEL BUTTON (Direct Complete Dashboard) */}
            <Link
              to="/admin"
              className="btn-admin-panel"
              onClick={close}
              title="Launch Complete Admin Dashboard"
            >
              <FiShield className="admin-icon-shield" />
              <span>Admin<span className="admin-btn-word-panel"> Panel</span></span>
              <span className="admin-live-pill">
                <span className="admin-pulse-dot" />
                Live
              </span>
            </Link>

            {user ? (
              <>
                <button
                  type="button"
                  className="btn-student-portal"
                  onClick={() => {
                    close();
                    navigate(user.role === "admin" ? "/admin" : "/dashboard");
                  }}
                >
                  <FiGrid />
                  <span>{user.role === "admin" ? "Console" : "My Learning"}</span>
                </button>

                <button
                  type="button"
                  className="btn-nav-logout"
                  onClick={() => {
                    logout();
                    close();
                    navigate("/");
                  }}
                  title="Sign out"
                >
                  <FiLogOut />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-nav-login"
                  onClick={close}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-nav-register"
                  onClick={close}
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-hamburger"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              type="button"
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="mobile-menu-drawer">
            {/* Highlighted Admin Panel Card on Mobile */}
            <Link
              to="/admin"
              className="mobile-admin-card"
              onClick={close}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 18
                }}>
                  <FiShield />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>
                    Admin Panel & Dashboard
                  </div>
                  <div style={{ fontSize: 12, color: "#C4B5FD" }}>
                    Full platform analytics & controls
                  </div>
                </div>
              </div>
              <FiArrowRight style={{ fontSize: 18, color: "#A78BFA" }} />
            </Link>

            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
                onClick={close}
              >
                {label}
              </NavLink>
            ))}

            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />

            {user ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "rgba(124, 58, 237, 0.3)",
                    border: "1px solid #7C3AED",
                    color: "#fff",
                    borderRadius: 10,
                    fontWeight: 700
                  }}
                  onClick={() => {
                    close();
                    navigate(user.role === "admin" ? "/admin" : "/dashboard");
                  }}
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  style={{
                    padding: "12px 20px",
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid #EF4444",
                    color: "#FCA5A5",
                    borderRadius: 10,
                    fontWeight: 700
                  }}
                  onClick={() => {
                    logout();
                    close();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <Link
                  to="/login"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    borderRadius: 10,
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                  onClick={close}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "12px",
                    background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                    color: "#fff",
                    borderRadius: 10,
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                  onClick={close}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
