import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiCheckCircle } from "react-icons/fi";
import { forgotPassword } from "../../services/authService.js";
import AuthCard from "./_AuthCard.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await forgotPassword({ email });
      setResult({ type: "success", message: res.data.message, resetUrl: res.data.resetUrl });
    } catch (err) {
      setResult({ type: "error", message: err.response?.data?.message || "Failed to process request." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot password?" subtitle="Enter your registered email to receive reset instructions." mode="forgot">
      {result && (
        <div className={`alert ${result.type}`}>
          {result.type === "success" && <FiCheckCircle />}
          {result.message}
          {result.resetUrl && (
            <div style={{ marginTop: 10, wordBreak: "break-all", fontSize: 12 }}>
              <Link to={result.resetUrl.replace(/^https?:\/\/[^/]+/, "")} style={{ color: "var(--primary)" }}>
                Open reset link
              </Link>
            </div>
          )}
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
          <FiMail /> {loading ? "Sending..." : "Reset password"}
        </button>
      </form>
      <div className="auth-links"><Link to="/login">Return to login</Link></div>
    </AuthCard>
  );
}
