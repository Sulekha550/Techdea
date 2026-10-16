import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import {
  getAdminCourses,
  getAdminModules,
  createModule,
  updateModule,
  deleteModule
} from "../../services/adminService.js";
import Loader from "../../components/common/Loader.jsx";

export default function AdminModules() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    course: "",
    title: "",
    description: "",
    order: 1
  });

  // Load courses for selector
  useEffect(() => {
    getAdminCourses().then((res) => {
      const cList = res.data?.courses || [];
      setCourses(cList);
      if (cList.length > 0 && !selectedCourseId) {
        setSelectedCourseId(cList[0]._id);
      }
    });
  }, []);

  // Load modules for selected course
  const loadModules = () => {
    if (!selectedCourseId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getAdminModules(selectedCourseId)
      .then((res) => setModules(res.data?.modules || []))
      .catch((err) => console.error("Modules error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadModules();
  }, [selectedCourseId]);

  const openCreateModal = () => {
    setEditingModule(null);
    setForm({
      course: selectedCourseId,
      title: "",
      description: "",
      order: modules.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (mod) => {
    setEditingModule(mod);
    setForm({
      course: mod.course?._id || selectedCourseId,
      title: mod.title,
      description: mod.description || "",
      order: mod.order || 1
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingModule) {
        await updateModule(editingModule._id, form);
      } else {
        await createModule(form);
      }
      setModalOpen(false);
      loadModules();
    } catch (err) {
      alert("Failed to save module: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Delete module "${title}"?`)) {
      try {
        await deleteModule(id);
        loadModules();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <div className="eyebrow">CURRICULUM CMS</div>
          <h1>Modules Management</h1>
          <p>Organize courses into sequential learning modules and units.</p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" className="btn btn-primary" onClick={openCreateModal}>
            <FiPlus /> Add Module
          </button>
        </div>
      </div>

      {/* Course Selector Filter */}
      <div style={{ margin: "0 36px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <strong style={{ fontSize: 14 }}>Filter by Course:</strong>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          style={{ maxWidth: 360 }}
        >
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: "60px 36px" }}><Loader /></div>
      ) : (
        <>
        {modules.length > 0 && (
          <div className="curriculum-builder" style={{ margin: "0 36px 24px" }}>
            {modules.map((m, idx) => (
              <div className="module-builder-card" key={m._id}>
                <strong>Module {String(idx + 1).padStart(2, "0")}</strong>
                <h3 style={{ margin: "4px 0 8px" }}>{m.title}</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>{m.lectureCount || 0} lessons · Edit or add lessons in Lessons.</p>
              </div>
            ))}
          </div>
        )}
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Module Title</th>
                <th>Course</th>
                <th>Lessons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.length > 0 ? (
                modules.map((m) => (
                  <tr key={m._id}>
                    <td style={{ fontWeight: 800, color: "var(--primary)" }}>#{m.order}</td>
                    <td>
                      <strong>{m.title}</strong>
                      {m.description && (
                        <small style={{ display: "block", color: "var(--muted)" }}>
                          {m.description}
                        </small>
                      )}
                    </td>
                    <td>{m.course?.name || "—"}</td>
                    <td>
                      <span className="badge badge-read">{m.lectureCount || 0} Lessons</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => openEditModal(m)}
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(m._id, m.title)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-empty">
                    No modules found for this course. Click "+ Add Module" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
      )}

      {/* Module Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editingModule ? "Edit Module" : "Create Module"}</h2>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
              <label>
                Target Course *
                <select
                  required
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Module Title *
                <input
                  required
                  placeholder="e.g. Module 1: Architecture & Foundations"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>

              <label>
                Order Sequence
                <input
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </label>

              <label>
                Description / Objectives
                <textarea
                  rows={3}
                  placeholder="Outline key topics covered in this module..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={submitting}
                style={{ marginTop: 10 }}
              >
                {submitting ? "Saving..." : editingModule ? "Update Module" : "Create Module"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}