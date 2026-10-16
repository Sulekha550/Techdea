import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiAward,
  FiCheckCircle,
  FiPlayCircle,
  FiClock
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  getMyEnrollments,
  getProgressSummary,
  getMyCertificates
} from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getMyEnrollments(),
      getProgressSummary(),
      getMyCertificates()
    ])
      .then(([enrollRes, progRes, certRes]) => {
        if (!isMounted) return;
        setEnrollments(enrollRes.data?.enrollments || []);
        setProgressSummary(progRes.data?.summary || null);
        setCertificates(certRes.data?.certificates || []);
      })
      .catch((err) => {
        console.error("Dashboard data load error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeEnrollments = enrollments.filter((e) =>
    ["active", "completed"].includes(e.status)
  );

  // Determine continue learning course (first active course)
  const continueCourse = activeEnrollments[0]?.course || null;

  return (
    <div>
      {/* Welcome Heading */}
      <div className="portal-heading">
        <div>
          <div className="eyebrow">STUDENT LEARNING HUB</div>
          <h1>Welcome back, {user?.name?.split(" ")[0]}!</h1>
          <p>Track your courses, lessons, assessments, and earned certificates.</p>
        </div>
        <Link className="btn btn-primary" to="/courses">
          Explore More Courses <FiArrowRight />
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0" }}><Loader /></div>
      ) : (
        <>
          {/* Key Stats Grid */}
          <div className="stats-grid">
            <StatCard icon={<FiBookOpen />} value={activeEnrollments.length} label="Courses enrolled" />
            <StatCard icon={<FiCheckCircle />} value={progressSummary?.fullyCompletedCourses || 0} label="Courses completed" />
            <StatCard icon={<FiClock />} value={progressSummary?.totalCompletedLessonsOverall || 0} label="Lessons completed" />
            <StatCard icon={<FiAward />} value={certificates.length} label="Certificates" />
          </div>

          {/* Continue Learning Banner */}
          {continueCourse && (
            <div
              style={{
                background: "linear-gradient(135deg, #151515 0%, #1E1B2B 100%)",
                color: "#FFFFFF",
                borderRadius: 18,
                padding: "26px 32px",
                marginBottom: 36,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 20,
                border: "1px solid rgba(124, 58, 237, 0.25)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
              }}
            >
              <div>
                <span className="eyebrow" style={{ color: "#A78BFA", marginBottom: 6 }}>
                  RESUME LEARNING
                </span>
                <h2 style={{ margin: "4px 0 8px", fontSize: 22, color: "#FFFFFF" }}>
                  {continueCourse.name}
                </h2>
                <p style={{ margin: 0, color: "#94A3B8", fontSize: 14 }}>
                  {continueCourse.duration} · {continueCourse.level}
                </p>
              </div>

              <Link
                to={`/learn/course/${continueCourse._id}`}
                className="btn btn-primary btn-large"
              >
                <FiPlayCircle style={{ fontSize: 18 }} /> Resume Course
              </Link>
            </div>
          )}

          {/* Enrolled Courses Section */}
          <div className="portal-section-head">
            <h2>My Active Courses</h2>
            <Link to="/my-courses">View all ({activeEnrollments.length})</Link>
          </div>

          {activeEnrollments.length > 0 ? (
            <div className="dashboard-course-list">
              {activeEnrollments.map((e) => {
                const courseData = e.course;
                if (!courseData) return null;

                // Match progress summary for this course
                const progressMatch = progressSummary?.courses?.find(
                  (c) => String(c.course?._id) === String(courseData._id)
                );
                const pct = progressMatch?.percentage || 0;

                return (
                  <div className="enrolled-card" key={e._id}>
                    <div className="course-icon">
                      <FiBookOpen />
                    </div>

                    <div style={{ flex: 1 }}>
                      <span className="course-category-tag">
                        {courseData.category || "Development"}
                      </span>
                      <h3 style={{ margin: "4px 0" }}>{courseData.name}</h3>
                      <p style={{ margin: "0 0 10px", color: "var(--muted)", fontSize: 13 }}>
                        {progressMatch ? `${progressMatch.completedLessons} of ${progressMatch.totalLessons} lessons completed (${pct}%)` : "Begin your first lesson"}
                      </p>

                      <div className="progress-bar-wrap" style={{ maxWidth: 300, margin: 0 }}>
                        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <Link
                      className="btn btn-primary btn-small"
                      to={`/learn/course/${courseData._id}`}
                    >
                      Continue Learning →
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No enrolled courses yet"
              text="Explore the catalog to start a TechDea program."
              action={<Link className="btn btn-primary" to="/courses">Browse catalog</Link>}
            />
          )}

          {/* Certificates Quick View */}
          {certificates.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <div className="portal-section-head">
                <h2>My Certificates</h2>
                <Link to="/certificates">View all</Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {certificates.map((cert) => (
                  <div
                    key={cert._id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: 20,
                      display: "flex",
                      gap: 14,
                      alignItems: "center"
                    }}
                  >
                    <div className="stat-icon" style={{ background: "#DCFCE7", color: "#16A34A" }}>
                      <FiAward />
                    </div>
                    <div>
                      <strong style={{ fontSize: 14, display: "block" }}>{cert.courseTitle}</strong>
                      <small style={{ color: "var(--muted)" }}>ID: {cert.certificateId}</small>
                      <Link
                        to={`/verify/${cert.certificateId}`}
                        style={{ display: "block", color: "var(--primary)", fontSize: 12, fontWeight: 700, marginTop: 4 }}
                      >
                        Verify Credential →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}