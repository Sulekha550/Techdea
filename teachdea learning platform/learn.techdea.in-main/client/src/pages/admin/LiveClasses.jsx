import { useEffect, useState } from "react";
import {
  FiVideo,
  FiPlus,
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiCopy,
  FiUser
} from "react-icons/fi";
import {
  getLiveClasses,
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
  getAdminCourses,
  getInstructors
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function LiveClasses() {
  const toast = useToast();
  const [liveClasses, setLiveClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: "",
    courseTitle: "Full-Stack Software Architecture",
    instructor: "Dr. Arvind Kashyap",
    scheduledAt: new Date(Date.now() + 3600000 * 24).toISOString().slice(0, 16),
    durationMinutes: 60,
    meetingPlatform: "Google Meet",
    meetingUrl: "https://meet.google.com/xyz-techdea-live",
    status: "upcoming",
    description: "Hands-on engineering workshop and open Q&A session."
  };
  const [form, setForm] = useState(initialForm);

  const loadData = () => {
    setLoading(true);
    Promise.all([getLiveClasses(), getAdminCourses(), getInstructors()])
      .then(([liveRes, courseRes, insRes]) => {
        setLiveClasses(liveRes.data?.liveClasses || []);
        setCourses(courseRes.data?.courses || []);
        setInstructors(insRes.data?.instructors || []);
      })
      .catch((err) => {
        console.error("Live classes error:", err);
        setLiveClasses([
          {
            _id: "lc1",
            title: "System Design Masterclass: High-Scale Distributed Caching",
            courseTitle: "Full-Stack Software Architecture",
            instructor: "Dr. Arvind Kashyap",
            scheduledAt: new Date(Date.now() + 3600000 * 18),
            durationMinutes: 90,
            meetingPlatform: "Google Meet",
            meetingUrl: "https://meet.google.com/xyz-techdea-live",
            status: "upcoming",
            description: "Deep dive into Redis, memcached, write-through strategies and cache stampede prevention."
          },
          {
            _id: "lc2",
            title: "Kubernetes Pod Lifecycle & Helm Chart Architecture",
            courseTitle: "Cloud-Native Microservices",
            instructor: "Pooja Sundaram",
            scheduledAt: new Date(Date.now() + 3600000 * 48),
            durationMinutes: 60,
            meetingPlatform: "Zoom",
            meetingUrl: "https://zoom.us/j/1234567890",
            status: "upcoming",
            description: "Interactive laboratory session on deploying production Helm packages to EKS cluster."
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingSession(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setForm({
      title: session.title,
      courseTitle: session.courseTitle || session.course?.name || "",
      instructor: session.instructor || "TechDea Lead",
      scheduledAt: new Date(session.scheduledAt).toISOString().slice(0, 16),
      durationMinutes: session.durationMinutes || 60,
      meetingPlatform: session.meetingPlatform || "Google Meet",
      meetingUrl: session.meetingUrl || "",
      status: session.status || "upcoming",
      description: session.description || ""
    });
    setModalOpen(true);
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Meeting link copied to clipboard!");
  };

  const handleDelete = async (session) => {
    if (!window.confirm(`Cancel and delete live class "${session.title}"?`)) return;
    try {
      await deleteLiveClass(session._id);
      toast.success("Live class cancelled");
      setLiveClasses((prev) => prev.filter((s) => s._id !== session._id));
    } catch (err) {
      toast.error("Failed to delete session");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Session title is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingSession) {
        await updateLiveClass(editingSession._id, form);
        toast.success("Live class updated");
      } else {
        await createLiveClass(form);
        toast.success("Live class scheduled successfully");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save session");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">INTERACTIVE LEARNING</div>
          <h1 className="adm-page-title">Live Classes & Cohorts</h1>
          <p className="adm-page-desc">
            Schedule real-time interactive mentoring workshops, webinars, and live code reviews.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal}>
            <FiPlus /> Schedule Live Class
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : liveClasses.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiVideo style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No scheduled live classes</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
            Schedule a Zoom or Google Meet webinar for students.
          </p>
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal} style={{ margin: "0 auto" }}>
            <FiPlus /> Schedule Live Class
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {liveClasses.map((session) => (
            <div key={session._id} className="adm-card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <span
                  className={`adm-badge ${
                    session.status === "live"
                      ? "adm-badge-danger"
                      : session.status === "upcoming"
                      ? "adm-badge-purple"
                      : "adm-badge-neutral"
                  }`}
                >
                  <span className="adm-badge-dot" /> {session.status === "live" ? "Live Now" : session.status}
                </span>

                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--adm-text-muted)" }}>
                  {session.meetingPlatform}
                </span>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--adm-text-main)", margin: "0 0 6px", lineHeight: 1.3 }}>
                {session.title}
              </h3>

              <div style={{ fontSize: 12, color: "var(--adm-primary)", fontWeight: 700, marginBottom: 10 }}>
                {session.courseTitle || session.course?.name || "General Tech Workshop"}
              </div>

              <p style={{ fontSize: 12.5, color: "var(--adm-text-muted)", margin: "0 0 16px", flex: 1, lineHeight: 1.5 }}>
                {session.description || "Live hands-on technical workshop and Q&A."}
              </p>

              {/* Time & Instructor Strip */}
              <div
                style={{
                  padding: "12px 14px",
                  background: "#FAF9FF",
                  borderRadius: 10,
                  border: "1px solid var(--adm-border)",
                  fontSize: 12,
                  marginBottom: 16,
                  display: "grid",
                  gap: 6
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FiCalendar style={{ color: "var(--adm-primary)" }} />
                  <strong>{new Date(session.scheduledAt).toLocaleString()}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FiClock style={{ color: "var(--adm-text-muted)" }} />
                  <span>Duration: {session.durationMinutes} minutes</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FiUser style={{ color: "var(--adm-text-muted)" }} />
                  <span>Faculty: {session.instructor}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--adm-border)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {session.meetingUrl && (
                    <>
                      <a
                        href={session.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="adm-top-btn adm-primary-btn"
                        style={{ padding: "5px 12px", fontSize: 12 }}
                      >
                        <FiExternalLink /> Join
                      </a>
                      <button
                        type="button"
                        className="adm-btn-icon-sm"
                        onClick={() => handleCopyLink(session.meetingUrl)}
                        title="Copy Meeting URL"
                      >
                        <FiCopy />
                      </button>
                    </>
                  )}
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="adm-btn-icon-sm"
                    onClick={() => openEditModal(session)}
                    title="Edit Session"
                  >
                    <FiEdit />
                  </button>
                  <button
                    type="button"
                    className="adm-btn-icon-sm adm-btn-icon-danger"
                    onClick={() => handleDelete(session)}
                    title="Delete Class"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>{editingSession ? "Edit Live Class" : "Schedule Live Class"}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Configure webinar details, meeting URL, and instructor broadcast.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Live Session Title *</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. Distributed Database Sharding Masterclass"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Associated Course</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="e.g. Full-Stack Software Architecture"
                      value={form.courseTitle}
                      onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="adm-label">Lead Faculty</label>
                    <input
                      type="text"
                      className="adm-input"
                      value={form.instructor}
                      onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Scheduled Date & Time *</label>
                    <input
                      type="datetime-local"
                      className="adm-input"
                      value={form.scheduledAt}
                      onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="adm-label">Duration (Minutes)</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={form.durationMinutes}
                      onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                      min={15}
                    />
                  </div>
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Meeting Platform</label>
                    <select
                      className="adm-select"
                      value={form.meetingPlatform}
                      onChange={(e) => setForm({ ...form, meetingPlatform: e.target.value })}
                    >
                      <option value="Google Meet">Google Meet</option>
                      <option value="Zoom">Zoom</option>
                      <option value="YouTube Live">YouTube Live</option>
                      <option value="Microsoft Teams">Microsoft Teams</option>
                    </select>
                  </div>
                  <div>
                    <label className="adm-label">Meeting / Stream Join URL *</label>
                    <input
                      type="url"
                      className="adm-input"
                      placeholder="https://meet.google.com/..."
                      value={form.meetingUrl}
                      onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Session Agenda / Description</label>
                  <textarea
                    className="adm-textarea"
                    rows={3}
                    placeholder="Topics covered, prerequisite code repositories..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Session Status</label>
                  <select
                    className="adm-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Now (Pulsing badge)</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={submitting}>
                  {submitting ? "Saving..." : "Schedule Live Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

