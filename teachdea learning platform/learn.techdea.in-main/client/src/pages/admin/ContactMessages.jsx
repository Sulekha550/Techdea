import { useEffect, useState } from "react";
import {
  FiMail,
  FiSearch,
  FiCheckCircle,
  FiTrash2,
  FiEye,
  FiX,
  FiMessageSquare,
  FiPhone
} from "react-icons/fi";
import {
  getContactMessages,
  updateContactStatus,
  deleteContactMessage
} from "../../services/contactService.js";
import Loader from "../../components/common/Loader.jsx";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadData = () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (search.trim()) params.search = search.trim();

    getContactMessages(params)
      .then((res) => setMessages(res.data?.messages || []))
      .catch((err) => console.error("Contact messages error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const openMessageModal = (msg) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.adminNotes || "");
    // If NEW, automatically mark as READ
    if (msg.status === "NEW") {
      updateContactStatus(msg._id, { status: "READ" }).then(loadData);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdating(true);
      await updateContactStatus(id, { status: newStatus, adminNotes });
      loadData();
      if (selectedMessage) {
        setSelectedMessage({ ...selectedMessage, status: newStatus, adminNotes });
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this message?")) {
      try {
        await deleteContactMessage(id);
        setSelectedMessage(null);
        loadData();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <div className="eyebrow">INQUIRY MANAGEMENT</div>
          <h1>Contact Messages & Leads</h1>
          <p>Review student inquiries, course queries, and WhatsApp lead submissions.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ margin: "0 36px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 8, flex: 1, maxWidth: 380 }}>
          <input
            placeholder="Search by name, email, subject, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline btn-small">
            <FiSearch /> Search
          </button>
        </form>

        <div style={{ display: "flex", gap: 8 }}>
          {["", "NEW", "READ", "REPLIED", "CLOSED"].map((st) => (
            <button
              key={st}
              type="button"
              className={`filter-tab ${statusFilter === st ? "active" : ""}`}
              onClick={() => setStatusFilter(st)}
            >
              {st || "All Inquiries"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 36px" }}><Loader /></div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sender</th>
                <th>Phone / WhatsApp</th>
                <th>Subject</th>
                <th>Status</th>
                <th>WhatsApp Alert</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((m) => (
                  <tr key={m._id}>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>
                      <strong>{m.name}</strong>
                      <small style={{ display: "block", color: "var(--muted)" }}>{m.email}</small>
                    </td>
                    <td>{m.phone || "—"}</td>
                    <td>
                      <strong>{m.subject}</strong>
                      <small style={{ display: "block", color: "var(--muted)", maxWidth: 280, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {m.message}
                      </small>
                    </td>
                    <td>
                      <span className={`badge badge-${m.status.toLowerCase()}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      {m.whatsappSent ? (
                        <span style={{ color: "var(--success)", fontSize: 12, fontWeight: 700 }}>
                          Dispatched
                        </span>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: 12 }}>
                          Logged in Console
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-action"
                        onClick={() => openMessageModal(m)}
                      >
                        <FiEye /> View
                      </button>
                      <button
                        type="button"
                        className="table-action danger"
                        onClick={() => handleDelete(m._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="table-empty">
                    No contact messages found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Inspection Modal */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Inquiry Details</h2>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setSelectedMessage(null)}
              >
                <FiX />
              </button>
            </div>

            <div style={{ background: "var(--soft)", padding: 18, borderRadius: 12, marginBottom: 20, fontSize: 13, display: "grid", gap: 6 }}>
              <div><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</div>
              <div><strong>Phone / WhatsApp:</strong> {selectedMessage.phone || "Not provided"}</div>
              <div><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</div>
              <div><strong>Status:</strong> <span className={`badge badge-${selectedMessage.status.toLowerCase()}`}>{selectedMessage.status}</span></div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <strong style={{ display: "block", fontSize: 16, marginBottom: 8 }}>
                Subject: {selectedMessage.subject}
              </strong>
              <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 10, padding: 16, lineHeight: 1.7, fontSize: 14 }}>
                {selectedMessage.message}
              </div>
            </div>

            <label style={{ marginBottom: 16 }}>
              Internal Admin Notes
              <textarea
                rows={2}
                placeholder="Add notes about your response or follow-up..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => handleStatusChange(selectedMessage._id, "REPLIED")}
                  disabled={updating}
                >
                  Mark as Replied
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={() => handleStatusChange(selectedMessage._id, "CLOSED")}
                  disabled={updating}
                >
                  Close Inquiry
                </button>
              </div>

              {selectedMessage.email && (
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="btn btn-primary btn-small"
                >
                  <FiMail /> Reply via Email
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
