import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiEdit, FiX, FiCheck } from "react-icons/fi";
import {
  getAdminTests,
  getAdminCourses,
  createTest,
  updateTest,
  deleteTest
} from "../../services/adminService.js";
import Loader from "../../components/common/Loader.jsx";

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    course: "",
    title: "",
    description: "",
    durationMinutes: 15,
    passingPercentage: 60,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: 0,
        marks: 1,
        explanation: ""
      }
    ]
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([getAdminTests(), getAdminCourses()])
      .then(([tRes, cRes]) => {
        setTests(tRes.data?.tests || []);
        setCourses(cRes.data?.courses || []);
      })
      .catch((err) => console.error("Admin tests load error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const openCreateModal = () => {
    setEditingTest(null);
    setForm({
      course: courses[0]?._id || "",
      title: "",
      description: "",
      durationMinutes: 15,
      passingPercentage: 60,
      questions: [
        {
          question: "",
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer: 0,
          marks: 1,
          explanation: ""
        }
      ]
    });
    setModalOpen(true);
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          question: "",
          options: ["", "", "", ""],
          answer: 0,
          marks: 1,
          explanation: ""
        }
      ]
    });
  };

  const removeQuestion = (qIndex) => {
    if (form.questions.length <= 1) return;
    setForm({
      ...form,
      questions: form.questions.filter((_, i) => i !== qIndex)
    });
  };

  const updateQuestion = (qIndex, field, value) => {
    const nextQ = [...form.questions];
    nextQ[qIndex] = { ...nextQ[qIndex], [field]: value };
    setForm({ ...form, questions: nextQ });
  };

  const updateOption = (qIndex, optIndex, value) => {
    const nextQ = [...form.questions];
    const opts = [...nextQ[qIndex].options];
    opts[optIndex] = value;
    nextQ[qIndex] = { ...nextQ[qIndex], options: opts };
    setForm({ ...form, questions: nextQ });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTest) {
        await updateTest(editingTest._id, form);
      } else {
        await createTest(form);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert("Failed to save quiz: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Delete test "${title}"?`)) {
      try {
        await deleteTest(id);
        loadData();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <div className="eyebrow">EVALUATION SYSTEM CMS</div>
          <h1>Assessments & Quiz Builder</h1>
          <p>Create timed multiple-choice assessments with automated grading.</p>
        </div>

        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          <FiPlus /> Create Quiz
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px 36px" }}><Loader /></div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Quiz Title</th>
                <th>Course / Track</th>
                <th>Questions</th>
                <th>Duration</th>
                <th>Pass Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.length > 0 ? (
                tests.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <strong>{t.title}</strong>
                      {t.description && (
                        <small style={{ display: "block", color: "var(--muted)" }}>
                          {t.description}
                        </small>
                      )}
                    </td>
                    <td>{t.course?.name || t.subject?.name || "General"}</td>
                    <td>
                      <span className="badge badge-read">
                        {t.questions?.length || 0} Questions
                      </span>
                    </td>
                    <td>{t.durationMinutes} min</td>
                    <td>
                      <strong>{t.passingPercentage}%</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(t._id, t.title)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-empty">
                    No quizzes found. Click "+ Create Quiz" to author your first assessment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Quiz Authoring Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" style={{ maxWidth: 740 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Create Evaluation Assessment</h2>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
                <label>
                  Associated Course *
                  <select
                    required
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                  >
                    <option value="">Select course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Quiz Title *
                  <input
                    required
                    placeholder="e.g. MERN Full-Stack Assessment"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label>
                  Time Limit (Minutes)
                  <input
                    type="number"
                    min={1}
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                  />
                </label>

                <label>
                  Passing Score (%)
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={form.passingPercentage}
                    onChange={(e) => setForm({ ...form, passingPercentage: Number(e.target.value) })}
                  />
                </label>
              </div>

              {/* Questions Builder */}
              <div style={{ marginTop: 14, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>
                    Questions ({form.questions.length})
                  </h3>
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={addQuestion}
                  >
                    <FiPlus /> Add Question
                  </button>
                </div>

                <div style={{ display: "grid", gap: 20 }}>
                  {form.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      style={{
                        background: "var(--soft)",
                        padding: 18,
                        borderRadius: 12,
                        border: "1px solid var(--border)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <strong>Question #{qIdx + 1}</strong>
                        {form.questions.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-small"
                            onClick={() => removeQuestion(qIdx)}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <label style={{ marginBottom: 10 }}>
                        Question Text *
                        <input
                          required
                          placeholder="e.g. Which HTTP method is idempotent?"
                          value={q.question}
                          onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                        />
                      </label>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} style={{ fontSize: 12 }}>
                            Option {String.fromCharCode(65 + optIdx)}
                            <input
                              required
                              placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                              value={opt}
                              onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                            />
                          </label>
                        ))}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <label>
                          Correct Answer
                          <select
                            value={q.answer}
                            onChange={(e) => updateQuestion(qIdx, "answer", Number(e.target.value))}
                          >
                            <option value={0}>Option A is Correct</option>
                            <option value={1}>Option B is Correct</option>
                            <option value={2}>Option C is Correct</option>
                            <option value={3}>Option D is Correct</option>
                          </select>
                        </label>

                        <label>
                          Explanation (shown after quiz)
                          <input
                            placeholder="Why this answer is correct..."
                            value={q.explanation}
                            onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={submitting}
                style={{ marginTop: 14 }}
              >
                {submitting ? "Publishing Quiz..." : "Save & Publish Quiz"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}