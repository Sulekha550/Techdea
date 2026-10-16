import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiPlayCircle,
  FiAward,
  FiUsers,
  FiCode,
  FiShield,
  FiBookOpen,
  FiCloud,
  FiCpu,
  FiLayers,
  FiZap,
} from "react-icons/fi";
import { getCourses } from "../../services/courseService.js";
import CourseCard from "../../components/course/CourseCard.jsx";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses({ all: "false" })
      .then(({ data }) =>
        setFeaturedCourses((data.courses || []).slice(0, 3))
      )
      .catch((err) => console.error("Home course load error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              WHERE TECHNOLOGY MEETS INNOVATION
            </div>

            <h1>
              Build Your
              <br />
              <span>DIGITAL FUTURE</span>
              <br />
              With TechDea
            </h1>

            <p>
              Software development, artificial intelligence, cloud, and
              professional training — structured for students and working
              professionals who want career-oriented learning.
            </p>

            <div className="hero-actions">
              <Link
                to="/courses"
                className="btn btn-primary btn-large"
              >
                Explore Courses <FiArrowRight />
              </Link>

              <Link
                to="/contact"
                className="btn btn-ghost btn-large"
              >
                Contact Us
              </Link>
            </div>

            <div className="trust-row">
              <span>
                <FiCheckCircle /> Industry-aligned curriculum
              </span>
              <span>
                <FiCheckCircle /> Project-led training
              </span>
              <span>
                <FiCheckCircle /> Verified certificates
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
              alt="Students learning technology"
              className="home-hero-image"
            />

            <div className="hero-image-overlay" />

            <div className="hero-floating-card hero-floating-top">
              <FiBookOpen />
              <div>
                <strong>Learn & Build</strong>
                <span>Industry focused</span>
              </div>
            </div>

            <div className="hero-floating-card hero-floating-bottom">
              <FiAward />
              <div>
                <strong>Career Ready</strong>
                <span>Projects + Certificate</span>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-head">
                <span>TechDea Learning Studio</span>
                <span className="live-dot" aria-hidden="true" />
              </div>

              <div className="learning-preview">
                <div className="preview-title">
                  Full-Stack Engineering
                </div>

                <div className="preview-sem">
                  Career track
                </div>

                {[
                  "Modern JavaScript & Architecture",
                  "React & product UI",
                  "APIs, data & cloud",
                  "Interview-ready projects",
                ].map((item, idx) => (
                  <div className="preview-item" key={item}>
                    <span className="preview-index">
                      0{idx + 1}
                    </span>

                    <span>{item}</span>

                    <FiArrowRight />
                  </div>
                ))}
              </div>

              <div className="preview-footer">
                <FiPlayCircle /> Lessons · Notes · Tests · Certificate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container stats-strip">
          <article>
            <div className="stat-icon">
              <FiBookOpen />
            </div>
            <div>
              <strong>Courses</strong>
              <span>Structured tech programs</span>
            </div>
          </article>

          <article>
            <div className="stat-icon">
              <FiCpu />
            </div>
            <div>
              <strong>AI & Cloud</strong>
              <span>Modern engineering stack</span>
            </div>
          </article>

          <article>
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div>
              <strong>Mentorship</strong>
              <span>Practitioner-led training</span>
            </div>
          </article>

          <article>
            <div className="stat-icon">
              <FiAward />
            </div>
            <div>
              <strong>Outcomes</strong>
              <span>Career-oriented learning</span>
            </div>
          </article>
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="POPULAR COURSES"
            title="Learn what the industry actually uses"
            text="Browse TechDea programs built around real software, AI, and cloud skills."
          />

          {loading ? (
            <Skeleton />
          ) : featuredCourses.length > 0 ? (
            <div className="course-grid">
              {featuredCourses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Courses are being published</h3>
              <p>
                The catalog will appear here as soon as programs are live.
              </p>

              <Link to="/courses" className="btn btn-primary">
                Browse catalog
              </Link>
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: 40,
            }}
          >
            <Link
              to="/courses"
              className="btn btn-secondary btn-large"
            >
              View all courses <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= NEW: LEARNING EXPERIENCE ================= */}
      <section className="section home-learning-section">
        <div className="container">
          <div className="home-learning-grid">
            <div className="home-learning-image">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85"
                alt="Developer working on a project"
              />

              <div className="image-badge">
                <FiCode />
                <div>
                  <strong>Build Real Projects</strong>
                  <span>Learn by doing</span>
                </div>
              </div>
            </div>

            <div className="home-learning-content">
              <div className="eyebrow">
                LEARN BY BUILDING
              </div>

              <h2>
                Turn your learning into
                <span> real technology.</span>
              </h2>

              <p>
                TechDea focuses on practical learning where concepts,
                projects, tools and career preparation work together.
              </p>

              <div className="learning-points">
                <div>
                  <span className="learning-point-icon">
                    <FiCheckCircle />
                  </span>

                  <div>
                    <strong>Project-based learning</strong>
                    <p>
                      Practice concepts by building meaningful
                      applications.
                    </p>
                  </div>
                </div>

                <div>
                  <span className="learning-point-icon">
                    <FiLayers />
                  </span>

                  <div>
                    <strong>Structured curriculum</strong>
                    <p>
                      Follow modules and lessons in a clear learning
                      sequence.
                    </p>
                  </div>
                </div>

                <div>
                  <span className="learning-point-icon">
                    <FiZap />
                  </span>

                  <div>
                    <strong>Modern technology</strong>
                    <p>
                      Learn tools and technologies used in today's
                      digital products.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/courses"
                className="btn btn-primary btn-large"
              >
                Start Learning <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY TECHDEA ================= */}
      <section className="section section-soft">
        <div className="container">
          <SectionHeader
            eyebrow="WHY TECHDEA"
            title="Why learn with TechDea"
            text="Premium technology education with a clean, focused learning experience."
          />

          <div className="feature-grid">
            <Feature
              icon={<FiPlayCircle />}
              title="Structured lessons"
              text="Clear modules and lessons so you always know what to study next."
            />

            <Feature
              icon={<FiBookOpen />}
              title="Notes & resources"
              text="Guides and attachments live with the lesson — not scattered across chats."
            />

            <Feature
              icon={<FiCode />}
              title="Practice tests"
              text="Check understanding with assessments tied to the same curriculum."
            />

            <Feature
              icon={<FiAward />}
              title="Certificates"
              text="Claim a credential after completing requirements — only when the platform issues it."
            />

            <Feature
              icon={<FiCloud />}
              title="Cloud & AI context"
              text="Training that includes the technologies companies actually hire for."
            />

            <Feature
              icon={<FiShield />}
              title="Production mindset"
              text="Clean engineering habits, not tutorial-only shortcuts."
            />
          </div>
        </div>
      </section>

      {/* ================= IMAGE FEATURE SECTION ================= */}
      <section className="section home-image-feature">
        <div className="container">
          <div className="home-image-feature-header">
            <div>
              <div className="eyebrow">
                TECHNOLOGY IN PRACTICE
              </div>

              <h2>
                Learn technology in a
                <span> real-world environment.</span>
              </h2>
            </div>

            <p>
              From coding and AI to cloud and software engineering,
              TechDea connects learning with practical technology.
            </p>
          </div>

          <div className="tech-image-grid">
            <div className="tech-image-card tech-image-large">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85"
                alt="Student learning on laptop"
              />

              <div className="tech-image-overlay">
                <span>01</span>
                <div>
                  <h3>Software Development</h3>
                  <p>Code. Build. Deploy.</p>
                </div>
              </div>
            </div>

            <div className="tech-image-card">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=85"
                alt="Technology team collaboration"
              />

              <div className="tech-image-overlay">
                <span>02</span>
                <div>
                  <h3>Collaboration</h3>
                  <p>Learn together.</p>
                </div>
              </div>
            </div>

            <div className="tech-image-card">
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85"
                alt="Cloud technology"
              />

              <div className="tech-image-overlay">
                <span>03</span>
                <div>
                  <h3>Cloud & Technology</h3>
                  <p>Think beyond the screen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="LEARNING PROCESS"
            title="A simple path from enroll to certificate"
          />

          <div className="process-grid">
            {[
              [
                "01",
                "Enroll",
                "Choose a TechDea course and unlock the curriculum.",
              ],
              [
                "02",
                "Learn",
                "Watch lessons, read notes, and follow the module order.",
              ],
              [
                "03",
                "Practice",
                "Use tests and projects to confirm what you know.",
              ],
              [
                "04",
                "Certify",
                "Complete requirements, then claim an issued certificate.",
              ],
            ].map(([n, t, d]) => (
              <div className="process-card" key={n}>
                <div className="process-index">{n}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TECHNOLOGY STACK ================= */}
      <section className="section section-soft">
        <div className="container">
          <SectionHeader
            eyebrow="TECHNOLOGY STACK"
            title="The tools behind modern products"
          />

          <div className="stack-showcase">
            <div className="stack-showcase-image">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85"
                alt="Technology and computer hardware"
              />

              <div className="stack-image-caption">
                <FiCpu />
                <span>Modern technology ecosystem</span>
              </div>
            </div>

            <div className="stack-content">
              <p>
                Explore the technologies that power modern websites,
                applications, AI systems and cloud platforms.
              </p>

              <div className="stack-grid">
                {[
                  "JavaScript",
                  "React",
                  "Node.js",
                  "Python",
                  "MongoDB",
                  "Cloud",
                  "SQL",
                  "UI/UX",
                  "DevOps",
                  "AI",
                  "APIs",
                  "Git",
                ].map((s) => (
                  <div className="stack-chip" key={s}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRAINING ================= */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="FEATURED TRAINING"
            title="Professional training, not a campus portal"
            text="Same brand as TechDea delivery work — software, websites, internships, and upskilling."
          />

          <div className="training-image-grid">
            <TrainingImageCard
              image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85"
              icon={<FiCode />}
              title="Software development"
              text="Build production-minded applications with structured coaching."
            />

            <TrainingImageCard
              image="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=85"
              icon={<FiCpu />}
              title="AI programs"
              text="Practical AI literacy connected to real product workflows."
            />

            <TrainingImageCard
              image="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=85"
              icon={<FiUsers />}
              title="Career tracks"
              text="Interview-ready projects and a clear learning sequence."
            />
          </div>
        </div>
      </section>

      {/* ================= STUDENT BENEFITS ================= */}
      <section className="section section-soft">
        <div className="container">
          <SectionHeader
            eyebrow="STUDENT BENEFITS"
            title="What you get as a learner"
          />

          <div className="student-benefit-layout">
            <div className="student-benefit-image">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85"
                alt="Students learning together"
              />

              <div className="student-image-card">
                <FiUsers />
                <div>
                  <strong>Learning Community</strong>
                  <span>Learn, practice and grow</span>
                </div>
              </div>
            </div>

            <div className="feature-grid student-benefits-grid">
              <Feature
                icon={<FiPlayCircle />}
                title="Focused player"
                text="Curriculum on the side, lesson in the center, progress always visible."
              />

              <Feature
                icon={<FiUsers />}
                title="Dashboard"
                text="Continue learning, tests, and certificates in one student workspace."
              />

              <Feature
                icon={<FiShield />}
                title="Support"
                text="Contact TechDea directly for training and enrollment questions."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="TESTIMONIALS"
            title="What learners value"
            text="Representative feedback on teaching quality — not a fabricated success metric."
          />

          <div className="quote-grid">
            <div className="quote-card">
              <p>
                “The structure is clear. I always know which module
                I’m in and what is next.”
              </p>
              <strong>Full-stack learner</strong>
            </div>

            <div className="quote-card">
              <p>
                “It feels like a product, not a college notice board.
                The purple identity is consistent.”
              </p>
              <strong>Working professional</strong>
            </div>

            <div className="quote-card">
              <p>
                “Lessons, notes, and tests live together. That’s what
                I needed.”
              </p>
              <strong>Internship trainee</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="section">
        <div className="container">
          <div className="cta-dark">
            <div>
              <div className="eyebrow">START WITH TECHDEA</div>

              <h2>Ready to build your digital future?</h2>

              <p>
                Explore courses or talk to the TechDea team about
                training.
              </p>
            </div>

            <div
              className="hero-actions"
              style={{ margin: 0 }}
            >
              <Link
                to="/courses"
                className="btn btn-primary btn-large"
              >
                Explore Courses
              </Link>

              <Link
                to="/contact"
                className="btn btn-ghost btn-large"
                style={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.2)",
                  background: "transparent",
                }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOME PAGE IMAGE STYLES ================= */}
      <style>{`
        .hero-image-wrapper {
          position: relative;
          min-height: 560px;
          border-radius: 28px;
          overflow: hidden;
          background: #111827;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
        }

        .home-hero-image {
          width: 100%;
          height: 560px;
          object-fit: cover;
          display: block;
        }

        .hero-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(15, 23, 42, 0.08),
              rgba(15, 23, 42, 0.68)
            );
        }

        .hero-floating-card {
          position: absolute;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px 16px;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border-radius: 14px;
          box-shadow: 0 15px 35px rgba(15,23,42,0.18);
        }

        .hero-floating-card svg {
          width: 21px;
          height: 21px;
          color: #6366f1;
        }

        .hero-floating-card div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .hero-floating-card strong {
          font-size: 13px;
          color: #0f172a;
        }

        .hero-floating-card span {
          font-size: 11px;
          color: #64748b;
        }

        .hero-floating-top {
          top: 28px;
          right: 28px;
        }

        .hero-floating-bottom {
          bottom: 30px;
          left: 28px;
        }

        .hero-card {
          position: absolute;
          z-index: 4;
          left: 50%;
          bottom: 30px;
          transform: translateX(-50%);
          width: min(430px, calc(100% - 50px));
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(15,23,42,0.78);
          backdrop-filter: blur(18px);
          border-radius: 20px;
          color: #fff;
        }

        .hero-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #cbd5e1;
          margin-bottom: 15px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 0 5px rgba(16,185,129,0.14);
        }

        .learning-preview {
          padding: 15px;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
        }

        .preview-title {
          font-size: 17px;
          font-weight: 800;
        }

        .preview-sem {
          color: #a5b4fc;
          font-size: 12px;
          margin: 4px 0 14px;
        }

        .preview-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 0;
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 12px;
          color: #e2e8f0;
        }

        .preview-item svg {
          margin-left: auto;
          color: #a5b4fc;
        }

        .preview-index {
          color: #a5b4fc;
          font-weight: 700;
        }

        .preview-footer {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          font-size: 11px;
          color: #94a3b8;
        }

        /* Learning section */

        .home-learning-section {
          background: #ffffff;
        }

        .home-learning-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 70px;
          align-items: center;
        }

        .home-learning-image {
          position: relative;
          min-height: 520px;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(15,23,42,0.13);
        }

        .home-learning-image img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
          transition: transform .5s ease;
        }

        .home-learning-image:hover img {
          transform: scale(1.04);
        }

        .image-badge {
          position: absolute;
          bottom: 25px;
          left: 25px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 15px;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(12px);
          box-shadow: 0 15px 30px rgba(15,23,42,0.15);
        }

        .image-badge svg {
          color: #6366f1;
          font-size: 22px;
        }

        .image-badge div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .image-badge strong {
          color: #0f172a;
          font-size: 13px;
        }

        .image-badge span {
          color: #64748b;
          font-size: 11px;
        }

        .home-learning-content h2 {
          margin: 12px 0 18px;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.08;
          letter-spacing: -1.8px;
          color: #0f172a;
        }

        .home-learning-content h2 span {
          color: #6366f1;
        }

        .home-learning-content > p {
          color: #64748b;
          font-size: 16px;
          line-height: 1.8;
          max-width: 570px;
        }

        .learning-points {
          margin: 28px 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .learning-points > div {
          display: flex;
          gap: 14px;
        }

        .learning-point-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #eef2ff;
          color: #6366f1;
        }

        .learning-points strong {
          display: block;
          color: #0f172a;
          font-size: 15px;
          margin-bottom: 3px;
        }

        .learning-points p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        /* Technology image section */

        .home-image-feature {
          background: #f8fafc;
        }

        .home-image-feature-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 40px;
          margin-bottom: 35px;
        }

        .home-image-feature-header h2 {
          margin: 10px 0 0;
          max-width: 680px;
          font-size: clamp(32px, 4vw, 46px);
          line-height: 1.1;
          color: #0f172a;
        }

        .home-image-feature-header h2 span {
          color: #6366f1;
        }

        .home-image-feature-header > p {
          max-width: 420px;
          margin: 0;
          color: #64748b;
          line-height: 1.7;
        }

        .tech-image-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 18px;
        }

        .tech-image-card {
          position: relative;
          height: 360px;
          border-radius: 22px;
          overflow: hidden;
          background: #111827;
        }

        .tech-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .5s ease;
        }

        .tech-image-card:hover img {
          transform: scale(1.06);
        }

        .tech-image-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 35%,
            rgba(15,23,42,0.86)
          );
        }

        .tech-image-overlay {
          position: absolute;
          z-index: 2;
          bottom: 22px;
          left: 22px;
          right: 22px;
          display: flex;
          gap: 12px;
          align-items: flex-end;
          color: #fff;
        }

        .tech-image-overlay > span {
          font-size: 12px;
          color: #c4b5fd;
          font-weight: 800;
        }

        .tech-image-overlay h3 {
          margin: 0 0 4px;
          font-size: 18px;
        }

        .tech-image-overlay p {
          margin: 0;
          color: #cbd5e1;
          font-size: 12px;
        }

        /* Stack */

        .stack-showcase {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 45px;
          align-items: center;
        }

        .stack-showcase-image {
          position: relative;
          height: 390px;
          border-radius: 24px;
          overflow: hidden;
        }

        .stack-showcase-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .stack-showcase-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 45%,
            rgba(15,23,42,.8)
          );
        }

        .stack-image-caption {
          position: absolute;
          z-index: 2;
          bottom: 22px;
          left: 22px;
          right: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-weight: 700;
        }

        .stack-image-caption svg {
          color: #a78bfa;
          font-size: 22px;
        }

        .stack-content > p {
          color: #64748b;
          line-height: 1.8;
          max-width: 600px;
          margin-bottom: 25px;
        }

        /* Training */

        .training-image-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .training-image-card {
          position: relative;
          min-height: 430px;
          overflow: hidden;
          border-radius: 22px;
          background: #111827;
          box-shadow: 0 15px 40px rgba(15,23,42,0.09);
        }

        .training-image-card img {
          width: 100%;
          height: 100%;
          min-height: 430px;
          object-fit: cover;
          display: block;
          transition: transform .5s ease;
        }

        .training-image-card:hover img {
          transform: scale(1.06);
        }

        .training-image-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(15,23,42,0.02) 25%,
            rgba(15,23,42,0.9)
          );
        }

        .training-image-content {
          position: absolute;
          z-index: 2;
          left: 22px;
          right: 22px;
          bottom: 22px;
          color: #fff;
        }

        .training-image-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #6366f1;
          margin-bottom: 16px;
        }

        .training-image-content h3 {
          margin: 0 0 8px;
          font-size: 21px;
        }

        .training-image-content p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.6;
          font-size: 13px;
        }

        /* Student benefits */

        .student-benefit-layout {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 45px;
          align-items: center;
        }

        .student-benefit-image {
          position: relative;
          height: 400px;
          border-radius: 24px;
          overflow: hidden;
        }

        .student-benefit-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .student-benefit-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 50%,
            rgba(15,23,42,.65)
          );
        }

        .student-image-card {
          position: absolute;
          z-index: 2;
          left: 20px;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px 16px;
          background: rgba(255,255,255,.94);
          border-radius: 14px;
          box-shadow: 0 15px 30px rgba(15,23,42,.18);
        }

        .student-image-card svg {
          color: #6366f1;
          font-size: 21px;
        }

        .student-image-card div {
          display: flex;
          flex-direction: column;
        }

        .student-image-card strong {
          color: #0f172a;
          font-size: 13px;
        }

        .student-image-card span {
          color: #64748b;
          font-size: 11px;
        }

        .student-benefits-grid {
          margin: 0;
        }

        @media (max-width: 1000px) {
          .home-learning-grid,
          .stack-showcase,
          .student-benefit-layout {
            grid-template-columns: 1fr;
          }

          .home-image-feature-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .tech-image-grid {
            grid-template-columns: 1fr 1fr;
          }

          .tech-image-large {
            grid-column: 1 / -1;
          }

          .training-image-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 700px) {
          .hero-image-wrapper {
            min-height: 500px;
          }

          .home-hero-image {
            height: 500px;
          }

          .hero-card {
            bottom: 20px;
            width: calc(100% - 30px);
          }

          .hero-floating-top {
            top: 18px;
            right: 18px;
          }

          .hero-floating-bottom {
            display: none;
          }

          .home-learning-image,
          .home-learning-image img {
            min-height: 380px;
            height: 380px;
          }

          .tech-image-grid,
          .training-image-grid {
            grid-template-columns: 1fr;
          }

          .tech-image-large {
            grid-column: auto;
          }

          .tech-image-card,
          .training-image-card,
          .training-image-card img {
            height: 330px;
            min-height: 330px;
          }

          .stack-showcase-image {
            height: 320px;
          }

          .student-benefit-image {
            height: 330px;
          }

          .home-learning-content h2 {
            font-size: 34px;
          }
        }
      `}</style>
    </>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function TrainingImageCard({ image, icon, title, text }) {
  return (
    <div className="training-image-card">
      <img src={image} alt={title} />

      <div className="training-image-content">
        <div className="training-image-icon">
          {icon}
        </div>

        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}