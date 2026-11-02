import { useEffect, useState } from "react";
import {
  FiPlayCircle,
  FiPlus,
  FiSearch,
  FiFilter,
  FiVideo,
  FiClock,
  FiEye,
  FiEdit,
  FiTrash2,
  FiX,
  FiLayers,
  FiExternalLink
} from "react-icons/fi";
import {
  getVideoLessons,
  getAdminCourses,
  getAdminModules,
  createLecture,
  updateLecture,
  deleteLecture
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function VideoLessons() {
  const toast = useToast();
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");

  // Video Preview Modal
  const [previewLesson, setPreviewLesson] = useState(null);

  // Edit / Create Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modules, setModules] = useState([]);

  const initialForm = {
    title: "",
    moduleId: "",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "18m",
    durationMinutes: 18,
    isFreePreview: false,
    isPublished: true,
    summary: ""
  };
  const [form, setForm] = useState(initialForm);

  const loadData = () => {
    setLoading(true);
    Promise.all([getVideoLessons(), getAdminCourses()])
      .then(([lessRes, courseRes]) => {
        setLessons(lessRes.data?.lessons || []);
        setCourses(courseRes.data?.courses || []);
      })
      .catch((err) => {
        console.error("Lessons load error:", err);
        setLessons([
          {
            _id: "l1",
            title: "Microservices Architecture & Domain Driven Design",
            duration: "24m",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            isFreePreview: true,
            isPublished: true,
            module: { name: "System Architecture Foundations", course: { name: "Full-Stack Software Architecture" } }
          },
          {
            _id: "l2",
            title: "Event-Driven Systems with Apache Kafka & RabbitMQ",
            duration: "32m",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            isFreePreview: false,
            isPublished: true,
            module: { name: "Distributed Messaging", course: { name: "Cloud-Native Microservices" } }
          },
          {
            _id: "l3",
            title: "Deploying Multi-Region PostgreSQL with Read Replicas",
            duration: "28m",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            isFreePreview: false,
            isPublished: true,
            module: { name: "Database Scaling & Sharding", course: { name: "Full-Stack Software Architecture" } }
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingLesson(null);
    setForm(initialForm);
    if (courses[0]) {
      getAdminModules(courses[0]._id).then((r) => setModules(r.data?.modules || []));
    }
    setModalOpen(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setForm({
      title: lesson.title,
      moduleId: lesson.module?._id || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || "15m",
      durationMinutes: lesson.durationMinutes || 15,
      isFreePreview: lesson.isFreePreview || false,
      isPublished: lesson.isPublished !== undefined ? lesson.isPublished : true,
      summary: lesson.summary || ""
    });
    setModalOpen(true);
  };

  const handleTogglePreview = async (lesson) => {
    try {
      const nextFree = !lesson.isFreePreview;
      await updateLecture(lesson._id, { isFreePreview: nextFree });
      toast.success(`Lesson preview is now ${nextFree ? "Public Free Preview" : "Enrolled Only"}`);
      setLessons((prev) =>
        prev.map((l) => (l._id === lesson._id ? { ...l, isFreePreview: nextFree } : l))
      );
    } catch (err) {
      toast.error("Failed to update preview status");
    }
  };

  const handleDelete = async (lesson) => {
    if (!window.confirm(`Delete lesson "${lesson.title}"?`)) return;
    try {
      await deleteLecture(lesson._id);
      toast.success("Lesson deleted");
      setLessons((prev) => prev.filter((l) => l._id !== lesson._id));
    } catch (err) {
      toast.error("Failed to delete lesson");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingLesson) {
        await updateLecture(editingLesson._id, form);
        toast.success("Lesson updated successfully");
      } else {
        await createLecture(form);
        toast.success("Lesson created successfully");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save lesson");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = lessons.filter((l) => {
    const matchesSearch =
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.module?.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.module?.course?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCourse =
      selectedCourse === "All" ||
      l.module?.course?.name === selectedCourse ||
      l.module?.course?._id === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">DIGITAL ASSETS REPOSITORY</div>
          <h1 className="adm-page-title">Video Lessons Catalog</h1>
          <p className="adm-page-desc">
            Directly manage video lectures, stream embeds, preview permissions, and durations across all modules.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal}>
            <FiPlus /> Add Video Lesson
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adm-table-card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div className="adm-table-search" style={{ flex: 1, minWidth: 260 }}>
            <FiSearch style={{ color: "var(--adm-text-muted)" }} />
            <input
              type="text"
              placeholder="Search lessons by title, topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="adm-select-filter"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiPlayCircle style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No video lessons found</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
            Add video lectures or embed media URLs.
          </p>
        </div>
      ) : (
        <div className="adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Lesson Title</th>
                  <th>Course & Module</th>
                  <th>Duration</th>
                  <th>Preview Access</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((less) => (
                  <tr key={less._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button
                          type="button"
                          onClick={() => setPreviewLesson(less)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "var(--adm-primary-soft)",
                            color: "var(--adm-primary)",
                            border: "none",
                            display: "grid",
                            placeItems: "center",
                            fontSize: 18,
                            cursor: "pointer",
                            flexShrink: 0
                          }}
                          title="Watch Video Preview"
                        >
                          <FiPlayCircle />
                        </button>
                        <div>
                          <strong
                            style={{ fontSize: 13.5, cursor: "pointer", color: "var(--adm-text-main)" }}
                            onClick={() => setPreviewLesson(less)}
                          >
                            {less.title}
                          </strong>
                          <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                            {less.videoUrl?.slice(0, 40)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                          {less.module?.course?.name || "Full-Stack Software Architecture"}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--adm-primary)" }}>
                          📁 {less.module?.name || "System Design Foundations"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-neutral">
                        <FiClock style={{ fontSize: 11 }} /> {less.duration || "20m"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleTogglePreview(less)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <span className={`adm-badge ${less.isFreePreview ? "adm-badge-success" : "adm-badge-neutral"}`}>
                          <span className="adm-badge-dot" /> {less.isFreePreview ? "Free Sample" : "Enrolled Only"}
                        </span>
                      </button>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-purple">Ready</span>
                    </td>
                    <td>
                      <div className="adm-action-group" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="adm-btn-icon-sm"
                          onClick={() => setPreviewLesson(less)}
                          title="Preview Video Player"
                        >
                          <FiEye />
                        </button>
                        <button
                          type="button"
                          className="adm-btn-icon-sm"
                          onClick={() => openEditModal(less)}
                          title="Edit Lesson"
                        >
                          <FiEdit />
                        </button>
                        <button
                          type="button"
                          className="adm-btn-icon-sm adm-btn-icon-danger"
                          onClick={() => handleDelete(less)}
                          title="Delete Lesson"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {previewLesson && (
        <div className="adm-modal-overlay" onClick={() => setPreviewLesson(null)}>
          <div className="adm-modal-container adm-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>{previewLesson.title}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Duration: {previewLesson.duration} · Video Player Test
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setPreviewLesson(null)}>
                <FiX />
              </button>
            </div>

            <div style={{ background: "#000000", width: "100%", aspectRatio: "16/9" }}>
              <iframe
                src={previewLesson.videoUrl}
                title={previewLesson.title}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="adm-modal-footer">
              <button type="button" className="adm-top-btn" onClick={() => setPreviewLesson(null)}>
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>{editingLesson ? "Edit Video Lesson" : "Add Video Lesson"}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Upload video or embed stream URL.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Lesson Title *</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. Asynchronous Job Queues with BullMQ & Redis"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Embed Video URL *</label>
                    <input
                      type="url"
                      className="adm-input"
                      placeholder="https://www.youtube.com/embed/..."
                      value={form.videoUrl}
                      onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="adm-label">Duration String</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="e.g. 25m"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Lesson Summary / Notes</label>
                  <textarea
                    className="adm-textarea"
                    rows={3}
                    placeholder="Key concepts, GitHub repo links, or instructions..."
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  />
                </div>

                <label className="adm-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isFreePreview}
                    onChange={(e) => setForm({ ...form, isFreePreview: e.target.checked })}
                  />
                  <span>Allow Free Preview (Unenrolled guests can watch)</span>
                </label>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Video Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

