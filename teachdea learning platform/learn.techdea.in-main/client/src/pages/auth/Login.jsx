import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="register-page">
      <style>{`
        .register-page {
          min-height: calc(100vh - 72px);
          padding: 42px 24px;
          background: #f6f7fb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .register-shell {
          width: 100%;
          max-width: 1120px;
          min-height: 650px;
          background: #fff;
          border-radius: 28px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          box-shadow:
            0 25px 70px rgba(15,23,42,.10),
            0 4px 18px rgba(15,23,42,.04);
          border: 1px solid #e9edf4;
        }

        /* ================= LEFT ================= */

        .register-showcase {
          position: relative;
          min-height: 650px;
          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              rgba(25,20,65,.94),
              rgba(55,42,130,.84)
            ),
            url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=90")
            center / cover;

          color: white;
          padding: 48px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .register-showcase::after {
          content: "";
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          right: -180px;
          bottom: -180px;
          background: rgba(255,255,255,.08);
        }

        .register-showcase-top,
        .register-showcase-content,
        .register-showcase-bottom {
          position: relative;
          z-index: 2;
        }

        /* ================= BRAND ================= */

        .register-brand {
          display: inline-flex;
          align-items: center;
          gap: 13px;
        }

        /* ONLY LOGO - NO WHITE BACKGROUND */

        .register-logo {
          width: 58px;
          height: 58px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: transparent;
          border: none;
          padding: 0;
          box-shadow: none;

          overflow: visible;
        }

        .register-logo img {
          width: 100%;
          height: 100%;

          object-fit: contain;
          display: block;

          background: transparent;
        }

        .register-brand-text {
          display: flex;
          flex-direction: column;
        }

        .register-brand-name {
          display: flex;
          align-items: center;
          gap: 5px;

          font-size: 21px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -.5px;
        }

        .register-brand-name .techdea {
          color: #a78bfa;
        }

        .register-brand-name .learn {
          color: #ffffff;
        }

        .register-brand-text > span {
          display: block;
          margin-top: 6px;

          color: rgba(255,255,255,.62);

          font-size: 10px;
          letter-spacing: .35px;
        }

        /* ================= CONTENT ================= */

        .register-showcase-content {
          max-width: 475px;
        }

        .register-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          padding: 7px 11px;
          border-radius: 8px;

          background: rgba(167,139,250,.15);
          border: 1px solid rgba(167,139,250,.25);

          color: #ddd6fe;

          font-size: 11px;
          font-weight: 800;
          letter-spacing: .9px;

          margin-bottom: 18px;
        }

        .register-showcase-content h1 {
          margin: 0;

          font-size: clamp(38px,4vw,52px);
          line-height: 1.06;
          letter-spacing: -2px;
          font-weight: 850;
        }

        .register-showcase-content h1 span {
          color: #a78bfa;
        }

        .register-showcase-content p {
          margin: 20px 0 0;
          max-width: 430px;

          color: rgba(255,255,255,.74);

          font-size: 15px;
          line-height: 1.75;
        }

        .register-features {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 27px;
        }

        .register-feature {
          display: flex;
          align-items: center;
          gap: 7px;

          padding: 8px 11px;
          border-radius: 9px;

          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);

          font-size: 12px;
          color: rgba(255,255,255,.86);
        }

        .register-feature svg {
          color: #a78bfa;
        }

        /* ================= BOTTOM ================= */

        .register-showcase-bottom {
          display: flex;
          align-items: center;
          gap: 28px;
          padding-top: 30px;
        }

        .register-stat {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .register-stat-icon {
          width: 39px;
          height: 39px;
          border-radius: 10px;

          display: grid;
          place-items: center;

          background: rgba(167,139,250,.13);
          color: #c4b5fd;
        }

        .register-stat strong {
          display: block;
          font-size: 13px;
        }

        .register-stat span {
          display: block;
          margin-top: 3px;

          color: rgba(255,255,255,.58);
          font-size: 11px;
        }

        /* ================= RIGHT ================= */

        .register-form-side {
          padding: 45px 58px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #fff;
        }

        .register-form-container {
          width: 100%;
          max-width: 390px;
        }

        .register-heading {
          margin-bottom: 27px;
        }

        .register-heading h2 {
          margin: 0;

          color: #111827;

          font-size: 31px;
          line-height: 1.15;
          letter-spacing: -.9px;
          font-weight: 850;
        }

        .register-heading p {
          margin: 9px 0 0;

          color: #64748b;

          font-size: 14px;
          line-height: 1.6;
        }

        /* ================= ERROR ================= */

        .register-error {
          display: flex;
          align-items: flex-start;
          gap: 9px;

          padding: 12px 13px;
          margin-bottom: 17px;

          border-radius: 10px;

          background: #fff5f5;
          border: 1px solid #fecaca;

          color: #b91c1c;

          font-size: 13px;
          line-height: 1.45;
        }

        /* ================= INPUT ================= */

        .register-field {
          margin-bottom: 16px;
        }

        .register-field label {
          display: block;
          margin-bottom: 8px;

          color: #334155;

          font-size: 13px;
          font-weight: 750;
        }

        .register-input-box {
          position: relative;
        }

        .register-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;

          transform: translateY(-50%);

          color: #94a3b8;

          pointer-events: none;
        }

        .register-input {
          width: 100%;
          height: 48px;
          box-sizing: border-box;

          border: 1px solid #dce2ea;
          border-radius: 10px;

          background: #fff;

          padding: 0 43px;

          color: #111827;
          font-size: 14px;

          outline: none;

          transition: .2s ease;
        }

        .register-input:hover {
          border-color: #cbd5e1;
        }

        .register-input:focus {
          border-color: #6366f1;

          box-shadow:
            0 0 0 3px rgba(99,102,241,.10);
        }

        .register-input::placeholder {
          color: #a1a9b5;
        }

        /* ================= PASSWORD ================= */

        .register-password-toggle {
          position: absolute;
          right: 13px;
          top: 50%;

          transform: translateY(-50%);

          border: 0;
          padding: 4px;

          background: transparent;

          color: #94a3b8;

          cursor: pointer;

          display: grid;
          place-items: center;
        }

        .register-password-toggle:hover {
          color: #4f46e5;
        }

        /* ================= BUTTON ================= */

        .register-button {
          width: 100%;
          height: 51px;

          margin-top: 5px;

          border: 0;
          border-radius: 10px;

          background: linear-gradient(
            135deg,
            #4f46e5,
            #6366f1
          );

          color: white;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          font-size: 14px;
          font-weight: 800;

          cursor: pointer;

          transition: .2s ease;

          box-shadow:
            0 8px 18px rgba(79,70,229,.20);
        }

        .register-button:hover:not(:disabled) {
          background: linear-gradient(
            135deg,
            #4338ca,
            #4f46e5
          );

          transform: translateY(-1px);

          box-shadow:
            0 11px 22px rgba(79,70,229,.25);
        }

        .register-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .register-button:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        /* ================= TERMS ================= */

        .register-terms {
          margin-top: 14px;

          color: #94a3b8;

          font-size: 11px;
          line-height: 1.6;

          text-align: center;
        }

        /* ================= LOGIN ================= */

        .register-divider {
          display: flex;
          align-items: center;
          gap: 12px;

          margin: 21px 0 18px;

          color: #94a3b8;

          font-size: 11px;
        }

        .register-divider::before,
        .register-divider::after {
          content: "";

          height: 1px;

          flex: 1;

          background: #e8edf3;
        }

        .login-box {
          text-align: center;

          padding: 15px;

          border-radius: 11px;

          background: #f8f7ff;

          border: 1px solid #e8e5ff;

          color: #64748b;

          font-size: 13px;
        }

        .login-box a {
          color: #4f46e5;

          font-weight: 800;

          text-decoration: none;
        }

        .login-box a:hover {
          text-decoration: underline;
        }

        .register-security {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 6px;

          margin-top: 17px;

          color: #9aa5b4;

          font-size: 11px;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 900px) {
          .register-shell {
            max-width: 520px;
            grid-template-columns: 1fr;
          }

          .register-showcase {
            min-height: 390px;
            padding: 35px;
          }

          .register-showcase-content h1 {
            font-size: 40px;
          }

          .register-form-side {
            padding: 42px 35px;
          }
        }

        @media (max-width: 520px) {
          .register-page {
            padding: 20px 12px;
          }

          .register-shell {
            border-radius: 20px;
          }

          .register-showcase {
            min-height: 350px;
            padding: 27px;
          }

          .register-logo {
            width: 50px;
            height: 50px;
          }

          .register-brand-name {
            font-size: 18px;
          }

          .register-showcase-content h1 {
            font-size: 34px;
            letter-spacing: -1.2px;
          }

          .register-showcase-content p {
            font-size: 13px;
          }

          .register-feature {
            font-size: 11px;
          }

          .register-showcase-bottom {
            display: none;
          }

          .register-form-side {
            padding: 35px 22px;
          }

          .register-heading h2 {
            font-size: 27px;
          }
        }
      `}</style>

      <div className="register-shell">

        {/* LEFT */}

        <section className="register-showcase">

          <div className="register-showcase-top">

            <div className="register-brand">

              {/* ACTUAL TECHDEA LOGO */}
              <div className="register-logo">
                <img
                  src="https://www.techdea.in/assets/logo-fhwAVZjG.png"
                  alt="TechDea Logo"
                />
              </div>

              <div className="register-brand-text">

                <div className="register-brand-name">
                  <span className="techdea">
                    TechDea
                  </span>

                  <span className="learn">
                    Learn
                  </span>
                </div>

                <span>
                  CONVERTS IDEAS INTO TECHNOLOGIES
                </span>

              </div>

            </div>

          </div>

          <div className="register-showcase-content">

            <div className="register-label">
              <span>✦</span>
              START LEARNING
            </div>

            <h1>
              Your journey
              <br />
              <span>starts here.</span>
            </h1>

            <p>
              Create your TechDea Learn account and get
              access to structured courses, practical
              learning and technology-focused training.
            </p>

            <div className="register-features">

              <div className="register-feature">
                <FiCheck size={14} />
                Practical courses
              </div>

              <div className="register-feature">
                <FiCheck size={14} />
                Learn at your pace
              </div>

              <div className="register-feature">
                <FiCheck size={14} />
                Track progress
              </div>

            </div>

          </div>

          <div className="register-showcase-bottom">

            <div className="register-stat">

              <div className="register-stat-icon">
                <FiCheck size={17} />
              </div>

              <div>
                <strong>Learn</strong>
                <span>Build your knowledge</span>
              </div>

            </div>

            <div className="register-stat">

              <div className="register-stat-icon">
                <FiArrowRight size={17} />
              </div>

              <div>
                <strong>Grow</strong>
                <span>Build your career</span>
              </div>

            </div>

          </div>

        </section>

        {/* RIGHT */}

        <section className="register-form-side">

          <div className="register-form-container">

            <div className="register-heading">

              <h2>
                Create your account
              </h2>

              <p>
                Join TechDea Learn and start your
                learning journey.
              </p>

            </div>

            {error && (
              <div className="register-error">
                <FiLock size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submit}>

              {/* NAME */}

              <div className="register-field">

                <label htmlFor="register-name">
                  Full name
                </label>

                <div className="register-input-box">

                  <FiUser
                    className="register-input-icon"
                    size={17}
                  />

                  <input
                    id="register-name"
                    className="register-input"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="register-field">

                <label htmlFor="register-email">
                  Email address
                </label>

                <div className="register-input-box">

                  <FiMail
                    className="register-input-icon"
                    size={17}
                  />

                  <input
                    id="register-email"
                    className="register-input"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              {/* PHONE */}

              <div className="register-field">

                <label htmlFor="register-phone">
                  Phone number
                </label>

                <div className="register-input-box">

                  <FiPhone
                    className="register-input-icon"
                    size={17}
                  />

                  <input
                    id="register-phone"
                    className="register-input"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="register-field">

                <label htmlFor="register-password">
                  Password
                </label>

                <div className="register-input-box">

                  <FiLock
                    className="register-input-icon"
                    size={17}
                  />

                  <input
                    id="register-password"
                    className="register-input"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff size={17} />
                    ) : (
                      <FiEye size={17} />
                    )}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create account
                    <FiArrowRight size={17} />
                  </>
                )}
              </button>

              <div className="register-terms">
                By creating an account, you agree to use
                TechDea Learn responsibly.
              </div>

            </form>

            <div className="register-divider">
              ALREADY A STUDENT?
            </div>

            <div className="login-box">
              Already have an account?{" "}
              <Link to="/login">
                Login
              </Link>
            </div>

            <div className="register-security">
              <FiLock size={12} />
              Secure account registration
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}