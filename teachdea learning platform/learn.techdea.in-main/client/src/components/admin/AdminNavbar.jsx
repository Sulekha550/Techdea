import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiPlus,
  FiMenu,
  FiUser,
  FiLogOut,
  FiExternalLink,
  FiCheckCircle,
  FiSettings,
  FiVideo,
  FiBookOpen
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function AdminNavbar({ onToggleMobileSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const quickRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (quickRef.current && !quickRef.current.contains(event.target)) {
        setShowQuickCreate(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sampleNotifications = [
    {
      id: 1,
      title: "New Student Enrolled",
      desc: "Rahul Sharma enrolled in Full-Stack Software Architecture",
      time: "10m ago",
      type: "enrollment"
    },
    {
      id: 2,
      title: "Instructor Application",
      desc: "Vikram Rathore applied for Lead Cybersecurity Instructor",
      time: "1h ago",
      type: "instructor"
    },
    {
      id: 3,
      title: "Payment Received",
      desc: "₹4,999 received via Razorpay / UPI for Semester 4 Bundle",
      time: "2h ago",
      type: "payment"
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.info(`Filtering console for: "${searchQuery}"`);
    navigate(`/admin/students?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="adm-topbar">
      <div className="adm-topbar-left">
        <button
          type="button"
          className="adm-mobile-toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Open mobile navigation"
        >
          <FiMenu />
        </button>

        <form onSubmit={handleSearchSubmit} className="adm-search-box">
          <FiSearch style={{ color: "var(--adm-text-muted)", fontSize: 16 }} />
          <input
            type="text"
            placeholder="Search students, courses, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="adm-search-shortcut">⌘K</span>
        </form>
      </div>

      <div className="adm-topbar-right">
        {/* Quick Action Dropdown */}
        <div style={{ position: "relative" }} ref={quickRef}>
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setShowQuickCreate(!showQuickCreate)}
          >
            <FiPlus />
            <span>Create New</span>
          </button>

          {showQuickCreate && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 210,
                background: "#FFFFFF",
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                border: "1px solid var(--adm-border)",
                padding: "8px",
                zIndex: 100,
                animation: "modalEnter 0.15s ease"
              }}
            >
              <Link
                to="/admin/courses?action=new"
                onClick={() => setShowQuickCreate(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--adm-text-main)",
                  textDecoration: "none"
                }}
                className="adm-dropdown-hover"
              >
                <FiBookOpen style={{ color: "var(--adm-primary)" }} /> Add New Course
              </Link>
              <Link
                to="/admin/live-classes"
                onClick={() => setShowQuickCreate(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--adm-text-main)",
                  textDecoration: "none"
                }}
                className="adm-dropdown-hover"
              >
                <FiVideo style={{ color: "#10B981" }} /> Schedule Live Class
              </Link>
              <Link
                to="/admin/notifications"
                onClick={() => setShowQuickCreate(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--adm-text-main)",
                  textDecoration: "none"
                }}
                className="adm-dropdown-hover"
              >
                <FiBell style={{ color: "#F59E0B" }} /> Send Announcement
              </Link>
            </div>
          )}
        </div>

        {/* View Public Website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="adm-top-btn"
          title="Open TechDea Public Website in new tab"
        >
          <FiExternalLink />
          <span>Live Site</span>
        </a>

        {/* Notifications Popover */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            type="button"
            className="adm-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
          >
            <FiBell />
            <span className="adm-icon-badge" />
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 320,
                background: "#FFFFFF",
                borderRadius: 14,
                boxShadow: "0 12px 36px rgba(0,0,0,0.14)",
                border: "1px solid var(--adm-border)",
                padding: "16px",
                zIndex: 100,
                animation: "modalEnter 0.15s ease"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--adm-border)"
                }}
              >
                <strong style={{ fontSize: 14 }}>Notifications</strong>
                <span
                  style={{
                    fontSize: 11,
                    background: "var(--adm-primary-soft)",
                    color: "var(--adm-primary)",
                    padding: "2px 7px",
                    borderRadius: 999,
                    fontWeight: 700
                  }}
                >
                  3 New
                </span>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {sampleNotifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "#FAF9FF",
                      fontSize: 12.5,
                      border: "1px solid rgba(231, 224, 243, 0.6)"
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "var(--adm-text-main)", marginBottom: 2 }}>
                      {n.title}
                    </div>
                    <div style={{ color: "var(--adm-text-muted)", fontSize: 11.5, marginBottom: 4 }}>
                      {n.desc}
                    </div>
                    <div style={{ color: "#94A3B8", fontSize: 10.5 }}>{n.time}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 12, textAlign: "center" }}>
                <Link
                  to="/admin/notifications"
                  onClick={() => setShowNotifications(false)}
                  style={{
                    fontSize: 12,
                    color: "var(--adm-primary)",
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                >
                  View All Platform Activity →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill & Dropdown */}
        <div style={{ position: "relative" }} ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#FAF9FF",
              border: "1px solid var(--adm-border)",
              borderRadius: 999,
              padding: "4px 12px 4px 6px",
              cursor: "pointer"
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 13
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--adm-text-main)", lineHeight: 1.2 }}>
                {user?.name || "TechDea Admin"}
              </span>
              <span style={{ fontSize: 10.5, color: "var(--adm-primary)", fontWeight: 700 }}>
                Super Admin
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 220,
                background: "#FFFFFF",
                borderRadius: 14,
                boxShadow: "0 12px 36px rgba(0,0,0,0.14)",
                border: "1px solid var(--adm-border)",
                padding: "8px",
                zIndex: 100,
                animation: "modalEnter 0.15s ease"
              }}
            >
              <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--adm-border)", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--adm-text-main)" }}>
                  {user?.name || "Admin"}
                </div>
                <div style={{ fontSize: 11, color: "var(--adm-text-muted)" }}>
                  {user?.email || "admin@techdea.in"}
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--adm-text-main)",
                  textDecoration: "none"
                }}
                className="adm-dropdown-hover"
              >
                <FiUser /> Student Portal View
              </Link>

              <Link
                to="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--adm-text-main)",
                  textDecoration: "none"
                }}
                className="adm-dropdown-hover"
              >
                <FiSettings /> Console Settings
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  toast.info("Logged out from admin console");
                  navigate("/admin/login");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#EF4444",
                  background: "transparent",
                  border: "none",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                className="adm-dropdown-hover"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
