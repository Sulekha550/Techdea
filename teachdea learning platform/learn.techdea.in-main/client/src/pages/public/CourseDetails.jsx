import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiClock,
  FiStar,
  FiUsers,
  FiBookOpen,
  FiCheckCircle,
  FiPlayCircle,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiAward,
  FiHelpCircle,
  FiX
} from "react-icons/fi";
import {
  getCourse,
  checkCourseEnrollment,
  enrollCourse,
  createPayment,
  verifyPayment
} from "../../services/courseService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [previewLesson, setPreviewLesson] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getCourse(id)
      .then(async (res) => {
        if (!isMounted) return;
        setData(res.data);

        // Auto-expand first module
        if (res.data.curriculum?.length > 0) {
          setExpandedModules({ [res.data.curriculum[0]._id]: true });
        }

        // Check enrollment if logged in
        if (user && res.data.course) {
          try {
            const checkRes = await checkCourseEnrollment(res.data.course._id);
            if (isMounted) setIsEnrolled(checkRes.data.enrolled);
          } catch (e) {
            console.error("Enrollment check error:", e);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load course details:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnrollClick = async () => {
    if (!user) {
      navigate(`/login?redirect=/courses/${id}`);
      return;
    }

    if (isEnrolled) {
      navigate(`/learn/course/${data.course._id}`);
      return;
    }

    const course = data.course;
    const isFree = (course.price || 0) <= 0;

    if (isFree) {
      try {
        setEnrolling(true);
        const res = await enrollCourse(course._id);
        if (res.data.success) {
          setIsEnrolled(true);
          setMessage({ type: "success", text: "Successfully enrolled in this course!" });
          setTimeout(() => {
            navigate(`/learn/course/${course._id}`);
          }, 1000);
        }
      } catch (err) {
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to complete enrollment."
        });
      } finally {
        setEnrolling(false);
      }
    } else {
      // Open Checkout Modal
      setPaymentModal(true);
    }
  };

  const handleCompletePayment = async () => {
    try {
      setPaymentProcessing(true);
      const course = data.course;
      const finalAmount = course.discountPrice || course.price;

      // 1. Create payment order
      const orderRes = await createPayment({
        courseId: course._id,
        amount: finalAmount,
        paymentMethod: "UPI / Net Banking"
      });

      // 2. Verify payment backend
      const verifyRes = await verifyPayment({
        paymentId: orderRes.data.payment._id,
        courseId: course._id
      });

      if (verifyRes.data.success) {
        setIsEnrolled(true);
        setPaymentModal(false);
        setMessage({
          type: "success",
          text: "Payment verified successfully! Welcome to the course."
        });
        setTimeout(() => {
          navigate(`/learn/course/${course._id}`);
        }, 1200);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Payment verification failed."
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <section className="section page-top">
        <div className="container" style={{ padding: "80px 0" }}>
          <Loader />
        </div>
      </section>
    );
  }

  if (!data?.course) {
    return (
      <section className="section page-top">
        <div className="container">
          <div className="alert error">Course could not be found.</div>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: 14 }}>
            Browse Courses
          </Link>
        </div>
      </section>
    );
  }

  const { course, curriculum = [] } = data;
  const totalLessons = curriculum.reduce(
    (acc, m) => acc + (m.lectures?.length || 0),
    0
  );
  const isFree = (course.price || 0) <= 0;

  return (
    <section className="section page-top">
      <div className="container">
        <Link className="back-link" to="/courses">
          ← Back to all courses
        </Link>

        {message && (
          <div className={`alert ${message.type}`} style={{ marginBottom: 20 }}>
            {message.text}
          </div>
        )}

        {/* ========================================================
            HERO HEADER
        ======================================================== */}
        <div className="detail-hero">
          <div className="eyebrow">{course.category || course.branch || "TECH TRACK"}</div>
          <h1>{course.name}</h1>
          <p>{course.shortDescription || course.description}</p>

          <div className="detail-meta-bar">
            <span><FiClock /> {course.duration || "Self-paced"}</span>
            <span><FiStar style={{ color: "#F59E0B" }} /> {course.rating || 4.8} ({course.ratingCount || 24} ratings)</span>
            <span><FiBookOpen /> {curriculum.length} Modules · {totalLessons} Lessons</span>
            <span><FiAward /> Official Certificate</span>
          </div>
        </div>

        {/* ========================================================
            MAIN DETAILS GRID
        ======================================================== */}
        <div className="detail-grid">
          <div>
            {/* Overview */}
            <div className="detail-card">
              <h3>Course Overview</h3>
              <p style={{ lineHeight: 1.7, color: "var(--muted)", margin: 0 }}>
                {course.description || course.shortDescription}
              </p>
            </div>

            {/* What you will learn */}
            {course.whatYouWillLearn?.length > 0 && (
              <div className="detail-card">
                <h3>What You Will Learn</h3>
                <div className="what-you-learn-list">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div className="what-you-learn-item" key={idx}>
                      <FiCheckCircle />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum */}
            <div className="detail-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ margin: 0 }}>Course Curriculum</h3>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>
                  {curriculum.length} Modules · {totalLessons} Lessons
                </span>
              </div>

              {curriculum.length > 0 ? (
                curriculum.map((mod) => {
                  const isExpanded = Boolean(expandedModules[mod._id]);
                  return (
                    <div className="curriculum-module" key={mod._id}>
                      <div
                        className="curriculum-module-head"
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleModule(mod._id)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleModule(mod._id); }}
                      >
                        <div>
                          <span>{mod.title}</span>
                          {mod.description && (
                            <small style={{ display: "block", color: "var(--muted)", fontWeight: 500, fontSize: 12, marginTop: 2 }}>
                              {mod.description}
                            </small>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>
                            {mod.lectures?.length || 0} lessons
                          </span>
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div>
                          {mod.lectures?.map((lec) => (
                            <div className="curriculum-lesson-row" key={lec._id}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <FiPlayCircle style={{ color: "var(--primary)" }} />
                                <div>
                                  <strong style={{ fontSize: 13 }}>{lec.title}</strong>
                                  {lec.duration && (
                                    <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>
                                      {lec.duration}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span className="lesson-type-badge">
                                  {lec.contentType || "Video"}
                                </span>
                                {lec.isPreview && (
                                  <button
                                    type="button"
                                    className="btn btn-outline btn-small"
                                    onClick={() => setPreviewLesson(lec)}
                                  >
                                    Preview
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{ color: "var(--muted)" }}>Curriculum is currently being published.</p>
              )}
            </div>

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <div className="detail-card">
                <h3>Requirements</h3>
                <ul style={{ paddingLeft: 20, color: "var(--muted)", margin: 0, lineHeight: 1.7 }}>
                  {course.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor Info */}
            {course.instructor && (
              <div className="detail-card">
                <h3>Instructor</h3>
                <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                  <img
                    src={course.instructor.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                    alt={course.instructor.name}
                    style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: 17 }}>{course.instructor.name}</h4>
                    <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: 13, display: "block" }}>
                      {course.instructor.title}
                    </span>
                    <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 13 }}>
                      {course.instructor.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* FAQs */}
            {course.faqs?.length > 0 && (
              <div className="detail-card">
                <h3><FiHelpCircle style={{ verticalAlign: "middle" }} /> Frequently Asked Questions</h3>
                {course.faqs.map((faq, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <strong style={{ display: "block", fontSize: 15, marginBottom: 4 }}>
                      {faq.question}
                    </strong>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================
              STICKY ENROLLMENT CTA SIDEBAR
          ======================================================== */}
          <aside className="enroll-sticky-card">
            <div style={{ marginBottom: 16 }}>
              <img
                src={course.thumbnail || course.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"}
                alt={course.name}
                style={{ width: "100%", borderRadius: 10, aspectRatio: "16/9", objectFit: "cover" }}
              />
            </div>

            <div className="sticky-price-row">
              {isFree ? (
                <span className="sticky-price" style={{ color: "var(--success)" }}>
                  Free
                </span>
              ) : (
                <>
                  <span className="sticky-price">₹{course.discountPrice || course.price}</span>
                  {course.discountPrice && course.price > course.discountPrice && (
                    <span className="original-price" style={{ fontSize: 16 }}>
                      ₹{course.price}
                    </span>
                  )}
                </>
              )}
            </div>

            <button
              type="button"
              className="btn btn-primary btn-large"
              style={{ width: "100%", marginBottom: 14 }}
              onClick={handleEnrollClick}
              disabled={enrolling}
            >
              {enrolling
                ? "Enrolling..."
                : isEnrolled
                ? "Continue Learning →"
                : isFree
                ? "Enroll for Free"
                : "Buy Course Now"}
            </button>

            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", fontSize: 13, color: "var(--muted)", display: "grid", gap: 10 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle style={{ color: "var(--success)" }} /> Full lifetime access
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle style={{ color: "var(--success)" }} /> Access on mobile and desktop
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle style={{ color: "var(--success)" }} /> Verifiable certificate included
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle style={{ color: "var(--success)" }} /> Interactive assessments
              </li>
            </ul>
          </aside>
        </div>
      </div>

      {/* ========================================================
          LESSON PREVIEW MODAL
      ======================================================== */}
      {previewLesson && (
        <div className="modal-overlay" onClick={() => setPreviewLesson(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Preview: {previewLesson.title}</h2>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setPreviewLesson(null)}
              >
                <FiX />
              </button>
            </div>
            <div className="video-wrap" style={{ marginBottom: 16 }}>
              {previewLesson.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${previewLesson.videoId}?autoplay=1&rel=0`}
                  title={previewLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : previewLesson.videoUrl ? (
                <iframe src={previewLesson.videoUrl} title={previewLesson.title} allowFullScreen />
              ) : (
                <div className="video-placeholder">Preview video loading...</div>
              )}
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>{previewLesson.description}</p>
          </div>
        </div>
      )}

      {/* ========================================================
          CHECKOUT MODAL
      ======================================================== */}
      {paymentModal && (
        <div className="modal-overlay" onClick={() => setPaymentModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Checkout & Payment</h2>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setPaymentModal(false)}
              >
                <FiX />
              </button>
            </div>

            <div style={{ background: "var(--primary-soft)", padding: 18, borderRadius: 12, marginBottom: 20 }}>
              <strong style={{ display: "block", fontSize: 16 }}>{course.name}</strong>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 14 }}>
                <span>Course Access Fee:</span>
                <strong>₹{course.discountPrice || course.price}</strong>
              </div>
            </div>

            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              Clicking below simulates a verified payment gateway callback to our backend.
              Once confirmed, your course will be instantly activated.
            </p>

            <button
              type="button"
              className="btn btn-primary btn-large"
              style={{ width: "100%", marginTop: 14 }}
              onClick={handleCompletePayment}
              disabled={paymentProcessing}
            >
              {paymentProcessing ? "Verifying Payment..." : `Pay ₹${course.discountPrice || course.price} & Unlock`}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}