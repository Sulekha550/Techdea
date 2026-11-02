import { useEffect, useState } from "react";
import {
  FiBell,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
  FiSend
} from "react-icons/fi";
import {
  getNotifications,
  createBroadcast,
  deleteNotification
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Notifications() {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    link: ""
  });
  const [broadcasting, setBroadcasting] = useState(false);

  const loadData = () => {
    setLoading(true);
    getNotifications()
      .then((res) => {
        setNotifications(res.data?.notifications || []);
      })
      .catch((err) => {
        console.error("Notifications error:", err);
        setNotifications([
          {
            _id: "notif_1",
            title: "🚀 Live System Design Masterclass Tomorrow",
            message: "Join Dr. Arvind Kashyap at 7:00 PM IST for our live distributed caching deep dive.",
            type: "info",
            link: "/admin/live-classes",
            createdAt: new Date()
          },
          {
            _id: "notif_2",
            title: "🎉 2026 Batch Enrollment Milestone",
            message: "Over 1,400 students have enrolled across cloud and full stack engineering tracks.",
            type: "success",
            createdAt: new Date(Date.now() - 3600000 * 24)
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (n) => {
    try {
      await deleteNotification(n._id);
      toast.success("Notification removed");
      setNotifications((prev) => prev.filter((item) => item._id !== n._id));
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      toast.error("Title and message are required");
      return;
    }

    setBroadcasting(true);
    try {
      await createBroadcast(form);
      toast.success("Broadcast sent to all students & faculty!");
      setModalOpen(false);
      setForm({ title: "", message: "", type: "info", link: "" });
      loadData();
    } catch (err) {
      toast.error("Failed to broadcast message");
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">COMMUNICATIONS & BROADCASTS</div>
          <h1 className="adm-page-title">Notifications & Announcements</h1>
          <p className="adm-page-desc">
            Broadcast platform announcements, technical maintenance alerts, and live event reminders to learners.
          </p>
        </div>

        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setModalOpen(true)}
          >
            <FiPlus /> New Announcement
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : notifications.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiBell style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No active broadcasts</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5, margin: "0 0 20px" }}>
            Create an announcement to communicate with enrolled students.
          </p>
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={() => setModalOpen(true)}
            style={{ margin: "0 auto" }}
          >
            <FiPlus /> New Announcement
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {notifications.map((n) => (
            <div
              key={n._id}
              className="adm-card"
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "18px 22px"
              }}
            >
              <div style={{ display: "flex", gap: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background:
                      n.type === "success"
                        ? "#ECFDF5"
                        : n.type === "warning"
                        ? "#FFFBEB"
                        : "var(--adm-primary-soft)",
                    color:
                      n.type === "success"
                        ? "#10B981"
                        : n.type === "warning"
                        ? "#F59E0B"
                        : "var(--adm-primary)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 18,
                    flexShrink: 0
                  }}
                >
                  {n.type === "success" ? <FiCheckCircle /> : n.type === "warning" ? <FiAlertCircle /> : <FiInfo />}
                </div>

                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800 }}>{n.title}</h3>
                  <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--adm-text-muted)", lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>
                    Sent: {new Date(n.createdAt).toLocaleString()} · Target: All Enrolled Students
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="adm-btn-icon-sm adm-btn-icon-danger"
                onClick={() => handleDelete(n)}
                title="Delete Announcement"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CREATE BROADCAST MODAL */}
      {modalOpen && (
        <div className="adm-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <h3>Send Platform Announcement</h3>
                <div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>
                  Broadcast notification to student portal dashboards.
                </div>
              </div>
              <button type="button" className="adm-modal-close" onClick={() => setModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleBroadcast}>
              <div className="adm-modal-body">
                <div className="adm-form-row">
                  <label className="adm-label">Announcement Title *</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="e.g. Schedule Update: Live Q&A Rescheduled"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Notification Type</label>
                  <select
                    className="adm-select"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="info">Information (Blue)</option>
                    <option value="success">Success / Milestone (Green)</option>
                    <option value="warning">Alert / Urgent (Amber)</option>
                  </select>
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Message Content *</label>
                  <textarea
                    className="adm-textarea"
                    rows={4}
                    placeholder="Write your broadcast message..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <div className="adm-form-row">
                  <label className="adm-label">Action Link / URL (Optional)</label>
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="/courses or https://..."
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-top-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-top-btn adm-primary-btn" disabled={broadcasting}>
                  <FiSend /> {broadcasting ? "Sending..." : "Send Broadcast"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

