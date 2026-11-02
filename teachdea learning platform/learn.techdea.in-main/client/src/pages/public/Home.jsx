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
  FiStar,
  FiTrendingUp,
  FiActivity,
  FiCheck,
  FiPlus,
  FiMinus,
  FiMonitor,
  FiTerminal,
  FiLock,
  FiServer,
  FiDatabase,
  FiGrid
} from "react-icons/fi";
import { getCourses } from "../../services/courseService.js";
import CourseCard from "../../components/course/CourseCard.jsx";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";

// Premium Fallback Courses if backend database has no active entries
const DEFAULT_FEATURED_COURSES = [
  {
    _id: "course-fsd-01",
    name: "Full-Stack Web Development with MERN & Next.js",
    category: "Full Stack Development",
    level: "Advanced",
    price: 6999,
    discountPrice: 4499,
    rating: 4.9,
    studentsCount: 2840,
    duration: "16 Weeks",
    instructor: { name: "Dr. Arvind Kashyap (Ex-Google)" },
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Master React 19, Node.js, Next.js, Microservices, Docker, Redis and enterprise cloud deployment."
  },
  {
    _id: "course-ai-02",
    name: "Generative AI Engineering & Autonomous LLM Agents",
    category: "Data & AI",
    level: "Intermediate",
    price: 8999,
    discountPrice: 5999,
    rating: 4.95,
    studentsCount: 1950,
    duration: "12 Weeks",
    instructor: { name: "Pooja Sundaram (AI Research Lead)" },
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Build real-world production GenAI apps, RAG pipelines, LangChain, vector databases, and fine-tune models."
  },
  {
    _id: "course-devops-03",
    name: "DevOps, Kubernetes & Cloud Native Architecture",
    category: "DevOps",
    level: "All Levels",
    price: 6499,
    discountPrice: 3999,
    rating: 4.85,
    studentsCount: 1620,
    duration: "10 Weeks",
    instructor: { name: "Vikram Rathore (Principal SRE)" },
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Zero-downtime CI/CD workflows, Docker containerization, Kubernetes cluster orchestration, and AWS infra."
  },
  {
    _id: "course-cyber-04",
    name: "Advanced Cyber Security & Penetration Testing",
    category: "Software Engineering",
    level: "Intermediate",
    price: 7499,
    discountPrice: 4799,
    rating: 4.9,
    studentsCount: 1310,
    duration: "14 Weeks",
    instructor: { name: "Sameer Varma (Certified Ethical Hacker)" },
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Hands-on threat hunting, network security, ethical exploitation, bug bounty methods, and SOC fundamentals."
  },
  {
    _id: "course-data-05",
    name: "Applied Data Science, ML & Predictive Modeling",
    category: "Data & AI",
    level: "Beginner",
    price: 5999,
    discountPrice: 3499,
    rating: 4.8,
    studentsCount: 2200,
    duration: "12 Weeks",
    instructor: { name: "Dr. Arvind Kashyap" },
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    shortDescription: "From Python & Pandas to Machine Learning algorithms, statistical modeling, Scikit-learn, and dashboards."
  },
  {
    _id: "course-mobile-06",
    name: "Cross-Platform Mobile App Engineering (React Native & Flutter)",
    category: "Full Stack Development",
    level: "All Levels",
    price: 5499,
    discountPrice: 3299,
    rating: 4.88,
    studentsCount: 1480,
    duration: "10 Weeks",
    instructor: { name: "Ananya Roy (Senior Mobile Architect)" },
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Craft high-performance native iOS & Android applications with React Native, Expo, Redux, and offline sync."
  },
  {
    _id: "course-web3-07",
    name: "Web3, Smart Contracts & Blockchain Systems",
    category: "Software Engineering",
    level: "Advanced",
    price: 7999,
    discountPrice: 4999,
    rating: 4.92,
    studentsCount: 1120,
    duration: "10 Weeks",
    instructor: { name: "Aditya Mehta (Blockchain Core Dev)" },
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Build decentralized applications (dApps), write secure Solidity smart contracts, Ethereum EVM, and DeFi protocols."
  },
  {
    _id: "course-uiux-08",
    name: "UI/UX Engineering & Modern Product Design Systems",
    category: "Technology",
    level: "Beginner",
    price: 4999,
    discountPrice: 2999,
    rating: 4.86,
    studentsCount: 1750,
    duration: "8 Weeks",
    instructor: { name: "Rhea Sen (Product Design Lead)" },
    thumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Master Figma, wireframing, micro-interactions, responsive typography, and scalable enterprise design systems."
  }
];

