import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiCloud,
  FiBriefcase,
  FiUsers,
  FiBookOpen,
  FiPlayCircle,
} from "react-icons/fi";

export default function Training() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("");

  const programs = [
    {
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
      icon: <FiCode />,
      title: "Full-Stack Development",
      description:
        "Build modern web applications with practical software development workflows.",
      tags: ["Web Development", "Projects", "Career"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
      icon: <FiCpu />,
      title: "AI & Emerging Technologies",
      description:
        "Explore AI-focused learning with practical concepts and technology-driven projects.",
      tags: ["AI", "Projects", "Innovation"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
      icon: <FiCloud />,
      title: "Cloud & Software Engineering",
      description:
        "Develop practical understanding of cloud technologies and modern engineering practices.",
      tags: ["Cloud", "Engineering", "Skills"],
    },
  ];

  const benefits = [
    "Structured learning path",
    "Practical project-based learning",
    "Progress tracking through the platform",
    "Career-oriented technology skills",
  ];

  const handleNavigation = (buttonName, path) => {
    setActiveButton(buttonName);

    setTimeout(() => {
      navigate(path);
    }, 180);
  };

  return (
    <>
      <style>{`
        .training-page {
          background: #f8fafc;
          color: #0f172a;
        }

        /* =========================
           BUTTONS
        ========================= */

        .training-primary-btn,
        .training-secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 10px;
          border: 1px solid transparent;
          text-decoration: none;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.15s ease,
            box-shadow 0.2s ease;
        }

        .training-primary-btn {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 8px 22px rgba(79, 70, 229, 0.18);
        }

        .training-primary-btn:hover {
          background: #4338ca;
          border-color: #4338ca;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.24);
        }

        .training-primary-btn.active {
          background: #312e81 !important;
          border-color: #312e81 !important;
          color: #ffffff !important;
          transform: translateY(1px) scale(0.96);
          box-shadow: 0 3px 10px rgba(49, 46, 129, 0.3);
        }

        .training-secondary-btn {
          background: #ffffff;
          color: #334155;
          border-color: #e2e8f0;
          box-shadow: 0 5px 16px rgba(15, 23, 42, 0.04);
        }

        .training-secondary-btn:hover {
          background: #f8fafc;
          border-color: #c7d2fe;
          color: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07);
        }

        .training-secondary-btn.active {
          background: #c7d2fe !important;
          color: #312e81 !important;
          border-color: #6366f1 !important;
          transform: translateY(1px) scale(0.96);
          box-shadow: 0 3px 10px rgba(79, 70, 229, 0.2);
        }

        /* =========================
           HERO
        ========================= */

        .training-hero {
          position: relative;
          overflow: hidden;
          padding: 86px 20px 82px;
          background:
            radial-gradient(
              circle at 85% 20%,
              rgba(99, 102, 241, 0.12),
              transparent 32%
            ),
            radial-gradient(
              circle at 10% 80%,
              rgba(124, 58, 237, 0.08),
              transparent 30%
            ),
            #ffffff;
          border-bottom: 1px solid #e2e8f0;
        }

        .training-hero-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 70px;
        }

        .training-eyebrow {
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

        .training-eyebrow::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
        }

        .training-hero h1 {
          max-width: 700px;
          margin: 0;
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1.06;
          letter-spacing: -2.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .training-hero h1 span {
          color: #4f46e5;
        }

        .training-hero-description {
          max-width: 610px;
          margin: 22px 0 30px;
          color: #64748b;
          font-size: 17px;
          line-height: 1.75;
        }

        .training-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        /* =========================
           HERO IMAGE
        ========================= */

        .training-visual {
          position: relative;
        }

        .training-hero-image-wrapper {
          position: relative;
          overflow: hidden;
          height: 390px;
          border-radius: 26px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          box-shadow: 0 25px 70px rgba(15, 23, 42, 0.12);
        }

        .training-hero-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .training-hero-image-wrapper:hover .training-hero-image {
          transform: scale(1.04);
        }

        .training-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(15, 23, 42, 0.02) 35%,
              rgba(15, 23, 42, 0.65) 100%
            );
        }

        .training-dashboard-card {
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 20px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.18);
        }

        .training-dashboard-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
        }

        .training-dashboard-title {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
        }

        .training-dashboard-title-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #eef2ff;
          color: #4f46e5;
        }

        .training-status {
          padding: 5px 9px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #059669;
          font-size: 10px;
          font-weight: 800;
        }

        .training-dashboard-progress {
          height: 7px;
          overflow: hidden;
          border-radius: 999px;
          background: #e2e8f0;
        }

        .training-dashboard-progress span {
          display: block;
          width: 72%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
        }

        .training-dashboard-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 9px;
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
        }

        /* FLOATING BADGE */

        .training-floating-badge {
          position: absolute;
          top: 22px;
          right: -18px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
          font-size: 12px;
          font-weight: 800;
          color: #334155;
        }

        .training-floating-badge svg {
          color: #4f46e5;
          font-size: 17px;
        }

        /* =========================
           PROGRAMS
        ========================= */

        .training-section {
          max-width: 1180px;
          margin: 0 auto;
          padding: 76px 20px;
        }

        .training-section-heading {
          max-width: 650px;
          margin-bottom: 34px;
        }

        .training-section-label {
          margin-bottom: 10px;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .training-section-heading h2 {
          margin: 0;
          font-size: 34px;
          letter-spacing: -1px;
          color: #0f172a;
        }

        .training-section-heading p {
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.7;
        }

        .training-program-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .training-program {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .training-program:hover {
          transform: translateY(-6px);
          border-color: #c7d2fe;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.1);
        }

        .training-program-image-wrapper {
          position: relative;
          height: 190px;
          overflow: hidden;
        }

        .training-program-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.45s ease;
        }

        .training-program:hover .training-program-image {
          transform: scale(1.07);
        }

        .training-program-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(15, 23, 42, 0.02),
            rgba(15, 23, 42, 0.42)
          );
        }

        .training-program-icon {
          position: absolute;
          left: 20px;
          bottom: 17px;
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.94);
          color: #4f46e5;
          font-size: 21px;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.15);
        }

        .training-program-content {
          padding: 24px;
        }

        .training-program h3 {
          margin: 0 0 10px;
          font-size: 19px;
          color: #0f172a;
        }

        .training-program p {
          min-height: 72px;
          margin: 0 0 20px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        .training-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .training-tag {
          padding: 6px 9px;
          border-radius: 7px;
          background: #f8fafc;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid #e2e8f0;
        }

        /* =========================
           APPROACH
        ========================= */

        .training-approach {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 60px;
          align-items: center;
          margin-top: 20px;
          padding: 42px;
          border-radius: 22px;
          background: #0f172a;
          color: #ffffff;
        }

        .training-approach h2 {
          margin: 0;
          font-size: 30px;
          letter-spacing: -0.8px;
        }

        .training-approach p {
          margin: 14px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        .training-benefits {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .training-benefit {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px;
          border: 1px solid #334155;
          border-radius: 11px;
          background: #172033;
          color: #cbd5e1;
          font-size: 13px;
          line-height: 1.5;
        }

        .training-benefit svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: #818cf8;
        }

        /* =========================
           CTA
        ========================= */

        .training-cta {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 20px 76px;
        }

        .training-cta-box {
          position: relative;
          overflow: hidden;
          padding: 48px 30px;
          text-align: center;
          border: 1px solid #e0e7ff;
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(99, 102, 241, 0.14),
              transparent 30%
            ),
            linear-gradient(135deg, #eef2ff, #f5f3ff);
        }

        .training-cta-box::before {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          right: -70px;
          top: -70px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.08);
        }

        .training-cta-box h2,
        .training-cta-box p,
        .training-cta-box button {
          position: relative;
          z-index: 1;
        }

        .training-cta-box h2 {
          margin: 0;
          font-size: 30px;
          color: #0f172a;
        }

        .training-cta-box p {
          max-width: 570px;
          margin: 12px auto 24px;
          color: #64748b;
          line-height: 1.7;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1000px) {
          .training-hero-inner {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .training-visual {
            max-width: 700px;
          }

          .training-floating-badge {
            right: 15px;
          }

          .training-program-grid {
            grid-template-columns: 1fr 1fr;
          }

          .training-approach {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .training-hero {
            padding: 60px 20px;
          }

          .training-hero h1 {
            font-size: 42px;
            letter-spacing: -1.8px;
          }

          .training-hero-description {
            font-size: 15px;
          }

          .training-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .training-primary-btn,
          .training-secondary-btn {
            width: 100%;
          }

          .training-hero-image-wrapper {
            height: 330px;
          }

          .training-floating-badge {
            top: 15px;
            right: 12px;
            font-size: 11px;
          }

          .training-dashboard-card {
            left: 13px;
            right: 13px;
            bottom: 13px;
          }

          .training-section {
            padding: 54px 20px;
          }

          .training-section-heading h2 {
            font-size: 29px;
          }

          .training-program-grid,
          .training-benefits {
            grid-template-columns: 1fr;
          }

          .training-program-image-wrapper {
            height: 205px;
          }

          .training-program p {
            min-height: auto;
          }

          .training-approach {
            padding: 28px 22px;
            gap: 30px;
          }

          .training-approach h2 {
            font-size: 26px;
          }

          .training-cta {
            padding: 0 20px 55px;
          }

          .training-cta-box {
            padding: 34px 20px;
          }

          .training-cta-box h2 {
            font-size: 27px;
          }
        }
      `}</style>

      <main className="training-page">
        {/* =========================
            HERO
        ========================= */}

        <section className="training-hero">
          <div className="training-hero-inner">
            <div>
              <div className="training-eyebrow">
                PROFESSIONAL TRAINING
              </div>

              <h1>
                Learn skills that
                <span> move your career forward.</span>
              </h1>

              <p className="training-hero-description">
                Full-stack, AI, cloud, and software engineering programs
                designed around practical learning, structured progress,
                and real-world technology skills.
              </p>

              <div className="training-actions">
                <button
                  type="button"
                  className={`training-primary-btn ${
                    activeButton === "hero-primary" ? "active" : ""
                  }`}
                  onClick={() =>
                    handleNavigation("hero-primary", "/courses")
                  }
                >
                  Explore Courses
                  <FiArrowRight />
                </button>

                <button
                  type="button"
                  className={`training-secondary-btn ${
                    activeButton === "hero-secondary" ? "active" : ""
                  }`}
                  onClick={() =>
                    handleNavigation("hero-secondary", "/contact")
                  }
                >
                  Talk to TechDea
                </button>
              </div>
            </div>

            {/* HERO IMAGE */}

            <div className="training-visual">
              <div className="training-hero-image-wrapper">
                <img
                  className="training-hero-image"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
                  alt="Students learning together"
                />

                <div className="training-image-overlay" />

                <div className="training-dashboard-card">
                  <div className="training-dashboard-top">
                    <div className="training-dashboard-title">
                      <div className="training-dashboard-title-icon">
                        <FiBookOpen />
                      </div>

                      Learning Dashboard
                    </div>

                    <span className="training-status">
                      In Progress
                    </span>
                  </div>

                  <div className="training-dashboard-progress">
                    <span />
                  </div>

                  <div className="training-dashboard-bottom">
                    <span>Full-Stack Development</span>
                    <strong>72%</strong>
                  </div>
                </div>
              </div>

              <div className="training-floating-badge">
                <FiPlayCircle />
                Learn by building
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            TRAINING PROGRAMS
        ========================= */}

        <section className="training-section">
          <div className="training-section-heading">
            <div className="training-section-label">
              Training Programs
            </div>

            <h2>Build practical technology skills.</h2>

            <p>
              Choose a learning direction and develop the skills needed
              to work with modern technologies.
            </p>
          </div>

          <div className="training-program-grid">
            {programs.map((program) => (
              <article
                className="training-program"
                key={program.title}
              >
                <div className="training-program-image-wrapper">
                  <img
                    className="training-program-image"
                    src={program.image}
                    alt={program.title}
                    loading="lazy"
                  />

                  <div className="training-program-image-overlay" />

                  <div className="training-program-icon">
                    {program.icon}
                  </div>
                </div>

                <div className="training-program-content">
                  <h3>{program.title}</h3>

                  <p>{program.description}</p>

                  <div className="training-tags">
                    {program.tags.map((tag) => (
                      <span
                        className="training-tag"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =========================
            APPROACH
        ========================= */}

        <section className="training-section">
          <div className="training-approach">
            <div>
              <h2>A focused approach to learning.</h2>

              <p>
                TechDea combines structured courses, practical projects,
                and progress tracking into one focused learning experience.
              </p>
            </div>

            <div className="training-benefits">
              {benefits.map((benefit) => (
                <div
                  className="training-benefit"
                  key={benefit}
                >
                  <FiCheckCircle />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            CTA
        ========================= */}

        <section className="training-cta">
          <div className="training-cta-box">
            <h2>Ready to start learning?</h2>

            <p>
              Explore the available courses and choose a learning path
              that matches your technology goals.
            </p>

            <button
              type="button"
              className={`training-primary-btn ${
                activeButton === "bottom-primary" ? "active" : ""
              }`}
              onClick={() =>
                handleNavigation("bottom-primary", "/courses")
              }
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