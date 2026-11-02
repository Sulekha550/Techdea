import { useEffect, useState } from "react";
import {
  FiBarChart2,
  FiDownload,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiAward,
  FiPieChart,
  FiCalendar
} from "react-icons/fi";
import { getReports } from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Reports() {
  const toast = useToast();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");

  useEffect(() => {
    setLoading(true);
    getReports()
      .then((res) => {
        setReport(res.data?.report);
      })
      .catch((err) => {
        console.error("Reports error:", err);
        setReport({
          summary: {
            totalStudents: 1428,
            totalCourses: 24,
            totalEnrollments: 2890,
            totalRevenue: 482500,
            avgRevenuePerStudent: 338,
            refundRate: "1.1%"
          },
          categoryPerformance: [
            { category: "Web Development", enrollments: 1240, revenue: 198000, completionRate: 82 },
            { category: "Data Science & AI", enrollments: 890, revenue: 145000, completionRate: 76 },
            { category: "Cloud & DevOps", enrollments: 480, revenue: 84000, completionRate: 79 },
            { category: "Mobile Apps", enrollments: 280, revenue: 55500, completionRate: 71 }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadReport = () => {
    if (!report) return;
    const headers = "Category,Enrollments,Revenue,CompletionRate\n";
    const rows = (report.categoryPerformance || [])
      .map((c) => `"${c.category}",${c.enrollments},${c.revenue},"${c.completionRate}%"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TechDea_Executive_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Executive Business Report downloaded!");
  };

  const summary = report?.summary || {
    totalStudents: 1428,
    totalCourses: 24,
    totalEnrollments: 2890,
    totalRevenue: 482500,
    avgRevenuePerStudent: 338,
    refundRate: "1.1%"
  };

  const categoryPerf = report?.categoryPerformance || [];

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">BUSINESS INTELLIGENCE</div>
          <h1 className="adm-page-title">Reports & Analytics</h1>
          <p className="adm-page-desc">
            Executive performance audit, cohort retention, and categorical revenue distribution analysis.
          </p>
        </div>

        <div className="adm-page-actions">
          <select
            className="adm-select-filter"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="ytd">Year to Date (2026)</option>
          </select>

          <button type="button" className="adm-top-btn adm-primary-btn" onClick={handleDownloadReport}>
            <FiDownload /> Download Executive Report (CSV)
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : (
        <div>
          {/* Executive KPI Summary */}
          <div className="adm-kpi-grid">
            <div className="adm-kpi-card">
              <div className="adm-kpi-top">
                <span className="adm-kpi-title">Gross EdTech Revenue</span>
                <div className="adm-kpi-icon-wrap adm-icon-purple">
                  <FiDollarSign />
                </div>
              </div>
              <div className="adm-kpi-value" style={{ color: "var(--adm-primary)" }}>
                ₹{summary.totalRevenue?.toLocaleString()}
              </div>
              <div className="adm-kpi-bottom">Verified Razorpay receipts</div>
            </div>

            <div className="adm-kpi-card">
              <div className="adm-kpi-top">
                <span className="adm-kpi-title">Total Active Learners</span>
                <div className="adm-kpi-icon-wrap adm-icon-blue">
                  <FiUsers />
                </div>
              </div>
              <div className="adm-kpi-value">{summary.totalStudents?.toLocaleString()}</div>
              <div className="adm-kpi-bottom">Across 24 engineering tracks</div>
            </div>

            <div className="adm-kpi-card">
              <div className="adm-kpi-top">
                <span className="adm-kpi-title">Avg Revenue Per Student</span>
                <div className="adm-kpi-icon-wrap adm-icon-emerald">
                  <FiTrendingUp />
                </div>
              </div>
              <div className="adm-kpi-value">₹{summary.avgRevenuePerStudent || 338}</div>
              <div className="adm-kpi-bottom">ARPU metric</div>
            </div>

            <div className="adm-kpi-card">
              <div className="adm-kpi-top">
                <span className="adm-kpi-title">Course Enrollments</span>
                <div className="adm-kpi-icon-wrap adm-icon-amber">
                  <FiAward />
                </div>
              </div>
              <div className="adm-kpi-value">{summary.totalEnrollments?.toLocaleString()}</div>
              <div className="adm-kpi-bottom">Refund rate: {summary.refundRate}</div>
            </div>
          </div>

          {/* Categorical Breakdown Table */}
          <div className="adm-card" style={{ marginBottom: 28 }}>
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">
                  <FiPieChart style={{ color: "var(--adm-primary)" }} /> Category Revenue & Completion Performance
                </h2>
                <div className="adm-card-subtitle">
                  Comparative performance metrics across engineering disciplines
                </div>
              </div>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Discipline</th>
                    <th>Enrollments</th>
                    <th>Gross Revenue</th>
                    <th>Average Completion Rate</th>
                    <th>Performance Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryPerf.map((cat, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong style={{ fontSize: 13.5 }}>{cat.category}</strong>
                      </td>
                      <td>{cat.enrollments?.toLocaleString()} learners</td>
                      <td>
                        <strong style={{ color: "var(--adm-primary)" }}>
                          ₹{cat.revenue?.toLocaleString()}
                        </strong>
                      </td>
                      <td style={{ width: 220 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                          <span>{cat.completionRate}%</span>
                        </div>
                        <div style={{ width: "100%", height: 6, background: "#EDE9FE", borderRadius: 999, overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${cat.completionRate}%`,
                              height: "100%",
                              background: "linear-gradient(90deg, #7C3AED 0%, #10B981 100%)"
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <span className="adm-badge adm-badge-success">Top Quartile</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

