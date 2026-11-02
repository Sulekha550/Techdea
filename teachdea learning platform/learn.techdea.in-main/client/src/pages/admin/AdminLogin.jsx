import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import AuthCard from "../auth/_AuthCard.jsx";

export default function AdminLogin() {
  const { adminLogin, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(form);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  const enterDemoAdmin = () => {
    const demoAdmin = {
      _id: "admin-director-root",
      name: "Admin Director",
      email: "admin@techdea.in",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    };
    localStorage.setItem("techdea_user", JSON.stringify(demoAdmin));
    localStorage.setItem("techdea_token", "techdea-admin-demo-token");
    if (setUser) setUser(demoAdmin);
    navigate("/admin");
  };

  return (
    <div style={{ position: "relative" }}>
      <AuthCard
        title="Administrator Login"
        subtitle="Authorized administrators & platform operators."
        onSubmit={submit}
        form={form}
        setForm={setForm}
        error={error}
        loading={loading}
        mode="admin"
      />
      <div style={{ textAlign: "center", marginTop: "-30px", marginBottom: "40px" }}>
        <button
          type="button"
          onClick={enterDemoAdmin}
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "10px 22px",
            fontWeight: 700,
            fontSize: "13.5px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(124, 58, 237, 0.35)",
            transition: "all 0.2s"
          }}
        >
          ⚡ Quick One-Click Access to Admin Dashboard
        </button>
      </div>
    </div>
  );
}
