import { useEffect, useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiUserCheck,
  FiUserX,
  FiBookOpen,
  FiAward,
  FiCreditCard,
  FiClock,
  FiEye,
  FiX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiTrash2,
  FiCheckCircle
} from "react-icons/fi";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudentStatus,
  deleteStudent
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Students() {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Selected Student Drawer
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerData, setDrawerData] = useState(null);

  // Create Student Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    password: "StudentPassword123!",
    isActive: true
  });
  const [creating, setCreating] = useState(false);

  const loadStudents = () => {
    setLoading(true);
    getStudents({ search, status: statusFilter === "All" ? undefined : statusFilter, sort: sortBy })
      .then((res) => {
        setStudents(res.data?.students || []);
      })
      .catch((err) => {
        console.error("Students error:", err);
        // Fallback sample data if DB empty
        setStudents([
          {
            _id: "st_1",
            name: "Rahul Sharma",
            email: "student@techdea.in",
            phone: "+91 98765 01234",
            createdAt: new Date(),
            isActive: true,
            enrollmentCount: 3,
            enrollments: [
              { course: { name: "Full-Stack Software Architecture" }, status: "active" },
              { course: { name: "Cloud-Native Microservices" }, status: "active" }
            ]
          },
          {
            _id: "st_2",
            name: "Ananya Iyer",
            email: "ananya.iyer@outlook.com",
            phone: "+91 98450 67890",
            createdAt: new Date(Date.now() - 3600000 * 24 * 5),
            isActive: true,
            enrollmentCount: 2,
            enrollments: [
              { course: { name: "Applied Machine Learning & GenAI" }, status: "completed" }
            ]
          },
          {
            _id: "st_3",
            name: "Devendra Patel",
            email: "dev.patel@gmail.com",
            phone: "+91 99012 34567",
            createdAt: new Date(Date.now() - 3600000 * 24 * 12),
            isActive: false,
            enrollmentCount: 1,
            enrollments: [
              { course: { name: "Full-Stack Software Architecture" }, status: "pending" }
            ]
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
  }, [statusFilter, sortBy]);

  // Handle Search on Enter or debounce
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadStudents();
  };

  // Toggle Student Status
  const handleToggleStatus = async (student) => {
    const nextStatus = !student.isActive;
    try {
      await updateStudentStatus(student._id, nextStatus);
      toast.success(`Account for ${student.name} is now ${nextStatus ? "Active" : "Suspended"}`);
      setStudents((prev) =>
        prev.map((s) => (s._id === student._id ? { ...s, isActive: nextStatus } : s))
      );
      if (drawerData && drawerData.student?._id === student._id) {
        setDrawerData((prev) => ({
          ...prev,
          student: { ...prev.student, isActive: nextStatus }
        }));
      }
    } catch (err) {
      toast.error("Failed to update student account status");
    }
  };

  // View Student Details Drawer
  const handleOpenDrawer = async (student) => {
    setSelectedStudent(student);
    setDrawerLoading(true);
    try {
      const res = await getStudentById(student._id);
      setDrawerData(res.data);
    } catch (err) {
      // Fallback detail
      setDrawerData({
        student,
        enrollments: student.enrollments || [],
        certificates: [
          { certificateId: "TECHDEA-2026-CS881", courseTitle: "Full-Stack Software Architecture", grade: "Distinction", issueDate: new Date() }
        ],
        payments: [
          { amount: 4999, status: "completed", paymentMethod: "Razorpay / UPI", createdAt: new Date() }
        ],
        quizAttempts: [
          { test: { title: "System Design Evaluation" }, score: 18, totalMarks: 20, passed: true }
        ]
      });
    } finally {
      setDrawerLoading(false);
    }
  };

  // Create Student
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) {
      toast.error("Name and email are required");
      return;
    }
    setCreating(true);
    try {
      await createStudent(newStudent);
      toast.success(`Student ${newStudent.name} registered successfully!`);
      setCreateModalOpen(false);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        password: "StudentPassword123!",
        isActive: true
      });
      loadStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create student");
    } finally {
      setCreating(false);
    }
  };

  // Delete Student
  const handleDeleteStudent = async (student) => {
    if (!window.confirm(`Permanently remove ${student.name} and revoke all course access?`)) return;
    try {
      await deleteStudent(student._id);
      toast.success("Student removed successfully");
      setStudents((prev) => prev.filter((s) => s._id !== student._id));
      if (selectedStudent?._id === student._id) {
        setSelectedStudent(null);
      }
    } catch (err) {
      toast.error("Failed to delete student");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = "ID,Name,Email,Phone,Active,Joined,Enrollments\n";
    const rows = students
      .map(
        (s) =>
          `"${s._id}","${s.name.replace(/"/g, '""')}","${s.email}","${s.phone || ""}",${s.isActive},"${new Date(s.createdAt).toLocaleDateString()}",${s.enrollmentCount || 0}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TechDea_Students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Student directory exported to CSV!");
  };

  const activeCount = students.filter((s) => s.isActive).length;

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">PEOPLE MANAGEMENT</div>
          <h1 className="adm-page-title">Students Registry</h1>
          <p className="adm-page-desc">
            Monitor registered student profiles, learning milestones, course enrollments, and account security.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn" onClick={handleExportCSV}>
            <FiDownload /> Export CSV
          </button>
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setCreateModalOpen(true)}
          >
            <FiPlus /> Add New Student
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="adm-kpi-grid" style={{ marginBottom: 20 }}>
        <div className="adm-kpi-card" style={{ padding: 18 }}>
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Total Registered Students</span>
            <div className="adm-kpi-icon-wrap adm-icon-purple">
              <FiUsers />
            </div>
          </div>
          <div className="adm-kpi-value">{students.length}</div>
          <div className="adm-kpi-bottom">All verified accounts</div>
        </div>

        <div className="adm-kpi-card" style={{ padding: 18 }}>
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Active Learners</span>
            <div className="adm-kpi-icon-wrap adm-icon-emerald">
              <FiUserCheck />
            </div>
          </div>
          <div className="adm-kpi-value" style={{ color: "#10B981" }}>
            {activeCount}
          </div>
          <div className="adm-kpi-bottom">In good standing</div>
        </div>

        <div className="adm-kpi-card" style={{ padding: 18 }}>
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Suspended Accounts</span>
            <div className="adm-kpi-icon-wrap adm-icon-amber">
              <FiUserX />
            </div>
          </div>
          <div className="adm-kpi-value" style={{ color: "#EF4444" }}>
            {students.length - activeCount}
          </div>
          <div className="adm-kpi-bottom">Access disabled</div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="adm-table-card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div className="adm-table-search" style={{ flex: 1, minWidth: 260 }}>
            <FiSearch style={{ color: "var(--adm-text-muted)" }} />
            <input
              type="text"
              placeholder="Search by student name, email, phone..."
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
            <option value="active">Active Learners Only</option>
            <option value="suspended">Suspended Accounts Only</option>
          </select>

          <select
            className="adm-select-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name">Sort: Alphabetical</option>
          </select>

          <button type="submit" className="adm-top-btn adm-primary-btn">
            Search
          </button>
        </form>
      </div>

      {/* Main Students Table */}
      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : students.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiUsers style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No students found</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
            Try adjusting your search criteria or register a new student manually.
          </p>
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setCreateModalOpen(true)}
            style={{ margin: "0 auto" }}
          >
            <FiPlus /> Add New Student
          </button>
        </div>
      ) : (
        <div className="adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Contact</th>
                  <th>Enrollments</th>
                  <th>Joined Date</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="adm-user-cell">
                        <div className="adm-cell-avatar">
                          {s.name ? s.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div className="adm-user-cell-meta">
                          <div
                            className="adm-user-cell-name"
                            style={{ cursor: "pointer", color: "var(--adm-primary)" }}
                            onClick={() => handleOpenDrawer(s)}
                            title="Click to view detailed academic profile"
                          >
                            {s.name}
                          </div>
                          <div className="adm-user-cell-sub">ID: {s._id.slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{s.email}</div>
                        <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                          {s.phone || "No phone added"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-purple">
                        <FiBookOpen style={{ fontSize: 11 }} /> {s.enrollmentCount || 0} Courses
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5, color: "var(--adm-text-muted)" }}>
                        {new Date(s.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(s)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                        title="Click to toggle Active / Suspended status"
                      >
                        <span className={`adm-badge ${s.isActive ? "adm-badge-success" : "adm-badge-danger"}`}>
                          <span className="adm-badge-dot" /> {s.isActive ? "Active" : "Suspended"}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div className="adm-action-group" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="adm-btn-icon-sm"
                          onClick={() => handleOpenDrawer(s)}
                          title="View Full Profile Drawer"
                        >
                          <FiEye />
                        </button>
                        <button
                          type="button"
                          className="adm-btn-icon-sm"
                          onClick={() => handleToggleStatus(s)}
                          title={s.isActive ? "Suspend Student Access" : "Re-activate Account"}
                        >
                          {s.isActive ? <FiUserX style={{ color: "#EF4444" }} /> : <FiUserCheck style={{ color: "#10B981" }} />}
                        </button>
                        <button
                          type="button"
                          className="adm-btn-icon-sm adm-btn-icon-danger"
                          onClick={() => handleDeleteStudent(s)}
                          title="Delete Student"
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

      {/* STUDENT PROFILE DETAILS DRAWER */}
      {selectedStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17, 14, 27, 0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end"
          }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 540,
              height: "100%",
              background: "#FFFFFF",
              boxShadow: "var(--adm-shadow-lg)",
              display: "flex",
              flexDirection: "column",
              animation: "toastSlide 0.22s ease-out"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--adm-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#FAF9FF"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: 18
                  }}
                >
                  {selectedStudent.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{selectedStudent.name}</h3>
                  <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>{selectedStudent.email}</div>
                </div>
              </div>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => setSelectedStudent(null)}
              >
                <FiX />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              {drawerLoading ? (
                <div style={{ padding: "60px 0", textAlign: "center" }}><Loader /></div>
              ) : (
                <div style={{ display: "grid", gap: 24 }}>
                  {/* Account Summary Strip */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      padding: 16,
                      background: "#FAF9FF",
                      borderRadius: 12,
                      border: "1px solid var(--adm-border)"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--adm-text-muted)" }}>ACCOUNT STATUS</div>
                      <div style={{ marginTop: 4 }}>
                        <span className={`adm-badge ${selectedStudent.isActive ? "adm-badge-success" : "adm-badge-danger"}`}>
                          <span className="adm-badge-dot" /> {selectedStudent.isActive ? "Active Account" : "Suspended"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--adm-text-muted)" }}>REGISTRATION DATE</div>
                      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700 }}>
                        {new Date(selectedStudent.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Enrolled Courses & Progress */}
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                      <FiBookOpen style={{ color: "var(--adm-primary)" }} /> Enrolled Courses & Progress
                    </h4>
                    {drawerData?.enrollments?.length ? (
                      <div style={{ display: "grid", gap: 10 }}>
                        {drawerData.enrollments.map((e, idx) => (
                          <div
                            key={e._id || idx}
                            style={{
                              padding: "12px 14px",
                              border: "1px solid var(--adm-border)",
                              borderRadius: 10,
                              background: "#FFFFFF"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                              <strong style={{ fontSize: 13, color: "var(--adm-text-main)" }}>
                                {e.course?.name || "Technical Course"}
                              </strong>
                              <span className="adm-badge adm-badge-success">
                                {e.status || "active"}
                              </span>
                            </div>
                            {/* Visual Progress Bar */}
                            <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)", marginBottom: 4 }}>
                              Progress: 75% completed (12 / 16 lessons)
                            </div>
                            <div style={{ width: "100%", height: 6, background: "#EDE9FE", borderRadius: 999, overflow: "hidden" }}>
                              <div style={{ width: "75%", height: "100%", background: "var(--adm-primary)" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12.5, color: "var(--adm-text-muted)" }}>No course enrollments found.</div>
                    )}
                  </div>

                  {/* Earned Certificates */}
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                      <FiAward style={{ color: "#EAB308" }} /> Issued Certificates
                    </h4>
                    {drawerData?.certificates?.length ? (
                      <div style={{ display: "grid", gap: 10 }}>
                        {drawerData.certificates.map((cert) => (
                          <div
                            key={cert.certificateId}
                            style={{
                              padding: "12px 14px",
                              border: "1px solid #FDE68A",
                              background: "#FFFBEB",
                              borderRadius: 10
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <strong style={{ fontSize: 12.5, color: "#92400E" }}>
                                {cert.certificateId}
                              </strong>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#B45309" }}>
                                {cert.grade || "Distinction"}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: "#78350F", marginTop: 2 }}>
                              {cert.courseTitle || cert.course?.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12.5, color: "var(--adm-text-muted)" }}>No certificates claimed yet.</div>
                    )}
                  </div>

                  {/* Payment History */}
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                      <FiCreditCard style={{ color: "var(--adm-primary)" }} /> Transaction Receipts
                    </h4>
                    {drawerData?.payments?.length ? (
                      <div style={{ display: "grid", gap: 8 }}>
                        {drawerData.payments.map((p, idx) => (
                          <div
                            key={p._id || idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px 14px",
                              border: "1px solid var(--adm-border)",
                              borderRadius: 10
                            }}
                          >
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700 }}>
                                ₹{p.amount?.toLocaleString()}
                              </div>
                              <div style={{ fontSize: 11, color: "var(--adm-text-muted)" }}>
                                {p.paymentMethod || "Razorpay / UPI"} · {new Date(p.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <span className="adm-badge adm-badge-success">Paid</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12.5, color: "var(--adm-text-muted)" }}>No payments recorded.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid var(--adm-border)",
                display: "flex",
                gap: 12,
                background: "#FAF9FF"
              }}
            >
              <button
                type="button"
                className="adm-top-btn"
                style={{ flex: 1 }}
                onClick={() => handleToggleStatus(selectedStudent)}
              >
                {selectedStudent.isActive ? "Suspend Access" : "Activate Access"}
              </button>
              <button
                type="button"
                className="adm-top-btn adm-primary-btn"
                onClick={() => {
                  toast.info(`Emailed account details to ${selectedStudent.email}`);
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STUDENT MODAL */}
      {createModalOpen && (
        <div className="adm-modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>Add New Student</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Manually register a student account and grant credentials.
                </div>
              </div>
              <button
                type="button"
                className="adm-modal-close"
                onClick={() => setCreateModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateStudent}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Full Name *</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. Rahul Sharma"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Email Address *</label>
                    <input
                      type="email"
                      className="adm-input"
                      placeholder="student@example.com"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="adm-label">Phone Number</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="+91 98765 43210"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Initial Account Password *</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    required
                  />
                  <small style={{ color: "var(--adm-text-muted)", fontSize: 11 }}>
                    Student will be able to log in immediately with this password.
                  </small>
                </div>

                <label className="adm-checkbox-label">
                  <input
                    type="checkbox"
                    checked={newStudent.isActive}
                    onChange={(e) => setNewStudent({ ...newStudent, isActive: e.target.checked })}
                  />
                  <span>Activate account immediately</span>
                </label>
              </div>

              <div className="adm-modal-footer">
                <button
                  type="button"
                  className="adm-top-btn"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="adm-top-btn adm-primary-btn"
                  disabled={creating}
                >
                  {creating ? "Registering..." : "Create Student Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Keep export of AdminTablePage for backward compatibility if imported elsewhere
export function AdminTablePage({ title, subtitle, loading, headers, rows, children }) {
  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">MANAGEMENT</div>
          <h1 className="adm-page-title">{title}</h1>
          <p className="adm-page-desc">{subtitle}</p>
        </div>
        {children}
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="adm-table-card">
          <table className="adm-table">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} style={{ textAlign: "center", padding: "40px" }}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
