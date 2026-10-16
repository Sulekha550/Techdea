import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle, FiShield, FiAlertTriangle, FiAward } from "react-icons/fi";
import { verifyCertificate } from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";

export default function CertificateVerify() {
  const { certificateId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    verifyCertificate(certificateId)
      .then((res) => {
        if (isMounted) setData(res.data.certificate);
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Certificate could not be verified or is invalid."
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [certificateId]);

  return (
    <section className="section page-top">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="section-heading centered">
          <div className="eyebrow">
            <FiShield /> OFFICIAL VERIFICATION
          </div>
          <h1>Certificate Verification Registry</h1>
          <p>Verify authenticity of credentials issued by TechDea Learning Platform.</p>
        </div>

        {loading ? (
          <div style={{ padding: "60px 0" }}><Loader /></div>
        ) : error ? (
          <div className="empty-state" style={{ borderColor: "#FECACA", background: "#FFF5F5" }}>
            <FiAlertTriangle style={{ fontSize: 44, color: "var(--danger)", marginBottom: 12 }} />
            <h3 style={{ color: "var(--danger)" }}>Verification Unsuccessful</h3>
            <p>{error}</p>
            <span style={{ fontSize: 13, color: "var(--muted)", display: "block", marginTop: 8 }}>
              Certificate ID queried: <strong>{certificateId}</strong>
            </span>
            <Link to="/courses" className="btn btn-primary" style={{ marginTop: 20 }}>
              Browse Verified Courses
            </Link>
          </div>
        ) : (
          <div className="certificate-frame">
            <div className="certificate-seal">
              <FiAward />
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#DCFCE7", color: "#15803D", padding: "6px 14px", borderRadius: 999, fontWeight: 700, fontSize: 13, marginBottom: 16 }}>
              <FiCheckCircle /> Authenticated & Verified Credential
            </div>

            <h2 style={{ fontSize: 24, margin: "10px 0 4px", color: "var(--muted)" }}>
              This certifies that
            </h2>

            <div className="cert-student-name">{data.studentName}</div>

            <p style={{ fontSize: 17, color: "#374151", maxWidth: 600, margin: "14px auto", lineHeight: 1.6 }}>
              has successfully satisfied all graduation requirements and completed the curriculum for:
            </p>

            <h3 style={{ fontSize: 22, color: "var(--primary-dark)", margin: "12px 0 20px" }}>
              {data.courseTitle}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 500, margin: "24px auto", padding: 18, background: "var(--soft)", borderRadius: 12, textAlign: "left", fontSize: 13 }}>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Certificate ID:</span>
                <strong style={{ fontFamily: "monospace", fontSize: 14 }}>{data.certificateId}</strong>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Issue Date:</span>
                <strong>{new Date(data.issueDate).toLocaleDateString()}</strong>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Completion:</span>
                <strong>{data.completionPercentage}% (Distinction)</strong>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Issuer:</span>
                <strong>{data.platform || "TechDea Learning Platform"}</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={() => window.print()}
              style={{ marginTop: 10 }}
            >
              Print / Save Certificate
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
