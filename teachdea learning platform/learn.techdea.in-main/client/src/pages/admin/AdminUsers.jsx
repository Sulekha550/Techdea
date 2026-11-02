import { useEffect, useState } from "react";
import {
  FiShield,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUserCheck,
  FiLock,
  FiX
} from "react-icons/fi";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function AdminUsers() {
  const toast = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "AdminPassword123!",
    role: "admin",
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    getAdminUsers()
      .then((res) => {
        setAdmins(res.data?.admins || []);
      })
      .catch((err) => {
        console.error("Admin users load error:", err);
        setAdmins([
          {
            _id: "adm_1",
            name: "TechDea Administrator",
            email: "admin@techdea.in",
            role: "superadmin",
            isActive: true,
            createdAt: new Date()
          },
          {
            _id: "adm_2",
            name: "Dr. Arvind Kashyap",
            email: "arvind.kashyap@techdea.in",
            role: "admin",
            isActive: true,
            createdAt: new Date(Date.now() - 3600000 * 24 * 30)
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingAdmin(null);
    setForm({
      name: "",
      email: "",
      password: "AdminPassword123!",
      role: "admin",
      isActive: true
    });
    setModalOpen(true);
  };

  const openEditModal = (a) => {
    setEditingAdmin(a);
    setForm({
      name: a.name,
      email: a.email,
      password: "",
      role: a.role || "admin",
      isActive: a.isActive !== false
    });
    setModalOpen(true);
  };

  const handleDelete = async (a) => {
    if (!window.confirm(`Permanently remove administrator permissions for ${a.name}?`)) return;
    try {
      await deleteAdminUser(a._id);
      toast.success("Admin user deleted");
      setAdmins((prev) => prev.filter((item) => item._id !== a._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete admin");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingAdmin) {
        await updateAdminUser(editingAdmin._id, {
          name: form.name,
          role: form.role,
          isActive: form.isActive
        });
        toast.success("Admin role updated successfully");
      } else {
        await createAdminUser(form);
        toast.success("New administrator added successfully");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save admin user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">ACCESS CONTROL & SECURITY</div>
          <h1 className="adm-page-title">Admin Users & Roles</h1>
          <p className="adm-page-desc">
            Manage administrative team members, grant role-based console permissions, and audit security credentials.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal}>
            <FiPlus /> Add Admin User
          </button>
        </div>
      </div>

      {/* Permissions Matrix Overview */}
      <div
        style={{
          padding: "18px 24px",
          background: "#FAF9FF",
          borderRadius: 14,
          border: "1px solid var(--adm-border)",
          marginBottom: 24,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16
        }}
      >
        <div>
          <strong style={{ fontSize: 13, color: "var(--adm-primary)" }}>🛡️ Super Admin</strong>
          <div style={{ fontSize: 12, color: "var(--adm-text-muted)", marginTop: 2 }}>
            Unrestricted access across courses, financial refunds, users, and platform settings.
          </div>
        </div>
        <div>
          <strong style={{ fontSize: 13, color: "#10B981" }}>🎓 Academic Director</strong>
          <div style={{ fontSize: 12, color: "var(--adm-text-muted)", marginTop: 2 }}>
            Full access to Courses, Modules, Video Lessons, Quizzes, and Certificates.
          </div>
        </div>
        <div>
          <strong style={{ fontSize: 13, color: "#3B82F6" }}>💳 Operations Admin</strong>
          <div style={{ fontSize: 12, color: "var(--adm-text-muted)", marginTop: 2 }}>
            Student management, enrollments, support inquiries, and coupons.
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : (
        <div className="adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Administrator</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                  <th>Created On</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((adm) => (
                  <tr key={adm._id}>
                    <td>
                      <div className="adm-user-cell">
                        <div className="adm-cell-avatar">
                          {adm.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="adm-user-cell-meta">
                          <div className="adm-user-cell-name">{adm.name}</div>
                          <div className="adm-user-cell-sub">ID: {adm._id.slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{adm.email}</strong>
                    </td>
                    <td>
                      <span
                        className={`adm-badge ${
                          adm.role === "superadmin" ? "adm-badge-purple" : "adm-badge-success"
                        }`}
                      >
                        <FiShield style={{ fontSize: 10 }} /> {adm.role === "superadmin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-success">
                        <span className="adm-badge-dot" /> Active
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                        {new Date(adm.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="adm-action-group" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="adm-btn-icon-sm"
                          onClick={() => openEditModal(adm)}
                          title="Edit Permissions"
                        >
                          <FiEdit />
                        </button>
                        <button
                          type="button"
                          className="adm-btn-icon-sm adm-btn-icon-danger"
                          onClick={() => handleDelete(adm)}
                          title="Revoke Admin Access"
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

      {/* CREATE / EDIT ADMIN MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>{editingAdmin ? "Edit Admin Role" : "Add Console Administrator"}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Grant secure administrative console credentials.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Admin Full Name *</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Email Address *</label>
                  <input
                    type="email"
                    className="adm-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={!!editingAdmin}
                    required
                  />
                </div>

                {!editingAdmin && (
                  <div className="adm-form-row">
                    <label className="adm-label">Access Password *</label>
                    <input
                      type="text"
                      className="adm-input"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="adm-form-row">
                  <label className="adm-label">Assigned Console Role</label>
                  <select
                    className="adm-select"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="admin">Admin (Course & Operations Engine)</option>
                    <option value="superadmin">Super Admin (Full Root Permissions)</option>
                  </select>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Admin User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

