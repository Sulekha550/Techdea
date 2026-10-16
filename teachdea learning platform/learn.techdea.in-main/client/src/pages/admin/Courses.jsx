import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiX, FiCheck } from "react-icons/fi";
import {
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from "../../services/adminService.js";
import Loader from "../../components/common/Loader.jsx";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formTab, setFormTab] = useState("basic");
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    category: "Full Stack Development",
    shortDescription: "",
    description: "",
    duration: "10 Weeks",
    level: "All Levels",
    price: 0,
    discountPrice: 0,
    thumbnail: "",
    instructorName: "TechDea Academy",
    instructorTitle: "Senior Architect",
    isPublished: true
  };

  const [form, setForm] = useState(initialForm);

  const loadData = () => {
    setLoading(true);
    getAdminCourses()
      .then((res) => setCourses(res.data?.courses || []))
      .catch((err) => console.error("Courses load error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setForm(initialForm);
    setFormTab("basic");
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      name: course.name,
      category: course.category || "Full Stack Development",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      duration: course.duration || "10 Weeks",
      level: course.level || "All Levels",
      price: course.price || 0,
      discountPrice: course.discountPrice || 0,
      thumbnail: course.thumbnail || course.image || "",
      instructorName: course.instructor?.name || "TechDea Academy",
      instructorTitle: course.instructor?.title || "Senior Architect",
      isPublished: Boolean(course.isPublished)
    });
    setFormTab("basic");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: form.name,
      category: form.category,
      shortDescription: form.shortDescription,
      description: form.description,
      duration: form.duration,
      level: form.level,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice),
      thumbnail: form.thumbnail,
      image: form.thumbnail,
      instructor: {
        name: form.instructorName,
        title: form.instructorTitle
      },
      isPublished: form.isPublished
    };

    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, payload);
      } else {
        await createCourse(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert("Error saving course: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to deactivate course "${name}"?`)) {
      try {
        await deleteCourse(id);
        loadData();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  const togglePublish = async (course) => {
    try {
      await updateCourse(course._id, { isPublished: !course.isPublished });
      loadData();
    } catch (err) {
      alert("Failed to toggle status: " + err.message);
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <div className="eyebrow">COURSE MANAGEMENT</div>
          <h1>Courses Catalog CMS</h1>
          <p>Create, update, publish, and structure technical courses.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          <FiPlus /> Add New Course
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px 36px" }}><Loader /></div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Course Name</th>
                <th>Category</th>
                <th>Level</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((c) => (
                  <tr key={c._id}>
                    <td style={{ width: 80 }}>
                      <img
                        src={c.thumbnail || c.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&auto=format&fit=crop"}
                        alt={c.name}
                        style={{ width: 64, height: 40, borderRadius: 6, objectFit: "cover" }}
                      />
                    </td>
                    <td>
                      <strong>{c.name}</strong>
                      <small style={{ display: "block", color: "var(--muted)" }}>
                        {c.modulesCount || 0} modules · {c.lessonsCount || 0} lessons
                      </small>
                    </td>
                    <td>{c.category || c.branch || "—"}</td>
                    <td><span className="badge badge-read">{c.level || "All"}</span></td>
                    <td>
                      {c.price > 0 ? `₹${c.discountPrice || c.price}` : <span style={{ color: "var(--success)", fontWeight: 700 }}>Free</span>}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge ${c.isPublished ? "badge-replied" : "badge-closed"}`}
                        style={{ border: 0, cursor: "pointer" }}
                        onClick={() => togglePublish(c)}
                        title="Click to toggle publish"
                      >
                        {c.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => openEditModal(c)}
                        title="Edit course"
                      >
                        <FiEdit /> Edit
                      </button>
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(c._id, c.name)}
                        title="Deactivate course"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="table-empty">
                    No courses found. Click "+ Add New Course" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Course Create / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editingCourse ? "Edit Course" : "Create New Course"}</h2>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="form-tabs" role="tablist">
              {[
                ["basic", "Basic"],
                ["details", "Details"],
                ["media", "Media"],
                ["publish", "Publishing"]
              ].map(([id, label]) => (
                <button key={id} type="button" className={`form-tab ${formTab === id ? "active" : ""}`} onClick={() => setFormTab(id)}>
                  {label}
                </button>
              ))}
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
              {formTab === "basic" && (
                <>
              <label>
                Course Title *
                <input
                  placeholder="e.g. Modern Full-Stack Web Development"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <div className="form-row-2">
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Technology">Technology</option>
                  </select>
                </label>

                <label>
                  Level
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </label>
              </div>
              <label>
                Short Description
                <input
                  placeholder="Brief overview for catalog cards..."
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                />
              </label>
              <label>
                Detailed Description
                <textarea
                  rows={4}
                  placeholder="Comprehensive course outline..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
                </>
              )}

              {formTab === "details" && (
                <>
              <div className="form-row-3">
                <label>
                  Duration
                  <input
                    placeholder="e.g. 10 Weeks"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </label>
                <label>
                  Price (₹) [0 = Free]
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </label>
                <label>
                  Discount Price (₹)
                  <input
                    type="number"
                    min={0}
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  />
                </label>
              </div>
              <div className="form-row-2">
                <label>
                  Instructor Name
                  <input
                    value={form.instructorName}
                    onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                  />
                </label>
                <label>
                  Instructor Title
                  <input
                    value={form.instructorTitle}
                    onChange={(e) => setForm({ ...form, instructorTitle: e.target.value })}
                  />
                </label>
              </div>
                </>
              )}

              {formTab === "media" && (
              <label>
                Thumbnail Image URL
                <input
                  placeholder="https://..."
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                />
              </label>
              )}

              {formTab === "publish" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}>
                <input
                  type="checkbox"
                  id="publishedCheckbox"
                  style={{ width: "auto" }}
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                />
                <label htmlFor="publishedCheckbox" style={{ cursor: "pointer", display: "inline" }}>
                  Published (visible on the public catalog)
                </label>
              </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={submitting}
                style={{ marginTop: 12 }}
              >
                {submitting ? "Saving..." : editingCourse ? "Save Changes" : "Create Course"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}