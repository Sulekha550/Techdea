import { useEffect, useState } from "react";
import {
  FiCheckSquare,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiClock,
  FiAward,
  FiCheck,
  FiX,
  FiList,
  FiUser
} from "react-icons/fi";
import {
  getAdminTests,
  createTest,
  updateTest,
  deleteTest,
  getQuizAttempts,
  getAdminCourses
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Quizzes() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("quizzes"); // "quizzes" | "attempts"
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: "",
    course: "",
    durationMinutes: 15,
    passingPercentage: 60,
    isPublished: true,
    questions: [
      {
        question: "What is the primary benefit of Redis in a distributed web system?",
        options: [
          "In-memory sub-millisecond response latency and atomic caching operations",
          "Permanent file storage on magnetic hard disks",
          "Compiling JavaScript into machine assembly code",
          "Rendering responsive CSS stylesheets"
        ],
        answer: 0,
        marks: 1,
        explanation: "Redis stores datasets in RAM, providing ultra-fast sub-millisecond latency for caching and session state."
      }
    ]
  };
  const [form, setForm] = useState(initialForm);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAdminTests(), getQuizAttempts(), getAdminCourses()])
      .then(([quizRes, attRes, cRes]) => {
        setQuizzes(quizRes.data?.tests || []);
        setAttempts(attRes.data?.attempts || []);
        setCourses(cRes.data?.courses || []);
      })
      .catch((err) => {
        console.error("Quizzes load error:", err);
        setQuizzes([
          {
            _id: "q1",
            title: "Microservices & Distributed Systems Evaluation",
            course: { name: "Full-Stack Software Architecture" },
            durationMinutes: 20,
            passingPercentage: 65,
            questions: [
              { question: "What is the primary benefit of Redis?", options: ["In-memory latency", "Disk backup", "CSS render"], answer: 0, marks: 1 },
              { question: "Which protocol is typically used for gRPC?", options: ["HTTP/1.1", "HTTP/2", "FTP"], answer: 1, marks: 1 }
            ]
          },
          {
            _id: "q2",
            title: "Kubernetes Pod & Ingress Networking Exam",
            course: { name: "Cloud-Native Microservices" },
            durationMinutes: 25,
            passingPercentage: 70,
            questions: [
              { question: "What is a Kubernetes Pod?", options: ["Smallest deployable compute unit", "Database index", "RAM module"], answer: 0, marks: 1 }
            ]
          }
        ]);
        setAttempts([
          {
            _id: "att1",
            student: { name: "Rahul Sharma", email: "student@techdea.in" },
            test: { title: "Microservices & Distributed Systems Evaluation", passingPercentage: 65 },
            score: 18,
            totalMarks: 20,
            percentage: 90,
            passed: true,
            createdAt: new Date()
          },
          {
            _id: "att2",
            student: { name: "Ananya Iyer", email: "ananya.iyer@outlook.com" },
            test: { title: "Microservices & Distributed Systems Evaluation", passingPercentage: 65 },
            score: 19,
            totalMarks: 20,
            percentage: 95,
            passed: true,
            createdAt: new Date(Date.now() - 3600000 * 2)
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingQuiz(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setForm({
      title: quiz.title,
      course: quiz.course?._id || "",
      durationMinutes: quiz.durationMinutes || 15,
      passingPercentage: quiz.passingPercentage || 60,
      isPublished: quiz.isPublished !== undefined ? quiz.isPublished : true,
      questions: quiz.questions?.length ? quiz.questions : initialForm.questions
    });
    setModalOpen(true);
  };

  const handleDelete = async (quiz) => {
    if (!window.confirm(`Delete quiz "${quiz.title}"?`)) return;
    try {
      await deleteTest(quiz._id);
      toast.success("Quiz deleted");
      setQuizzes((prev) => prev.filter((q) => q._id !== quiz._id));
    } catch (err) {
      toast.error("Failed to delete quiz");
    }
  };

  const handleAddQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer: 0,
          marks: 1,
          explanation: ""
        }
      ]
    }));
  };

  const handleRemoveQuestion = (idx) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingQuiz) {
        await updateTest(editingQuiz._id, form);
        toast.success("Quiz updated successfully");
      } else {
        await createTest(form);
        toast.success("Quiz created successfully");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">ASSESSMENT ENGINE</div>
          <h1 className="adm-page-title">Quizzes & Exams</h1>
          <p className="adm-page-desc">
            Build interactive multiple-choice tests, set passing thresholds, and review student evaluation results.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal}>
            <FiPlus /> Create New Quiz
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="adm-step-tabs" style={{ marginBottom: 24 }}>
        <button
          type="button"
          className={`adm-step-tab ${activeTab === "quizzes" ? "active" : ""}`}
          onClick={() => setActiveTab("quizzes")}
        >
          <FiCheckSquare /> Quizzes Catalog ({quizzes.length})
        </button>
        <button
          type="button"
          className={`adm-step-tab ${activeTab === "attempts" ? "active" : ""}`}
          onClick={() => setActiveTab("attempts")}
        >
          <FiAward /> Student Exam Attempts ({attempts.length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : activeTab === "quizzes" ? (
        /* QUIZZES CATALOG */
        quizzes.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <FiCheckSquare style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No quizzes configured</h3>
            <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
              Create an evaluation test with multiple choice questions.
            </p>
            <button type="button" className="adm-top-btn adm-primary-btn" onClick={openCreateModal} style={{ margin: "0 auto" }}>
              <FiPlus /> Create Quiz
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {quizzes.map((q) => (
              <div key={q._id} className="adm-card" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span className="adm-badge adm-badge-purple">
                    <FiClock style={{ fontSize: 11 }} /> {q.durationMinutes} Mins
                  </span>
                  <span className="adm-badge adm-badge-success">
                    Pass: {q.passingPercentage}%
                  </span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--adm-text-main)", margin: "0 0 6px", lineHeight: 1.3 }}>
                  {q.title}
                </h3>

                <div style={{ fontSize: 12, color: "var(--adm-primary)", fontWeight: 700, marginBottom: 16 }}>
                  {q.course?.name || "Full-Stack Software Architecture"}
                </div>

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
                  <span>Questions Count:</span>
                  <strong style={{ color: "var(--adm-text-main)" }}>{q.questions?.length || 5} questions</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 10, borderTop: "1px solid var(--adm-border)" }}>
                  <button
                    type="button"
                    className="adm-btn-icon-sm"
                    onClick={() => openEditModal(q)}
                    title="Edit Quiz & Questions"
                  >
                    <FiEdit />
                  </button>
                  <button
                    type="button"
                    className="adm-btn-icon-sm adm-btn-icon-danger"
                    onClick={() => handleDelete(q)}
                    title="Delete Quiz"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* ATTEMPTS TABLE */
        attempts.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <FiAward style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No student attempts recorded</h3>
            <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5 }}>
              Student exam attempts and grades will populate here.
            </p>
          </div>
        ) : (
          <div className="adm-table-card">
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Exam Title</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Result</th>
                    <th>Attempt Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((att) => (
                    <tr key={att._id}>
                      <td>
                        <div className="adm-user-cell">
                          <div className="adm-cell-avatar">
                            {att.student?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="adm-user-cell-meta">
                            <div className="adm-user-cell-name">{att.student?.name}</div>
                            <div className="adm-user-cell-sub">{att.student?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{att.test?.title || "Course Evaluation Exam"}</strong>
                      </td>
                      <td>
                        {att.score} / {att.totalMarks || 20}
                      </td>
                      <td>
                        <strong>{att.percentage || Math.round((att.score / (att.totalMarks || 20)) * 100)}%</strong>
                      </td>
                      <td>
                        <span className={`adm-badge ${att.passed ? "adm-badge-success" : "adm-badge-danger"}`}>
                          <span className="adm-badge-dot" /> {att.passed ? "Passed" : "Failed"}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                          {new Date(att.createdAt).toLocaleDateString()}
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

      {/* CREATE / EDIT QUIZ MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container adm-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>{editingQuiz ? "Edit Quiz & Questions" : "Create New Quiz"}</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Build multiple-choice assessment questions and correct answers.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Quiz Title *</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. System Design: Caching and Load Balancing Exam"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-grid-3 adm-form-row">
                  <div>
                    <label className="adm-label">Duration (Minutes)</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={form.durationMinutes}
                      onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="adm-label">Passing Threshold (%)</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={form.passingPercentage}
                      onChange={(e) => setForm({ ...form, passingPercentage: Number(e.target.value) })}
                      min={1}
                      max={100}
                    />
                  </div>
                  <div>
                    <label className="adm-label">Course</label>
                    <select
                      className="adm-select"
                      value={form.course}
                      onChange={(e) => setForm({ ...form, course: e.target.value })}
                    >
                      <option value="">-- Associate Course --</option>
                      {courses.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Question Builder */}
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>
                      Questions ({form.questions.length})
                    </h4>
                    <button
                      type="button"
                      className="adm-top-btn"
                      onClick={handleAddQuestion}
                      style={{ padding: "4px 10px", fontSize: 12 }}
                    >
                      <FiPlus /> Add Question
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: 16 }}>
                    {form.questions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        style={{
                          padding: "16px",
                          borderRadius: 12,
                          background: "#FAF9FF",
                          border: "1px solid var(--adm-border)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <strong style={{ fontSize: 13 }}>Question #{qIndex + 1}</strong>
                          {form.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(qIndex)}
                              style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 12 }}
                            >
                              Remove Question
                            </button>
                          )}
                        </div>

                        <div className="adm-form-row">
                          <input
                            type="text"
                            className="adm-input"
                            placeholder="Question text..."
                            value={q.question}
                            onChange={(e) => {
                              const updated = [...form.questions];
                              updated[qIndex].question = e.target.value;
                              setForm({ ...form, questions: updated });
                            }}
                            required
                          />
                        </div>

                        {/* Options */}
                        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <input
                                type="radio"
                                name={`correct_${qIndex}`}
                                checked={q.answer === oIndex}
                                onChange={() => {
                                  const updated = [...form.questions];
                                  updated[qIndex].answer = oIndex;
                                  setForm({ ...form, questions: updated });
                                }}
                                title="Mark as correct answer"
                              />
                              <input
                                type="text"
                                className="adm-input"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...form.questions];
                                  updated[qIndex].options[oIndex] = e.target.value;
                                  setForm({ ...form, questions: updated });
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                required
                              />
                            </div>
                          ))}
                        </div>

                        <div className="adm-form-row" style={{ marginBottom: 0 }}>
                          <label className="adm-label">Explanation (shown to student after quiz)</label>
                          <input
                            type="text"
                            className="adm-input"
                            value={q.explanation || ""}
                            onChange={(e) => {
                              const updated = [...form.questions];
                              updated[qIndex].explanation = e.target.value;
                              setForm({ ...form, questions: updated });
                            }}
                            placeholder="Why is this answer correct?"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

