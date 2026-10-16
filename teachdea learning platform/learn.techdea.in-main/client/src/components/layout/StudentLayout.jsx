import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBook, FiAward, FiHome, FiLogOut, FiUser, FiBarChart2,
  FiCheckSquare, FiPlayCircle, FiFileText, FiSettings, FiMenu, FiX
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const nav = [
    ["/dashboard", "Dashboard", FiHome],
    ["/my-courses", "My Courses", FiBook],
    ["/my-courses", "Continue Learning", FiPlayCircle],
    ["/notes", "Notes", FiFileText],
    ["/tests", "Tests", FiCheckSquare],
    ["/certificates", "Certificates", FiAward],
    ["/progress", "Progress", FiBarChart2],
    ["/profile", "Profile", FiUser],
    ["/profile", "Settings", FiSettings]
  ];

  return (
    <div className="portal-shell">
      <button type="button" className="sidebar-toggle" onClick={() => setOpen(true)} aria-label="Open student menu">
        <FiMenu /> Menu
      </button>
      {open && <div className="sidebar-overlay open" onClick={close} />}

      <aside className={`student-sidebar ${open ? "open" : ""}`}>
        <div className="portal-logo" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tech<span>Dea</span></span>
          <button type="button" className="sidebar-toggle" style={{ width: "auto", padding: 0, background: "transparent" }} onClick={close} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</strong>
            <small>Student</small>
          </div>
        </div>

        <nav className="portal-nav" aria-label="Student">
          {nav.map(([to, label, Icon], idx) => (
            <NavLink
              key={`${to}-${label}-${idx}`}
              to={to}
              onClick={close}
              className={({ isActive }) => (isActive && label !== "Continue Learning" && label !== "Settings" ? "portal-link active" : "portal-link")}
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="sidebar-logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      <section className="portal-content">
        <Outlet />
      </section>
    </div>
  );
}
