import { useEffect, useState } from "react";
import {
  FiTag,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPercent,
  FiClock,
  FiCheck,
  FiX,
  FiCopy
} from "react-icons/fi";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Coupons() {
  const toast = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountPercentage: 25,
    maxDiscount: 2000,
    minPurchase: 999,
    usageLimit: 100,
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    getCoupons()
      .then((res) => {
        setCoupons(res.data?.coupons || []);
      })
      .catch((err) => {
        console.error("Coupons error:", err);
        setCoupons([
          {
            _id: "c1",
            code: "TECHDEA50",
            description: "50% Special Inaugural Cohort Discount",
            discountPercentage: 50,
            maxDiscount: 2500,
            minPurchase: 999,
            usageLimit: 200,
            usedCount: 46,
            isActive: true
          },
          {
            _id: "c2",
            code: "EARLYBIRD",
            description: "Early Bird 30% Off for Next Batch",
            discountPercentage: 30,
            maxDiscount: 1500,
            minPurchase: 499,
            usageLimit: 100,
            usedCount: 18,
            isActive: true
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied!`);
  };

  const handleToggleActive = async (coupon) => {
    try {
      const nextActive = !coupon.isActive;
      await updateCoupon(coupon._id, { isActive: nextActive });
      toast.success(`Coupon ${nextActive ? "Activated" : "Deactivated"}`);
      setCoupons((prev) =>
        prev.map((c) => (c._id === coupon._id ? { ...c, isActive: nextActive } : c))
      );
    } catch (err) {
      toast.error("Failed to update coupon status");
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon "${coupon.code}"?`)) return;
    try {
      await deleteCoupon(coupon._id);
      toast.success("Coupon deleted");
      setCoupons((prev) => prev.filter((c) => c._id !== coupon._id));
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    setSubmitting(true);
    try {
      await createCoupon({
        ...form,
        code: form.code.toUpperCase().trim()
      });
      toast.success("Coupon code created successfully");
      setModalOpen(false);
      setForm({
        code: "",
        description: "",
        discountPercentage: 25,
        maxDiscount: 2000,
        minPurchase: 999,
        usageLimit: 100,
        isActive: true
      });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">COMMERCE & PROMOTIONS</div>
          <h1 className="adm-page-title">Coupons & Discounts</h1>
          <p className="adm-page-desc">
            Create promotional coupon discount campaigns, set minimum spend rules, and track redemption limits.
          </p>
        </div>

        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setModalOpen(true)}
          >
            <FiPlus /> Create Coupon
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : coupons.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiTag style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No coupons active</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
            Create discount voucher codes for special marketing campaigns.
          </p>
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setModalOpen(true)}
            style={{ margin: "0 auto" }}
          >
            <FiPlus /> Create Coupon
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {coupons.map((c) => (
            <div key={c._id} className="adm-card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 16,
                      fontWeight: 800,
                      color: "var(--adm-primary)",
                      background: "var(--adm-primary-soft)",
                      padding: "4px 10px",
                      borderRadius: 8,
                      border: "1px dashed var(--adm-primary)"
                    }}
                  >
                    {c.code}
                  </span>
                  <button
                    type="button"
                    className="adm-btn-icon-sm"
                    onClick={() => handleCopyCode(c.code)}
                    title="Copy Code"
                  >
                    <FiCopy />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleActive(c)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span className={`adm-badge ${c.isActive ? "adm-badge-success" : "adm-badge-neutral"}`}>
                    <span className="adm-badge-dot" /> {c.isActive ? "Active" : "Disabled"}
                  </span>
                </button>
              </div>

              <div style={{ fontSize: 24, fontWeight: 850, color: "var(--adm-text-main)", marginBottom: 4 }}>
                {c.discountPercentage}% OFF
              </div>

              <p style={{ fontSize: 12.5, color: "var(--adm-text-muted)", margin: "0 0 16px", flex: 1 }}>
                {c.description || "Promotional coupon code applicable during student checkout."}
              </p>

              {/* Progress of usage */}
              <div
                style={{
                  padding: "12px 14px",
                  background: "#FAF9FF",
                  borderRadius: 10,
                  border: "1px solid var(--adm-border)",
                  fontSize: 12,
                  marginBottom: 16
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span>Usage:</span>
                  <strong>
                    {c.usedCount || 0} / {c.usageLimit || 100} redeemed
                  </strong>
                </div>
                <div style={{ width: "100%", height: 6, background: "#EDE9FE", borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${Math.min(Math.round(((c.usedCount || 0) / (c.usageLimit || 100)) * 100), 100)}%`,
                      height: "100%",
                      background: "var(--adm-primary)"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid var(--adm-border)" }}>
                <span style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                  Min spend: ₹{c.minPurchase || 0}
                </span>

                <button
                  type="button"
                  className="adm-btn-icon-sm adm-btn-icon-danger"
                  onClick={() => handleDelete(c)}
                  title="Delete Coupon"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>Create Discount Coupon</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Configure coupon code, percentage off, and usage limits.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Coupon Code (Uppercase) *</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. FESTIVE40"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Discount Percentage (%) *</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={form.discountPercentage}
                      onChange={(e) => setForm({ ...form, discountPercentage: Number(e.target.value) })}
                      min={1}
                      max={100}
                      required
                    />
                  </div>
                  <div>
                    <label className="adm-label">Max Discount Cap (INR ₹)</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={form.maxDiscount}
                      onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="adm-form-grid-2 adm-form-row">
                  <div>
                    <label className="adm-label">Minimum Purchase Amount (₹)</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={form.minPurchase}
                      onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="adm-label">Usage Limit</label>
                    <input
                      type="number"
                      className="adm-input"
                      value={form.usageLimit}
                      onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                      min={1}
                    />
                  </div>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Campaign Description</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. 40% Inaugural tech festival discount"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

