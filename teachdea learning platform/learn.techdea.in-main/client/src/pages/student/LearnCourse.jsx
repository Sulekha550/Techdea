import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiCircle,
  FiPlayCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiAward,
  FiCheck,
  FiBookOpen,
  FiHelpCircle
} from "react-icons/fi";
import {
  getCourse,
  getCourseProgress,
  toggleLessonProgress,
  claimCertificate
} from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";

export default function LearnCourse() {
  const { courseId, semesterId } = useParams();
  const effectiveId = courseId || semesterId;
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progressData, setProgressData] = useState({
    completedLessonIds: [],
    percentage: 0,
    completedCount: 0,
    totalLessons: 0
  });
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getCourse(effectiveId)
      .then(async (res) => {
        if (!isMounted) return;
        const courseObj = res.data.course;
        const cur = res.data.curriculum || [];
        setCourse(courseObj);
        setCurriculum(cur);

        // Fetch backend progress
        if (courseObj?._id) {
          try {
            const progRes = await getCourseProgress(courseObj._id);
            if (isMounted && progRes.data?.data) {
              setProgressData(progRes.data.data);
            }
          } catch (pe) {
            console.error("Progress fetch error:", pe);
          }
        }

        // Set initial active lesson
        let firstLesson = null;
        for (const mod of cur) {
          if (mod.lectures?.length > 0) {
            firstLesson = mod.lectures[0];
            break;
          }
        }
        if (isMounted) setActiveLesson(firstLesson);
      })
      .catch((err) => {
        console.error("LearnCourse error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [effectiveId]);

  // Flatten all lessons across modules for simple next/previous navigation
  const allLessons = [];
  curriculum.forEach((mod) => {
    (mod.lectures || []).forEach((lec) => {
      allLessons.push({ ...lec, moduleTitle: mod.title });
    });
  });

  const currentIndex = allLessons.findIndex(
    (l) => String(l._id) === String(activeLesson?._id)
  );
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const isCurrentCompleted = Boolean(
    activeLesson && progressData.completedLessonIds.includes(String(activeLesson._id))
  );

  const handleToggleComplete = async () => {
    if (!activeLesson || toggling) return;
    setToggling(true);
    setAlertMsg(null);

    try {
      const willBeCompleted = !isCurrentCompleted;
      const res = await toggleLessonProgress({
        lectureId: activeLesson._id,
        courseId: course._id,
        completed: willBeCompleted
      });

      if (res.data.success) {
        // Refresh course progress from backend
        const progRes = await getCourseProgress(course._id);
        if (progRes.data?.data) {
          setProgressData(progRes.data.data);
        }
        setAlertMsg({
          type: "success",
          text: willBeCompleted ? "Lesson completed!" : "Lesson marked as incomplete"
        });
      }
    } catch (err) {
      setAlertMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update lesson progress."
      });
    } finally {
      setToggling(false);
    }
  };

  const handleClaimCertificate = async () => {
    if (claiming) return;
    setClaiming(true);
    setAlertMsg(null);

    try {
      const res = await claimCertificate(course._id);
      if (res.data.success) {
        navigate(`/verify/${res.data.certificate.certificateId}`);
      }
    } catch (err) {
      setAlertMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to claim certificate."
      });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "80px 0" }}>
        <Loader />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="empty-state">
        <h3>Course could not be loaded</h3>
        <p>Please return to your dashboard or browse available courses.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top Breadcrumb & Progress Bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <div>
            <Link to="/my-courses" style={{ color: "var(--muted)", fontSize: 13, fontWeight: 700 }}>
              ← My Courses
            </Link>
            <h1 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800 }}>
              {course.name}
            </h1>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--primary)" }}>
              {progressData.percentage}% Completed ({progressData.completedCount}/{progressData.totalLessons} lessons)
            </span>
          </div>
        </div>

        <div className="progress-bar-wrap" style={{ margin: 0 }}>
          <div className="progress-bar-fill" style={{ width: `${progressData.percentage}%` }} />
        </div>
      </div>

      {alertMsg && (
        <div className={`alert ${alertMsg.type}`} style={{ marginBottom: 16 }}>
          {alertMsg.text}
        </div>
      )}

      {/* 100% Completion Certificate Banner */}
      {progressData.percentage === 100 && progressData.totalLessons > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, #15803D 0%, #16A34A 100%)",
            color: "#FFFFFF",
            padding: "18px 24px",
            borderRadius: 14,
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14
          }}
        >
          <div>
            <strong style={{ fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <FiAward style={{ fontSize: 20 }} /> 100% Course Completed!
            </strong>
            <span style={{ fontSize: 13, opacity: 0.9 }}>
              You have completed all curriculum requirements. Your official certificate is ready to claim.
            </span>
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ background: "#FFFFFF", color: "#15803D", fontWeight: 800 }}
            onClick={handleClaimCertificate}
            disabled={claiming}
          >
            {claiming ? "Generating..." : "Claim Official Certificate →"}
          </button>
        </div>
      )}

      {/* Two-Column Stage: Lesson Player + Curriculum Sidebar */}
      <div className="learn-portal-grid">
        {/* Left Column: Lesson Stage */}
        <div className="learn-main-stage">
          {activeLesson ? (
            <>
              {/* Media Container */}
              {activeLesson.contentType === "video" || activeLesson.videoId || activeLesson.videoUrl ? (
                <div className="learn-video-player">
                  {activeLesson.videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${activeLesson.videoId}?rel=0&autoplay=0`}
                      title={activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : activeLesson.videoUrl ? (
                    <iframe src={activeLesson.videoUrl} title={activeLesson.title} allowFullScreen />
                  ) : (
                    <div className="video-placeholder">No video provided for this lesson</div>
                  )}
                </div>
              ) : activeLesson.contentType === "text" ? (
                <div style={{ background: "#FAF5FF", padding: "30px", borderBottom: "1px solid var(--border)" }}>
                  <div className="eyebrow"><FiFileText /> READING LESSON</div>
                  <h2 style={{ margin: "4px 0" }}>{activeLesson.title}</h2>
                </div>
              ) : (
                <div style={{ background: "#FAF5FF", padding: "30px", borderBottom: "1px solid var(--border)" }}>
                  <div className="eyebrow"><FiBookOpen /> LEARNING MATERIAL</div>
                  <h2 style={{ margin: "4px 0" }}>{activeLesson.title}</h2>
                </div>
              )}

              {/* Lesson Controls & Content */}
              <div className="learn-stage-body">
                <div className="learn-controls-bar">
                  <div>
                    <span className="eyebrow" style={{ marginBottom: 4, display: "block" }}>
                      LESSON {currentIndex + 1} OF {allLessons.length}
                    </span>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
                      {activeLesson.title}
                    </h2>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button
                      type="button"
                      className={`btn ${isCurrentCompleted ? "btn-outline" : "btn-primary"}`}
                      onClick={handleToggleComplete}
                      disabled={toggling}
                    >
                      {isCurrentCompleted ? (
                        <>
                          <FiCheck style={{ color: "var(--success)" }} /> Completed
                        </>
                      ) : (
                        "Mark as Complete"
                      )}
                    </button>
                  </div>
                </div>

                {/* Lesson Description & Text Content */}
                {activeLesson.description && (
                  <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 15, margin: "0 0 20px" }}>
                    {activeLesson.description}
                  </p>
                )}

                {activeLesson.content && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: 24,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.7,
                      fontSize: 14,
                      color: "#374151",
                      marginBottom: 24
                    }}
                  >
                    {activeLesson.content}
                  </div>
                )}

                {/* Attached Notes & Resources */}
                {(activeLesson.noteUrl || activeLesson.pdfUrl || activeLesson.resources?.length > 0) && (
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                    <h4 style={{ margin: "0 0 14px", fontSize: 16 }}>Attached Resources</h4>
                    <div style={{ display: "grid", gap: 8 }}>
                      {activeLesson.noteUrl && (
                        <a
                          href={activeLesson.noteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="resource-row"
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <FiFileText style={{ color: "var(--primary)" }} />
                            <span>Study Notes</span>
                          </div>
                          <FiExternalLink />
                        </a>
                      )}

                      {activeLesson.pdfUrl && (
                        <a
                          href={activeLesson.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="resource-row"
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <FiDownload style={{ color: "var(--primary)" }} />
                            <span>Download PDF Guide</span>
                          </div>
                          <FiExternalLink />
                        </a>
                      )}

                      {activeLesson.resources?.map((r, i) => (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="resource-row"
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <FiExternalLink style={{ color: "var(--primary)" }} />
                            <span>{r.title}</span>
                          </div>
                          <span className="lesson-type-badge">{r.type}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next & Previous Buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                  {prevLesson ? (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setActiveLesson(prevLesson)}
                    >
                      <FiChevronLeft /> Previous Lesson
                    </button>
                  ) : <div />}

                  {nextLesson ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setActiveLesson(nextLesson)}
                    >
                      Next Lesson <FiChevronRight />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => navigate(`/tests/${course._id}`)}
                    >
                      Take Course Quiz <FiAward />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: 40, textAlign: "center" }}>
              <p>Select a lesson from the curriculum sidebar to begin.</p>
            </div>
          )}
        </div>

        {/* Right Column: Curriculum Navigation Drawer */}
        <aside className="curriculum-sidebar-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Course Content</h3>
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
              {allLessons.length} Lessons
            </span>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {curriculum.map((mod) => (
              <div key={mod._id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                <strong style={{ fontSize: 13, display: "block", color: "#111827", marginBottom: 6 }}>
                  {mod.title}
                </strong>

                <div style={{ display: "grid", gap: 4 }}>
                  {mod.lectures?.map((lec) => {
                    const isActive = String(lec._id) === String(activeLesson?._id);
                    const isCompleted = progressData.completedLessonIds.includes(String(lec._id));

                    return (
                      <button
                        type="button"
                        key={lec._id}
                        className={`learn-lesson-btn ${isActive ? "active" : ""}`}
                        onClick={() => setActiveLesson({ ...lec, moduleTitle: mod.title })}
                      >
                        {isCompleted ? (
                          <FiCheckCircle style={{ color: "var(--success)", flex: "none" }} />
                        ) : (
                          <FiCircle style={{ color: "var(--border)", flex: "none" }} />
                        )}
                        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {lec.title}
                        </span>
                        {lec.duration && (
                          <small style={{ color: "var(--muted)", fontSize: 11 }}>{lec.duration}</small>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Practice Quiz Link */}
          <div style={{ marginTop: 20 }}>
            <Link
              to={`/tests/${course._id}`}
              className="btn btn-outline"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <FiAward /> Course Practice Quiz
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
