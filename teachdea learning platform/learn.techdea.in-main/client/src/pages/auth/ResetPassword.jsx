import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import { resetPassword } from "../../services/authService.js";
import AuthCard from "./_AuthCard.jsx";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    if (password !== confirmPassword) {
      setFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }
    if (password.length < 6) {
      setFeedback({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(token, { password });
      setFeedback({ type: "success", message: res.data.message || "Password updated. Redirecting…" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || "Invalid or expired reset token." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Set new password" subtitle="Choose a secure password for your TechDea account." mode="reset">
      {feedback && (
        <div className={`alert ${feedback.type}`}>
          {feedback.type === "success" && <FiCheckCircle />}
          {feedback.message}
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          New password
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </label>
        <label>
          Confirm password
          <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
        </label>
        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
          <FiLock /> {loading ? "Updating..." : "Save new password"}
        </button>
      </form>
      <div className="auth-links"><Link to="/login">Return to login</Link></div>
    </AuthCard>
  );
}
