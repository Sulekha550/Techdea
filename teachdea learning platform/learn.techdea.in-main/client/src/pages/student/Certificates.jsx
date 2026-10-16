import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiAward, FiCheckCircle, FiExternalLink, FiPrinter } from "react-icons/fi";
import { getMyCertificates } from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getMyCertificates()
      .then((res) => {
        if (isMounted) setCertificates(res.data?.certificates || []);
      })
      .catch((err) => {
        console.error("Certificates load error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "60px 0" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="portal-heading">
        <div>
          <div className="eyebrow">ACCREDITATION & BADGES</div>
          <h1>My Certificates</h1>
          <p>Official course completion credentials issued by TechDea Learning Platform.</p>
        </div>
      </div>

      {certificates.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {certificates.map((cert) => (
            <div
              key={cert._id}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 24,
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div className="stat-icon" style={{ background: "#DCFCE7", color: "#16A34A" }}>
                  <FiAward style={{ fontSize: 22 }} />
                </div>
                <div>
                  <span className="badge badge-replied" style={{ fontSize: 11, marginBottom: 4 }}>
                    <FiCheckCircle style={{ marginRight: 4 }} /> Verified Credential
                  </span>
                  <strong style={{ display: "block", fontSize: 16 }}>{cert.courseTitle}</strong>
                </div>
              </div>

              <div style={{ fontSize: 13, color: "var(--muted)", margin: "auto 0 16px", display: "grid", gap: 4 }}>
                <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                <span>ID: <code style={{ color: "var(--primary)", fontWeight: 700 }}>{cert.certificateId}</code></span>
                <span>Honors: {cert.grade || "Distinction"}</span>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <Link
                  to={`/verify/${cert.certificateId}`}
                  target="_blank"
                  className="btn btn-primary btn-small"
                  style={{ flex: 1 }}
                >
                  <FiExternalLink /> Public Verification
                </Link>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => setSelectedCert(cert)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FiAward style={{ fontSize: 48, color: "var(--muted)", marginBottom: 12 }} />
          <h3>No Certificates Earned Yet</h3>
          <p>
            Certificates are automatically awarded when you complete 100% of a course curriculum.
          </p>
          <Link to="/my-courses" className="btn btn-primary" style={{ marginTop: 14 }}>
            Continue Learning
          </Link>
        </div>
      )}

      {/* Printable Certificate Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div
            className="modal-box"
            style={{ maxWidth: 840 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={() => window.print()}
              >
                <FiPrinter /> Print / Save PDF
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setSelectedCert(null)}
              >
                Close
              </button>
            </div>

            <div className="certificate-frame" style={{ margin: "10px 0" }}>
              <div className="certificate-seal">
                <FiAward />
              </div>
              <h2 style={{ fontSize: 24, margin: "10px 0 4px", color: "var(--muted)" }}>
                Certificate of Completion
              </h2>
              <div className="cert-student-name">{selectedCert.studentName}</div>
              <p style={{ fontSize: 16, color: "#374151", margin: "14px auto", maxWidth: 500 }}>
                has successfully completed all requirements for:
              </p>
              <h3 style={{ fontSize: 22, color: "var(--primary-dark)", margin: "12px 0 20px" }}>
                {selectedCert.courseTitle}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 460, margin: "20px auto", textAlign: "left", fontSize: 12 }}>
                <div>
                  <span style={{ color: "var(--muted)" }}>Certificate ID:</span>
                  <strong>{selectedCert.certificateId}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)" }}>Date of Issue:</span>
                  <strong>{new Date(selectedCert.issueDate).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
