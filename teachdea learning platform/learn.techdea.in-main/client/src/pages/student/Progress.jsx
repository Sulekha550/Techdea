import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiBookOpen, FiAward, FiArrowRight } from "react-icons/fi";
import { getProgressSummary } from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";

export default function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getProgressSummary()
      .then((res) => {
        if (isMounted) setData(res.data?.summary || null);
      })
      .catch((err) => {
        console.error("Progress load error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "60px 0" }}>
        <Loader />
      </div>
    );
  }

  const overallPct = data?.overallPercentage || 0;
  const courses = data?.courses || [];

  return (
    <div>
      <div className="portal-heading">
        <div>
          <div className="eyebrow">ACADEMIC ANALYTICS</div>
          <h1>Learning Progress</h1>
          <p>Real-time tracking of lessons completed, course metrics, and certificates.</p>
        </div>
      </div>

      {/* Overall Progress Panel */}
      <div className="progress-panel" style={{ marginBottom: 36 }}>
        <div className="progress-circle">
          <strong>{overallPct}%</strong>
          <span>Overall Completed</span>
        </div>

        <div>
          <h2 style={{ margin: "0 0 8px" }}>
            {data?.totalCompletedLessonsOverall || 0} of {data?.totalLessonsOverall || 0} Lessons Mastered
          </h2>
          <p style={{ margin: "0 0 14px", color: "var(--muted)", maxWidth: 540 }}>
            {overallPct === 100
              ? "Incredible work! You have completed all course requirements across your enrollments."
              : "Keep moving through your curriculum modules. Each completed lesson brings you closer to your verified certification."}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span className="badge badge-read" style={{ fontSize: 12 }}>
              <FiBookOpen style={{ marginRight: 4 }} /> {data?.enrolledCount || 0} Enrolled Programs
            </span>
            <span className="badge badge-replied" style={{ fontSize: 12 }}>
              <FiAward style={{ marginRight: 4 }} /> {data?.fullyCompletedCourses || 0} Fully Completed
            </span>
          </div>
        </div>
      </div>

      {/* Course-by-Course Progress Breakdown */}
      <div className="portal-section-head">
        <h2>Progress by Course</h2>
      </div>

      {courses.length > 0 ? (
        <div style={{ display: "grid", gap: 16 }}>
          {courses.map((c) => {
            const course = c.course;
            if (!course) return null;

            return (
              <div
                key={course._id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  <div>
                    <span className="course-category-tag">{course.category || "Engineering"}</span>
                    <h3 style={{ margin: "4px 0", fontSize: 18 }}>{course.name}</h3>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>
                      {c.completedLessons} of {c.totalLessons} lessons completed
                    </span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <strong style={{ fontSize: 22, color: "var(--primary)" }}>{c.percentage}%</strong>
                  </div>
                </div>

                <div className="progress-bar-wrap" style={{ marginBottom: 16 }}>
                  <div className="progress-bar-fill" style={{ width: `${c.percentage}%` }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {c.percentage === 100 ? (
                    <span style={{ color: "var(--success)", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                      <FiCheckCircle /> 100% Completed
                    </span>
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: 13 }}>
                      {c.totalLessons - c.completedLessons} lessons remaining
                    </span>
                  )}

                  <Link
                    to={`/learn/course/${course._id}`}
                    className="btn btn-primary btn-small"
                  >
                    Continue Course <FiArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No progress recorded yet</h3>
          <p>Enroll in a course and complete your first lesson to see tracking here.</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: 12 }}>
            Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
}