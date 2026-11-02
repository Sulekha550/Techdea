import { useEffect, useState } from "react";
import {
  FiGrid,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiStar,
  FiBookOpen,
  FiCode,
  FiCpu,
  FiGlobe,
  FiSmartphone,
  FiShield,
  FiLayout
} from "react-icons/fi";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Categories() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({
    name: "",
    icon: "code",
    description: "",
    featured: true,
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setCategories(res.data?.categories || []);
      })
      .catch((err) => {
        console.error("Categories error:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      icon: "code",
      description: "",
      featured: true,
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      icon: cat.icon || "code",
      description: cat.description || "",
      featured: cat.featured !== undefined ? cat.featured : true,
      isActive: cat.isActive !== undefined ? cat.isActive : true
    });
    setModalOpen(true);
  };

  const handleToggleFeatured = async (cat) => {
    try {
      const nextFeatured = !cat.featured;
      await updateCategory(cat._id, { featured: nextFeatured });
      toast.success(`Category ${nextFeatured ? "Featured on Homepage" : "Unfeatured"}`);
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, featured: nextFeatured } : c))
      );
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat._id);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, form);
        toast.success("Category updated");
      } else {
        await createCategory(form);
        toast.success("Category created successfully");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "cpu":
        return <FiCpu />;
      case "globe":
        return <FiGlobe />;
      case "smartphone":
        return <FiSmartphone />;
      case "shield":
        return <FiShield />;
      case "layout":
        return <FiLayout />;
      default:
        return <FiCode />;
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">CURRICULUM TAXONOMY</div>
          <h1 className="adm-page-title">Categories Management</h1>
          <p className="adm-page-desc">
            Organize TechDea's engineering disciplines, topics, and featured subjects.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal}>
            <FiPlus /> Add New Category
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {categories.map((cat) => (
            <div key={cat._id} className="adm-card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "var(--adm-primary-soft)",
                      color: "var(--adm-primary)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 20
                    }}
                  >
                    {getIconComponent(cat.icon)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{cat.name}</h3>
                    <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                      Slug: /{cat.slug}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFeatured(cat)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                  title="Toggle Homepage Showcase"
                >
                  <span className={`adm-badge ${cat.featured ? "adm-badge-purple" : "adm-badge-neutral"}`}>
                    <FiStar style={{ fontSize: 10 }} /> {cat.featured ? "Featured" : "Standard"}
                  </span>
                </button>
              </div>

              <p style={{ fontSize: 12.5, color: "var(--adm-text-muted)", margin: "0 0 16px", flex: 1, lineHeight: 1.5 }}>
                {cat.description || "Core engineering category covering modern concepts and hands-on laboratory exercises."}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "#FAF9FF",
                  borderRadius: 10,
                  border: "1px solid var(--adm-border)",
                  fontSize: 12,
                  marginBottom: 14
                }}
              >
                <div>
                  <span style={{ color: "var(--adm-text-muted)" }}>Courses Catalog: </span>
                  <strong style={{ color: "var(--adm-primary)" }}>{cat.coursesCount || 4} active</strong>
                </div>
                <span className="adm-badge adm-badge-success">Active</span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 10, borderTop: "1px solid var(--adm-border)" }}>
                <button
                  type="button"
                  className="adm-btn-icon-sm"
                  onClick={() => openEditModal(cat)}
                  title="Edit Category"
                >
                  <FiEdit />
                </button>
                <button
                  type="button"
                  className="adm-btn-icon-sm adm-btn-icon-danger"
                  onClick={() => handleDelete(cat)}
                  title="Delete Category"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT CATEGORY MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>{editingCategory ? "Edit Category" : "Add Course Category"}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Configure category title, icon and homepage display.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Category Name *</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. Cloud & DevOps Engineering"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Category Icon</label>
                  <select
                    className="adm-select"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  >
                    <option value="code">Code / Web Engineering</option>
                    <option value="cpu">CPU / AI & Data Science</option>
                    <option value="globe">Globe / Cloud Infrastructure</option>
                    <option value="smartphone">Smartphone / Mobile Applications</option>
                    <option value="shield">Shield / Cybersecurity</option>
                    <option value="layout">Layout / UI/UX Design</option>
                  </select>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Description</label>
                  <textarea
                    className="adm-textarea"
                    rows={3}
                    placeholder="Summary of skills and tools covered in this category..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <label className="adm-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  <span>Feature on public TechDea homepage</span>
                </label>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

