import { useEffect, useState } from "react";
import {
  FiUserCheck,
  FiPlus,
  FiSearch,
  FiMail,
  FiPhone,
  FiStar,
  FiBookOpen,
  FiCheck,
  FiX,
  FiEdit,
  FiTrash2,
  FiAward
} from "react-icons/fi";
import {
  getInstructors,
  createInstructor,
  updateInstructor,
  updateInstructorStatus,
  deleteInstructor,
  getAdminCourses
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Instructors() {
  const toast = useToast();
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    email: "",
    phone: "",
    avatar: "",
    title: "Senior Engineering Mentor",
    bio: "Ex-enterprise technical lead with extensive real-world experience.",
    expertise: "System Design, React, Microservices",
    status: "approved"
  };
  const [form, setForm] = useState(initialForm);

  const loadData = () => {
    setLoading(true);
    Promise.all([getInstructors(), getAdminCourses()])
      .then(([insRes, courseRes]) => {
        setInstructors(insRes.data?.instructors || []);
        setCourses(courseRes.data?.courses || []);
      })
      .catch((err) => {
        console.error("Instructors load error:", err);
        setInstructors([
          {
            _id: "ins1",
            name: "Dr. Arvind Kashyap",
            email: "arvind.kashyap@techdea.in",
            phone: "+91 98450 11223",
            title: "Principal Cloud Architect & AI Lead",
            bio: "Ex-Google Staff Engineer with 14+ years in distributed systems, machine learning and microservices architecture.",
            expertise: ["System Design", "Kubernetes", "Generative AI", "Go"],
            status: "approved",
            rating: 4.95,
            totalStudents: 1420
          },
          {
            _id: "ins2",
            name: "Pooja Sundaram",
            email: "pooja.sundaram@techdea.in",
            phone: "+91 98210 44556",
            title: "Senior Full Stack Engineering Mentor",
            bio: "Full Stack Specialist and open source contributor passionate about modern React 19, TypeScript and Node.js performance.",
            expertise: ["React", "Next.js", "Node.js", "GraphQL"],
            status: "approved",
            rating: 4.92,
            totalStudents: 1840
          },
          {
            _id: "ins3",
            name: "Vikram Rathore",
            email: "vikram.rathore@techdea.in",
            phone: "+91 99100 77889",
            title: "Lead Cybersecurity Specialist",
            bio: "Certified Ethical Hacker (CEH) with expertise in enterprise penetration testing and DevSecOps pipelines.",
            expertise: ["Penetration Testing", "Cloud Security", "OWASP", "SOC"],
            status: "pending",
            rating: 4.88,
            totalStudents: 620
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingInstructor(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (ins) => {
    setEditingInstructor(ins);
    setForm({
      name: ins.name,
      email: ins.email,
      phone: ins.phone || "",
      avatar: ins.avatar || "",
      title: ins.title || "",
      bio: ins.bio || "",
      expertise: Array.isArray(ins.expertise) ? ins.expertise.join(", ") : ins.expertise || "",
      status: ins.status || "approved"
    });
    setModalOpen(true);
  };

  const handleToggleStatus = async (ins, newStatus) => {
    try {
      await updateInstructorStatus(ins._id, newStatus);
      toast.success(`Instructor status changed to ${newStatus}`);
      setInstructors((prev) =>
        prev.map((i) => (i._id === ins._id ? { ...i, status: newStatus } : i))
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (ins) => {
    if (!window.confirm(`Are you sure you want to delete instructor "${ins.name}"?`)) return;
    try {
      await deleteInstructor(ins._id);
      toast.success("Instructor deleted");
      setInstructors((prev) => prev.filter((i) => i._id !== ins._id));
    } catch (err) {
      toast.error("Failed to delete instructor");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }

    setSubmitting(true);
    const payload = {
      ...form,
      expertise: form.expertise.split(",").map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (editingInstructor) {
        await updateInstructor(editingInstructor._id, payload);
        toast.success("Instructor updated successfully");
      } else {
        await createInstructor(payload);
        toast.success("Instructor profile created");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save instructor");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = instructors.filter((ins) => {
    const matchesSearch =
      ins.name?.toLowerCase().includes(search.toLowerCase()) ||
      ins.email?.toLowerCase().includes(search.toLowerCase()) ||
      ins.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || ins.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">FACULTY & MENTORSHIP</div>
          <h1 className="adm-page-title">Instructor Management</h1>
          <p className="adm-page-desc">
            Manage academic faculty profiles, verify credentials, assign courses, and approve new applicants.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal}>
            <FiPlus /> Add Instructor
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="adm-table-card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div className="adm-table-search" style={{ flex: 1, minWidth: 260 }}>
            <FiSearch style={{ color: "var(--adm-text-muted)" }} />
            <input
              type="text"
              placeholder="Search instructors by name, title, skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="adm-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="approved">Approved Faculty</option>
            <option value="pending">Pending Approval</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiUserCheck style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No instructors found</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
            Add an instructor or approve pending applications.
          </p>
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal} style={{ margin: "0 auto" }}>
            <FiPlus /> Add Instructor
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {filtered.map((ins) => (
            <div key={ins._id} className="adm-card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
                      color: "#FFFFFF",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: 20
                    }}
                  >
                    {ins.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{ins.name}</h3>
                    <div style={{ fontSize: 12, color: "var(--adm-primary)", fontWeight: 600 }}>
                      {ins.title}
                    </div>
                  </div>
                </div>

                <span
                  className={`adm-badge ${
                    ins.status === "approved"
                      ? "adm-badge-success"
                      : ins.status === "pending"
                      ? "adm-badge-warning"
                      : "adm-badge-danger"
                  }`}
                >
                  <span className="adm-badge-dot" /> {ins.status}
                </span>
              </div>

              <p style={{ fontSize: 12.5, color: "var(--adm-text-muted)", margin: "0 0 16px", flex: 1, lineHeight: 1.5 }}>
                {ins.bio || "No professional biography provided."}
              </p>

              {/* Skills Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {(ins.expertise || []).map((exp, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      background: "#FAF9FF",
                      border: "1px solid var(--adm-border)",
                      color: "var(--adm-text-main)",
                      padding: "3px 8px",
                      borderRadius: 6
                    }}
                  >
                    {exp}
                  </span>
                ))}
              </div>

              {/* Metric Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "#FAF9FF",
                  borderRadius: 10,
                  border: "1px solid var(--adm-border)",
                  fontSize: 12,
                  marginBottom: 16
                }}
              >
                <div>
                  <span style={{ color: "var(--adm-text-muted)" }}>Students Mentored: </span>
                  <strong>{ins.totalStudents || 0}</strong>
                </div>
                <div>
                  <span style={{ color: "#EAB308", fontWeight: 700 }}>★ {ins.rating || 4.9}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--adm-border)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {ins.status === "pending" ? (
                    <button
                      type="button"
                      className="adm-top-btn adm-primary-btn"
                      style={{ padding: "4px 10px", fontSize: 12 }}
                      onClick={() => handleToggleStatus(ins, "approved")}
                    >
                      <FiCheck /> Approve Faculty
                    </button>
                  ) : ins.status === "approved" ? (
                    <button
                      type="button"
                      className="adm-btn-icon-sm"
                      onClick={() => handleToggleStatus(ins, "suspended")}
                      title="Suspend Access"
                    >
                      <FiX style={{ color: "#EF4444" }} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="adm-btn-icon-sm"
                      onClick={() => handleToggleStatus(ins, "approved")}
                      title="Re-activate"
                    >
                      <FiCheck style={{ color: "#10B981" }} />
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="adm-btn-icon-sm"
                    onClick={() => openEditModal(ins)}
                    title="Edit Instructor"
                  >
                    <FiEdit />
                  </button>
                  <button
                    type="button"
                    className="adm-btn-icon-sm adm-btn-icon-danger"
                    onClick={() => handleDelete(ins)}
                    title="Delete Instructor"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT INSTRUCTOR MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>{editingInstructor ? "Edit Instructor Profile" : "Add New Instructor"}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Configure academic title, biography, and subject expertise.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body">
                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Full Name *</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="e.g. Dr. Arvind Kashyap"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="adm-label">Email Address *</label>
                    <input
                      type="email"
                      className="adm-input"
                      placeholder="instructor@techdea.in"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Phone</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="+91 98450 11223"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="adm-label">Professional Title</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="e.g. Principal Cloud Architect"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Expertise Tags (Comma-separated)</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="System Design, React, Microservices, Python"
                    value={form.expertise}
                    onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                  />
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Biography</label>
                  <textarea
                    className="adm-textarea"
                    rows={4}
                    placeholder="Professional background, career highlights, and industry experience..."
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Approval Status</label>
                  <select
                    className="adm-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending Review</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Instructor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

