import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBookOpen, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { getMyEnrollments, getProgressSummary } from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([getMyEnrollments(), getProgressSummary()])
      .then(([enrollRes, progRes]) => {
        if (!isMounted) return;
        setEnrollments(enrollRes.data?.enrollments || []);
        setProgressSummary(progRes.data?.summary || null);
      })
      .catch((err) => {
        console.error("MyCourses load error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const active = enrollments.filter((e) =>
    ["active", "completed"].includes(e.status)
  );

  return (
    <div>
      <div className="portal-heading">
        <div>
          <div className="eyebrow">MY LEARNING</div>
          <h1>My Enrolled Courses</h1>
          <p>Access your active learning programs and track your lesson progress.</p>
        </div>
        <Link className="btn btn-primary" to="/courses">
          Browse More Courses <FiArrowRight />
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0" }}><Loader /></div>
      ) : active.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {active.map((e) => {
            const course = e.course;
            if (!course) return null;

            const progressMatch = progressSummary?.courses?.find(
              (c) => String(c.course?._id) === String(course._id)
            );
            const pct = progressMatch?.percentage || 0;

            return (
              <div
                key={e._id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16/9", background: "#1E1B2B" }}>
                  <img
                    src={course.thumbnail || course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"}
                    alt={course.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span className="course-badge-level">{course.level || "All Levels"}</span>
                </div>

                <div style={{ padding: 22, display: "flex", flexDirection: "column", flex: 1 }}>
                  <span className="course-category-tag">{course.category || "Engineering"}</span>
                  <h3 style={{ margin: "4px 0 10px", fontSize: 17, fontWeight: 800 }}>{course.name}</h3>

                  <div style={{ margin: "auto 0 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>
                      <span>Course Progress</span>
                      <span style={{ color: "var(--primary)" }}>{pct}%</span>
                    </div>
                    <div className="progress-bar-wrap" style={{ margin: 0 }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    {pct === 100 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--success)", fontSize: 12, fontWeight: 700, marginTop: 8 }}>
                        <FiCheckCircle /> Course Completed!
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/learn/course/${course._id}`}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    Open Learning Portal <FiArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No Enrolled Courses</h3>
          <p>You haven't enrolled in any learning tracks yet.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: 14 }}>
            Explore Courses Catalog
          </Link>
        </div>
      )}
    </div>
  );
}