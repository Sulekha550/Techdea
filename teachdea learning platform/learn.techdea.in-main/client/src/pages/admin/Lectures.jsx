import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiPlayCircle, FiFileText, FiX, FiCheck } from "react-icons/fi";
import {
  getAdminCourses,
  getAdminModules,
  getAdminLectures,
  createLecture,
  updateLecture,
  deleteLecture
} from "../../services/adminService.js";
import Loader from "../../components/common/Loader.jsx";

export default function AdminLectures() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    module: "",
    title: "",
    description: "",
    contentType: "video",
    videoId: "",
    videoUrl: "",
    content: "",
    pdfUrl: "",
    noteUrl: "",
    duration: "15 min",
    order: 1,
    isPreview: false,
    isPublished: true
  };

  const [form, setForm] = useState(initialForm);

  // Load courses
  useEffect(() => {
    getAdminCourses().then((res) => {
      const cList = res.data?.courses || [];
      setCourses(cList);
      if (cList.length > 0 && !selectedCourseId) {
        setSelectedCourseId(cList[0]._id);
      }
    });
  }, []);

  // When selectedCourseId changes, load its modules
  useEffect(() => {
    if (!selectedCourseId) return;
    getAdminModules(selectedCourseId).then((res) => {
      const mList = res.data?.modules || [];
      setModules(mList);
      setSelectedModuleId(mList.length > 0 ? mList[0]._id : "");
    });
  }, [selectedCourseId]);

  // Load lectures
  const loadLectures = () => {
    setLoading(true);
    getAdminLectures(selectedModuleId || undefined)
      .then((res) => {
        setLectures(res.data?.lectures || []);
      })
      .catch((err) => console.error("Lectures load error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLectures();
  }, [selectedModuleId]);

  const openCreateModal = () => {
    setEditingLecture(null);
    setForm({
      ...initialForm,
      module: selectedModuleId || (modules[0]?._id || ""),
      order: lectures.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (lec) => {
    setEditingLecture(lec);
    setForm({
      module: lec.module?._id || selectedModuleId,
      title: lec.title,
      description: lec.description || "",
      contentType: lec.contentType || "video",
      videoId: lec.videoId || "",
      videoUrl: lec.videoUrl || "",
      content: lec.content || "",
      pdfUrl: lec.pdfUrl || "",
      noteUrl: lec.noteUrl || "",
      duration: lec.duration || "15 min",
      order: lec.order || 1,
      isPreview: Boolean(lec.isPreview),
      isPublished: Boolean(lec.isPublished)
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingLecture) {
        await updateLecture(editingLecture._id, form);
      } else {
        await createLecture(form);
      }
      setModalOpen(false);
      loadLectures();
    } catch (err) {
      alert("Failed to save lesson: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Delete lesson "${title}"?`)) {
      try {
        await deleteLecture(id);
        loadLectures();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <div className="eyebrow">LESSON CONTENT CMS</div>
          <h1>Lessons & Content Manager</h1>
          <p>Add video lectures, text articles, PDF notes, and preview access.</p>
        </div>

        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          <FiPlus /> Add Lesson
        </button>
      </div>

      {/* Filter Toolbar */}
      <div style={{ margin: "0 36px 24px", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <strong style={{ fontSize: 13 }}>Course:</strong>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            style={{ maxWidth: 280 }}
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <strong style={{ fontSize: 13 }}>Module:</strong>
          <select
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            style={{ maxWidth: 280 }}
          >
            <option value="">All Modules in Course</option>
            {modules.map((m) => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 36px" }}><Loader /></div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Module</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Preview</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.length > 0 ? (
                lectures.map((lec) => (
                  <tr key={lec._id}>
                    <td style={{ fontWeight: 800, color: "var(--primary)" }}>#{lec.order}</td>
                    <td>
                      <strong>{lec.title}</strong>
                      {lec.videoId && (
                        <small style={{ display: "block", color: "var(--muted)", fontFamily: "monospace" }}>
                          YT: {lec.videoId}
                        </small>
                      )}
                    </td>
                    <td>{lec.module?.title || "—"}</td>
                    <td>
                      <span className="lesson-type-badge">
                        {lec.contentType || "Video"}
                      </span>
                    </td>
                    <td>{lec.duration || "—"}</td>
                    <td>
                      {lec.isPreview ? (
                        <span className="badge badge-replied">Free Preview</span>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: 12 }}>Enrolled Only</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${lec.isPublished ? "badge-replied" : "badge-closed"}`}>
                        {lec.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => openEditModal(lec)}
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(lec._id, lec.title)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="table-empty">
                    No lessons found in this module. Click "+ Add Lesson" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Lesson Create / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editingLecture ? "Edit Lesson" : "Create New Lesson"}</h2>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
                <label>
                  Module *
                  <select
                    required
                    value={form.module}
                    onChange={(e) => setForm({ ...form, module: e.target.value })}
                  >
                    <option value="">Select target module</option>
                    {modules.map((m) => (
                      <option key={m._id} value={m._id}>{m.title}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Content Type
                  <select
                    value={form.contentType}
                    onChange={(e) => setForm({ ...form, contentType: e.target.value })}
                  >
                    <option value="video">Video Lecture</option>
                    <option value="text">Text / Documentation</option>
                    <option value="pdf">PDF Resource</option>
                    <option value="resource">External Material</option>
                  </select>
                </label>
              </div>

              <label>
                Lesson Title *
                <input
                  required
                  placeholder="e.g. 01. React 19 State Architecture"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label>
                  YouTube Video ID (or URL)
                  <input
                    placeholder="e.g. bMknfKXIFA8"
                    value={form.videoId}
                    onChange={(e) => setForm({ ...form, videoId: e.target.value })}
                  />
                </label>

                <label>
                  Duration (mins)
                  <input
                    placeholder="e.g. 20 min"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label>
                  Downloadable PDF Guide URL
                  <input
                    placeholder="https://drive.google.com/... or /pdf"
                    value={form.pdfUrl}
                    onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                  />
                </label>

                <label>
                  Notes / Docs Link
                  <input
                    placeholder="https://developer.mozilla.org/..."
                    value={form.noteUrl}
                    onChange={(e) => setForm({ ...form, noteUrl: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Lesson Description
                <textarea
                  rows={2}
                  placeholder="Summary of concepts learned in this lesson..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>

              {form.contentType === "text" && (
                <label>
                  Full Lesson Text / Guide Content
                  <textarea
                    rows={6}
                    placeholder="Write detailed technical guide, code blocks, or notes..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                </label>
              )}

              <div style={{ display: "flex", gap: 20, margin: "6px 0", flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    style={{ width: "auto" }}
                    checked={form.isPreview}
                    onChange={(e) => setForm({ ...form, isPreview: e.target.checked })}
                  />
                  <span>Free Preview (Visible to unenrolled students)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    style={{ width: "auto" }}
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  />
                  <span>Published (Active in curriculum)</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={submitting}
                style={{ marginTop: 10 }}
              >
                {submitting ? "Saving..." : editingLecture ? "Update Lesson" : "Create Lesson"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}