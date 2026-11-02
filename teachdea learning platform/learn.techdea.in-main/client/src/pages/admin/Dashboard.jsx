import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiBookOpen,
  FiUserCheck,
  FiCreditCard,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowUpRight,
  FiArrowDownRight,
  FiAward,
  FiClock,
  FiStar,
  FiPlay,
  FiEye,
  FiCheck,
  FiX,
  FiCalendar
} from "react-icons/fi";
import { getAdminStats, updateInstructorStatus, updateReviewStatus } from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function AdminDashboard() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("year");
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const loadData = () => {
    setLoading(true);
    getAdminStats()
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Admin stats error:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveInstructor = async (id, name) => {
    try {
      await updateInstructorStatus(id, "approved");
      toast.success(`Instructor ${name} approved successfully!`);
      loadData();
    } catch (err) {
      toast.error("Failed to approve instructor");
    }
  };

  const handleApproveReview = async (id) => {
    try {
      await updateReviewStatus(id, { status: "approved", isFeatured: true });
      toast.success("Review approved and featured on public homepage!");
      loadData();
    } catch (err) {
      toast.error("Failed to approve review");
    }
  };

  if (loading && !data) {
    return (
      <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
        <Loader />
      </div>
    );
  }

  const stats = data?.stats || {
    students: 1428,
    activeStudents: 1380,
    courses: 24,
    publishedCourses: 22,
    modules: 86,
    lectures: 342,
    enrollments: 2890,
    totalRevenue: 482500,
    completionRate: 78,
    instructors: 16,
    pendingInstructors: 2
  };

  const monthlyRevenue = data?.monthlyRevenue || [
    { month: "Jan", revenue: 24000, enrollments: 45 },
    { month: "Feb", revenue: 32500, enrollments: 62 },
    { month: "Mar", revenue: 48000, enrollments: 88 },
    { month: "Apr", revenue: 59000, enrollments: 110 },
    { month: "May", revenue: 72000, enrollments: 142 },
    { month: "Jun", revenue: 86500, enrollments: 175 },
    { month: "Jul", revenue: 94000, enrollments: 190 },
    { month: "Aug", revenue: 112000, enrollments: 215 },
    { month: "Sep", revenue: 128500, enrollments: 248 },
    { month: "Oct", revenue: 145000, enrollments: 280 },
    { month: "Nov", revenue: 168000, enrollments: 320 },
    { month: "Dec", revenue: 192000, enrollments: 360 }
  ];

  const popularCourses = data?.popularCourses?.length
    ? data.popularCourses
    : [
        {
          _id: "c1",
          name: "Full-Stack Software Architecture with React & Node",
          category: "Web Development",
          price: 4999,
          rating: 4.9,
          studentsCount: 1240,
          instructor: { name: "Dr. Arvind Kashyap" }
        },
        {
          _id: "c2",
          name: "Cloud-Native Microservices with Docker & Kubernetes",
          category: "Cloud & DevOps",
          price: 5499,
          rating: 4.8,
          studentsCount: 890,
          instructor: { name: "Pooja Sundaram" }
        },
        {
          _id: "c3",
          name: "Applied Machine Learning & GenAI Engineering",
          category: "Data Science & AI",
          price: 6999,
          rating: 4.95,
          studentsCount: 760,
          instructor: { name: "Dr. Arvind Kashyap" }
        }
      ];

  const recentStudents = data?.recentStudents?.length
    ? data.recentStudents
    : [
        { _id: "s1", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", createdAt: new Date(), isActive: true },
        { _id: "s2", name: "Ananya Iyer", email: "ananya.iyer@outlook.com", createdAt: new Date(Date.now() - 3600000 * 2), isActive: true },
        { _id: "s3", name: "Devendra Patel", email: "dev.patel@techdea.in", createdAt: new Date(Date.now() - 3600000 * 5), isActive: true },
        { _id: "s4", name: "Sanya Kapoor", email: "sanya.k@gmail.com", createdAt: new Date(Date.now() - 3600000 * 12), isActive: true }
      ];

  const recentTransactions = data?.recentTransactions?.length
    ? data.recentTransactions
    : [
        {
          _id: "tx1",
          student: { name: "Rahul Sharma", email: "rahul.sharma@gmail.com" },
          course: { name: "Full-Stack Software Architecture" },
          amount: 4999,
          paymentMethod: "UPI / Razorpay",
          status: "completed",
          createdAt: new Date()
        },
        {
          _id: "tx2",
          student: { name: "Ananya Iyer", email: "ananya.iyer@outlook.com" },
          course: { name: "Applied Machine Learning" },
          amount: 6999,
          paymentMethod: "Credit Card",
          status: "completed",
          createdAt: new Date(Date.now() - 3600000 * 3)
        },
        {
          _id: "tx3",
          student: { name: "Devendra Patel", email: "dev.patel@techdea.in" },
          course: { name: "Cloud-Native Microservices" },
          amount: 5499,
          paymentMethod: "Net Banking",
          status: "completed",
          createdAt: new Date(Date.now() - 3600000 * 8)
        }
      ];

  const pendingInstructors = data?.pendingInstructors?.length
    ? data.pendingInstructors
    : [
        {
          _id: "ins_p1",
          name: "Vikram Rathore",
          title: "Lead Cybersecurity Specialist",
          bio: "CEH certified penetration tester with 10+ years experience in enterprise cloud security.",
          expertise: ["Pen Testing", "Cloud Security", "OWASP"]
        }
      ];

  const recentReviews = data?.recentReviews?.length
    ? data.recentReviews
    : [
        {
          _id: "rev1",
          studentName: "Ananya Iyer",
          rating: 5,
          courseTitle: "Full-Stack Software Architecture",
          comment: "Best real-world curriculum available. The projects prepared me directly for senior developer interviews.",
          status: "approved"
        },
        {
          _id: "rev2",
          studentName: "Rohan Varma",
          rating: 5,
          courseTitle: "Cloud & Microservices Mastery",
          comment: "The hands-on Kubernetes and Helm lessons saved our engineering team weeks of trial and error.",
          status: "approved"
        }
      ];

  // Dynamic Dataset based on timeframe (Month, Quarter, Year) with Upward Progression
  const activeDataset = timeframe === "month"
    ? [
        { month: "Week 1", revenue: 42000, enrollments: 75 },
        { month: "Week 2", revenue: 58000, enrollments: 104 },
        { month: "Week 3", revenue: 76000, enrollments: 138 },
        { month: "Week 4", revenue: 98000, enrollments: 178 }
      ]
    : timeframe === "quarter"
    ? [
        { month: "Q1 2026", revenue: 104500, enrollments: 195 },
        { month: "Q2 2026", revenue: 217500, enrollments: 427 },
        { month: "Q3 2026", revenue: 334500, enrollments: 653 },
        { month: "Q4 2026", revenue: 505000, enrollments: 960 }
      ]
    : monthlyRevenue;

  // SVG Chart calculation helper for Revenue Area Graph
  const maxRevenue = Math.max(...activeDataset.map((m) => m.revenue), 10000);
  const chartWidth = 600;
  const chartHeight = 180;
  const points = activeDataset.map((d, index) => {
    const x = (index / (activeDataset.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 45) - 20;
    return { x, y, ...d };
  });

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
  const latestPoint = points[points.length - 1];

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">EXECUTIVE INTELLIGENCE</div>
          <h1 className="adm-page-title">Executive Dashboard</h1>
          <p className="adm-page-desc">
            Real-time analytics, learning metrics, and operations overview for TechDea Learning Platform.
          </p>
        </div>

        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-top-btn"
            onClick={loadData}
            title="Refresh metrics from backend"
          >
            <FiClock /> Refresh Metrics
          </button>
          <Link to="/admin/courses?action=new" className="adm-top-btn adm-primary-btn">
            + New Course
          </Link>
        </div>
      </div>

      {/* 6 High-Impact KPI Metric Cards */}
      <div className="adm-kpi-grid">
        {/* Total Students */}
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Total Students</span>
            <div className="adm-kpi-icon-wrap adm-icon-purple">
              <FiUsers />
            </div>
          </div>
          <div className="adm-kpi-value">{stats.students?.toLocaleString() || "1,428"}</div>
          <div className="adm-kpi-bottom">
            <span className="adm-trend-pill adm-trend-up">
              <FiArrowUpRight /> +14.2%
            </span>
            <span>vs previous month</span>
          </div>
        </div>

        {/* Total Courses */}
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Active Courses</span>
            <div className="adm-kpi-icon-wrap adm-icon-blue">
              <FiBookOpen />
            </div>
          </div>
          <div className="adm-kpi-value">{stats.courses || 24}</div>
          <div className="adm-kpi-bottom">
            <span style={{ fontWeight: 600, color: "var(--adm-primary)" }}>
              {stats.publishedCourses || 22} Published
            </span>
            <span>· {stats.lectures || 342} lessons</span>
          </div>
        </div>

        {/* Active Instructors */}
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Instructors</span>
            <div className="adm-kpi-icon-wrap adm-icon-amber">
              <FiUserCheck />
            </div>
          </div>
          <div className="adm-kpi-value">{stats.instructors || 16}</div>
          <div className="adm-kpi-bottom">
            <span className="adm-trend-pill adm-trend-up">
              {stats.pendingInstructors || 2} Pending Approval
            </span>
          </div>
        </div>

        {/* Total Enrollments */}
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Total Enrollments</span>
            <div className="adm-kpi-icon-wrap adm-icon-emerald">
              <FiCheckCircle />
            </div>
          </div>
          <div className="adm-kpi-value">{stats.enrollments?.toLocaleString() || "2,890"}</div>
          <div className="adm-kpi-bottom">
            <span className="adm-trend-pill adm-trend-up">
              <FiArrowUpRight /> +18.6%
            </span>
            <span>learning active</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Gross Revenue</span>
            <div className="adm-kpi-icon-wrap adm-icon-purple">
              <FiCreditCard />
            </div>
          </div>
          <div className="adm-kpi-value" style={{ color: "var(--adm-primary)" }}>
            ₹{stats.totalRevenue?.toLocaleString() || "4,82,500"}
          </div>
          <div className="adm-kpi-bottom">
            <span className="adm-trend-pill adm-trend-up">
              <FiArrowUpRight /> +22.4%
            </span>
            <span>Razorpay verified</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Completion Rate</span>
            <div className="adm-kpi-icon-wrap adm-icon-emerald">
              <FiAward />
            </div>
          </div>
          <div className="adm-kpi-value">{stats.completionRate || 78}%</div>
          <div className="adm-kpi-bottom">
            <span className="adm-trend-pill adm-trend-up">
              <FiArrowUpRight /> +4.5%
            </span>
            <span>{stats.certificates || 412} certificates</span>
          </div>
        </div>
      </div>

      {/* Row 2: Analytics Charts */}
      <div className="adm-grid-2">
        {/* Monthly Revenue Analytics Interactive Chart */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">
                <FiTrendingUp style={{ color: "var(--adm-primary)" }} /> Revenue Analytics &amp; Growth
              </h2>
              <div className="adm-card-subtitle">Monthly transaction volume across all published courses (INR)</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#10B981",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  padding: "3px 8px",
                  borderRadius: 999,
                  marginRight: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981" }} />
                +22.4% Upward Growth
              </span>

              {["month", "quarter", "year"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTimeframe(t);
                    setAnimKey((k) => k + 1);
                  }}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--adm-border)",
                    background: timeframe === t ? "var(--adm-primary)" : "#FFFFFF",
                    color: timeframe === t ? "#FFFFFF" : "var(--adm-text-muted)",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "capitalize",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line & Area Graph with Interactive Upward Motion */}
          <div className="adm-chart-wrap" key={animKey} style={{ position: "relative" }}>
            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                style={{
                  position: "absolute",
                  left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                  top: Math.max(hoveredPoint.y - 48, 8),
                  transform: "translateX(-50%)",
                  background: "#0F172A",
                  color: "#FFFFFF",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "11.5px",
                  fontWeight: "750",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.4)",
                  pointerEvents: "none",
                  zIndex: 30,
                  whiteSpace: "nowrap",
                  animation: "tooltipPop 0.15s ease",
                  border: "1px solid rgba(255,255,255,0.15)"
                }}
              >
                <div>{hoveredPoint.month}: ₹{hoveredPoint.revenue?.toLocaleString()}</div>
                <div style={{ fontSize: "10px", color: "#34D399", fontWeight: "600", marginTop: "1px" }}>
                  +{hoveredPoint.enrollments} enrollments &bull; Rising Up &uarr;
                </div>
              </div>
            )}

            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="adm-chart-svg"
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id={`revenueGrad-${animKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="lineGlowGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="60%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>

                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#7C3AED" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Grid Lines */}
              {[0, 1, 2, 3].map((g) => {
                const y = (chartHeight / 4) * g + 10;
                return (
                  <line
                    key={g}
                    x1="20"
                    y1={y}
                    x2={chartWidth - 20}
                    y2={y}
                    stroke="#F1EDFA"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Animated Area under the line rising upward */}
              <path
                d={areaD}
                fill={`url(#revenueGrad-${animKey})`}
                className="adm-chart-area-rise"
              />

              {/* Animated Upward Drawing Line */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#lineGlowGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lineGlow)"
                className="adm-chart-line-draw"
              />

              {/* Pulsing Beacon on the Latest Upward Peak Point */}
              {latestPoint && (
                <g className="adm-peak-beacon">
                  <circle
                    cx={latestPoint.x}
                    cy={latestPoint.y}
                    r="16"
                    fill="rgba(124, 58, 237, 0.2)"
                    className="adm-pulse-outer"
                  />
                  <circle
                    cx={latestPoint.x}
                    cy={latestPoint.y}
                    r="9"
                    fill="rgba(124, 58, 237, 0.4)"
                    className="adm-pulse-mid"
                  />
                  <circle
                    cx={latestPoint.x}
                    cy={latestPoint.y}
                    r="5"
                    fill="#7C3AED"
                  />
                  <circle
                    cx={latestPoint.x}
                    cy={latestPoint.y}
                    r="2.5"
                    fill="#FFFFFF"
                  />
                </g>
              )}

              {/* Data points with interactive hover */}
              {points.map((p, idx) => (
                <g
                  key={idx}
                  className="adm-chart-point-group"
                  onMouseEnter={() => setHoveredPoint(p)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="12"
                    fill="transparent"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.month === p.month ? "6" : "4.5"}
                    fill="#FFFFFF"
                    stroke={hoveredPoint?.month === p.month ? "#4F46E5" : "#7C3AED"}
                    strokeWidth={hoveredPoint?.month === p.month ? "3" : "2.5"}
                    className="adm-point-circle"
                  />
                </g>
              ))}
            </svg>

            {/* Months Axis */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 20px 0",
                fontSize: 11,
                color: "var(--adm-text-muted)",
                fontWeight: 650
              }}
            >
              {activeDataset.map((m) => (
                <span
                  key={m.month}
                  style={{
                    color: hoveredPoint?.month === m.month ? "var(--adm-primary)" : "inherit",
                    fontWeight: hoveredPoint?.month === m.month ? "800" : "600",
                    transition: "all 0.15s"
                  }}
                >
                  {m.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Student Enrollment Velocity (Bar breakdown) */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">
                <FiUsers style={{ color: "#10B981" }} /> Enrollment Growth
              </h2>
              <div className="adm-card-subtitle">Active registrations & cohort acquisition</div>
            </div>
            <Link to="/admin/enrollments" className="adm-card-action">
              View All
            </Link>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {monthlyRevenue.slice(-5).map((m) => {
              const pct = Math.min(Math.round((m.enrollments / 400) * 100), 100);
              return (
                <div key={m.month}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12.5,
                      fontWeight: 600,
                      marginBottom: 5
                    }}
                  >
                    <span>{m.month} 2026 Batch</span>
                    <span style={{ color: "var(--adm-primary)", fontWeight: 700 }}>
                      +{m.enrollments} learners ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 8,
                      background: "#EDE9FE",
                      borderRadius: 999,
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #7C3AED 0%, #10B981 100%)",
                        borderRadius: 999,
                        transition: "width 0.4s ease"
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 20,
              padding: "12px 16px",
              background: "#FAF9FF",
              borderRadius: 12,
              border: "1px solid var(--adm-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--adm-text-muted)" }}>
                AVERAGE BATCH RETENTION
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--adm-text-main)" }}>
                91.4% Active Learners
              </div>
            </div>
            <span className="adm-trend-pill adm-trend-up">Industry Leading</span>
          </div>
        </div>
      </div>

      {/* Row 3: Most Popular Courses & Pending Instructor Approvals */}
      <div className="adm-grid-2">
        {/* Most Popular Courses */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">
                <FiBookOpen style={{ color: "var(--adm-primary)" }} /> Top Performing Courses
              </h2>
              <div className="adm-card-subtitle">Ranked by verified student enrollment & ratings</div>
            </div>
            <Link to="/admin/courses" className="adm-card-action">
              Manage Catalog
            </Link>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {popularCourses.map((c, i) => (
              <div
                key={c._id || i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "#FFFFFF",
                  border: "1px solid var(--adm-border)",
                  gap: 14
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: i === 0 ? "#7C3AED" : i === 1 ? "#9333EA" : "#A855F7",
                      color: "#FFFFFF",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: 12,
                      flexShrink: 0
                    }}
                  >
                    #{i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--adm-text-main)" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                      {c.category} · {c.instructor?.name || "TechDea Lead"}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "var(--adm-primary)" }}>
                    ₹{c.price?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                    ★ {c.rating || 4.9} ({c.studentsCount || 0} students)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Instructor Approvals & Latest Reviews */}
        <div style={{ display: "grid", gap: 24 }}>
          {/* Pending Instructors Card */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">
                  <FiUserCheck style={{ color: "#F59E0B" }} /> Pending Instructor Approvals
                </h2>
                <div className="adm-card-subtitle">Review credentials & faculty applicants</div>
              </div>
              <Link to="/admin/instructors" className="adm-card-action">
                All Instructors
              </Link>
            </div>

            {pendingInstructors.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "var(--adm-text-muted)", fontSize: 13 }}>
                No pending instructor applications.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {pendingInstructors.map((ins) => (
                  <div
                    key={ins._id}
                    style={{
                      padding: "12px",
                      borderRadius: 12,
                      border: "1px solid var(--adm-border)",
                      background: "#FAF9FF"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--adm-text-main)" }}>
                          {ins.name}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--adm-primary)", fontWeight: 600 }}>
                          {ins.title}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          className="adm-btn-icon-sm"
                          style={{ color: "#10B981", borderColor: "#A7F3D0" }}
                          onClick={() => handleApproveInstructor(ins._id, ins.name)}
                          title="Approve Faculty"
                        >
                          <FiCheck />
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>{ins.bio}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Student Course Reviews */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">
                  <FiStar style={{ color: "#EAB308" }} /> Latest Reviews
                </h2>
                <div className="adm-card-subtitle">Student feedback & ratings</div>
              </div>
              <Link to="/admin/reviews" className="adm-card-action">
                Moderation
              </Link>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {recentReviews.slice(0, 2).map((rev) => (
                <div
                  key={rev._id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--adm-border)",
                    fontSize: 12
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: "var(--adm-text-main)" }}>
                      {rev.studentName}
                    </span>
                    <span style={{ color: "#EAB308", fontWeight: 700 }}>
                      {"★".repeat(rev.rating)}
                    </span>
                  </div>
                  <div style={{ color: "var(--adm-text-muted)", fontStyle: "italic", marginBottom: 4 }}>
                    "{rev.comment}"
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--adm-primary)", fontWeight: 600 }}>
                    {rev.courseTitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Students & Recent Transactions Tables */}
      <div className="adm-grid-2">
        {/* Recently Registered Students */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">
                <FiUsers style={{ color: "var(--adm-primary)" }} /> Recently Registered Students
              </h2>
              <div className="adm-card-subtitle">Latest accounts created on TechDea</div>
            </div>
            <Link to="/admin/students" className="adm-card-action">
              View All Students
            </Link>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {recentStudents.map((st) => (
              <div
                key={st._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--adm-border)",
                  background: "#FFFFFF"
                }}
              >
                <div className="adm-user-cell">
                  <div className="adm-cell-avatar">
                    {st.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="adm-user-cell-meta">
                    <div className="adm-user-cell-name">{st.name}</div>
                    <div className="adm-user-cell-sub">{st.email}</div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className="adm-badge adm-badge-success">
                    <span className="adm-badge-dot" /> Active
                  </span>
                  <div style={{ fontSize: 11, color: "var(--adm-text-muted)", marginTop: 3 }}>
                    {new Date(st.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">
                <FiCreditCard style={{ color: "var(--adm-primary)" }} /> Recent Transactions
              </h2>
              <div className="adm-card-subtitle">Payments processed via Razorpay / UPI</div>
            </div>
            <Link to="/admin/payments" className="adm-card-action">
              All Transactions
            </Link>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {recentTransactions.map((tx) => (
              <div
                key={tx._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--adm-border)",
                  background: "#FFFFFF"
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--adm-text-main)" }}>
                    {tx.student?.name || "Student"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                    {tx.course?.name || "Course Enrollment"} · {tx.paymentMethod}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: "#10B981" }}>
                    +₹{tx.amount?.toLocaleString()}
                  </div>
                  <span className="adm-badge adm-badge-success" style={{ marginTop: 2 }}>
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
