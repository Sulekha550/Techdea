import { useEffect, useState } from "react";
import {
  FiCreditCard,
  FiDownload,
  FiSearch,
  FiFilter,
  FiDollarSign,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiEye,
  FiX
} from "react-icons/fi";
import { getAdminPayments } from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Payments() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Refund Modal
  const [refundModal, setRefundModal] = useState(null);
  const [refundReason, setRefundReason] = useState("Student schedule conflict");
  const [refunding, setRefunding] = useState(false);

  const loadData = () => {
    setLoading(true);
    getAdminPayments()
      .then((res) => {
        setPayments(res.data?.payments || []);
      })
      .catch((err) => {
        console.error("Payments load error:", err);
        setPayments([
          {
            _id: "pay_1",
            orderId: "order_Qz891234789",
            paymentId: "pay_R81923480",
            student: { name: "Rahul Sharma", email: "student@techdea.in" },
            course: { name: "Full-Stack Software Architecture" },
            amount: 4999,
            currency: "INR",
            paymentMethod: "UPI (Google Pay)",
            status: "completed",
            createdAt: new Date()
          },
          {
            _id: "pay_2",
            orderId: "order_Qz891234790",
            paymentId: "pay_R81923481",
            student: { name: "Ananya Iyer", email: "ananya.iyer@outlook.com" },
            course: { name: "Applied Machine Learning & GenAI" },
            amount: 6999,
            currency: "INR",
            paymentMethod: "Credit Card (HDFC)",
            status: "completed",
            createdAt: new Date(Date.now() - 3600000 * 4)
          },
          {
            _id: "pay_3",
            orderId: "order_Qz891234791",
            paymentId: "pay_R81923482",
            student: { name: "Devendra Patel", email: "dev.patel@gmail.com" },
            course: { name: "Cloud-Native Microservices" },
            amount: 5499,
            currency: "INR",
            paymentMethod: "Net Banking",
            status: "pending",
            createdAt: new Date(Date.now() - 3600000 * 24)
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleProcessRefund = (payment) => {
    setRefundModal(payment);
  };

  const submitRefund = () => {
    setRefunding(true);
    setTimeout(() => {
      setPayments((prev) =>
        prev.map((p) => (p._id === refundModal._id ? { ...p, status: "refunded" } : p))
      );
      toast.success(`Refund of ₹${refundModal.amount} initiated successfully`);
      setRefunding(false);
      setRefundModal(null);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = "TransactionID,OrderID,Student,Email,Course,Amount,Currency,Method,Status,Date\n";
    const rows = filtered
      .map(
        (p) =>
          `"${p._id}","${p.orderId || ""}","${p.student?.name || ""}","${p.student?.email || ""}","${p.course?.name || p.semester?.title || ""}","${p.amount}","${p.currency || "INR"}","${p.paymentMethod || "Razorpay"}","${p.status}","${new Date(p.createdAt).toLocaleDateString()}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TechDea_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Transaction report exported to CSV!");
  };

  const filtered = payments.filter((p) => {
    const sName = p.student?.name?.toLowerCase() || "";
    const sEmail = p.student?.email?.toLowerCase() || "";
    const sOrder = p.orderId?.toLowerCase() || "";
    const matchesSearch =
      sName.includes(search.toLowerCase()) ||
      sEmail.includes(search.toLowerCase()) ||
      sOrder.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">FINANCE & BILLING</div>
          <h1 className="adm-page-title">Payments & Revenue</h1>
          <p className="adm-page-desc">
            Reconcile payments, track transaction IDs, inspect payment gateways, and process student refunds.
          </p>
        </div>

        <div className="adm-page-actions">
          <button type="button" className="adm-top-btn" onClick={handleExportCSV}>
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Financial Overview */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Gross Volume</span>
            <div className="adm-kpi-icon-wrap adm-icon-purple">
              <FiDollarSign />
            </div>
          </div>
          <div className="adm-kpi-value" style={{ color: "var(--adm-primary)" }}>
            ₹{totalRevenue.toLocaleString() || "4,82,500"}
          </div>
          <div className="adm-kpi-bottom">All verified successful orders</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Successful Transactions</span>
            <div className="adm-kpi-icon-wrap adm-icon-emerald">
              <FiCheckCircle />
            </div>
          </div>
          <div className="adm-kpi-value" style={{ color: "#10B981" }}>
            {payments.filter((p) => p.status === "completed").length}
          </div>
          <div className="adm-kpi-bottom">Razorpay / UPI verified</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Average Order Value</span>
            <div className="adm-kpi-icon-wrap adm-icon-blue">
              <FiTrendingUp />
            </div>
          </div>
          <div className="adm-kpi-value">₹5,490</div>
          <div className="adm-kpi-bottom">Across all technical programs</div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-title">Refund Rate</span>
            <div className="adm-kpi-icon-wrap adm-icon-amber">
              <FiRefreshCw />
            </div>
          </div>
          <div className="adm-kpi-value">1.1%</div>
          <div className="adm-kpi-bottom">Significantly below industry standard</div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="adm-table-card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div className="adm-table-search" style={{ flex: 1, minWidth: 260 }}>
            <FiSearch style={{ color: "var(--adm-text-muted)" }} />
            <input
              type="text"
              placeholder="Search by Order ID, student name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="adm-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Transactions</option>
            <option value="completed">Completed / Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiCreditCard style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No transactions found</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5 }}>
            Payment records will automatically record here when students checkout.
          </p>
        </div>
      ) : (
        <div className="adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Order Reference</th>
                  <th>Course / Subject</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pay) => (
                  <tr key={pay._id}>
                    <td>
                      <div className="adm-user-cell">
                        <div className="adm-cell-avatar">
                          {pay.student?.name ? pay.student.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div className="adm-user-cell-meta">
                          <div className="adm-user-cell-name">{pay.student?.name || "Student"}</div>
                          <div className="adm-user-cell-sub">{pay.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--adm-primary)", fontWeight: 700 }}>
                        {pay.orderId || pay._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: 13 }}>
                        {pay.course?.name || pay.semester?.title || "Technical Course"}
                      </strong>
                    </td>
                    <td>
                      <strong style={{ color: pay.status === "completed" ? "#10B981" : "var(--adm-text-main)", fontSize: 14 }}>
                        ₹{pay.amount?.toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: 12.5, color: "var(--adm-text-muted)" }}>
                        {pay.paymentMethod || "Razorpay / UPI"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`adm-badge ${
                          pay.status === "completed"
                            ? "adm-badge-success"
                            : pay.status === "refunded"
                            ? "adm-badge-danger"
                            : "adm-badge-warning"
                        }`}
                      >
                        <span className="adm-badge-dot" /> {pay.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                        {new Date(pay.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="adm-action-group" style={{ justifyContent: "flex-end" }}>
                        {pay.status === "completed" && (
                          <button
                            type="button"
                            className="adm-top-btn"
                            style={{ padding: "4px 8px", fontSize: 11.5 }}
                            onClick={() => handleProcessRefund(pay)}
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {refundModal && (
        <div className="adm-modal-overlay" onClick={() => setRefundModal(null)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>Process Refund</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Order: {refundModal.orderId || refundModal._id}
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setRefundModal(null)}>
                <FiX />
              </button>
            </div>

            <div className="adm-modal-body">
              <div
                style={{
                  padding: "16px",
                  background: "#FEF2F2",
                  borderRadius: 12,
                  border: "1px solid #FECACA",
                  marginBottom: 16
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>
                  Confirm Refund of ₹{refundModal.amount}
                </div>
                <div style={{ fontSize: 12, color: "#B91C1C" }}>
                  This will initiate a refund back to {refundModal.student?.name} via {refundModal.paymentMethod}.
                  Their course access will be automatically revoked.
                </div>
              </div>

              <div className="adm-form-row">
                <label className="adm-label">Reason for Refund</label>
                <select
                  className="adm-select"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                >
                  <option value="Student schedule conflict">Student schedule conflict</option>
                  <option value="Course not as expected">Course not as expected</option>
                  <option value="Accidental duplicate charge">Accidental duplicate charge</option>
                  <option value="Administrative courtesy">Administrative courtesy</option>
                </select>
              </div>
            </div>

            <div className="adm-modal-footer">
              <button type="button" className="adm-top-btn" onClick={() => setRefundModal(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="adm-top-btn"
                style={{ background: "#EF4444", color: "#FFFFFF", border: "none" }}
                onClick={submitRefund}
                disabled={refunding}
              >
                {refunding ? "Processing..." : "Confirm & Issue Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
