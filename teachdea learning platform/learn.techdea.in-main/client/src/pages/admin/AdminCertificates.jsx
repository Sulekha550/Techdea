import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiAward, FiExternalLink } from "react-icons/fi";
import { getAdminCertificates } from "../../services/adminService.js";
import Loader from "../../components/common/Loader.jsx";

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminCertificates()
      .then((res) => {
        if (isMounted) setCertificates(res.data?.certificates || []);
      })
      .catch((err) => console.error("Admin certificates error:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <div className="eyebrow">CREDENTIAL REGISTRY</div>
          <h1>Issued Certificates</h1>
          <p>Official registry of student graduation credentials and verification IDs.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 36px" }}><Loader /></div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Issue Date</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.length > 0 ? (
                certificates.map((cert) => (
                  <tr key={cert._id}>
                    <td>
                      <code style={{ color: "var(--primary)", fontWeight: 700 }}>
                        {cert.certificateId}
                      </code>
                    </td>
                    <td>
                      <strong>{cert.studentName}</strong>
                      <small style={{ display: "block", color: "var(--muted)" }}>
                        {cert.student?.email}
                      </small>
                    </td>
                    <td>{cert.courseTitle}</td>
                    <td>{new Date(cert.issueDate).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-replied">{cert.grade || "Distinction"}</span>
                    </td>
                    <td>
                      <Link
                        to={`/verify/${cert.certificateId}`}
                        target="_blank"
                        className="table-action"
                      >
                        <FiExternalLink /> Verify Link
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-empty">
                    No certificates have been issued yet. Students receive them upon completing 100% of a course.
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
