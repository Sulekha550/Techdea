import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiLayers,
  FiVideo,
  FiCheck,
  FiX,
  FiUpload,
  FiStar,
  FiGrid,
  FiList,
  FiDollarSign,
  FiDownload,
  FiHelpCircle
} from "react-icons/fi";
import {
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function AdminCourses() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  // Filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState("basic");
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialForm = {
    name: "",
    category: "Web Development",
    level: "All Levels",
    duration: "10 Weeks",
    shortDescription: "",
    description: "",
    price: 3999,
    discountPrice: 2999,
    isFree: false,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    instructorName: "Dr. Arvind Kashyap",
    instructorTitle: "Principal Systems Architect",
    isPublished: true,
    featured: true,
    whatYouWillLearn: [
      "Master modern enterprise web architecture and scalability patterns",
      "Build production-grade APIs with robust security, logging and caching",
      "Deploy containerized microservices to cloud environments with CI/CD"
    ],
    requirements: [
      "Basic understanding of JavaScript and programming fundamentals",
      "Computer with internet connection and Node.js installed"
    ],
    faqs: [
      {
        question: "Is this course self-paced or cohort-based?",
        answer: "This course offers flexible on-demand video modules along with scheduled live Q&A sessions."
      }
    ]
  };

  const [form, setForm] = useState(initialForm);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAdminCourses(), getCategories()])
      .then(([courseRes, catRes]) => {
        setCourses(courseRes.data?.courses || []);
        setCategories(catRes.data?.categories || []);
      })
      .catch((err) => {
        console.error("Courses load error:", err);
        // Fallback default courses if empty
        setCourses([
          {
            _id: "c1",
            name: "Full-Stack Software Architecture with React & Node",
            category: "Web Development",
            level: "Intermediate",
            duration: "12 Weeks",
            price: 4999,
            discountPrice: 3499,
            thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
            rating: 4.9,
            studentsCount: 1240,
            isPublished: true,
            featured: true,
            moduleCount: 6,
            lessonCount: 42
          },
          {
            _id: "c2",
            name: "Cloud-Native Microservices with Docker & Kubernetes",
            category: "Cloud & DevOps",
            level: "Advanced",
            duration: "10 Weeks",
            price: 5499,
            discountPrice: 3999,
            thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80",
            rating: 4.85,
            studentsCount: 890,
            isPublished: true,
            featured: true,
            moduleCount: 5,
            lessonCount: 36
          },
          {
            _id: "c3",
            name: "Applied Machine Learning & GenAI Engineering",
            category: "Data Science & AI",
            level: "All Levels",
            duration: "14 Weeks",
            price: 6999,
            discountPrice: 4999,
            thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80",
            rating: 4.95,
            studentsCount: 760,
            isPublished: true,
            featured: false,
            moduleCount: 7,
            lessonCount: 48
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    if (searchParams.get("action") === "new") {
      openCreateModal();
    }
  }, [searchParams]);

  const openCreateModal = () => {
    setEditingCourse(null);
    setForm(initialForm);
    setActiveStep("basic");
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      name: course.name,
      category: course.category || "Web Development",
      level: course.level || "All Levels",
      duration: course.duration || "10 Weeks",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      price: course.price || 0,
      discountPrice: course.discountPrice || 0,
      isFree: course.price === 0,
      thumbnail: course.thumbnail || course.image || initialForm.thumbnail,
      instructorName: course.instructor?.name || "TechDea Academy",
      instructorTitle: course.instructor?.title || "Senior Architect",
      isPublished: course.isPublished !== undefined ? course.isPublished : true,
      featured: course.featured !== undefined ? course.featured : false,
      whatYouWillLearn: course.whatYouWillLearn?.length ? course.whatYouWillLearn : initialForm.whatYouWillLearn,
      requirements: course.requirements?.length ? course.requirements : initialForm.requirements,
      faqs: course.faqs?.length ? course.faqs : initialForm.faqs
    });
    setActiveStep("basic");
    setModalOpen(true);
  };

  const handleTogglePublish = async (course) => {
    try {
      const nextStatus = !course.isPublished;
      await updateCourse(course._id, { isPublished: nextStatus });
      toast.success(`Course ${nextStatus ? "Published" : "Moved to Draft"}`);
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? { ...c, isPublished: nextStatus } : c))
      );
    } catch (err) {
      toast.error("Failed to update course status");
    }
  };

  const handleToggleFeature = async (course) => {
    try {
      const nextFeatured = !course.featured;
      await updateCourse(course._id, { featured: nextFeatured });
      toast.success(`Course ${nextFeatured ? "Featured" : "Unfeatured"}`);
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? { ...c, featured: nextFeatured } : c))
      );
    } catch (err) {
      toast.error("Failed to toggle featured status");
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteCourse(course._id);
      toast.success("Course deleted successfully");
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Course title is required");
      setActiveStep("basic");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      level: form.level,
      duration: form.duration,
      shortDescription: form.shortDescription,
      description: form.description,
      price: form.isFree ? 0 : Number(form.price),
      discountPrice: form.isFree ? 0 : Number(form.discountPrice),
      thumbnail: form.thumbnail,
      isPublished: form.isPublished,
      featured: form.featured,
      instructor: {
        name: form.instructorName,
        title: form.instructorTitle
      },
      whatYouWillLearn: form.whatYouWillLearn.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
      faqs: form.faqs.filter((f) => f.question && f.answer)
    };

    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, payload);
        toast.success("Course updated successfully!");
      } else {
        await createCourse(payload);
        toast.success("Course created successfully!");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  // Outcome / FAQ dynamic helper
  const handleAddOutcome = () => {
    setForm((prev) => ({
      ...prev,
      whatYouWillLearn: [...prev.whatYouWillLearn, ""]
    }));
  };

  const handleOutcomeChange = (index, value) => {
    const updated = [...form.whatYouWillLearn];
    updated[index] = value;
    setForm((prev) => ({ ...prev, whatYouWillLearn: updated }));
  };

  const handleRemoveOutcome = (index) => {
    setForm((prev) => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index)
    }));
  };

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "published" && c.isPublished) ||
      (statusFilter === "draft" && !c.isPublished) ||
      (statusFilter === "featured" && c.featured);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = "ID,Name,Category,Level,Price,Discount,Students,Published,Featured\n";
    const rows = filteredCourses
      .map(
        (c) =>
          `"${c._id}","${c.name.replace(/"/g, '""')}","${c.category}","${c.level}",${c.price},${c.discountPrice},${c.studentsCount || 0},${c.isPublished},${c.featured}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TechDea_Courses_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Courses exported to CSV!");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">ACADEMIC ENGINE</div>
          <h1 className="adm-page-title">Course Management</h1>
          <p className="adm-page-desc">
            Create, curate, price, and structure technical curriculum, modules, and learning assets.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn" onClick={handleExportCSV}>
            <FiDownload /> Export CSV
          </button>
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal}>
            <FiPlus /> Create New Course
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="adm-table-card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 280 }}>
            {/* Search */}
            <div className="adm-table-search" style={{ width: 280 }}>
              <FiSearch style={{ color: "var(--adm-text-muted)" }} />
              <input
                type="text"
                placeholder="Search course title, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--adm-text-muted)" }}
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              className="adm-select-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.slug} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="Web Development">Web Development</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Data Science & AI">Data Science & AI</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>

            {/* Status Filter */}
            <select
              className="adm-select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="featured">Featured On Homepage</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--adm-text-muted)", marginRight: 8 }}>
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
            <button
              type="button"
              className={`adm-btn-icon-sm ${viewMode === "grid" ? "adm-primary-btn" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <FiGrid />
            </button>
            <button
              type="button"
              className={`adm-btn-icon-sm ${viewMode === "table" ? "adm-primary-btn" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiBookOpen style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No courses match your filter</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
            Try resetting your search query or create a brand new course now.
          </p>
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal} style={{ margin: "0 auto" }}>
            <FiPlus /> Create New Course
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {filteredCourses.map((c) => (
            <div
              key={c._id}
              className="adm-card"
              style={{
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}
            >
              {/* Thumbnail Header */}
              <div style={{ position: "relative", width: "100%", height: 170, background: "#1F1735" }}>
                <img
                  src={c.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800"}
                  alt={c.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Status Badges */}
                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                  <span className={`adm-badge ${c.isPublished ? "adm-badge-success" : "adm-badge-neutral"}`}>
                    <span className="adm-badge-dot" /> {c.isPublished ? "Published" : "Draft"}
                  </span>
                  {c.featured && (
                    <span className="adm-badge adm-badge-purple">
                      <FiStar style={{ fontSize: 10 }} /> Featured
                    </span>
                  )}
                </div>

                {/* Level Tag */}
                <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                  <span
                    style={{
                      background: "rgba(17, 14, 27, 0.75)",
                      color: "#FFFFFF",
                      backdropFilter: "blur(4px)",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6
                    }}
                  >
                    {c.level || "All Levels"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--adm-primary)", textTransform: "uppercase", marginBottom: 4 }}>
                  {c.category}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--adm-text-main)", margin: "0 0 8px", lineHeight: 1.3 }}>
                  {c.name}
                </h3>
                <p style={{ fontSize: 12.5, color: "var(--adm-text-muted)", margin: "0 0 16px", flex: 1, lineHeight: 1.5 }}>
                  {c.shortDescription || "Comprehensive practical engineering curriculum designed for industry mastery."}
                </p>

                {/* Metrics strip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "#FAF9FF",
                    borderRadius: 10,
                    border: "1px solid var(--adm-border)",
                    marginBottom: 16,
                    fontSize: 12
                  }}
                >
                  <div>
                    <span style={{ color: "var(--adm-text-muted)" }}>Students: </span>
                    <strong style={{ color: "var(--adm-text-main)" }}>{c.studentsCount || 0}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--adm-text-muted)" }}>Modules: </span>
                    <strong style={{ color: "var(--adm-text-main)" }}>{c.moduleCount || 5}</strong>
                  </div>
                  <div>
                    <strong style={{ fontSize: 14, color: "var(--adm-primary)" }}>
                      {c.price === 0 ? "Free" : `₹${c.price?.toLocaleString()}`}
                    </strong>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--adm-border)" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      className="adm-btn-icon-sm"
                      onClick={() => handleTogglePublish(c)}
                      title={c.isPublished ? "Unpublish (Move to draft)" : "Publish Course"}
                    >
                      {c.isPublished ? <FiEye /> : <FiCheck />}
                    </button>
                    <button
                      type="button"
                      className="adm-btn-icon-sm"
                      onClick={() => handleToggleFeature(c)}
                      title={c.featured ? "Remove from Homepage" : "Feature on Homepage"}
                    >
                      <FiStar style={{ color: c.featured ? "#EAB308" : undefined }} />
                    </button>
                    <Link
                      to={`/admin/modules?course=${c._id}`}
                      className="adm-btn-icon-sm"
                      title="Manage Curriculum Modules"
                    >
                      <FiLayers />
                    </Link>
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      className="adm-btn-icon-sm"
                      onClick={() => openEditModal(c)}
                      title="Edit Course"
                    >
                      <FiEdit />
                    </button>
                    <button
                      type="button"
                      className="adm-btn-icon-sm adm-btn-icon-danger"
                      onClick={() => handleDelete(c)}
                      title="Delete Course"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="adm-user-cell">
                        <img
                          src={c.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120"}
                          alt=""
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }}
                        />
                        <div className="adm-user-cell-meta">
                          <div className="adm-user-cell-name">{c.name}</div>
                          <div className="adm-user-cell-sub">
                            {c.duration} · {c.instructor?.name || "TechDea Faculty"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-neutral">{c.category}</span>
                    </td>
                    <td>{c.level || "All Levels"}</td>
                    <td>
                      <strong style={{ color: "var(--adm-primary)" }}>
                        {c.price === 0 ? "Free" : `₹${c.price?.toLocaleString()}`}
                      </strong>
                    </td>
                    <td>{c.studentsCount || 0}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(c)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <span className={`adm-badge ${c.isPublished ? "adm-badge-success" : "adm-badge-neutral"}`}>
                          <span className="adm-badge-dot" /> {c.isPublished ? "Published" : "Draft"}
                        </span>
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(c)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <span className={`adm-badge ${c.featured ? "adm-badge-purple" : "adm-badge-neutral"}`}>
                          <FiStar style={{ fontSize: 11 }} /> {c.featured ? "Featured" : "Standard"}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div className="adm-action-group" style={{ justifyContent: "flex-end" }}>
                        <Link
                          to={`/admin/modules?course=${c._id}`}
                          className="adm-btn-icon-sm"
                          title="Curriculum Modules"
                        >
                          <FiLayers />
                        </Link>
                        <button
                          type="button"
                          className="adm-btn-icon-sm"
                          onClick={() => openEditModal(c)}
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          type="button"
                          className="adm-btn-icon-sm adm-btn-icon-danger"
                          onClick={() => handleDelete(c)}
                          title="Delete"
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

      {/* MULTI-STEP COURSE BUILDER MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="adm-modal-container adm-modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="adm-modal-header">
              <div>
                <h3>{editingCourse ? "Edit Course Curriculum" : "Create New Course"}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Configure basic info, curriculum structure, pricing and multimedia.
                </div>
              </div>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            {/* Step Tabs Navigation */}
            <div style={{ padding: "0 28px", background: "#FAF9FF", borderBottom: "1px solid var(--adm-border)" }}>
              <div className="adm-step-tabs" style={{ margin: 0 }}>
                {[
                  { id: "basic", label: "1. Basic Details" },
                  { id: "pricing", label: "2. Pricing & Access" },
                  { id: "media", label: "3. Media & Thumbnail" },
                  { id: "curriculum", label: "4. Learning Outcomes" },
                  { id: "faqs", label: "5. Student FAQs" }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`adm-step-tab ${activeStep === s.id ? "active" : ""}`}
                    onClick={() => setActiveStep(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveCourse} className="adm-modal-body">
              {/* STEP 1: BASIC DETAILS */}
              {activeStep === "basic" && (
                <div>
                  <div className="adm-form-row">
                    <label className="adm-label">Course Title *</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="e.g. Full-Stack Software Architecture with React & Node.js"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="adm-form-grid-3 adm-form-row">
                    <div>
                      <label className="adm-label">Category</label>
                      <select
                        className="adm-select"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                        <option value="Data Science & AI">Data Science & AI</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                      </select>
                    </div>

                    <div>
                      <label className="adm-label">Difficulty Level</label>
                      <select
                        className="adm-select"
                        value={form.level}
                        onChange={(e) => setForm({ ...form, level: e.target.value })}
                      >
                        <option value="All Levels">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="adm-label">Duration</label>
                      <input
                        type="text"
                        className="adm-input"
                        placeholder="e.g. 10 Weeks"
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="adm-form-row">
                    <label className="adm-label">Short Elevator Pitch (Displayed on cards)</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="Brief one-sentence summary for search engines and cards..."
                      value={form.shortDescription}
                      onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-row">
                    <label className="adm-label">Full Course Overview & Syllabus Description</label>
                    <textarea
                      className="adm-textarea"
                      rows={5}
                      placeholder="Detailed markdown description of the course..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-grid-2 adm-form-row">
                    <div>
                      <label className="adm-label">Lead Faculty / Instructor Name</label>
                      <input
                        type="text"
                        className="adm-input"
                        value={form.instructorName}
                        onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="adm-label">Instructor Professional Title</label>
                      <input
                        type="text"
                        className="adm-input"
                        value={form.instructorTitle}
                        onChange={(e) => setForm({ ...form, instructorTitle: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
                    <label className="adm-checkbox-label">
                      <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      />
                      <span>Publish live immediately to students</span>
                    </label>

                    <label className="adm-checkbox-label">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      />
                      <span>Feature on TechDea Homepage</span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 2: PRICING & ENROLLMENT */}
              {activeStep === "pricing" && (
                <div>
                  <div
                    style={{
                      padding: "16px",
                      background: "var(--adm-primary-soft)",
                      borderRadius: 12,
                      border: "1px solid var(--adm-border)",
                      marginBottom: 20
                    }}
                  >
                    <label className="adm-checkbox-label" style={{ fontWeight: 700 }}>
                      <input
                        type="checkbox"
                        checked={form.isFree}
                        onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
                      />
                      <span>Make this a 100% Free Open Course</span>
                    </label>
                    <div style={{ fontSize: 12, color: "var(--adm-text-muted)", marginLeft: 26, marginTop: 4 }}>
                      Free courses do not require payment gateway verification. Students can enroll with 1-click.
                    </div>
                  </div>

                  {!form.isFree && (
                    <div className="adm-form-grid-2 adm-form-row">
                      <div>
                        <label className="adm-label">Standard Regular Price (INR ₹)</label>
                        <input
                          type="number"
                          className="adm-input"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          min={0}
                        />
                      </div>

                      <div>
                        <label className="adm-label">Discounted / Offer Price (INR ₹)</label>
                        <input
                          type="number"
                          className="adm-input"
                          value={form.discountPrice}
                          onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                          min={0}
                        />
                        <small style={{ color: "var(--adm-text-muted)", fontSize: 11 }}>
                          Strikethrough price will be ₹{form.price}
                        </small>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      padding: "14px 18px",
                      background: "#FAF9FF",
                      borderRadius: 12,
                      border: "1px solid var(--adm-border)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12
                    }}
                  >
                    <FiDollarSign style={{ fontSize: 24, color: "var(--adm-primary)" }} />
                    <div style={{ fontSize: 13, color: "var(--adm-text-muted)" }}>
                      Transactions are automatically processed through Razorpay / UPI in INR.
                      Invoices and access credentials are generated in real-time.
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: MEDIA & THUMBNAIL */}
              {activeStep === "media" && (
                <div>
                  <div className="adm-form-row">
                    <label className="adm-label">Course Thumbnail Image URL</label>
                    <input
                      type="url"
                      className="adm-input"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={form.thumbnail}
                      onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    />
                  </div>

                  {/* Thumbnail Preview */}
                  {form.thumbnail && (
                    <div className="adm-form-row">
                      <label className="adm-label">Thumbnail Preview</label>
                      <div
                        style={{
                          width: "100%",
                          maxWidth: 420,
                          height: 220,
                          borderRadius: 12,
                          overflow: "hidden",
                          border: "2px solid var(--adm-border)",
                          boxShadow: "var(--adm-shadow)"
                        }}
                      >
                        <img
                          src={form.thumbnail}
                          alt="Thumbnail preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800";
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                    <span style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>Quick presets:</span>
                    {[
                      { label: "Code & Software", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800" },
                      { label: "Cloud Architecture", url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800" },
                      { label: "AI & Neural Networks", url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800" }
                    ].map((pre) => (
                      <button
                        key={pre.label}
                        type="button"
                        onClick={() => setForm({ ...form, thumbnail: pre.url })}
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid var(--adm-border)",
                          borderRadius: 6,
                          padding: "3px 8px",
                          fontSize: 11.5,
                          cursor: "pointer",
                          fontWeight: 600
                        }}
                      >
                        {pre.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: CURRICULUM & OUTCOMES */}
              {activeStep === "curriculum" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>"What You Will Learn" Key Outcomes</h4>
                      <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>Bullet points shown on the course sales page</div>
                    </div>
                    <button
                      type="button"
                      className="adm-top-btn"
                      onClick={handleAddOutcome}
                      style={{ padding: "6px 12px", fontSize: 12 }}
                    >
                      <FiPlus /> Add Outcome
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                    {form.whatYouWillLearn.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: "var(--adm-primary)", fontWeight: 800 }}>✓</span>
                        <input
                          type="text"
                          className="adm-input"
                          value={item}
                          onChange={(e) => handleOutcomeChange(idx, e.target.value)}
                          placeholder={`Learning objective #${idx + 1}`}
                        />
                        {form.whatYouWillLearn.length > 1 && (
                          <button
                            type="button"
                            className="adm-btn-icon-sm adm-btn-icon-danger"
                            onClick={() => handleRemoveOutcome(idx)}
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {editingCourse && (
                    <div
                      style={{
                        padding: "16px",
                        background: "#FAF9FF",
                        borderRadius: 12,
                        border: "1px solid var(--adm-border)",
                        marginTop: 20
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong style={{ fontSize: 13 }}>Organize Modules & Video Lessons</strong>
                          <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                            Directly structure modules and upload lesson videos
                          </div>
                        </div>
                        <Link
                          to={`/admin/modules?course=${editingCourse._id}`}
                          className="adm-top-btn adm-primary-btn"
                          style={{ padding: "6px 12px", fontSize: 12 }}
                        >
                          <FiLayers /> Open Curriculum Builder →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: FAQS */}
              {activeStep === "faqs" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Frequently Asked Questions</h4>
                      <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>Common queries answered on course page</div>
                    </div>
                    <button
                      type="button"
                      className="adm-top-btn"
                      onClick={() =>
                        setForm({
                          ...form,
                          faqs: [...form.faqs, { question: "", answer: "" }]
                        })
                      }
                      style={{ padding: "6px 12px", fontSize: 12 }}
                    >
                      <FiPlus /> Add FAQ
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: 14 }}>
                    {form.faqs.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "14px",
                          borderRadius: 12,
                          background: "#FAF9FF",
                          border: "1px solid var(--adm-border)"
                        }}
                      >
                        <div className="adm-form-row">
                          <label className="adm-label">Question #{i + 1}</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={f.question}
                            onChange={(e) => {
                              const updated = [...form.faqs];
                              updated[i].question = e.target.value;
                              setForm({ ...form, faqs: updated });
                            }}
                            placeholder="e.g. Do I get a verified certificate upon completion?"
                          />
                        </div>
                        <div className="adm-form-row" style={{ marginBottom: 6 }}>
                          <label className="adm-label">Answer</label>
                          <textarea
                            className="adm-textarea"
                            rows={2}
                            value={f.answer}
                            onChange={(e) => {
                              const updated = [...form.faqs];
                              updated[i].answer = e.target.value;
                              setForm({ ...form, faqs: updated });
                            }}
                            placeholder="e.g. Yes! You receive an industry-recognized cryptographic credential..."
                          />
                        </div>
                        {form.faqs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setForm({
                                ...form,
                                faqs: form.faqs.filter((_, idx) => idx !== i)
                              });
                            }}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#EF4444",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              padding: 0
                            }}
                          >
                            Remove this FAQ
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="adm-modal-footer">
                <button
                  type="button"
                  className="adm-top-btn"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-top-btn adm-primary-btn"
                  disabled={submitting}
                >
                  {submitting ? "Saving Course..." : editingCourse ? "Save Changes" : "Publish Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
