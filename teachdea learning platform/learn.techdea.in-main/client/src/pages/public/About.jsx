import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiCode,
  FiLayers,
  FiUsers,
  FiTarget,
  FiZap,
  FiPlayCircle,
  FiMonitor,
  FiAward,
} from "react-icons/fi";

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: <FiLayers />,
      title: "Structured Learning",
      text: "Courses are organized into modules, lessons, notes and assessments so learners always know what comes next.",
    },
    {
      icon: <FiCode />,
      title: "Practical Technology",
      text: "Learn modern technologies through practical concepts, development workflows and project-oriented learning.",
    },
    {
      icon: <FiUsers />,
      title: "Learner First",
      text: "A clean and focused experience designed to keep learners engaged without unnecessary complexity.",
    },
  ];

  return (
    <>
      <style>{`
        .about-page {
          background: #f8fafc;
          color: #0f172a;
        }

        /* =========================
           HERO
        ========================= */

        .about-hero {
          position: relative;
          overflow: hidden;
          padding: 86px 20px 78px;
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(99, 102, 241, 0.14),
              transparent 30%
            ),
            radial-gradient(
              circle at 5% 85%,
              rgba(124, 58, 237, 0.08),
              transparent 28%
            ),
            #ffffff;
          border-bottom: 1px solid #e2e8f0;
        }

        .about-hero-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 65px;
        }

        .about-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          margin-bottom: 20px;
          border: 1px solid #e0e7ff;
          border-radius: 999px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .about-eyebrow::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
        }

        .about-hero h1 {
          max-width: 680px;
          margin: 0;
          font-size: clamp(40px, 5vw, 61px);
          line-height: 1.06;
          letter-spacing: -2.6px;
          font-weight: 800;
          color: #0f172a;
        }

        .about-hero h1 span {
          color: #4f46e5;
        }

        .about-hero-description {
          max-width: 600px;
          margin: 23px 0 30px;
          color: #64748b;
          font-size: 17px;
          line-height: 1.75;
        }

        .about-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .about-primary-btn,
        .about-secondary-btn {
          min-height: 48px;
          padding: 0 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .about-primary-btn {
          border: 1px solid #4f46e5;
          background: #4f46e5;
          color: #ffffff;
          box-shadow: 0 8px 22px rgba(79, 70, 229, 0.18);
        }

        .about-primary-btn:hover {
          background: #4338ca;
          border-color: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(79, 70, 229, 0.25);
        }

        .about-secondary-btn {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
        }

        .about-secondary-btn:hover {
          border-color: #c7d2fe;
          background: #f8fafc;
          color: #4f46e5;
          transform: translateY(-2px);
        }

        /* =========================
           HERO IMAGE
        ========================= */

        .about-hero-visual {
          position: relative;
        }

        .about-hero-image-box {
          position: relative;
          height: 430px;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          box-shadow: 0 28px 70px rgba(15, 23, 42, 0.13);
        }

        .about-hero-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .about-hero-image-box:hover .about-hero-image {
          transform: scale(1.045);
        }

        .about-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(15, 23, 42, 0.02) 30%,
              rgba(15, 23, 42, 0.7) 100%
            );
        }

        .about-image-caption {
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 22px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.93);
          backdrop-filter: blur(14px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
        }

        .about-image-caption-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 9px;
        }

        .about-image-caption-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
        }

        .about-image-caption-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #eef2ff;
          color: #4f46e5;
        }

        .about-image-status {
          padding: 5px 9px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #059669;
          font-size: 10px;
          font-weight: 800;
        }

        .about-image-caption p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .about-floating-stat {
          position: absolute;
          top: 24px;
          right: -20px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          background: #ffffff;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.13);
          font-size: 12px;
          font-weight: 800;
        }

        .about-floating-stat svg {
          color: #4f46e5;
          font-size: 18px;
        }

        /* =========================
           STORY SECTION
        ========================= */

        .about-section {
          max-width: 1180px;
          margin: 0 auto;
          padding: 80px 20px;
        }

        .about-story {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          align-items: center;
          gap: 70px;
        }

        .about-story-image {
          position: relative;
          overflow: hidden;
          height: 390px;
          border-radius: 22px;
          box-shadow: 0 22px 55px rgba(15, 23, 42, 0.1);
        }

        .about-story-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .about-story-image:hover img {
          transform: scale(1.04);
        }

        .about-story-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 55%,
            rgba(15, 23, 42, 0.38)
          );
        }

        .about-story-badge {
          position: absolute;
          z-index: 2;
          left: 20px;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 13px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.94);
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        .about-story-badge svg {
          color: #4f46e5;
        }

        .about-label {
          margin-bottom: 10px;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .about-story h2 {
          margin: 0 0 17px;
          font-size: 37px;
          line-height: 1.18;
          letter-spacing: -1.2px;
        }

        .about-story-text {
          color: #64748b;
          font-size: 15px;
          line-height: 1.85;
        }

        .about-story-text p {
          margin: 0 0 14px;
        }

        .about-check-list {
          display: grid;
          gap: 11px;
          margin-top: 24px;
        }

        .about-check {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .about-check svg {
          color: #4f46e5;
        }

        /* =========================
           VALUES
        ========================= */

        .about-heading {
          max-width: 670px;
          margin-bottom: 35px;
        }

        .about-heading h2 {
          margin: 0;
          font-size: 35px;
          letter-spacing: -1px;
        }

        .about-heading p {
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.7;
        }

        .about-values {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .about-value-card {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
          transition: all 0.25s ease;
        }

        .about-value-card:hover {
          transform: translateY(-6px);
          border-color: #c7d2fe;
          box-shadow: 0 20px 42px rgba(15, 23, 42, 0.09);
        }

        .about-value-image {
          height: 150px;
          overflow: hidden;
        }

        .about-value-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .about-value-card:hover .about-value-image img {
          transform: scale(1.07);
        }

        .about-value-content {
          padding: 23px;
        }

        .about-value-icon {
          width: 45px;
          height: 45px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 20px;
        }

        .about-value-card h3 {
          margin: 0 0 9px;
          font-size: 18px;
        }

        .about-value-card p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        /* =========================
           PLATFORM
        ========================= */

        .about-platform {
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          gap: 60px;
          align-items: center;
          padding: 45px;
          border-radius: 24px;
          background: #0f172a;
          color: #ffffff;
        }

        .about-platform h2 {
          margin: 0;
          font-size: 32px;
          letter-spacing: -0.9px;
        }

        .about-platform-description {
          max-width: 580px;
          margin: 14px 0 25px;
          color: #94a3b8;
          line-height: 1.75;
        }

        .about-platform-points {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .about-platform-point {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #cbd5e1;
          font-size: 13px;
        }

        .about-platform-point svg {
          color: #818cf8;
        }

        .about-platform-visual {
          display: grid;
          gap: 12px;
        }

        .about-platform-box {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 17px;
          border: 1px solid #334155;
          border-radius: 13px;
          background: #172033;
          transition: transform 0.2s ease;
        }

        .about-platform-box:hover {
          transform: translateX(5px);
        }

        .about-platform-box-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #252f4a;
          color: #818cf8;
        }

        .about-platform-box strong {
          display: block;
          font-size: 13px;
        }

        .about-platform-box span {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 11px;
        }

        /* =========================
           CTA
        ========================= */

        .about-cta {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 20px 75px;
        }

        .about-cta-box {
          position: relative;
          overflow: hidden;
          padding: 50px 30px;
          text-align: center;
          border: 1px solid #e0e7ff;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 15% 30%,
              rgba(99, 102, 241, 0.13),
              transparent 30%
            ),
            linear-gradient(135deg, #eef2ff, #f5f3ff);
        }

        .about-cta-box h2 {
          margin: 0;
          font-size: 31px;
          letter-spacing: -0.8px;
        }

        .about-cta-box p {
          max-width: 570px;
          margin: 12px auto 24px;
          color: #64748b;
          line-height: 1.7;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 950px) {
          .about-hero-inner,
          .about-story,
          .about-platform {
            grid-template-columns: 1fr;
          }

          .about-hero-inner {
            gap: 45px;
          }

          .about-values {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 620px) {
          .about-hero {
            padding: 60px 20px;
          }

          .about-hero h1 {
            font-size: 42px;
            letter-spacing: -1.8px;
          }

          .about-hero-description {
            font-size: 15px;
          }

          .about-actions {
            flex-direction: column;
          }

          .about-primary-btn,
          .about-secondary-btn {
            width: 100%;
          }

          .about-hero-image-box {
            height: 340px;
          }

          .about-floating-stat {
            top: 14px;
            right: 10px;
          }

          .about-section {
            padding: 55px 20px;
          }

          .about-story h2,
          .about-heading h2 {
            font-size: 29px;
          }

          .about-story-image {
            height: 300px;
          }

          .about-values {
            grid-template-columns: 1fr;
          }

          .about-platform {
            padding: 29px 22px;
            gap: 35px;
          }

          .about-platform h2 {
            font-size: 27px;
          }

          .about-platform-points {
            grid-template-columns: 1fr;
          }

          .about-cta {
            padding: 0 20px 55px;
          }

          .about-cta-box {
            padding: 36px 20px;
          }

          .about-cta-box h2 {
            font-size: 27px;
          }
        }
      `}</style>

      <main className="about-page">

        {/* =========================
            HERO
        ========================= */}

        <section className="about-hero">
          <div className="about-hero-inner">

            <div>
              <div className="about-eyebrow">
                ABOUT TECHDEA
              </div>

              <h1>
                Technology that
                <br />
                <span>helps people grow.</span>
              </h1>

              <p className="about-hero-description">
                TechDea combines technology, software development and
                structured learning to create practical digital experiences
                for students and professionals.
              </p>

              <div className="about-actions">
                <button
                  type="button"
                  className="about-primary-btn"
                  onClick={() => navigate("/courses")}
                >
                  Explore Courses
                  <FiArrowRight />
                </button>

                <button
                  type="button"
                  className="about-secondary-btn"
                  onClick={() => navigate("/contact")}
                >
                  Contact TechDea
                </button>
              </div>
            </div>

            {/* HERO IMAGE */}

            <div className="about-hero-visual">
              <div className="about-hero-image-box">

                <img
                  className="about-hero-image"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
                  alt="Students learning together"
                />

                <div className="about-image-overlay" />

                <div className="about-image-caption">
                  <div className="about-image-caption-top">
                    <div className="about-image-caption-title">
                      <div className="about-image-caption-icon">
                        <FiBookOpen />
                      </div>

                      TechDea Learning
                    </div>

                    <span className="about-image-status">
                      ACTIVE
                    </span>
                  </div>

                  <p>
                    Structured learning, practical projects and
                    technology-focused skill development.
                  </p>
                </div>

              </div>

              <div className="about-floating-stat">
                <FiAward />
                Learn. Build. Grow.
              </div>
            </div>

          </div>
        </section>

        {/* =========================
            OUR STORY
        ========================= */}

        <section className="about-section">
          <div className="about-story">

            <div className="about-story-image">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1100&q=85"
                alt="Software developer working on technology"
                loading="lazy"
              />

              <div className="about-story-badge">
                <FiCode />
                Technology & Learning
              </div>
            </div>

            <div>
              <div className="about-label">
                Who We Are
              </div>

              <h2>
                Built around technology and practical learning.
              </h2>

              <div className="about-story-text">
                <p>
                  TechDea is a technology-focused platform that combines
                  software development, digital solutions and structured
                  professional learning.
                </p>

                <p>
                  Our learning experience is organized around courses,
                  modules, lessons, notes, tests and progress — making
                  technology easier to learn in a structured way.
                </p>

                <p>
                  The goal is simple: create a modern environment where
                  learners can focus on building useful technology skills.
                </p>
              </div>

              <div className="about-check-list">
                <div className="about-check">
                  <FiCheckCircle />
                  Modern technology-focused learning
                </div>

                <div className="about-check">
                  <FiCheckCircle />
                  Practical and structured content
                </div>

                <div className="about-check">
                  <FiCheckCircle />
                  Clean and focused digital experience
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================
            VALUES
        ========================= */}

        <section className="about-section">

          <div className="about-heading">
            <div className="about-label">
              Our Approach
            </div>

            <h2>
              What makes the TechDea experience different?
            </h2>

            <p>
              We focus on creating an experience that feels clear,
              practical and purposeful from the first lesson to the last.
            </p>
          </div>

          <div className="about-values">

            {values.map((value, index) => (
              <article
                className="about-value-card"
                key={value.title}
              >

                <div className="about-value-image">
                  <img
                    src={
                      [
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
                        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
                        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
                      ][index]
                    }
                    alt={value.title}
                    loading="lazy"
                  />
                </div>

                <div className="about-value-content">

                  <div className="about-value-icon">
                    {value.icon}
                  </div>

                  <h3>{value.title}</h3>

                  <p>{value.text}</p>

                </div>

              </article>
            ))}

          </div>

        </section>

        {/* =========================
            PLATFORM
        ========================= */}

        <section className="about-section">

          <div className="about-platform">

            <div>
              <div className="about-label">
                The Platform
              </div>

              <h2>
                Learning designed like a product.
              </h2>

              <p className="about-platform-description">
                Instead of treating online learning as a collection of
                documents, TechDea organizes education as a complete
                digital experience.
              </p>

              <div className="about-platform-points">

                <div className="about-platform-point">
                  <FiCheckCircle />
                  Structured courses
                </div>

                <div className="about-platform-point">
                  <FiCheckCircle />
                  Video lectures
                </div>

                <div className="about-platform-point">
                  <FiCheckCircle />
                  Notes & resources
                </div>

                <div className="about-platform-point">
                  <FiCheckCircle />
                  Tests & assessments
                </div>

                <div className="about-platform-point">
                  <FiCheckCircle />
                  Progress tracking
                </div>

                <div className="about-platform-point">
                  <FiCheckCircle />
                  Career-oriented skills
                </div>

              </div>
            </div>

            <div className="about-platform-visual">

              <div className="about-platform-box">
                <div className="about-platform-box-icon">
                  <FiBookOpen />
                </div>

                <div>
                  <strong>Learn</strong>
                  <span>
                    Follow a structured learning path
                  </span>
                </div>
              </div>

              <div className="about-platform-box">
                <div className="about-platform-box-icon">
                  <FiMonitor />
                </div>

                <div>
                  <strong>Build</strong>
                  <span>
                    Apply concepts through practical work
                  </span>
                </div>
              </div>

              <div className="about-platform-box">
                <div className="about-platform-box-icon">
                  <FiTarget />
                </div>

                <div>
                  <strong>Grow</strong>
                  <span>
                    Track progress and strengthen skills
                  </span>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* =========================
            CTA
        ========================= */}

        <section className="about-cta">

          <div className="about-cta-box">

            <h2>
              Ready to start learning?
            </h2>

            <p>
              Explore TechDea courses and choose a structured learning
              path that matches your technology goals.
            </p>

            <button
              type="button"
              className="about-primary-btn"
              onClick={() => navigate("/courses")}
            >
              Explore Courses
              <FiArrowRight />
            </button>

          </div>

        </section>

      </main>
    </>
  );
}