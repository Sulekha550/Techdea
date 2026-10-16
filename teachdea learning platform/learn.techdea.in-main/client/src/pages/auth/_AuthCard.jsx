import { Link } from "react-router-dom";

export default function AuthCard({
  title,
  subtitle,
  onSubmit,
  form,
  setForm,
  error,
  loading,
  mode = "register",
  extra,
  children
}) {
  const isLogin = mode === "login";
  const isAdmin = mode === "admin";

  return (
    <section className="auth-page">
      <div className="auth-split">
        <div className="auth-brand-panel">
          <div className="eyebrow" style={{ color: "#C4B5FD" }}>TECHDEA</div>
          <h2>Build your <span>digital future</span></h2>
          <p>
            {isAdmin
              ? "Administrator access to the TechDea learning console."
              : "Professional technology training — courses, progress, tests, and certificates in one product."}
          </p>
        </div>
        <div className="auth-form-panel">
          <Link className="auth-brand" to="/">Tech<span>Dea</span></Link>
          <div className="eyebrow">
            {isAdmin ? "ADMIN LOGIN" : isLogin ? "STUDENT LOGIN" : mode === "forgot" ? "ACCOUNT RECOVERY" : mode === "reset" ? "NEW PASSWORD" : "CREATE ACCOUNT"}
          </div>
          <h1>{title}</h1>
          <p style={{ color: "var(--muted)" }}>{subtitle}</p>
          {error && <div className="alert error">{error}</div>}
          {children || (
            <form onSubmit={onSubmit} className="auth-form">
              {!isLogin && mode === "register" && (
                <label>Full name
                  <input required value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                </label>
              )}
              <label>Email
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              </label>
              <label>Password
                <input required minLength="6" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete={isLogin ? "current-password" : "new-password"} />
              </label>
              {mode === "register" && (
                <label>Phone (optional)
                  <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
                </label>
              )}
              {isLogin && (
                <div className="checkbox-row">
                  <label>
                    <input type="checkbox" name="remember" /> Remember me
                  </label>
                  <Link to="/forgot-password">Forgot password</Link>
                </div>
              )}
              <button className="btn btn-primary btn-large" disabled={loading}>
                {loading ? "Please wait..." : isLogin || isAdmin ? "Login" : "Create account"}
              </button>
            </form>
          )}
          {extra}
        </div>
      </div>
    </section>
  );
}
