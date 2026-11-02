import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminNavbar from "./AdminNavbar.jsx";
import "../../styles/admin.css";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="adm-shell">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="adm-main-wrap">
        <AdminNavbar
          onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
        />

        <main className="adm-content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
