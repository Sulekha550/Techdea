import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCode,
  FiMonitor,
  FiPenTool,
  FiBookOpen,
  FiUsers,
  FiLayers,
  FiCheckCircle,
} from "react-icons/fi";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Website Development",
      text: "Responsive, professional websites with a clear TechDea visual system and modern user experience.",
      icon: <FiCode />,
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
      tags: ["React", "Responsive", "Modern UI"],
    },
    {
      title: "Software Development",
      text: "Custom applications designed and engineered around real business requirements and practical use cases.",
      icon: <FiMonitor />,
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
      tags: ["Web Apps", "APIs", "Solutions"],
    },
    {
      title: "UI/UX Design",
      text: "Product interfaces with consistent spacing, typography, visual hierarchy, and brand-focused design.",
      icon: <FiPenTool />,
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85",
      tags: ["UI Design", "UX", "Branding"],
    },
    {
      title: "IT Training",
      text: "Instructor-led and self-paced learning tracks designed around practical technology skills.",
      icon: <FiBookOpen />,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85",
      tags: ["Courses", "Projects", "Skills"],
    },
    {
      title: "Internship Programs",
      text: "Guided project work and practical exposure for students preparing to enter the technology industry.",
      icon: <FiUsers />,
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
      tags: ["Projects", "Mentorship", "Career"],
    },
    {
      title: "Project Guidance",
      text: "Mentorship around architecture, implementation, delivery, documentation, and project presentation.",
      icon: <FiLayers />,
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
      tags: ["Architecture", "Guidance", "Delivery"],
    },
  ];

  return (
    <>
      <style>{`
        .services-page {
          background: #f8fafc;
          color: #0f172a;
        }

        /* =========================
           HERO
        ========================= */

        .services-hero {
          position: relative;
          overflow: hidden;
          padding: 88px 20px 82px;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(99, 102, 241, 0.14),
              transparent 31%
            ),
            radial-gradient(
              circle at 8% 85%,
              rgba(124, 58, 237, 0.08),
              transparent 28%
            ),
            #ffffff;
          border-bottom: 1px solid #e2e8f0;
        }

        .services-hero-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 0.9fr;
          align-items: center;
          gap: 70px;
        }

        .services-eyebrow {
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

        .services-eyebrow::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
        }

        .services-hero h1 {
          max-width: 700px;
          margin: 0;
          font-size: clamp(40px, 5vw, 60px);
          line-height: 1.07;
          letter-spacing: -2.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .services-hero h1 span {
          color: #4f46e5;
        }

        .services-hero-description {
          max-width: 600px;
          margin: 22px 0 30px;
          color: #64748b;
          font-size: 17px;
          line-height: 1.75;
        }

        .services-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .services-primary-btn,
        .services-secondary-btn {
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

        .services-primary-btn {
          border: 1px solid #4f46e5;
          background: #4f46e5;
          color: #ffffff;
          box-shadow: 0 8px 22px rgba(79, 70, 229, 0.18);
        }

        .services-primary-btn:hover {
          background: #4338ca;
          border-color: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 12px 27px rgba(79, 70, 229, 0.25);
        }

        .services-secondary-btn {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
        }

        .services-secondary-btn:hover {
          border-color: #c7d2fe;
          color: #4f46e5;
          background: #f8fafc;
          transform: translateY(-2px);
        }

        /* =========================
           HERO VISUAL
        ========================= */

        .services-hero-visual {
          position: relative;
        }

        .services-hero-image {
          position: relative;
          height: 390px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 26px;
          box-shadow: 0 25px 65px rgba(15, 23, 42, 0.12);
        }

        .services-hero-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .services-hero-image:hover img {
          transform: scale(1.045);
        }

        .services-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(15, 23, 42, 0.02) 25%,
            rgba(15, 23, 42, 0.7) 100%
          );
        }

        .services-hero-card {
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: 20px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.16);
        }

        .services-hero-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .services-hero-card-title {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
          font-weight: 800;
        }

        .services-hero-card-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #eef2ff;
          color: #4f46e5;
        }

        .services-hero-status {
          padding: 5px 9px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #059669;
          font-size: 10px;
          font-weight: 800;
        }

        .services-hero-card p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .services-floating-badge {
          position: absolute;
          top: 20px;
          right: -20px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.13);
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        .services-floating-badge svg {
          color: #4f46e5;
          font-size: 17px;
        }

        /* =========================
           SERVICES SECTION
        ========================= */

        .services-section {
          max-width: 1180px;
          margin: 0 auto;
          padding: 78px 20px;
        }

        .services-heading {
          max-width: 670px;
          margin-bottom: 35px;
        }

        .services-label {
          margin-bottom: 10px;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .services-heading h2 {
          margin: 0;
          font-size: 35px;
          letter-spacing: -1px;
        }

        .services-heading p {
          margin: 12px 0 0;
          color: #64748b;
          line-height: 1.7;
        }

        /* =========================
           SERVICE CARDS
        ========================= */

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .service-card {
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

        .service-card:hover {
          transform: translateY(-7px);
          border-color: #c7d2fe;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.1);
        }

        .service-image {
          position: relative;
          height: 175px;
          overflow: hidden;
        }

        .service-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .service-card:hover .service-image img {
          transform: scale(1.07);
        }

        .service-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(15, 23, 42, 0.02),
            rgba(15, 23, 42, 0.38)
          );
        }

        .service-icon {
          position: absolute;
          z-index: 2;
          left: 19px;
          bottom: 16px;
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #4f46e5;
          font-size: 21px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
        }

        .service-content {
          padding: 23px;
        }

        .service-content h3 {
          margin: 0 0 9px;
          font-size: 18px;
          color: #0f172a;
        }

        .service-content p {
          min-height: 72px;
          margin: 0 0 19px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        .service-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .service-tag {
          padding: 6px 9px;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          background: #f8fafc;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
        }

        /* =========================
           PROCESS
        ========================= */

        .services-process {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 60px;
          align-items: center;
          padding: 45px;
          border-radius: 24px;
          background: #0f172a;
          color: #ffffff;
        }

        .services-process h2 {
          margin: 0;
          font-size: 31px;
          letter-spacing: -0.8px;
        }

        .services-process-description {
          margin: 14px 0 25px;
          color: #94a3b8;
          line-height: 1.75;
        }

        .services-process-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .services-process-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px;
          border: 1px solid #334155;
          border-radius: 11px;
          background: #172033;
          color: #cbd5e1;
          font-size: 13px;
        }

        .services-process-item svg {
          color: #818cf8;
          flex-shrink: 0;
        }

        .services-process-visual {
          display: grid;
          gap: 12px;
        }

        .process-box {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 17px;
          border: 1px solid #334155;
          border-radius: 13px;
          background: #172033;
        }

        .process-number {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #252f4a;
          color: #a5b4fc;
          font-size: 13px;
          font-weight: 800;
        }

        .process-box strong {
          display: block;
          font-size: 13px;
        }

        .process-box span {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 11px;
        }

        /* =========================
           CTA
        ========================= */

        .services-cta {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 20px 76px;
        }

        .services-cta-box {
          padding: 48px 30px;
          text-align: center;
          border: 1px solid #e0e7ff;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(99, 102, 241, 0.13),
              transparent 30%
            ),
            linear-gradient(135deg, #eef2ff, #f5f3ff);
        }

        .services-cta-box h2 {
          margin: 0;
          font-size: 31px;
          letter-spacing: -0.8px;
        }

        .services-cta-box p {
          max-width: 570px;
          margin: 12px auto 24px;
          color: #64748b;
          line-height: 1.7;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 950px) {
          .services-hero-inner,
          .services-process {
            grid-template-columns: 1fr;
          }

          .services-hero-inner {
            gap: 45px;
          }

          .services-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 620px) {
          .services-hero {
            padding: 60px 20px;
          }

          .services-hero h1 {
            font-size: 42px;
            letter-spacing: -1.8px;
          }

          .services-hero-description {
            font-size: 15px;
          }

          .services-actions {
            flex-direction: column;
          }

          .services-primary-btn,
          .services-secondary-btn {
            width: 100%;
          }

          .services-hero-image {
            height: 330px;
          }

          .services-floating-badge {
            top: 12px;
            right: 10px;
          }

          .services-section {
            padding: 55px 20px;
          }

          .services-heading h2 {
            font-size: 29px;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .service-content p {
            min-height: auto;
          }

          .services-process {
            padding: 29px 22px;
            gap: 35px;
          }

          .services-process h2 {
            font-size: 27px;
          }

          .services-process-list {
            grid-template-columns: 1fr;
          }

          .services-cta {
            padding: 0 20px 55px;
          }

          .services-cta-box {
            padding: 36px 20px;
          }

          .services-cta-box h2 {
            font-size: 27px;
          }
        }
      `}</style>

      <main className="services-page">

        {/* =========================
            HERO
        ========================= */}

        <section className="services-hero">
          <div className="services-hero-inner">

            <div>
              <div className="services-eyebrow">
                OUR SERVICES
              </div>

              <h1>
                Build.
                <br />
                <span>Learn. Ship.</span>
              </h1>

              <p className="services-hero-description">
                From websites and software products to professional
                training and project guidance, TechDea brings technology
                services and learning together under one platform.
              </p>

              <div className="services-actions">
                <button
                  type="button"
                  className="services-primary-btn"
                  onClick={() => navigate("/contact")}
                >
                  Start a Conversation
                  <FiArrowRight />
                </button>

                <button
                  type="button"
                  className="services-secondary-btn"
                  onClick={() => navigate("/training")}
                >
                  Explore Training
                </button>
              </div>
            </div>

            <div className="services-hero-visual">

              <div className="services-hero-image">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85"
                  alt="Technology team working together"
                />

                <div className="services-image-overlay" />

                <div className="services-hero-card">
                  <div className="services-hero-card-top">
                    <div className="services-hero-card-title">
                      <div className="services-hero-card-icon">
                        <FiLayers />
                      </div>

                      TechDea Solutions
                    </div>

                    <span className="services-hero-status">
                      ACTIVE
                    </span>
                  </div>

                  <p>
                    Technology development, design, training and
                    project guidance in one ecosystem.
                  </p>
                </div>
              </div>

              <div className="services-floating-badge">
                <FiCheckCircle />
                End-to-end support
              </div>

            </div>

          </div>
        </section>

        {/* =========================
            SERVICES
        ========================= */}

        <section className="services-section">

          <div className="services-heading">
            <div className="services-label">
              What We Do
            </div>

            <h2>
              Technology services built around real needs.
            </h2>

            <p>
              Whether you need a digital product, want to build your
              technology skills, or need guidance on a project, our
              services are designed around practical outcomes.
            </p>
          </div>

          <div className="services-grid">

            {services.map((service) => (
              <article
                className="service-card"
                key={service.title}
              >

                <div className="service-image">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                  />

                  <div className="service-icon">
                    {service.icon}
                  </div>
                </div>

                <div className="service-content">

                  <h3>{service.title}</h3>

                  <p>{service.text}</p>

                  <div className="service-tags">
                    {service.tags.map((tag) => (
                      <span
                        className="service-tag"
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
            PROCESS
        ========================= */}

        <section className="services-section">

          <div className="services-process">

            <div>

              <div className="services-label">
                Our Approach
              </div>

              <h2>
                From idea to practical outcome.
              </h2>

              <p className="services-process-description">
                We keep the process clear and focused — understand
                the requirement, build with the right technology,
                and deliver something that can actually be used.
              </p>

              <div className="services-process-list">

                <div className="services-process-item">
                  <FiCheckCircle />
                  Clear requirements
                </div>

                <div className="services-process-item">
                  <FiCheckCircle />
                  Modern technology
                </div>

                <div className="services-process-item">
                  <FiCheckCircle />
                  Practical execution
                </div>

                <div className="services-process-item">
                  <FiCheckCircle />
                  Continuous guidance
                </div>

              </div>

            </div>

            <div className="services-process-visual">

              <div className="process-box">
                <div className="process-number">
                  01
                </div>

                <div>
                  <strong>Understand</strong>
                  <span>
                    Identify the requirement and goals
                  </span>
                </div>
              </div>

              <div className="process-box">
                <div className="process-number">
                  02
                </div>

                <div>
                  <strong>Design & Build</strong>
                  <span>
                    Create a practical technology solution
                  </span>
                </div>
              </div>

              <div className="process-box">
                <div className="process-number">
                  03
                </div>

                <div>
                  <strong>Deliver & Grow</strong>
                  <span>
                    Refine, deploy and improve the outcome
                  </span>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* =========================
            CTA
        ========================= */}

        <section className="services-cta">

          <div className="services-cta-box">

            <h2>
              Have a project or learning goal?
            </h2>

            <p>
              Tell us what you are building, learning, or trying to
              achieve and let's find the right way forward.
            </p>

            <button
              type="button"
              className="services-primary-btn"
              onClick={() => navigate("/contact")}
            >
              Talk to TechDea
              <FiArrowRight />
            </button>

          </div>

        </section>

      </main>
    </>
  );
}