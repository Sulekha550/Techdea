import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiCheckCircle,
  FiVideo,
  FiPlayCircle,
  FiFileText,
  FiCheckSquare,
  FiAward,
  FiCreditCard,
  FiTag,
  FiStar,
  FiTrendingUp,
  FiBell,
  FiBarChart2,
  FiGlobe,
  FiShield,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminSidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navGroups = [
    {
      label: "Overview",
      items: [
        { to: "/admin", label: "Dashboard Overview", icon: FiHome, end: true }
      ]
    },
    {
      label: "Academic Engine",
      items: [
        { to: "/admin/courses", label: "Courses Management", icon: FiBookOpen },
        { to: "/admin/categories", label: "Categories Management", icon: FiGrid },
        { to: "/admin/video-lessons", label: "Video Lessons", icon: FiPlayCircle },
        { to: "/admin/live-classes", label: "Live Classes", icon: FiVideo, badge: "Live", badgePulse: true },
        { to: "/admin/quizzes", label: "Quizzes & Exams", icon: FiCheckSquare },
        { to: "/admin/assignments", label: "Assignments & Projects", icon: FiFileText },
        { to: "/admin/certificates", label: "Certificates Management", icon: FiAward },
        { to: "/admin/progress", label: "Learning Progress", icon: FiTrendingUp }
      ]
    },
    {
      label: "People & Operations",
      items: [
        { to: "/admin/students", label: "Students Management", icon: FiUsers },
        { to: "/admin/instructors", label: "Instructor Management", icon: FiUserCheck, badge: "2 New" },
        { to: "/admin/enrollments", label: "Enrollment Management", icon: FiCheckCircle },
        { to: "/admin/reviews", label: "Reviews & Ratings", icon: FiStar }
      ]
    },
    {
      label: "Finance & Growth",
      items: [
        { to: "/admin/payments", label: "Payments & Transactions", icon: FiCreditCard },
        { to: "/admin/coupons", label: "Coupons & Discounts", icon: FiTag },
        { to: "/admin/reports", label: "Reports & Analytics", icon: FiBarChart2 }
      ]
    },
    {
      label: "Platform & CMS",
      items: [
        { to: "/admin/notifications", label: "Notifications & Alerts", icon: FiBell },
        { to: "/admin/website-content", label: "Website Content (CMS)", icon: FiGlobe },
        { to: "/admin/users-roles", label: "Admin Users & Roles", icon: FiShield },
        { to: "/admin/settings", label: "General Settings", icon: FiSettings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17, 14, 27, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 85
          }}
        />
      )}

      <aside
        className={`adm-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* Brand Header */}
        <div className="adm-brand-header">
          <NavLink to="/admin" className="adm-brand-link" onClick={onCloseMobile}>
            <img
              src="/logo.png"
              alt="TechDea"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                objectFit: "contain",
                boxShadow: "0 0 14px rgba(124, 58, 237, 0.5)",
                border: "1px solid rgba(167, 139, 250, 0.4)",
                flexShrink: 0
              }}
            />
            {!collapsed && (
              <div className="adm-brand-text">
                <div className="adm-brand-title">
                  Tech<span>Dea</span>
                </div>
                <div className="adm-brand-badge">EDTECH ADMIN SAAS</div>
              </div>
            )}
          </NavLink>

          <button
            type="button"
            className="adm-collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="adm-nav-scroll" aria-label="Admin Navigation">
          {navGroups.map((group) => (
            <div className="adm-nav-group" key={group.label}>
              <div className="adm-nav-label">{group.label}</div>
              {group.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      isActive ? "adm-nav-item active" : "adm-nav-item"
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="adm-nav-icon">
                      <IconComponent />
                    </span>
                    <span className="adm-nav-text">{item.label}</span>
                    {item.badge && (
                      <span className={`adm-nav-pill ${item.badgePulse ? "pulse" : ""}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer User & Logout */}
        <div className="adm-sidebar-footer">
          <div className="adm-user-mini">
            <div className="adm-user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            {!collapsed && (
              <div className="adm-user-meta">
                <div className="adm-user-name">{user?.name || "Administrator"}</div>
                <div className="adm-user-role">Super Admin</div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="adm-logout-btn"
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
            title="Log out of Admin Console"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
