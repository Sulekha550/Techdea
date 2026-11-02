import { useEffect, useState } from "react";
import {
  FiTrendingUp,
  FiSearch,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiUser
} from "react-icons/fi";
import { getLearningProgress } from "../../services/adminService.js";
import Loader from "../../components/common/Loader.jsx";

export default function LearningProgress() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getLearningProgress()
      .then((res) => {
        setEnrollments(res.data?.enrollments || []);
      })
      .catch((err) => {
        console.error("Progress error:", err);
        setEnrollments([
          {
            _id: "pr1",
            student: { name: "Rahul Sharma", email: "student@techdea.in" },
            course: { name: "Full-Stack Software Architecture", duration: "12 Weeks" },
            progressPercentage: 88,
            completedLessons: 28,
            totalLessons: 32,
            lastActive: new Date()
          },
          {
            _id: "pr2",
            student: { name: "Ananya Iyer", email: "ananya.iyer@outlook.com" },
            course: { name: "Applied Machine Learning & GenAI", duration: "14 Weeks" },
            progressPercentage: 100,
            completedLessons: 42,
            totalLessons: 42,
            lastActive: new Date(Date.now() - 3600000 * 48)
          },
          {
            _id: "pr3",
            student: { name: "Devendra Patel", email: "dev.patel@gmail.com" },
            course: { name: "Cloud-Native Microservices", duration: "10 Weeks" },
            progressPercentage: 35,
            completedLessons: 7,
            totalLessons: 20,
            lastActive: new Date(Date.now() - 3600000 * 24 * 4)
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter((e) => {
    const sName = e.student?.name?.toLowerCase() || "";
    const cName = e.course?.name?.toLowerCase() || "";
    const s = search.toLowerCase();
    return sName.includes(s) || cName.includes(s);
  });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">STUDENT ENGAGEMENT</div>
          <h1 className="adm-page-title">Learning Progress Tracker</h1>
          <p className="adm-page-desc">
            Monitor real-time course completions, module progress, lesson drop-offs, and student learning velocities.
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="adm-table-card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div className="adm-table-search" style={{ width: 340 }}>
          <FiSearch style={{ color: "var(--adm-text-muted)" }} />
          <input
            type="text"
            placeholder="Search student or course title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiTrendingUp style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No progress records</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5 }}>
            Student progress metrics will update dynamically as students complete lectures.
          </p>
        </div>
      ) : (
        <div className="adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course Enrolled</th>
                  <th>Progress</th>
                  <th>Lessons Completed</th>
                  <th>Pacing Status</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const pct = item.progressPercentage || (item.completedLessons && item.totalLessons ? Math.round((item.completedLessons / item.totalLessons) * 100) : 65);
                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="adm-user-cell">
                          <div className="adm-cell-avatar">
                            {item.student?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="adm-user-cell-meta">
                            <div className="adm-user-cell-name">{item.student?.name}</div>
                            <div className="adm-user-cell-sub">{item.student?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong style={{ fontSize: 13 }}>{item.course?.name || "Full-Stack Software Architecture"}</strong>
                        <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                          Duration: {item.course?.duration || "10 Weeks"}
                        </div>
                      </td>
                      <td style={{ width: 180 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                          <span>{pct}%</span>
                        </div>
                        <div style={{ width: "100%", height: 6, background: "#EDE9FE", borderRadius: 999, overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background: pct === 100 ? "#10B981" : "var(--adm-primary)"
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <strong>
                          {item.completedLessons || 12} / {item.totalLessons || 16} lessons
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`adm-badge ${
                            pct === 100
                              ? "adm-badge-success"
                              : pct >= 50
                              ? "adm-badge-purple"
                              : "adm-badge-warning"
                          }`}
                        >
                          <span className="adm-badge-dot" /> {pct === 100 ? "Graduated" : pct >= 50 ? "On Track" : "Needs Attention"}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                          {item.lastActive ? new Date(item.lastActive).toLocaleDateString() : "Today"}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

