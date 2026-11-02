import { useEffect, useState } from "react";
import {
  FiFileText,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiEdit,
  FiTrash2,
  FiX,
  FiUser,
  FiAward
} from "react-icons/fi";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  gradeSubmission,
  getAdminCourses
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Assignments() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("assignments"); // "assignments" | "submissions"
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Assignment Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: "",
    courseTitle: "Full-Stack Software Architecture",
    description: "Build an end-to-end distributed caching layer with Redis and benchmark throughput.",
    dueDate: new Date(Date.now() + 3600000 * 24 * 14).toISOString().slice(0, 10),
    maxMarks: 100,
    resourceFileUrl: "https://github.com/techdea/assignment-starter"
  };
  const [form, setForm] = useState(initialForm);

  // Grade Submission Modal
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState("Excellent work!");
  const [gradeStatus, setGradeStatus] = useState("graded");

  const loadData = () => {
    setLoading(true);
    Promise.all([getAssignments(), getAdminCourses()])
      .then(([assRes, cRes]) => {
        setAssignments(assRes.data?.assignments || []);
        setCourses(cRes.data?.courses || []);
      })
      .catch((err) => {
        console.error("Assignments error:", err);
        setAssignments([
          {
            _id: "ass1",
            title: "Capstone Project: AI-Powered Search Engine with Vector Store",
            courseTitle: "Full-Stack Software Architecture",
            description: "Implement vector embeddings with Pinecone and Node.js REST API with rate limiting.",
            dueDate: new Date(Date.now() + 3600000 * 24 * 14),
            maxMarks: 100,
            submissions: [
              {
                _id: "sub1",
                studentName: "Rahul Sharma",
                studentEmail: "student@techdea.in",
                githubUrl: "https://github.com/rahul/techdea-rag-capstone",
                notes: "Completed with Redis vector store and hybrid BM25 search.",
                submittedAt: new Date(),
                marks: 95,
                feedback: "Outstanding system architecture and clean error handling.",
                status: "graded"
              },
              {
                _id: "sub2",
                studentName: "Devendra Patel",
                studentEmail: "dev.patel@gmail.com",
                githubUrl: "https://github.com/dev/techdea-capstone",
                notes: "Pending final test cases for JWT authentication.",
                submittedAt: new Date(Date.now() - 3600000 * 24),
                marks: 0,
                feedback: "",
                status: "submitted"
              }
            ]
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingAssignment(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (a) => {
    setEditingAssignment(a);
    setForm({
      title: a.title,
      courseTitle: a.courseTitle || a.course?.name || "",
      description: a.description || "",
      dueDate: a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 10) : "",
      maxMarks: a.maxMarks || 100,
      resourceFileUrl: a.resourceFileUrl || ""
    });
    setModalOpen(true);
  };

  const handleDelete = async (a) => {
    if (!window.confirm(`Delete assignment "${a.title}"?`)) return;
    try {
      await deleteAssignment(a._id);
      toast.success("Assignment deleted");
      setAssignments((prev) => prev.filter((item) => item._id !== a._id));
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Assignment title is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingAssignment) {
        await updateAssignment(editingAssignment._id, form);
        toast.success("Assignment updated successfully");
      } else {
        await createAssignment(form);
        toast.success("Assignment created successfully");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const openGradingModal = (assignment, sub) => {
    setSelectedSub({ assignmentId: assignment._id, assignmentTitle: assignment.title, ...sub });
    setGradeScore(sub.marks || 85);
    setGradeFeedback(sub.feedback || "Good effort! Architecture structure is well decoupled.");
    setGradeStatus(sub.status || "graded");
    setGradingModalOpen(true);
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      await gradeSubmission(selectedSub.assignmentId, selectedSub._id, {
        marks: Number(gradeScore),
        feedback: gradeFeedback,
        status: gradeStatus
      });
      toast.success(`Submission graded for ${selectedSub.studentName}!`);
      setGradingModalOpen(false);
      loadData();
    } catch (err) {
      toast.error("Failed to save grade");
    }
  };

  // Extract all student submissions
  const allSubmissions = [];
  assignments.forEach((a) => {
    (a.submissions || []).forEach((sub) => {
      allSubmissions.push({ ...sub, assignmentTitle: a.title, assignmentId: a._id, maxMarks: a.maxMarks });
    });
  });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">PROJECT-BASED EVALUATION</div>
          <h1 className="adm-page-title">Assignments & Projects</h1>
          <p className="adm-page-desc">
            Assign capstones, review GitHub repository code submissions, provide feedback, and grade student coursework.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal}>
            <FiPlus /> Create Assignment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="adm-step-tabs" style={{ marginBottom: 24 }}>
        <button
          type="button"
          className={`adm-step-tab ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          <FiFileText /> Assignments Catalog ({assignments.length})
        </button>
        <button
          type="button"
          className={`adm-step-tab ${activeTab === "submissions" ? "active" : ""}`}
          onClick={() => setActiveTab("submissions")}
        >
          <FiCheckCircle /> Student Submissions ({allSubmissions.length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : activeTab === "assignments" ? (
        /* ASSIGNMENTS CATALOG */
        assignments.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <FiFileText style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No assignments created</h3>
            <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
              Publish a capstone assignment or code challenge for enrolled students.
            </p>
            <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal} style={{ margin: "0 auto" }}>
              <FiPlus /> Create Assignment
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {assignments.map((a) => (
              <div key={a._id} className="adm-card" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="adm-badge adm-badge-purple">
                    Max Score: {a.maxMarks || 100} pts
                  </span>
                  <span style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                    Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "Flexible"}
                  </span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.3 }}>
                  {a.title}
                </h3>
                <div style={{ fontSize: 12, color: "var(--adm-primary)", fontWeight: 700, marginBottom: 10 }}>
                  {a.courseTitle || a.course?.name || "Full-Stack Engineering"}
                </div>

                <p style={{ fontSize: 12.5, color: "var(--adm-text-muted)", margin: "0 0 16px", flex: 1, lineHeight: 1.5 }}>
                  {a.description}
                </p>

                <div
                  style={{
                    padding: "10px 14px",
                    background: "#FAF9FF",
                    borderRadius: 10,
                    border: "1px solid var(--adm-border)",
                    fontSize: 12,
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <span>Submissions Received:</span>
                  <strong style={{ color: "var(--adm-primary)" }}>{a.submissions?.length || 0} students</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--adm-border)" }}>
                  <button
                    type="button"
                    className="adm-top-btn"
                    style={{ padding: "4px 10px", fontSize: 12 }}
                    onClick={() => setActiveTab("submissions")}
                  >
                    View Submissions
                  </button>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      className="adm-btn-icon-sm"
                      onClick={() => openEditModal(a)}
                      title="Edit Assignment"
                    >
                      <FiEdit />
                    </button>
                    <button
                      type="button"
                      className="adm-btn-icon-sm adm-btn-icon-danger"
                      onClick={() => handleDelete(a)}
                      title="Delete Assignment"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* SUBMISSIONS TABLE */
        allSubmissions.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <FiCheckCircle style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No submissions yet</h3>
            <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5 }}>
              Submitted code will appear here for grading and instructor feedback.
            </p>
          </div>
        ) : (
          <div className="adm-table-card">
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Assignment Title</th>
                    <th>Submitted Link</th>
                    <th>Date</th>
                    <th>Grade / Score</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allSubmissions.map((sub) => (
                    <tr key={sub._id}>
                      <td>
                        <div className="adm-user-cell">
                          <div className="adm-cell-avatar">
                            {sub.studentName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="adm-user-cell-meta">
                            <div className="adm-user-cell-name">{sub.studentName}</div>
                            <div className="adm-user-cell-sub">{sub.studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong style={{ fontSize: 13 }}>{sub.assignmentTitle}</strong>
                      </td>
                      <td>
                        {sub.githubUrl ? (
                          <a
                            href={sub.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--adm-primary)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}
                          >
                            <FiExternalLink /> GitHub Repo
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: sub.marks >= 80 ? "#10B981" : "var(--adm-text-main)" }}>
                          {sub.marks} / {sub.maxMarks || 100}
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`adm-badge ${
                            sub.status === "graded"
                              ? "adm-badge-success"
                              : sub.status === "resubmit"
                              ? "adm-badge-warning"
                              : "adm-badge-neutral"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <div className="adm-action-group" style={{ justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className="adm-top-btn adm-primary-btn"
                            style={{ padding: "4px 10px", fontSize: 12 }}
                            onClick={() => openGradingModal({ _id: sub.assignmentId, title: sub.assignmentTitle }, sub)}
                          >
                            <FiAward /> Grade
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* CREATE / EDIT ASSIGNMENT MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>{editingAssignment ? "Edit Assignment" : "Create New Assignment"}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Configure assignment guidelines, maximum points, and due date.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Assignment Title *</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. Capstone: Distributed Microservices Architecture"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Course Title</label>
                    <input
                      type="text"
                      className="adm-input"
                      value={form.courseTitle}
                      onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="adm-label">Max Score Points</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={form.maxMarks}
                      onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Due Date</label>
                    <input
                      type="date"
                      className="adm-input"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="adm-label">Starter Code / Repo Link</label>
                    <input
                      type="url"
                      className="adm-input"
                      value={form.resourceFileUrl}
                      onChange={(e) => setForm({ ...form, resourceFileUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Instructions & Rubric</label>
                  <textarea
                    className="adm-textarea"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={submitting}>
                  {submitting ? "Saving..." : "Publish Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADE SUBMISSION MODAL */}
      {gradingModalOpen && selectedSub && (
        <div className="adm-modal-overlay" onClick={() => setGradingModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>Grade Submission: {selectedSub.studentName}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  {selectedSub.assignmentTitle}
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setGradingModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveGrade}>
              <div className="adm-modal-body">
                {selectedSub.githubUrl && (
                  <div style={{ padding: "12px", background: "#FAF9FF", borderRadius: 10, border: "1px solid var(--adm-border)", marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>SUBMITTED GITHUB REPOSITORY:</div>
                    <a
                      href={selectedSub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 14, fontWeight: 700, color: "var(--adm-primary)" }}
                    >
                      {selectedSub.githubUrl} ↗
                    </a>
                  </div>
                )}

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Score (Max: {selectedSub.maxMarks || 100})</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={gradeScore}
                      onChange={(e) => setGradeScore(e.target.value)}
                      min={0}
                      max={selectedSub.maxMarks || 100}
                      required
                    />
                  </div>

                  <div>
                    <label className="adm-label">Grading Status</label>
                    <select
                      className="adm-select"
                      value={gradeStatus}
                      onChange={(e) => setGradeStatus(e.target.value)}
                    >
                      <option value="graded">Graded (Accepted)</option>
                      <option value="resubmit_required">Revision Required</option>
                    </select>
                  </div>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Faculty Feedback for Student</label>
                  <textarea
                    className="adm-textarea"
                    rows={4}
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    placeholder="Constructive feedback, code review remarks..."
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setGradingModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn">
                  Submit Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

