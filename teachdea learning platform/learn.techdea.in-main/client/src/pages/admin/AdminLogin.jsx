import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import AuthCard from "../auth/_AuthCard.jsx";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
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

  return (
    <AuthCard
      title="Administrator login"
      subtitle="Authorized administrators only."
      onSubmit={submit}
      form={form}
      setForm={setForm}
      error={error}
      loading={loading}
      mode="admin"
    />
  );
}
