import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiClock,
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight,
  FiCheck,
  FiRotateCcw
} from "react-icons/fi";
import {
  getTests,
  getTest,
  submitQuiz,
  getMyQuizAttempts
} from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";

export default function Tests() {
  const { courseId, subjectId } = useParams();
  const filterId = courseId || subjectId;

  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load tests for this course/subject
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const query = {};
    if (filterId) {
      query.course = filterId;
    }

    getTests(query)
      .then((res) => {
        if (isMounted) setTests(res.data?.tests || []);
      })
      .catch((err) => {
        console.error("Failed to load tests:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filterId]);

  // Load student's past attempts
  useEffect(() => {
    getMyQuizAttempts()
      .then((res) => {
        setAttempts(res.data?.attempts || []);
      })
      .catch((e) => console.error("Attempts error:", e));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeTest || quizResult || timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTest, quizResult, timerSeconds]);

  const handleStartQuiz = async (testItem) => {
    try {
      setLoading(true);
      const res = await getTest(testItem._id);
      setActiveTest(res.data.test);
      setSelectedAnswers({});
      setQuizResult(null);
      setTimerSeconds((res.data.test.durationMinutes || 15) * 60);
    } catch (err) {
      alert("Failed to start quiz: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeTest || submitting) return;
    setSubmitting(true);

    try {
      const answersPayload = (activeTest.questions || []).map((q) => ({
        questionId: q._id,
        selectedOption:
          selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : -1
      }));

      const totalTime = (activeTest.durationMinutes || 15) * 60;
      const timeSpent = totalTime - timerSeconds;

      const res = await submitQuiz(activeTest._id, {
        answers: answersPayload,
        timeSpentSeconds: timeSpent > 0 ? timeSpent : 0
      });

      if (res.data.success) {
        setQuizResult(res.data);
        // Refresh attempts
        getMyQuizAttempts().then((r) => setAttempts(r.data?.attempts || []));
      }
    } catch (err) {
      alert("Quiz submission error: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 0" }}>
        <Loader />
      </div>
    );
  }

  // Active Quiz View
  if (activeTest) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <span className="eyebrow">ASSESSMENT IN PROGRESS</span>
            <h1 style={{ margin: "4px 0", fontSize: 24 }}>{activeTest.title}</h1>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
              Passing criteria: {activeTest.passingPercentage}% · Total Questions: {activeTest.questions?.length || 0}
            </p>
          </div>

          {!quizResult && (
            <div className="quiz-timer-badge">
              <FiClock /> Time Remaining: <strong>{formatTime(timerSeconds)}</strong>
            </div>
          )}
        </div>

        {/* Results Screen */}
        {quizResult ? (
          <div className="quiz-runner-card">
            <div style={{ textAlign: "center", paddingBottom: 24, borderBottom: "1px solid var(--border)", marginBottom: 28 }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: quizResult.attempt.passed ? "#DCFCE7" : "#FEE2E2",
                  color: quizResult.attempt.passed ? "#15803D" : "#DC2626",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 32,
                  margin: "0 auto 14px"
                }}
              >
                {quizResult.attempt.passed ? <FiCheckCircle /> : <FiXCircle />}
              </div>

              <h2 style={{ margin: "0 0 6px" }}>
                {quizResult.attempt.passed ? "Congratulations! You Passed!" : "Assessment Not Cleared"}
              </h2>

              <p style={{ color: "var(--muted)", margin: "0 0 16px" }}>
                Score: <strong>{quizResult.attempt.score} / {quizResult.attempt.totalMarks}</strong> ({quizResult.attempt.percentage}%)
                {" · "}Pass Requirement: {quizResult.attempt.passingPercentage}%
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleStartQuiz(activeTest)}
                >
                  <FiRotateCcw /> Retake Quiz
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setActiveTest(null);
                    setQuizResult(null);
                  }}
                >
                  Back to Assessments
                </button>
              </div>
            </div>

            {/* Answer Key & Review */}
            <h3 style={{ margin: "0 0 18px", fontSize: 18 }}>Detailed Review & Explanations</h3>
            <div style={{ display: "grid", gap: 20 }}>
              {quizResult.review?.map((q, idx) => (
                <div
                  key={q._id}
                  style={{
                    background: q.isCorrect ? "#F0FDF4" : "#FEF2F2",
                    border: `1px solid ${q.isCorrect ? "#BBF7D0" : "#FECACA"}`,
                    borderRadius: 14,
                    padding: 20
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <strong style={{ fontSize: 15 }}>
                      Q{idx + 1}. {q.question}
                    </strong>
                    <span style={{ fontSize: 12, fontWeight: 700, color: q.isCorrect ? "#15803D" : "#DC2626" }}>
                      {q.isCorrect ? "Correct (+1)" : "Incorrect (0)"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: 6, margin: "12px 0" }}>
                    {q.options?.map((opt, optIdx) => {
                      const isStudent = q.studentSelected === optIdx;
                      const isCorrect = q.correctAnswer === optIdx;

                      let optBg = "#FFFFFF";
                      let optBorder = "#E5E7EB";
                      if (isCorrect) {
                        optBg = "#DCFCE7";
                        optBorder = "#86EFAC";
                      } else if (isStudent && !isCorrect) {
                        optBg = "#FEE2E2";
                        optBorder = "#FCA5A5";
                      }

                      return (
                        <div
                          key={optIdx}
                          style={{
                            padding: "8px 14px",
                            borderRadius: 8,
                            background: optBg,
                            border: `1px solid ${optBorder}`,
                            fontSize: 13,
                            display: "flex",
                            justifyContent: "space-between"
                          }}
                        >
                          <span>{opt}</span>
                          {isCorrect && <strong style={{ color: "#15803D", fontSize: 11 }}>Correct Answer</strong>}
                          {isStudent && !isCorrect && <span style={{ color: "#DC2626", fontSize: 11 }}>Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <p style={{ margin: "10px 0 0", fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Question Form */
          <div className="quiz-runner-card">
            <div style={{ display: "grid", gap: 28 }}>
              {activeTest.questions?.map((q, idx) => (
                <div key={q._id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24 }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 750 }}>
                    {idx + 1}. {q.question}
                  </h3>

                  <div>
                    {q.options?.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q._id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`quiz-option-label ${isSelected ? "selected" : ""}`}
                          onClick={() => handleSelectOption(q._id, optIdx)}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              border: `2px solid ${isSelected ? "var(--primary)" : "#CBD5E1"}`,
                              background: isSelected ? "var(--primary)" : "transparent",
                              display: "grid",
                              placeItems: "center"
                            }}
                          >
                            {isSelected && <FiCheck style={{ color: "#FFFFFF", fontSize: 12 }} />}
                          </div>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  if (confirm("Are you sure you want to exit? Your answers will not be saved.")) {
                    setActiveTest(null);
                  }
                }}
              >
                Cancel & Exit
              </button>

              <button
                type="button"
                className="btn btn-primary btn-large"
                onClick={handleSubmitQuiz}
                disabled={submitting}
              >
                {submitting ? "Grading..." : "Submit Assessment"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz Catalog & Past Attempts List
  return (
    <div>
      <div className="portal-heading">
        <div>
          <div className="eyebrow">EVALUATIONS & TESTS</div>
          <h1>Practice Assessments & Quizzes</h1>
          <p>Test your conceptual understanding with timed, automatically graded evaluations.</p>
        </div>
      </div>

      {tests.length > 0 ? (
        <div style={{ display: "grid", gap: 16 }}>
          {tests.map((test) => (
            <div className="test-row" key={test._id} style={{ alignItems: "center" }}>
              <div>
                <span className="course-category-tag">
                  {test.course?.name || test.subject?.name || "Practice Quiz"}
                </span>
                <h3 style={{ margin: "4px 0" }}>{test.title}</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
                  {test.description || "Timed assessment to test your mastery of module concepts."}
                </p>
                <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
                  <span><FiClock /> {test.durationMinutes} Minutes</span>
                  <span><FiAward /> Passing: {test.passingPercentage}%</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleStartQuiz(test)}
              >
                Start Test <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No Quizzes Available</h3>
          <p>Assessments will appear here as they are published by the instructor.</p>
        </div>
      )}

      {/* Past Attempts Table */}
      {attempts.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div className="portal-section-head">
            <h2>Your Recent Quiz Attempts</h2>
          </div>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Score</th>
                  <th>Result</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((att) => (
                  <tr key={att._id}>
                    <td><strong>{att.test?.title || "Quiz"}</strong></td>
                    <td>{att.score} / {att.totalMarks} ({att.percentage}%)</td>
                    <td>
                      <span className={`badge ${att.passed ? "badge-replied" : "badge-new"}`}>
                        {att.passed ? "Passed" : "Needs Practice"}
                      </span>
                    </td>
                    <td>{new Date(att.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}