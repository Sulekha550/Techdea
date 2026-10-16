import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiBookOpen,
  FiLayers,
  FiVideo,
  FiCreditCard,
  FiAward,
  FiMail,
  FiCheckCircle,
  FiArrowRight
} from "react-icons/fi";
import { getAdminStats } from "../../services/adminService.js";
import Loader from "../../components/common/Loader.jsx";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminStats()
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch((err) => console.error("Admin stats error:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "60px 36px" }}>
        <Loader />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentEnrollments = data?.recentEnrollments || [];
  const recentMessages = data?.recentMessages || [];

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <div className="eyebrow">ANALYTICS & METRICS</div>
          <h1>System Overview</h1>
          <p>Real-time performance metrics and operations dashboard.</p>
        </div>
        <Link to="/admin/courses" className="btn btn-primary">
          + Manage Courses
        </Link>
      </div>

      {/* 4-Column Stats Grid */}
      <div className="admin-stats">
        <div className="admin-stat">
          <span>Active Students</span>
          <strong>{stats.activeStudents || 0}</strong>
          <small style={{ color: "var(--muted)" }}>{stats.students || 0} registered total</small>
        </div>

        <div className="admin-stat">
          <span>Published Courses</span>
          <strong>{stats.courses || 0}</strong>
          <small style={{ color: "var(--muted)" }}>{stats.modules || 0} modules · {stats.lectures || 0} lessons</small>
        </div>

        <div className="admin-stat">
          <span>Active Enrollments</span>
          <strong>{stats.enrollments || 0}</strong>
          <small style={{ color: "var(--muted)" }}>Students actively learning</small>
        </div>

        <div className="admin-stat">
          <span>Total Revenue</span>
          <strong style={{ color: "var(--primary)" }}>₹{stats.totalRevenue || 0}</strong>
          <small style={{ color: "var(--muted)" }}>From verified orders</small>
        </div>

        <div className="admin-stat">
          <span>Practice Quizzes</span>
          <strong>{stats.tests || 0}</strong>
          <small style={{ color: "var(--muted)" }}>Active evaluations</small>
        </div>

        <div className="admin-stat">
          <span>Certificates Issued</span>
          <strong>{stats.certificates || 0}</strong>
          <small style={{ color: "var(--muted)" }}>Verified graduates</small>
        </div>

        <div className="admin-stat">
          <span>Contact Inquiries</span>
          <strong>{stats.contactMessages || 0}</strong>
          <small style={{ color: "var(--muted)" }}>
            {stats.newContactMessages > 0 ? (
              <span style={{ color: "var(--danger)", fontWeight: 700 }}>
                {stats.newContactMessages} NEW Inquiries
              </span>
            ) : "All resolved"}
          </small>
        </div>

        <div className="admin-stat">
          <span>System Status</span>
          <strong style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: 6 }}>
            <FiCheckCircle style={{ fontSize: 20 }} /> Healthy
          </strong>
          <small style={{ color: "var(--muted)" }}>MongoDB Connected</small>
        </div>
      </div>

      {/* Recent Activity: Enrollments & Inquiries */}
      <div className="admin-two-col">
        <div className="panel-card">
          <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Platform mix</h3>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 0 }}>From live admin stats.</p>
          <div className="chart-bars">
            {[
              ["Students", stats.activeStudents || stats.students || 0],
              ["Courses", stats.courses || 0],
              ["Enrollments", stats.enrollments || 0],
              ["Certificates", stats.certificates || 0]
            ].map(([label, value]) => {
              const max = Math.max(Number(stats.students || 0), Number(stats.enrollments || 0), Number(stats.courses || 0), Number(stats.certificates || 0), 1);
              return (
                <div className="chart-bar-row" key={label}>
                  <span>{label}</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${Math.min(100, (Number(value) / max) * 100)}%` }} />
                  </div>
                  <strong>{value}</strong>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel-card">
          <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Revenue</h3>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>₹{stats.totalRevenue || 0} from verified orders.</p>
        </div>
      </div>

      <div className="admin-two-col">
        {/* Recent Enrollments */}
        <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Recent Enrollments</h3>
            <Link to="/admin/enrollments" style={{ color: "var(--primary)", fontSize: 12, fontWeight: 700 }}>
              View all →
            </Link>
          </div>

          {recentEnrollments.length > 0 ? (
            <div style={{ display: "grid", gap: 10 }}>
              {recentEnrollments.map((enr) => (
                <div
                  key={enr._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "var(--soft)",
                    borderRadius: 10,
                    fontSize: 13
                  }}
                >
                  <div>
                    <strong>{enr.student?.name || "Student"}</strong>
                    <span style={{ color: "var(--muted)", display: "block", fontSize: 12 }}>
                      {enr.course?.name || "Course package"}
                    </span>
                  </div>
                  <span className={`badge ${enr.status === "active" ? "badge-replied" : "badge-new"}`}>
                    {enr.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>No enrollments recorded yet.</p>
          )}
        </div>

        {/* Recent Messages */}
        <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Recent Inquiries</h3>
            <Link to="/admin/contact" style={{ color: "var(--primary)", fontSize: 12, fontWeight: 700 }}>
              View all →
            </Link>
          </div>

          {recentMessages.length > 0 ? (
            <div style={{ display: "grid", gap: 10 }}>
              {recentMessages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "var(--soft)",
                    borderRadius: 10,
                    fontSize: 13
                  }}
                >
                  <div>
                    <strong>{msg.name}</strong>
                    <span style={{ color: "var(--muted)", display: "block", fontSize: 12 }}>
                      {msg.subject}
                    </span>
                  </div>
                  <span className={`badge badge-${msg.status.toLowerCase()}`}>
                    {msg.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--muted)", fontSize: 13 }}>No inquiries received yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}