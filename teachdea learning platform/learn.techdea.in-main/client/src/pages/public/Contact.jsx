import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { submitContact } from "../../services/contactService.js";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFeedback(null);
    setLoading(true);

    try {
      const res = await submitContact(form);

      setFeedback({
        type: "success",
        text:
          res.data?.message ||
          "Thank you. Your inquiry was received.",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to submit. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* ==============================
           CONTACT PAGE
        ============================== */

        .contact-page {
          min-height: 100vh;
          background: #ffffff;
          color: #0f172a;
        }

        /* ==============================
           HERO
        ============================== */

        .contact-hero {
          padding: 72px 20px 55px;
          text-align: center;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(99, 102, 241, 0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(124, 58, 237, 0.08),
              transparent 30%
            ),
            #ffffff;
        }

        .contact-hero-inner {
          max-width: 800px;
          margin: 0 auto;
        }

        .contact-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 13px;
          margin-bottom: 17px;
          border: 1px solid #e0e7ff;
          border-radius: 999px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .contact-eyebrow::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
        }

        .contact-hero h1 {
          margin: 0;
          font-size: clamp(38px, 5vw, 54px);
          line-height: 1.1;
          letter-spacing: -2px;
          font-weight: 800;
        }

        .contact-hero p {
          max-width: 650px;
          margin: 18px auto 0;
          color: #64748b;
          font-size: 16px;
          line-height: 1.75;
        }

        /* ==============================
           CONTACT INFO CARDS
        ============================== */

        .contact-info-section {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 20px 65px;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .contact-info-card {
          position: relative;
          padding: 28px 24px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #f8fafc;
          box-shadow: 0 5px 20px rgba(15, 23, 42, 0.04);
          transition: all 0.25s ease;
        }

        .contact-info-card:hover {
          transform: translateY(-4px);
          border-color: #c7d2fe;
          background: #ffffff;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
        }

        .contact-info-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 17px;
          border-radius: 11px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 20px;
        }

        .contact-info-card h3 {
          margin: 0 0 9px;
          font-size: 18px;
          font-weight: 800;
        }

        .contact-info-card p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .contact-info-card a {
          color: #475569;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-info-card a:hover {
          color: #4f46e5;
        }

        /* ==============================
           MESSAGE SECTION
        ============================== */

        .contact-main-section {
          padding: 68px 20px;
          background: #f8fafc;
        }

        .contact-main-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 55px;
          align-items: start;
        }

        .contact-section-heading {
          margin-bottom: 26px;
        }

        .contact-section-heading h2 {
          margin: 0 0 9px;
          font-size: 28px;
          letter-spacing: -0.7px;
        }

        .contact-section-heading p {
          max-width: 520px;
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        /* ==============================
           FORM
        ============================== */

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .contact-form label {
          display: flex;
          flex-direction: column;
          gap: 7px;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: #ffffff;
          color: #0f172a;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .contact-form input {
          height: 47px;
          padding: 0 14px;
        }

        .contact-form textarea {
          min-height: 125px;
          padding: 13px 14px;
          resize: vertical;
        }

        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: #94a3b8;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.10);
        }

        .contact-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .contact-submit {
          min-height: 46px;
          margin-top: 3px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #4f46e5;
          border-radius: 9px;
          background: #4f46e5;
          color: #ffffff;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .contact-submit:hover:not(:disabled) {
          background: #4338ca;
          border-color: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.22);
        }

        .contact-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* ==============================
           ALERT
        ============================== */

        .contact-alert {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 12px 14px;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.5;
        }

        .contact-alert.success {
          border: 1px solid #a7f3d0;
          background: #ecfdf5;
          color: #047857;
        }

        .contact-alert.error {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
        }

        /* ==============================
           RIGHT SIDE
        ============================== */

        .contact-connect {
          padding-left: 5px;
        }

        .contact-socials {
          display: flex;
          gap: 12px;
          margin: 25px 0 32px;
        }

        .contact-social {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          background: #ffffff;
          color: #0f172a;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
          transition: all 0.2s ease;
        }

        .contact-social:hover {
          border-color: #c7d2fe;
          background: #eef2ff;
          color: #4f46e5;
          transform: translateY(-3px);
        }

        .contact-working-card {
          padding: 23px 20px;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          background: #ffffff;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.06);
        }

        .contact-working-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 14px;
        }

        .contact-working-title svg {
          color: #4f46e5;
        }

        .contact-working-title h3 {
          margin: 0;
          font-size: 17px;
        }

        .working-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 11px 0;
          border-bottom: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 12px;
        }

        .working-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .working-row:first-of-type {
          padding-top: 0;
        }

        .working-time {
          color: #475569;
          font-weight: 600;
          text-align: right;
        }

        /* ==============================
           WHATSAPP
        ============================== */

        .whatsapp-floating {
          position: fixed;
          z-index: 50;
          right: 22px;
          bottom: 20px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #16c45b;
          color: #ffffff;
          font-size: 22px;
          text-decoration: none;
          box-shadow: 0 8px 25px rgba(22, 196, 91, 0.3);
          transition: all 0.2s ease;
        }

        .whatsapp-floating:hover {
          background: #12aa4e;
          transform: translateY(-3px) scale(1.04);
        }

        /* ==============================
           RESPONSIVE
        ============================== */

        @media (max-width: 900px) {
          .contact-info-grid {
            grid-template-columns: 1fr;
          }

          .contact-main-grid {
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .contact-connect {
            padding-left: 0;
          }
        }

        @media (max-width: 600px) {
          .contact-hero {
            padding: 55px 20px 45px;
          }

          .contact-hero h1 {
            font-size: 38px;
            letter-spacing: -1.5px;
          }

          .contact-info-section {
            padding-bottom: 45px;
          }

          .contact-main-section {
            padding: 50px 20px;
          }

          .contact-form-row {
            grid-template-columns: 1fr;
          }

          .contact-section-heading h2 {
            font-size: 25px;
          }

          .whatsapp-floating {
            right: 16px;
            bottom: 16px;
          }
        }
      `}</style>

      <main className="contact-page">

        {/* ==============================
            HERO
        ============================== */}

        <section className="contact-hero">
          <div className="contact-hero-inner">

            <div className="contact-eyebrow">
              CONTACT TECHDEA
            </div>

            <h1>
              Let&apos;s build something
              <br />
              <span style={{ color: "#4f46e5" }}>
                meaningful together.
              </span>
            </h1>

            <p>
              Have questions about courses, training batches,
              internships, projects, or enrollment? Reach out to
              our team and we&apos;ll get back to you.
            </p>

          </div>
        </section>

        {/* ==============================
            CONTACT INFO
        ============================== */}

        <section className="contact-info-section">

          <div className="contact-info-grid">

            <div className="contact-info-card">

              <div className="contact-info-icon">
                <FiPhone />
              </div>

              <h3>Call Us</h3>

              <p>
                <a href="tel:+919369907885">
                  +91 9369907885
                </a>
              </p>

              <p style={{ marginTop: 4 }}>
                <a href="tel:+919411862576">
                  +91 9411862576
                </a>
              </p>

            </div>

            <div className="contact-info-card">

              <div className="contact-info-icon">
                <FiMail />
              </div>

              <h3>Email</h3>

              <p>
                <a href="mailto:contact.TechDea@gmail.com">
                  contact.TechDea@gmail.com
                </a>
              </p>

              <p style={{ marginTop: 4 }}>
                <a href="mailto:manager.TechDea@gmail.com">
                  manager.TechDea@gmail.com
                </a>
              </p>

            </div>

            <div className="contact-info-card">

              <div className="contact-info-icon">
                <FiMapPin />
              </div>

              <h3>Office</h3>

              <p>
                Ghaziabad, Uttar Pradesh, India
              </p>

            </div>

          </div>

        </section>

        {/* ==============================
            MESSAGE + CONNECT
        ============================== */}

        <section className="contact-main-section">

          <div className="contact-main-grid">

            {/* LEFT */}

            <div>

              <div className="contact-section-heading">

                <h2>
                  Send a Message
                </h2>

                <p>
                  Fill out the form and our team will contact
                  you as soon as possible.
                </p>

              </div>

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >

                {feedback && (
                  <div
                    className={`contact-alert ${feedback.type}`}
                  >
                    {feedback.type === "success" && (
                      <FiCheckCircle />
                    )}

                    {feedback.text}
                  </div>
                )}

                <label>
                  Name *

                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Your Name"
                  />
                </label>

                <div className="contact-form-row">

                  <label>
                    Email *

                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="Email Address"
                    />
                  </label>

                  <label>
                    Phone

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      placeholder="Phone Number"
                    />
                  </label>

                </div>

                <label>
                  Subject *

                  <input
                    required
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                  />
                </label>

                <label>
                  Message *

                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                  />
                </label>

                <button
                  type="submit"
                  className="contact-submit"
                  disabled={loading}
                >
                  <FiSend />

                  {loading
                    ? "Sending..."
                    : "Send Message"}
                </button>

              </form>

            </div>

            {/* RIGHT */}

            <div className="contact-connect">

              <div className="contact-section-heading">

                <h2>
                  Connect With Us
                </h2>

                <p>
                  Follow us on social media and stay updated
                  with our latest projects, internships and
                  training programs.
                </p>

              </div>

              <div className="contact-socials">

                <a
                  href="#"
                  className="contact-social"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>

                <a
                  href="#"
                  className="contact-social"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>

                <a
                  href="#"
                  className="contact-social"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>

                <a
                  href="https://wa.me/919369907885"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-social"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>

              </div>

              <div className="contact-working-card">

                <div className="contact-working-title">

                  <FiClock />

                  <h3>
                    Working Hours
                  </h3>

                </div>

                <div className="working-row">
                  <span>Monday – Friday</span>
                  <span className="working-time">
                    09:00 AM – 06:00 PM
                  </span>
                </div>

                <div className="working-row">
                  <span>Saturday</span>
                  <span className="working-time">
                    10:00 AM – 04:00 PM
                  </span>
                </div>

                <div className="working-row">
                  <span>Sunday</span>
                  <span className="working-time">
                    Closed
                  </span>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==============================
            FLOATING WHATSAPP
        ============================== */}

        <a
          href="https://wa.me/919369907885"
          target="_blank"
          rel="noreferrer"
          className="whatsapp-floating"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp />
        </a>

      </main>
    </>
  );
}