export default function Home() {
  const [courses, setCourses] = useState(DEFAULT_FEATURED_COURSES);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    getCourses({ all: "false" })
      .then(({ data }) => {
        if (data?.courses && data.courses.length > 0) {
          const existingNames = new Set(data.courses.map((c) => (c.name || "").toLowerCase()));
          const complementary = DEFAULT_FEATURED_COURSES.filter(
            (c) => !existingNames.has((c.name || "").toLowerCase())
          );
          setCourses([...data.courses, ...complementary]);
        } else {
          setCourses(DEFAULT_FEATURED_COURSES);
        }
      })
      .catch((err) => {
        console.error("Home course load error (using fallback):", err);
        setCourses(DEFAULT_FEATURED_COURSES);
      })
      .finally(() => setLoading(false));
  }, []);

  const domains = [
    { id: "all", label: "All Programs" },
    { id: "Full Stack Development", label: "Web & Full Stack" },
    { id: "Data & AI", label: "Artificial Intelligence & Data" },
    { id: "DevOps", label: "DevOps & Cloud" },
    { id: "Software Engineering", label: "Cyber Security & Systems" }
  ];

  const filteredCourses = selectedDomain === "all"
    ? courses.slice(0, 6)
    : courses.filter(c => c.category === selectedDomain || c.branch === selectedDomain).slice(0, 6);

  const faqs = [
    {
      q: "How does the TechDea learning methodology work?",
      a: "Our programs are 80% practical and 20% theory. Every week you attend live interactive masterclasses, build real-world GitHub capstones, receive 1-on-1 code reviews from senior engineers, and practice with industry-standard tooling."
    },
    {
      q: "Can I access the complete Admin Dashboard to manage courses and students?",
      a: "Yes! Click the prominent 'Admin Panel' button at the top of the website. It gives administrators, instructors, and academy directors complete access to the live console: student enrollments, course syllabus editor, live class scheduling, revenue analytics, and digital certification."
    },
    {
      q: "Are the certificates verified and recognized by hiring companies?",
      a: "Absolutely. Every TechDea certificate comes with a unique cryptographic verification ID and QR code. Employers can verify credentials instantly via our public verification portal (/verify/:id)."
    },
    {
      q: "Is there job placement and career assistance provided?",
      a: "Yes. Our Career Acceleration Hub provides resume audits, LinkedIn profile optimization, DSA mock interviews, and direct referrals to over 450+ partner tech companies."
    }
  ];

  return (
    <div className="home-page-container">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-modern">
        <div className="hero-modern-backdrop" />
        <div className="container hero-grid-modern">
          <div className="hero-copy-modern">
            {/* Platform Status Badge - Matching semester.techdea.in */}
            <div className="hero-pill-badge">
              <span className="hero-pill-indicator" />
              <span>Where Technology Meets Learning</span>
            </div>

            <h1 className="hero-headline-ultra">
              Master High-Impact <span className="hero-gradient-text">Software &amp; AI Tech</span> to Build Your Future
            </h1>

            <p className="hero-subtext">
              Industry-accredited software architecture, artificial intelligence,
              cloud engineering, and industrial bootcamps — engineered with live mentors
              and real-world production labs.
            </p>

            {/* Action Buttons: Includes PROMINENT Admin Panel Button */}
            <div className="hero-action-buttons">
              <Link
                to="/courses"
                className="btn-hero-primary"
              >
                <span>Explore All Courses</span>
                <FiArrowRight />
              </Link>

              {/* Direct Complete Admin Dashboard Access Button */}
              <Link
                to="/admin"
                className="btn-hero-admin"
                title="Open Complete Admin Dashboard"
              >
                <FiShield className="admin-glow-icon" />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "13px", fontWeight: "800", lineHeight: "1.2" }}>
                    Admin Panel
                  </div>
                  <div style={{ fontSize: "10px", opacity: 0.85, fontWeight: "600" }}>
                    Complete Dashboard &bull; Live
                  </div>
                </div>
              </Link>
            </div>

            {/* Trust Checkmarks */}
            <div className="hero-trust-checks">
              <div className="trust-check-item">
                <FiCheckCircle className="check-icon" />
                <span>80% Practical GitHub Projects</span>
              </div>
              <div className="trust-check-item">
                <FiCheckCircle className="check-icon" />
                <span>1-on-1 Senior Tech Mentors</span>
              </div>
              <div className="trust-check-item">
                <FiCheckCircle className="check-icon" />
                <span>ISO & Cryptographic Certificates</span>
              </div>
            </div>

            {/* Live Metrics Row */}
            <div className="hero-metrics-strip">
              <div className="metric-box">
                <span className="metric-value">18,500+</span>
                <span className="metric-label">Active Learners</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-value">98.4%</span>
                <span className="metric-label">Placement Success</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-value">450+</span>
                <span className="metric-label">Hiring Partners</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-value">4.9 / 5</span>
                <span className="metric-label">Student Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Right-Side Image Showcase with Glass Badges */}
          <div className="hero-image-showcase">
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
                alt="TechDea Students Coding & Collaborating"
                className="hero-main-photo"
                loading="eager"
              />
              <div className="hero-photo-gradient-overlay" />

              {/* Live Batch Indicator */}
              <div className="hero-floating-live-pill">
                <span className="live-pulse-dot" />
                <span>Next Live Cohort Enrolling</span>
              </div>

              {/* Floating Badge: Top-Right */}
              <div className="hero-glass-badge badge-top-right">
                <div className="badge-icon-box icon-purple">
                  <FiBookOpen />
                </div>
                <div>
                  <strong>Hands-on Labs</strong>
                  <span>Project-Based Learning</span>
                </div>
              </div>

              {/* Floating Badge: Bottom-Left */}
              <div className="hero-glass-badge badge-bottom-left">
                <div className="badge-icon-box icon-emerald">
                  <FiAward />
                </div>
                <div>
                  <strong>Verified Diploma</strong>
                  <span>ISO &amp; QR Credential</span>
                </div>
              </div>

              {/* Floating Badge: Bottom-Right */}
              <div className="hero-glass-badge badge-bottom-right">
                <div className="badge-icon-box icon-blue">
                  <FiTrendingUp />
                </div>
                <div>
                  <strong>450+ Hiring Techs</strong>
                  <span>98.4% Placement Record</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HIRING TECH PARTNERS MARQUEE ================= */}
      <section className="hiring-partners-strip">
        <div className="container">
          <div className="hiring-strip-inner">
            <span className="hiring-strip-label">
              GRADUATES HIRED AT TOP TECH ENTERPRISES
            </span>
            <div className="hiring-logos-row">
              <span className="partner-pill"><span className="partner-dot dot-google" /> Google</span>
              <span className="partner-pill"><span className="partner-dot dot-msft" /> Microsoft</span>
              <span className="partner-pill"><span className="partner-dot dot-aws" /> Amazon AWS</span>
              <span className="partner-pill"><span className="partner-dot dot-meta" /> Meta</span>
              <span className="partner-pill"><span className="partner-dot dot-razorpay" /> Razorpay</span>
              <span className="partner-pill"><span className="partner-dot dot-tcs" /> TCS Digital</span>
              <span className="partner-pill"><span className="partner-dot dot-infosys" /> Infosys</span>
              <span className="partner-pill"><span className="partner-dot dot-flipkart" /> Flipkart</span>
              <span className="partner-pill"><span className="partner-dot dot-techm" /> Tech Mahindra</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section-admin-spotlight">
        <div className="container">
          <div className="admin-spotlight-card">
            <div className="admin-spotlight-glow" />
            <div className="admin-spotlight-grid">
              <div className="admin-spotlight-left">
                <div className="admin-badge-mini">
                  <FiShield /> ENTERPRISE LMS ENGINE
                </div>
                <h2>
                  Full-Fledged <span className="highlight-gradient">Admin Dashboard</span> &amp; Control Hub
                </h2>
                <p>
                  Experience the powerful command center designed for academy operators,
                  instructors, and directors. Effortlessly manage student lifecycles, publish
                  curriculum, schedule live Zoom/Meet classes, track revenue, and issue cryptographic certificates.
                </p>

                <div className="admin-spotlight-features">
                  <div className="admin-feature-bullet">
                    <div className="bullet-icon"><FiTrendingUp /></div>
                    <div>
                      <strong>Live Revenue &amp; Enrollment Analytics</strong>
                      <p>Instant financial breakdown, month-over-month growth charts, and retention stats.</p>
                    </div>
                  </div>
                  <div className="admin-feature-bullet">
                    <div className="bullet-icon"><FiBookOpen /></div>
                    <div>
                      <strong>Curriculum &amp; Syllabus Studio</strong>
                      <p>Drag-and-drop course module ordering, video lesson uploads, and automated quizzes.</p>
                    </div>
                  </div>
                  <div className="admin-feature-bullet">
                    <div className="bullet-icon"><FiUsers /></div>
                    <div>
                      <strong>Unified Student &amp; Instructor Management</strong>
                      <p>Detailed learner profiles, progress metrics, assignment grading, and permissions.</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "28px" }}>
                  <Link
                    to="/admin"
                    className="btn-launch-admin"
                  >
                    <FiShield style={{ fontSize: 18 }} />
                    <span>Launch Complete Admin Dashboard</span>
                    <FiArrowRight style={{ fontSize: 18 }} />
                  </Link>
                </div>
              </div>

              {/* Admin Preview Mockup Screen */}
              <div className="admin-spotlight-preview">
                <div className="admin-preview-window">
                  <div className="admin-window-bar">
                    <div className="dots-group">
                      <span className="dot dot-red" />
                      <span className="dot dot-yellow" />
                      <span className="dot dot-green" />
                    </div>
                    <span className="window-title">admin.techdea.in/dashboard &bull; Live Console</span>
                    <span className="window-live-badge"><span className="live-dot" /> Online</span>
                  </div>

                  {/* Dashboard Mockup Content */}
                  <div className="admin-mockup-body">
                    {/* Top KPI Cards in Mockup */}
                    <div className="mockup-kpi-grid">
                      <div className="mockup-kpi-card">
                        <span className="kpi-title">Total Learners</span>
                        <span className="kpi-num">1,428</span>
                        <span className="kpi-sub positive">+14.2% this month</span>
                      </div>
                      <div className="mockup-kpi-card">
                        <span className="kpi-title">Gross Revenue</span>
                        <span className="kpi-num">₹4,82,500</span>
                        <span className="kpi-sub positive">+22.8% YoY</span>
                      </div>
                      <div className="mockup-kpi-card">
                        <span className="kpi-title">Active Courses</span>
                        <span className="kpi-num">24</span>
                        <span className="kpi-sub neutral">100% Published</span>
                      </div>
                    </div>

                    {/* Quick Admin Actions inside Mockup */}
                    <div className="mockup-quick-actions">
                      <div className="mockup-section-title">Admin Quick Controls</div>
                      <div className="mockup-action-buttons">
                        <Link to="/admin/courses" className="mockup-btn">
                          <FiBookOpen /> Courses
                        </Link>
                        <Link to="/admin/students" className="mockup-btn">
                          <FiUsers /> Students
                        </Link>
                        <Link to="/admin/live-classes" className="mockup-btn">
                          <FiMonitor /> Live Classes
                        </Link>
                        <Link to="/admin/payments" className="mockup-btn">
                          <FiTrendingUp /> Payments
                        </Link>
                      </div>
                    </div>

                    {/* Interactive Prompt */}
                    <div className="mockup-banner-footer">
                      <div>
                        <strong>Ready to inspect the live console?</strong>
                        <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>Access all 20+ administrative management pages in 1 click.</p>
                      </div>
                      <Link to="/admin" className="mockup-enter-btn">
                        Open Admin <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPLORE PROGRAMS SECTION ================= */}
      <section className="section section-courses-modern">
        <div className="container">
          <div className="section-head-center">
            <div className="badge-modern-pill">
              <FiZap /> INDUSTRY-ALIGNED CURRICULUM
            </div>
            <h2 className="section-title-large">
              Accelerate Your Career With <span className="highlight-gradient">Cutting-Edge Courses</span>
            </h2>
            <p className="section-subtitle-large">
              Engineered with senior engineers from top global companies. Real code, real architectures, zero fluff.
            </p>

            {/* Filter Tabs */}
            <div className="filter-pill-container">
              {domains.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`filter-pill-btn ${selectedDomain === d.id ? "active" : ""}`}
                  onClick={() => setSelectedDomain(d.id)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <Skeleton />
          ) : (
            <div className="courses-grid-modern">
              {filteredCourses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link to="/courses" className="btn-view-all-courses">
              <span>Explore All {courses.length}+ Programs</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SPECIALIZATION TRACKS ================= */}
      <section className="section section-tracks">
        <div className="container">
          <div className="section-head-center">
            <div className="badge-modern-pill">
              <FiLayers /> CAREER ROADMAPS
            </div>
            <h2 className="section-title-large">
              Targeted Specializations Built For <span className="highlight-gradient">Immediate Hiring</span>
            </h2>
            <p className="section-subtitle-large">
              Choose your domain track, follow a battle-tested roadmap, and build an exceptional portfolio.
            </p>
          </div>

          <div className="tracks-grid">
            <div className="track-card">
              <div className="track-icon-wrap icon-purple">
                <FiCode />
              </div>
              <div className="track-tag">High Demand</div>
              <h3>Full-Stack Software Architecture</h3>
              <p>Master React 19, TypeScript, Next.js, Node.js, distributed databases, caching, and scalable REST/GraphQL APIs.</p>
              <div className="track-chips">
                <span>React</span>
                <span>Node.js</span>
                <span>PostgreSQL</span>
                <span>Docker</span>
              </div>
              <div className="track-footer">
                <span className="track-avg">Avg Package: <strong>₹8 - 18 LPA</strong></span>
                <Link to="/courses" className="track-arrow"><FiArrowRight /></Link>
              </div>
            </div>

            <div className="track-card">
              <div className="track-icon-wrap icon-indigo">
                <FiCpu />
              </div>
              <div className="track-tag tag-hot">🔥 Hottest Track</div>
              <h3>Applied AI &amp; GenAI Engineering</h3>
              <p>Deep-dive into LLM applications, RAG pipelines, LangChain, semantic vectors, fine-tuning, and multimodal AI agents.</p>
              <div className="track-chips">
                <span>Python</span>
                <span>PyTorch</span>
                <span>LangChain</span>
                <span>ChromaDB</span>
              </div>
              <div className="track-footer">
                <span className="track-avg">Avg Package: <strong>₹12 - 25 LPA</strong></span>
                <Link to="/courses" className="track-arrow"><FiArrowRight /></Link>
              </div>
            </div>

            <div className="track-card">
              <div className="track-icon-wrap icon-cyan">
                <FiCloud />
              </div>
              <div className="track-tag">Global Cloud</div>
              <h3>DevOps &amp; Cloud Native Architecture</h3>
              <p>Orchestrate Kubernetes clusters, automate multi-stage CI/CD pipelines, configure AWS/GCP, and manage infrastructure as code.</p>
              <div className="track-chips">
                <span>Kubernetes</span>
                <span>Docker</span>
                <span>Terraform</span>
                <span>AWS</span>
              </div>
              <div className="track-footer">
                <span className="track-avg">Avg Package: <strong>₹10 - 22 LPA</strong></span>
                <Link to="/courses" className="track-arrow"><FiArrowRight /></Link>
              </div>
            </div>

            <div className="track-card">
              <div className="track-icon-wrap icon-red">
                <FiLock />
              </div>
              <div className="track-tag">High Security</div>
              <h3>Cyber Security &amp; Ethical Hacking</h3>
              <p>Master penetration testing, vulnerability assessment, network auditing, reverse engineering, and threat defense.</p>
              <div className="track-chips">
                <span>Kali Linux</span>
                <span>Wireshark</span>
                <span>Metasploit</span>
                <span>SOC</span>
              </div>
              <div className="track-footer">
                <span className="track-avg">Avg Package: <strong>₹9 - 20 LPA</strong></span>
                <Link to="/courses" className="track-arrow"><FiArrowRight /></Link>
              </div>
            </div>

            <div className="track-card">
              <div className="track-icon-wrap icon-emerald">
                <FiDatabase />
              </div>
              <div className="track-tag">Analytics</div>
              <h3>Data Science &amp; Predictive Analytics</h3>
              <p>Transform raw big data into strategic business intelligence using Python, Pandas, statistical modeling, and ML libraries.</p>
              <div className="track-chips">
                <span>Pandas</span>
                <span>Scikit-learn</span>
                <span>Tableau</span>
                <span>SQL</span>
              </div>
              <div className="track-footer">
                <span className="track-avg">Avg Package: <strong>₹8 - 17 LPA</strong></span>
                <Link to="/courses" className="track-arrow"><FiArrowRight /></Link>
              </div>
            </div>

            <div className="track-card">
              <div className="track-icon-wrap icon-amber">
                <FiMonitor />
              </div>
              <div className="track-tag">Multi-Device</div>
              <h3>Cross-Platform Mobile Engineering</h3>
              <p>Architect stunning, snappy mobile experiences for iOS and Android with single-codebase React Native &amp; Flutter.</p>
              <div className="track-chips">
                <span>React Native</span>
                <span>Expo</span>
                <span>Redux</span>
                <span>Swift/Kotlin</span>
              </div>
              <div className="track-footer">
                <span className="track-avg">Avg Package: <strong>₹8 - 16 LPA</strong></span>
                <Link to="/courses" className="track-arrow"><FiArrowRight /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY TECHDEA (PLATFORM ADVANTAGE) ================= */}
      <section className="section section-advantage">
        <div className="container">
          <div className="advantage-grid">
            <div className="advantage-copy">
              <div className="badge-modern-pill">
                <FiAward /> THE TECHDEA ADVANTAGE
              </div>
              <h2 className="section-title-large" style={{ textAlign: "left" }}>
                Built Different for <span className="highlight-gradient">Real Software Careers</span>
              </h2>
              <p className="advantage-sub">
                Most platforms sell endless video libraries with zero accountability.
                TechDea is designed as a rigorous tech accelerator where you write production code
                and build verified work proof.
              </p>

              <div className="advantage-list">
                <div className="adv-item">
                  <div className="adv-num">01</div>
                  <div>
                    <h4>Interactive Cloud Sandboxes &amp; Labs</h4>
                    <p>Code directly in browser-based VS Code environments pre-configured with databases and containers.</p>
                  </div>
                </div>

                <div className="adv-item">
                  <div className="adv-num">02</div>
                  <div>
                    <h4>1-on-1 Code Reviews From Senior Tech Leads</h4>
                    <p>Every assignment and pull request receives line-by-line feedback from engineers working at top product firms.</p>
                  </div>
                </div>

                <div className="adv-item">
                  <div className="adv-num">03</div>
                  <div>
                    <h4>Cryptographic Certificate Verification</h4>
                    <p>All graduation diplomas feature immutable QR verification IDs, making your resume 100% credible to recruiters.</p>
                  </div>
                </div>

                <div className="adv-item">
                  <div className="adv-num">04</div>
                  <div>
                    <h4>Direct Campus-to-Corporate Placement Pipeline</h4>
                    <p>Resume workshops, mock algorithmic interviews, and direct employer introductions to 450+ partner companies.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="advantage-visual">
              <div className="adv-glass-card">
                <div className="adv-card-header">
                  <div className="adv-badge-pulse">
                    <span className="pulse-dot-green" /> PLATFORM HEALTH: 100%
                  </div>
                  <span className="adv-timestamp">Real-Time Metrics</span>
                </div>

                <div className="adv-stat-cards">
                  <div className="adv-stat-tile">
                    <span className="adv-stat-big">96.8%</span>
                    <span className="adv-stat-desc">Course Completion Rate</span>
                  </div>
                  <div className="adv-stat-tile">
                    <span className="adv-stat-big">4.9 / 5</span>
                    <span className="adv-stat-desc">Student Satisfaction</span>
                  </div>
                  <div className="adv-stat-tile">
                    <span className="adv-stat-big">48 hrs</span>
                    <span className="adv-stat-desc">Avg Mentor SLA Review</span>
                  </div>
                  <div className="adv-stat-tile">
                    <span className="adv-stat-big">₹8.5 LPA</span>
                    <span className="adv-stat-desc">Median Graduate CTC</span>
                  </div>
                </div>

                <div className="adv-quote-box">
                  <p>
                    "TechDea taught me how real engineering teams operate. Within 3 months of completing the Full-Stack Cloud track, I converted a frontend developer interview into a Senior Software Engineer offer at a US SaaS startup."
                  </p>
                  <div className="adv-quote-author">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Student"
                      className="author-avatar"
                    />
                    <div>
                      <strong>Pooja Deshmukh</strong>
                      <span>Software Engineer &bull; Placed at CloudScale Labs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STUDENT TESTIMONIALS ================= */}
      <section className="section section-testimonials">
        <div className="container">
          <div className="section-head-center">
            <div className="badge-modern-pill">
              <FiUsers /> ALUMNI SUCCESS STORIES
            </div>
            <h2 className="section-title-large">
              From Passionate Beginners to <span className="highlight-gradient">Hired Engineers</span>
            </h2>
            <p className="section-subtitle-large">
              Discover how TechDea learners transformed their careers across the globe.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testi-card">
              <div className="testi-stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="star-filled" />
                ))}
              </div>
              <p className="testi-text">
                "The curriculum isn't just about syntax — it's about system design, microservices, and debugging real production errors. The Admin Panel and student notes portal made tracking my roadmap effortless."
              </p>
              <div className="testi-user">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Aman"
                  className="testi-avatar"
                />
                <div>
                  <strong>Aman Saxena</strong>
                  <span>Full-Stack Engineer &bull; Razorpay</span>
                </div>
              </div>
            </div>

            <div className="testi-card">
              <div className="testi-stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="star-filled" />
                ))}
              </div>
              <p className="testi-text">
                "The Generative AI track was unreal. We built actual RAG architectures and deployed autonomous agents using LangChain and AWS. My mentor gave code reviews that helped me clear the Amazon interview."
              </p>
              <div className="testi-user">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Sneha"
                  className="testi-avatar"
                />
                <div>
                  <strong>Sneha Kulkarni</strong>
                  <span>AI Engineer &bull; Amazon AWS</span>
                </div>
              </div>
            </div>

            <div className="testi-card">
              <div className="testi-stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="star-filled" />
                ))}
              </div>
              <p className="testi-text">
                "Coming from a tier-3 college, I had zero industry exposure. TechDea gave me hands-on Docker and Kubernetes experience that made me stand out from thousands of other fresh graduates."
              </p>
              <div className="testi-user">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Rohan"
                  className="testi-avatar"
                />
                <div>
                  <strong>Rohan Sen</strong>
                  <span>DevOps Engineer &bull; Tech Mahindra</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="section section-faq">
        <div className="container">
          <div className="section-head-center">
            <div className="badge-modern-pill">
              <FiBookOpen /> GOT QUESTIONS?
            </div>
            <h2 className="section-title-large">
              Frequently Asked <span className="highlight-gradient">Questions</span>
            </h2>
            <p className="section-subtitle-large">
              Everything you need to know about the platform, certifications, and admin access.
            </p>
          </div>

          <div className="faq-accordion-box">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className={`faq-item ${activeFaq === idx ? "expanded" : ""}`}
                onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
              >
                <div className="faq-header">
                  <h3>{f.q}</h3>
                  <button type="button" className="faq-toggle-btn">
                    {activeFaq === idx ? <FiMinus /> : <FiPlus />}
                  </button>
                </div>
                {activeFaq === idx && (
                  <div className="faq-body">
                    <p>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION (CTA) ================= */}
      <section className="section-final-cta">
        <div className="container">
          <div className="final-cta-card">
            <div className="final-cta-glow" />
            <div className="final-cta-content">
              <span className="final-pill">⚡ START YOUR TECH ACCELERATION</span>
              <h2>Ready to Build Real Technology and Lead the Future?</h2>
              <p>
                Join over 18,500+ ambitious developers, engineers, and digital innovators
                upskilling on TechDea. Or explore the complete Admin Dashboard right now!
              </p>

              <div className="final-cta-buttons">
                <Link to="/courses" className="btn-cta-explore">
                  <span>Explore Courses</span>
                  <FiArrowRight />
                </Link>

                <Link to="/admin" className="btn-cta-admin">
                  <FiShield />
                  <span>Open Admin Panel (Complete Dashboard)</span>
                </Link>

                <Link to="/contact" className="btn-cta-contact">
                  Talk to a Counselor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}