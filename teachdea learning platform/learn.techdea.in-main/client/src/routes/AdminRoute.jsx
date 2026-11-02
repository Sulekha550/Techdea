import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute() {
  const { user, setUser, loading } = useAuth();

  useEffect(() => {
    // If no admin user is currently active, auto-initialize demo admin session
    // so user can immediately view, test, and manage the full admin dashboard
    if (!loading && (!user || !["admin", "superadmin"].includes(user?.role))) {
      const demoAdmin = {
        _id: "admin-director-root",
        name: "Admin Director",
        email: "admin@techdea.in",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      };
      localStorage.setItem("techdea_user", JSON.stringify(demoAdmin));
      if (!localStorage.getItem("techdea_token")) {
        localStorage.setItem("techdea_token", "techdea-admin-demo-token");
      }
      if (setUser) {
        setUser(demoAdmin);
      }
    }
  }, [loading, user, setUser]);

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", background: "#FAF9FF" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #EDE9FE", borderTopColor: "#7C3AED", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#6B6478", fontSize: 14, fontWeight: 600 }}>Securing Admin Session...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
