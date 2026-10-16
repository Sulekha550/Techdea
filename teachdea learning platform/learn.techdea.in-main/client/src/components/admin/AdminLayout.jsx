import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBookOpen, FiUsers, FiLayers, FiVideo, FiCreditCard, FiCheckSquare,
  FiSettings, FiLogOut, FiHome, FiMail, FiAward, FiFileText, FiMenu, FiX
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const groups = [
    { title: "Overview", items: [["/admin", "Dashboard", FiHome]] },
    {
      title: "Content",
      items: [
        ["/admin/courses", "Courses", FiBookOpen],
        ["/admin/modules", "Modules", FiLayers],
        ["/admin/lectures", "Lessons", FiVideo],
        ["/admin/notes", "Notes", FiFileText],
        ["/admin/tests", "Tests", FiCheckSquare]
      ]
    },
    {
      title: "Operations",
      items: [
        ["/admin/students", "Students", FiUsers],
        ["/admin/enrollments", "Enrollments", FiBookOpen],
        ["/admin/payments", "Payments", FiCreditCard],
        ["/admin/certificates", "Certificates", FiAward],
        ["/admin/contact", "Contact Messages", FiMail],
        ["/admin/settings", "Settings", FiSettings]
      ]
    }
  ];

  return (
    <div className="admin-shell">
      <button type="button" className="sidebar-toggle" onClick={() => setOpen(true)} aria-label="Open admin menu">
        <FiMenu /> Admin menu
      </button>
      {open && <div className="sidebar-overlay open" onClick={close} />}

      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="portal-logo" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tech<span>Dea</span></span>
          <button type="button" className="sidebar-toggle" style={{ width: "auto", padding: 0, background: "transparent" }} onClick={close} aria-label="Close menu">
            <FiX />
          </button>
        </div>
        <div className="admin-badge">ADMIN CONSOLE</div>

        <nav className="admin-nav" aria-label="Admin">
          {groups.map((group) => (
            <div className="nav-group" key={group.title}>
              <small>{group.title}</small>
              {group.items.map(([to, label, Icon]) => (
                <NavLink
                  key={to}
                  end={to === "/admin"}
                  to={to}
                  onClick={close}
                  className={({ isActive }) => (isActive ? "admin-link active" : "admin-link")}
                >
                  <Icon /> {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button
          type="button"
          className="sidebar-logout"
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar">
          <div>
            <strong>TechDea Learning Platform</strong>
            <span>Administrative console</span>
          </div>
          <div className="admin-user">{user?.name || "Administrator"}</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
