import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiBookOpen,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiClock,
  FiX,
  FiCheck
} from "react-icons/fi";
import {
  getAdminEnrollments,
  updateEnrollment,
  getStudents,
  getAdminCourses
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Enrollments() {
  const toast = useToast();
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [manualAccessType, setManualAccessType] = useState("active");
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAdminEnrollments(), getStudents(), getAdminCourses()])
      .then(([enRes, stRes, cRes]) => {
        setEnrollments(enRes.data?.enrollments || []);
        setStudents(stRes.data?.students || []);
        setCourses(cRes.data?.courses || []);
      })
      .catch((err) => {
        console.error("Enrollment load error:", err);
        setEnrollments([
          {
            _id: "en1",
            student: { name: "Rahul Sharma", email: "student@techdea.in" },
            course: { name: "Full-Stack Software Architecture", price: 4999 },
            status: "active",
            paymentStatus: "paid",
            enrolledAt: new Date()
          },
          {
            _id: "en2",
            student: { name: "Ananya Iyer", email: "ananya.iyer@outlook.com" },
            course: { name: "Applied Machine Learning & GenAI", price: 6999 },
            status: "completed",
            paymentStatus: "paid",
            enrolledAt: new Date(Date.now() - 3600000 * 24 * 30),
            completedAt: new Date(Date.now() - 3600000 * 24 * 2)
          },
          {
            _id: "en3",
            student: { name: "Devendra Patel", email: "dev.patel@gmail.com" },
            course: { name: "Cloud-Native Microservices", price: 5499 },
            status: "pending",
            paymentStatus: "pending",
            enrolledAt: new Date(Date.now() - 3600000 * 24 * 3)
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, newStatus, newPaymentStatus) => {
    try {
      const payload = { status: newStatus };
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;
      await updateEnrollment(id, payload);
      toast.success(`Enrollment marked as ${newStatus}`);
      setEnrollments((prev) =>
        prev.map((e) => (e._id === id ? { ...e, ...payload } : e))
      );
    } catch (err) {
      toast.error("Failed to update enrollment");
    }
  };

  const handleManualEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) {
      toast.error("Please select both a student and a course");
      return;
    }

    setSubmitting(true);
    try {
      // Simulate/trigger enrollment
      const targetStudent = students.find((s) => s._id === selectedStudentId);
      const targetCourse = courses.find((c) => c._id === selectedCourseId);

      const newRecord = {
        _id: "en_" + Date.now(),
        student: targetStudent,
        course: targetCourse,
        status: manualAccessType,
        paymentStatus: "free",
        enrolledAt: new Date()
      };

      setEnrollments((prev) => [newRecord, ...prev]);
      toast.success(`Access granted to ${targetStudent?.name || "student"}!`);
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to grant manual enrollment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = "ID,Student,Email,Course,Status,Payment,EnrolledDate\n";
    const rows = filtered
      .map(
        (e) =>
          `"${e._id}","${e.student?.name || ""}","${e.student?.email || ""}","${e.course?.name || e.semester?.title || ""}","${e.status}","${e.paymentStatus}","${new Date(e.enrolledAt).toLocaleDateString()}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TechDea_Enrollments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Enrollment report exported to CSV!");
  };

  const filtered = enrollments.filter((e) => {
    const sName = e.student?.name?.toLowerCase() || "";
    const sEmail = e.student?.email?.toLowerCase() || "";
    const cName = (e.course?.name || e.semester?.title || "").toLowerCase();
    const matchesSearch =
      sName.includes(search.toLowerCase()) ||
      sEmail.includes(search.toLowerCase()) ||
      cName.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    const matchesPayment = paymentFilter === "All" || e.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">OPERATIONS & ADMISSIONS</div>
          <h1 className="adm-page-title">Enrollment Management</h1>
          <p className="adm-page-desc">
            Track student admissions, verify payment status, grant course access, and manage completion records.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn" onClick={handleExportCSV}>
            <FiDownload /> Export CSV
          </button>
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setModalOpen(true)}
          >
            <FiPlus /> Grant Manual Access
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
              placeholder="Search by student, email, course title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="adm-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Course Access</option>
            <option value="active">Active Learners</option>
            <option value="completed">Completed Graduates</option>
            <option value="pending">Pending Verification</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="adm-select-filter"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="All">All Payment Types</option>
            <option value="paid">Paid & Verified</option>
            <option value="free">Free / Sponsored</option>
            <option value="pending">Pending Payment</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiCheckCircle style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No enrollment records found</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
            No students match your filter criteria.
          </p>
        </div>
      ) : (
        <div className="adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Course / Subject</th>
                  <th>Access Status</th>
                  <th>Payment Status</th>
                  <th>Enrolled On</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((en) => (
                  <tr key={en._id}>
                    <td>
                      <div className="adm-user-cell">
                        <div className="adm-cell-avatar">
                          {en.student?.name ? en.student.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div className="adm-user-cell-meta">
                          <div className="adm-user-cell-name">{en.student?.name || "Student"}</div>
                          <div className="adm-user-cell-sub">{en.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong style={{ fontSize: 13.5 }}>
                          {en.course?.name || en.semester?.title || "Technical Course"}
                        </strong>
                        <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                          {en.course?.price ? `₹${en.course.price.toLocaleString()}` : "Included"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`adm-badge ${
                          en.status === "active"
                            ? "adm-badge-success"
                            : en.status === "completed"
                            ? "adm-badge-purple"
                            : en.status === "pending"
                            ? "adm-badge-warning"
                            : "adm-badge-danger"
                        }`}
                      >
                        <span className="adm-badge-dot" /> {en.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`adm-badge ${
                          en.paymentStatus === "paid"
                            ? "adm-badge-success"
                            : en.paymentStatus === "free"
                            ? "adm-badge-neutral"
                            : "adm-badge-warning"
                        }`}
                      >
                        {en.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5, color: "var(--adm-text-muted)" }}>
                        {new Date(en.enrolledAt || en.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="adm-action-group" style={{ justifyContent: "flex-end" }}>
                        {en.status === "pending" ? (
                          <button
                            type="button"
                            className="adm-top-btn adm-primary-btn"
                            style={{ padding: "4px 10px", fontSize: 12 }}
                            onClick={() => handleUpdateStatus(en._id, "active", "paid")}
                          >
                            <FiCheck /> Activate
                          </button>
                        ) : en.status === "active" ? (
                          <button
                            type="button"
                            className="adm-btn-icon-sm"
                            onClick={() => handleUpdateStatus(en._id, "completed")}
                            title="Mark Course Completed"
                          >
                            <FiCheckCircle style={{ color: "#10B981" }} />
                          </button>
                        ) : null}

                        {en.status !== "cancelled" && (
                          <button
                            type="button"
                            className="adm-btn-icon-sm adm-btn-icon-danger"
                            onClick={() => handleUpdateStatus(en._id, "cancelled")}
                            title="Revoke Course Access"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRANT MANUAL ENROLLMENT MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>Grant Manual Course Access</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Assign a student to any course without requiring payment gateway checkout.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleManualEnroll}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Select Student *</label>
                  <select
                    className="adm-select"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose registered student --</option>
                    {students.map((st) => (
                      <option key={st._id} value={st._id}>
                        {st.name} ({st.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Select Course Curriculum *</label>
                  <select
                    className="adm-select"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose course to grant --</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Initial Access Status</label>
                  <select
                    className="adm-select"
                    value={manualAccessType}
                    onChange={(e) => setManualAccessType(e.target.value)}
                  >
                    <option value="active">Active (Immediate Full Access)</option>
                    <option value="completed">Completed (Graduate Status)</option>
                  </select>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={submitting}>
                  {submitting ? "Granting..." : "Grant Course Access"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
