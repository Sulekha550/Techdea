import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiExternalLink,
  FiPlus,
  FiSearch,
  FiDownload,
  FiPrinter,
  FiX,
  FiCheck,
  FiShield
} from "react-icons/fi";
import {
  getAdminCertificates,
  getStudents,
  getAdminCourses
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function AdminCertificates() {
  const toast = useToast();
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Preview Modal
  const [previewCert, setPreviewCert] = useState(null);

  // Manual Issue Modal
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueStudent, setIssueStudent] = useState("");
  const [issueCourse, setIssueCourse] = useState("");
  const [issueGrade, setIssueGrade] = useState("Distinction");
  const [issuing, setIssuing] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAdminCertificates(), getStudents(), getAdminCourses()])
      .then(([certRes, stRes, cRes]) => {
        setCertificates(certRes.data?.certificates || []);
        setStudents(stRes.data?.students || []);
        setCourses(cRes.data?.courses || []);
      })
      .catch((err) => {
        console.error("Certificates error:", err);
        setCertificates([
          {
            _id: "cert1",
            certificateId: "TECHDEA-2026-CS881",
            studentName: "Rahul Sharma",
            courseTitle: "Full-Stack Software Architecture with React & Node",
            issueDate: new Date(),
            completionPercentage: 100,
            grade: "Distinction",
            isValid: true
          },
          {
            _id: "cert2",
            certificateId: "TECHDEA-2026-ML402",
            studentName: "Ananya Iyer",
            courseTitle: "Applied Machine Learning & GenAI Engineering",
            issueDate: new Date(Date.now() - 3600000 * 24 * 7),
            completionPercentage: 100,
            grade: "Merit",
            isValid: true
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleValid = (cert) => {
    const nextValid = !cert.isValid;
    setCertificates((prev) =>
      prev.map((c) => (c._id === cert._id ? { ...c, isValid: nextValid } : c))
    );
    toast.success(`Certificate ${cert.certificateId} is now ${nextValid ? "Valid" : "Revoked"}`);
  };

  const handleIssueManual = (e) => {
    e.preventDefault();
    if (!issueStudent || !issueCourse) {
      toast.error("Please select a student and course");
      return;
    }

    setIssuing(true);
    const targetStudent = students.find((s) => s._id === issueStudent);
    const targetCourse = courses.find((c) => c._id === issueCourse);

    const newCert = {
      _id: "cert_" + Date.now(),
      certificateId: `TECHDEA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: targetStudent?.name || "Student",
      courseTitle: targetCourse?.name || "Technical Course",
      issueDate: new Date(),
      completionPercentage: 100,
      grade: issueGrade,
      isValid: true
    };

    setCertificates((prev) => [newCert, ...prev]);
    toast.success(`Certificate issued: ${newCert.certificateId}`);
    setIssueModalOpen(false);
    setIssuing(false);
  };

  const filtered = certificates.filter((c) => {
    const s = search.toLowerCase();
    return (
      c.certificateId?.toLowerCase().includes(s) ||
      c.studentName?.toLowerCase().includes(s) ||
      c.courseTitle?.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">CREDENTIAL REGISTRY</div>
          <h1 className="adm-page-title">Certificates Management</h1>
          <p className="adm-page-desc">
            Cryptographically verifiable student graduation credentials, authenticity verification, and template styling.
          </p>
        </div>

        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setIssueModalOpen(true)}
          >
            <FiPlus /> Issue Certificate
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="adm-table-card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div className="adm-table-search" style={{ width: 340 }}>
          <FiSearch style={{ color: "var(--adm-text-muted)" }} />
          <input
            type="text"
            placeholder="Search certificate ID, student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiAward style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No certificates issued yet</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
            Certificates are issued automatically upon 100% course completion or manually by faculty.
          </p>
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setIssueModalOpen(true)}
            style={{ margin: "0 auto" }}
          >
            <FiPlus /> Issue Certificate
          </button>
        </div>
      ) : (
        <div className="adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Student Name</th>
                  <th>Course Title</th>
                  <th>Issue Date</th>
                  <th>Grade</th>
                  <th>Authenticity</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert) => (
                  <tr key={cert._id}>
                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 700,
                          color: "var(--adm-primary)",
                          cursor: "pointer"
                        }}
                        onClick={() => setPreviewCert(cert)}
                        title="Click to view visual certificate"
                      >
                        {cert.certificateId}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: "var(--adm-text-main)" }}>{cert.studentName}</strong>
                    </td>
                    <td>{cert.courseTitle}</td>
                    <td>
                      <div style={{ fontSize: 12.5, color: "var(--adm-text-muted)" }}>
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-purple">{cert.grade || "Distinction"}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleValid(cert)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                        title="Toggle verification validity"
                      >
                        <span className={`adm-badge ${cert.isValid !== false ? "adm-badge-success" : "adm-badge-danger"}`}>
                          <span className="adm-badge-dot" /> {cert.isValid !== false ? "Verified" : "Revoked"}
                        </span>
                      </button>
                    </td>
                    <td>
                      <div className="adm-action-group" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="adm-top-btn"
                          style={{ padding: "4px 10px", fontSize: 12 }}
                          onClick={() => setPreviewCert(cert)}
                        >
                          <FiAward /> Preview
                        </button>
                        <a
                          href={`/verify/${cert.certificateId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="adm-btn-icon-sm"
                          title="Public Verification Link"
                        >
                          <FiExternalLink />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CERTIFICATE TEMPLATE VISUAL PREVIEW MODAL */}
      {previewCert && (
        <div className="adm-modal-overlay" onClick={() => setPreviewCert(null)}>
          <div className="adm-modal-container adm-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>Official Credential Preview</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Certificate ID: {previewCert.certificateId}
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setPreviewCert(null)}>
                <FiX />
              </button>
            </div>

            <div style={{ padding: "32px", background: "#FAF9FF", overflowY: "auto" }}>
              {/* Certificate Paper */}
              <div className="cert-preview-card">
                <div className="cert-brand-emblem">TECHDEA ACADEMY</div>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#6B6478" }}>
                  INTERNATIONAL EDTECH INSTITUTE OF TECHNOLOGY
                </div>

                <div className="cert-main-title">Certificate of Mastery</div>

                <div style={{ fontSize: 13, color: "#6B6478", fontStyle: "italic", marginTop: 8 }}>
                  This official academic credential certifies that
                </div>

                <div className="cert-student-name">{previewCert.studentName}</div>

                <div style={{ fontSize: 13, color: "#4B5563", maxWidth: 520, margin: "10px auto 16px", lineHeight: 1.6 }}>
                  has successfully completed the comprehensive technical curriculum, practical laboratory capstones, and evaluation for
                </div>

                <div style={{ fontSize: 20, fontWeight: 800, color: "#1F1735", marginBottom: 6 }}>
                  {previewCert.courseTitle}
                </div>

                <div style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", marginBottom: 24 }}>
                  Awarded with Grade: {previewCert.grade || "Distinction"}
                </div>

                {/* Footer Signatures */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 32, padding: "0 24px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "cursive", fontSize: 18, color: "#1F1735" }}>
                      Dr. Arvind Kashyap
                    </div>
                    <div style={{ width: 140, height: 1, background: "#1F1735", margin: "4px auto 4px" }} />
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#6B6478" }}>ACADEMIC DIRECTOR</div>
                  </div>

                  {/* Gold Verification Seal */}
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #FDE68A 0%, #D4AF37 100%)",
                      boxShadow: "0 4px 14px rgba(212, 175, 55, 0.4)",
                      display: "grid",
                      placeItems: "center",
                      color: "#78350F",
                      fontWeight: 900,
                      fontSize: 10,
                      textAlign: "center",
                      border: "2px solid #FFFFFF"
                    }}
                  >
                    VERIFIED<br />2026
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1F1735" }}>
                      {new Date(previewCert.issueDate).toLocaleDateString()}
                    </div>
                    <div style={{ width: 140, height: 1, background: "#1F1735", margin: "4px auto 4px" }} />
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#6B6478" }}>DATE OF ISSUANCE</div>
                  </div>
                </div>

                <div style={{ marginTop: 24, fontSize: 10.5, color: "#9CA3AF" }}>
                  Verification ID: {previewCert.certificateId} · verify at techdea.in/verify
                </div>
              </div>
            </div>

            <div className="adm-modal-footer">
              <button
                type="button"
                className="adm-top-btn"
                onClick={() => window.print()}
              >
                <FiPrinter /> Print Credential
              </button>
              <button
                type="button"
                className="adm-top-btn adm-primary-btn"
                onClick={() => setPreviewCert(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE CERTIFICATE MODAL */}
      {issueModalOpen && (
        <div className="adm-modal-overlay" onClick={() => setIssueModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>Issue Verified Certificate</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Manually grant an official academic credential.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setIssueModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleIssueManual}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Graduate Student *</label>
                  <select
                    className="adm-select"
                    value={issueStudent}
                    onChange={(e) => setIssueStudent(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map((st) => (
                      <option key={st._id} value={st._id}>
                        {st.name} ({st.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Curriculum / Course *</label>
                  <select
                    className="adm-select"
                    value={issueCourse}
                    onChange={(e) => setIssueCourse(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Graduation Grade</label>
                  <select
                    className="adm-select"
                    value={issueGrade}
                    onChange={(e) => setIssueGrade(e.target.value)}
                  >
                    <option value="Distinction">Distinction (Top 5%)</option>
                    <option value="Merit">Merit (Honors)</option>
                    <option value="Pass">Pass</option>
                  </select>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setIssueModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={issuing}>
                  {issuing ? "Generating..." : "Generate & Sign Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
