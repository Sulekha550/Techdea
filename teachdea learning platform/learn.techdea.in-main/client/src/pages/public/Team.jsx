import {
  FiArrowUpRight,
  FiBookOpen,
  FiCode,
  FiLayers,
  FiPenTool,
  FiPlay,
  FiUsers,
  FiZap,
} from "react-icons/fi";

export default function Team() {
  const teamAreas = [
    {
      number: "01",
      icon: <FiCode />,
      title: "Engineering",
      subtitle: "We build the learning engine.",
      description:
        "Software, architecture, and cloud delivery come together to create a smooth and reliable learning experience.",
      tags: ["Software", "Architecture", "Cloud"],
      className: "team-card-indigo",
    },
    {
      number: "02",
      icon: <FiBookOpen />,
      title: "Training",
      subtitle: "We turn knowledge into skills.",
      description:
        "Curriculum, assessments, and learner support are designed around practical learning and real progress.",
      tags: ["Curriculum", "Learning", "Support"],
      className: "team-card-purple",
    },
    {
      number: "03",
      icon: <FiPenTool />,
      title: "Design",
      subtitle: "We make learning feel simple.",
      description:
        "Thoughtful interfaces and product experiences keep your attention where it belongs — on learning.",
      tags: ["UI/UX", "Product", "Experience"],
      className: "team-card-cyan",
    },
  ];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .team-page {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          overflow: hidden;
        }

        /* =========================
           HERO
        ========================= */

        .team-hero {
          position: relative;
          padding: 92px 24px 110px;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(99, 102, 241, 0.13),
              transparent 28%
            ),
            radial-gradient(
              circle at 85% 15%,
              rgba(168, 85, 247, 0.12),
              transparent 26%
            ),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }

        .team-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              rgba(15, 23, 42, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(15, 23, 42, 0.035) 1px,
              transparent 1px
            );
          background-size: 42px 42px;
          mask-image: linear-gradient(
            to bottom,
            black 0%,
            rgba(0, 0, 0, 0.3) 55%,
            transparent 100%
          );
          pointer-events: none;
        }

        .team-hero-container {
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: auto;
        }

        .team-hero-content {
          max-width: 780px;
          margin: auto;
          text-align: center;
        }

        .team-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(238, 242, 255, 0.9);
          border: 1px solid #dfe5ff;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.3px;
          margin-bottom: 25px;
        }

        .team-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4f46e5;
          box-shadow: 0 0 0 5px rgba(79, 70, 229, 0.1);
        }

        .team-hero h1 {
          margin: 0;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1.02;
          letter-spacing: -3px;
          font-weight: 850;
        }

        .team-gradient-text {
          background: linear-gradient(
            110deg,
            #4f46e5,
            #7c3aed 50%,
            #0891b2
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .team-hero-description {
          max-width: 680px;
          margin: 25px auto 0;
          color: #64748b;
          font-size: 17px;
          line-height: 1.8;
        }

        /* =========================
           FLOATING MINI VISUALS
        ========================= */

        .team-floating {
          position: absolute;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 15px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 14px 35px rgba(15, 23, 42, 0.09);
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .team-floating svg {
          color: #4f46e5;
          font-size: 17px;
        }

        .team-floating.one {
          left: 7%;
          top: 38%;
          transform: rotate(-4deg);
        }

        .team-floating.two {
          right: 7%;
          top: 29%;
          transform: rotate(4deg);
        }

        .team-floating.three {
          right: 13%;
          bottom: 18%;
          transform: rotate(-3deg);
        }

        /* =========================
           MAIN
        ========================= */

        .team-main {
          max-width: 1180px;
          margin: auto;
          padding: 0 24px 110px;
        }

        /* =========================
           INTRO CARD
        ========================= */

        .team-intro {
          margin-top: -35px;
          position: relative;
          z-index: 5;
          padding: 34px 40px;
          border: 1px solid #e2e8f0;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(14px);
          border-radius: 24px;
          box-shadow: 0 20px 55px rgba(15, 23, 42, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .team-intro-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .team-intro-icon {
          flex-shrink: 0;
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef2ff;
          color: #4f46e5;
          font-size: 23px;
        }

        .team-intro h2 {
          margin: 0 0 5px;
          font-size: 20px;
          letter-spacing: -0.4px;
        }

        .team-intro p {
          margin: 0;
          color: #64748b;
          line-height: 1.6;
          font-size: 14px;
        }

        .team-intro-stat {
          flex-shrink: 0;
          text-align: right;
        }

        .team-intro-stat strong {
          display: block;
          font-size: 27px;
          color: #4f46e5;
          line-height: 1;
        }

        .team-intro-stat span {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 700;
        }

        /* =========================
           SECTION HEADING
        ========================= */

        .team-section-heading {
          text-align: center;
          max-width: 700px;
          margin: 95px auto 48px;
        }

        .team-section-label {
          color: #4f46e5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
        }

        .team-section-heading h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 44px);
          letter-spacing: -1.5px;
          line-height: 1.12;
        }

        .team-section-heading p {
          margin: 16px auto 0;
          color: #64748b;
          line-height: 1.75;
        }

        /* =========================
           TEAM CARDS
        ========================= */

        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .team-card {
          position: relative;
          min-height: 395px;
          padding: 30px;
          border-radius: 26px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          transition:
            transform 280ms ease,
            box-shadow 280ms ease,
            border-color 280ms ease;
        }

        .team-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.12);
        }

        .team-card::before {
          content: "";
          position: absolute;
          width: 210px;
          height: 210px;
          border-radius: 50%;
          right: -90px;
          top: -90px;
          opacity: 0.75;
        }

        .team-card-indigo::before {
          background: #e0e7ff;
        }

        .team-card-purple::before {
          background: #ede9fe;
        }

        .team-card-cyan::before {
          background: #cffafe;
        }

        .team-card-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 60px;
        }

        .team-card-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          background: #f1f5f9;
        }

        .team-card-indigo .team-card-icon {
          background: #eef2ff;
          color: #4f46e5;
        }

        .team-card-purple .team-card-icon {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .team-card-cyan .team-card-icon {
          background: #ecfeff;
          color: #0891b2;
        }

        .team-card-number {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .team-card h3 {
          position: relative;
          z-index: 2;
          margin: 0;
          font-size: 27px;
          letter-spacing: -0.8px;
        }

        .team-card-subtitle {
          position: relative;
          z-index: 2;
          margin: 8px 0 15px;
          font-size: 14px;
          font-weight: 750;
          color: #4f46e5;
        }

        .team-card-purple .team-card-subtitle {
          color: #7c3aed;
        }

        .team-card-cyan .team-card-subtitle {
          color: #0891b2;
        }

        .team-card-description {
          position: relative;
          z-index: 2;
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.75;
        }

        .team-tags {
          position: absolute;
          z-index: 3;
          left: 30px;
          bottom: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .team-tag {
          padding: 6px 10px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
        }

        /* =========================
           LEARNING JOURNEY
        ========================= */

        .team-journey {
          margin-top: 90px;
          padding: 55px;
          border-radius: 30px;
          background: #0f172a;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .team-journey::before {
          content: "";
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.25);
          filter: blur(70px);
          right: -150px;
          top: -200px;
        }

        .team-journey-content {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .team-journey-label {
          color: #a5b4fc;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .team-journey h2 {
          margin: 12px 0 15px;
          font-size: clamp(30px, 4vw, 42px);
          line-height: 1.12;
          letter-spacing: -1px;
        }

        .team-journey p {
          margin: 0;
          color: #94a3b8;
          line-height: 1.75;
          max-width: 520px;
        }

        .team-journey-steps {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .team-step {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 17px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.045);
          border-radius: 15px;
        }

        .team-step-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99, 102, 241, 0.18);
          color: #a5b4fc;
        }

        .team-step strong {
          display: block;
          font-size: 14px;
        }

        .team-step span {
          color: #94a3b8;
          font-size: 12px;
        }

        /* =========================
           CTA
        ========================= */

        .team-cta {
          text-align: center;
          padding: 100px 20px 30px;
        }

        .team-cta h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 43px);
          letter-spacing: -1.2px;
          line-height: 1.15;
        }

        .team-cta p {
          max-width: 580px;
          margin: 15px auto 20px;
          color: #64748b;
          line-height: 1.7;
        }

        /* NEW CTA HIGHLIGHTS */

        .team-cta-highlights {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin: 0 auto 28px;
        }

        .team-cta-highlights span {
          padding: 8px 13px;
          border-radius: 999px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 12px;
          font-weight: 700;
          transition:
            background 200ms ease,
            border-color 200ms ease,
            transform 200ms ease;
        }

        .team-cta-highlights span:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
          color: #4f46e5;
          transform: translateY(-2px);
        }

        .team-cta-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 22px;
          border-radius: 13px;
          background: #4f46e5;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.22);
          transition: all 220ms ease;
        }

        .team-cta-button:hover {
          background: #3730a3;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(79, 70, 229, 0.3);
        }

        .team-cta-button svg {
          transition: transform 200ms ease;
        }

        .team-cta-button:hover svg {
          transform: translate(3px, -3px);
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 950px) {
          .team-floating {
            display: none;
          }

          .team-grid {
            grid-template-columns: 1fr;
            max-width: 620px;
            margin: auto;
          }

          .team-card {
            min-height: 360px;
          }

          .team-journey-content {
            grid-template-columns: 1fr;
            gap: 35px;
          }
        }

        @media (max-width: 700px) {
          .team-hero {
            padding: 70px 18px 90px;
          }

          .team-hero h1 {
            letter-spacing: -1.8px;
          }

          .team-hero-description {
            font-size: 15px;
          }

          .team-main {
            padding: 0 16px 75px;
          }

          .team-intro {
            margin-top: -30px;
            padding: 25px;
            flex-direction: column;
            align-items: flex-start;
          }

          .team-intro-stat {
            text-align: left;
          }

          .team-section-heading {
            margin-top: 70px;
          }

          .team-card {
            padding: 26px;
            min-height: 370px;
          }

          .team-card-top {
            margin-bottom: 48px;
          }

          .team-tags {
            left: 26px;
            bottom: 26px;
          }

          .team-journey {
            margin-top: 65px;
            padding: 32px 25px;
          }

          .team-cta {
            padding-top: 75px;
          }

          .team-cta-highlights {
            gap: 7px;
          }

          .team-cta-highlights span {
            font-size: 11px;
            padding: 7px 10px;
          }

          .team-cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <main className="team-page">

        {/* ================= HERO ================= */}

        <section className="team-hero">
          <div className="team-hero-container">

            <div className="team-floating one">
              <FiZap />
              Learn. Build. Grow.
            </div>

            <div className="team-floating two">
              <FiUsers />
              Built around learners
            </div>

            <div className="team-floating three">
              <FiPlay />
              Practical learning
            </div>

            <div className="team-hero-content">

              <div className="team-badge">
                <span className="team-badge-dot"></span>
                THE PEOPLE BEHIND TECHDEA
              </div>

              <h1>
                Great learning starts with{" "}
                <span className="team-gradient-text">
                  great people.
                </span>
              </h1>

              <p className="team-hero-description">
                Behind every course, interface, and learning experience is a
                team working to make technology easier to learn, easier to
                understand, and easier to build with.
              </p>

            </div>
          </div>
        </section>

        <section className="team-main">

          {/* ================= INTRO ================= */}

          <div className="team-intro">

            <div className="team-intro-left">

              <div className="team-intro-icon">
                <FiUsers />
              </div>

              <div>
                <h2>A team built around your learning journey.</h2>

                <p>
                  Technology, training, and design working together behind
                  TechDea Learn.
                </p>
              </div>

            </div>

            <div className="team-intro-stat">
              <strong>3</strong>
              <span>CORE AREAS</span>
            </div>

          </div>

          {/* ================= SECTION HEADING ================= */}

          <div className="team-section-heading">

            <div className="team-section-label">
              HOW TECHDEA WORKS
            </div>

            <h2>
              Different expertise.
              <br />

              <span className="team-gradient-text">
                One learning experience.
              </span>
            </h2>

            <p>
              Each part of the team plays a different role, but the goal stays
              the same — helping learners move from understanding concepts to
              actually building with them.
            </p>

          </div>

          {/* ================= TEAM CARDS ================= */}

          <div className="team-grid">

            {teamAreas.map((area) => (
              <article
                key={area.number}
                className={`team-card ${area.className}`}
              >

                <div className="team-card-top">

                  <div className="team-card-icon">
                    {area.icon}
                  </div>

                  <span className="team-card-number">
                    {area.number}
                  </span>

                </div>

                <h3>{area.title}</h3>

                <div className="team-card-subtitle">
                  {area.subtitle}
                </div>

                <p className="team-card-description">
                  {area.description}
                </p>

                <div className="team-tags">
                  {area.tags.map((tag) => (
                    <span className="team-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

              </article>
            ))}

          </div>

          {/* ================= LEARNING JOURNEY ================= */}

          <section className="team-journey">

            <div className="team-journey-content">

              <div>

                <div className="team-journey-label">
                  FROM LEARNING TO BUILDING
                </div>

                <h2>
                  Your journey is the
                  <br />
                  reason we build.
                </h2>

                <p>
                  TechDea brings engineering, training, and design together so
                  that learning doesn't stop at watching a lecture. The goal is
                  to help learners understand, practice, and move forward.
                </p>

              </div>

              <div className="team-journey-steps">

                <div className="team-step">

                  <div className="team-step-icon">
                    <FiBookOpen />
                  </div>

                  <div>
                    <strong>Learn the concept</strong>
                    <span>
                      Build a strong technical foundation.
                    </span>
                  </div>

                </div>

                <div className="team-step">

                  <div className="team-step-icon">
                    <FiLayers />
                  </div>

                  <div>
                    <strong>Practice the skill</strong>
                    <span>
                      Turn knowledge into practical understanding.
                    </span>
                  </div>

                </div>

                <div className="team-step">

                  <div className="team-step-icon">
                    <FiCode />
                  </div>

                  <div>
                    <strong>Build something real</strong>
                    <span>
                      Apply what you learn through technology.
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* ================= CTA ================= */}

          <section className="team-cta">

            <h2>
              Ready to start
              <br />

              <span className="team-gradient-text">
                learning with TechDea?
              </span>
            </h2>

            <p>
              Explore the courses and start building skills that you can
              actually use.
            </p>

            <div className="team-cta-highlights">
              <span>✓ Practical Learning</span>
              <span>✓ Skill-Focused Courses</span>
              <span>✓ Learn at Your Pace</span>
            </div>

            <a
              href="/courses"
              className="team-cta-button"
            >
              Explore Courses
              <FiArrowUpRight />
            </a>

          </section>

        </section>
      </main>
    </>
  );
}