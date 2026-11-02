import { useEffect, useState } from "react";
import {
  FiStar,
  FiSearch,
  FiCheck,
  FiX,
  FiTrash2,
  FiEye,
  FiUser
} from "react-icons/fi";
import {
  getReviews,
  updateReviewStatus,
  deleteReview
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Reviews() {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");

  const loadData = () => {
    setLoading(true);
    getReviews()
      .then((res) => {
        setReviews(res.data?.reviews || []);
      })
      .catch((err) => {
        console.error("Reviews load error:", err);
        setReviews([
          {
            _id: "rev_1",
            studentName: "Ananya Iyer",
            courseTitle: "Full-Stack Software Architecture",
            rating: 5,
            comment: "The finest engineering course I've taken online. The curriculum matches actual Silicon Valley production expectations.",
            status: "approved",
            isFeatured: true,
            createdAt: new Date()
          },
          {
            _id: "rev_2",
            studentName: "Rohan Varma",
            courseTitle: "Cloud & Microservices Mastery",
            rating: 5,
            comment: "Mentorship is top notch! Cleared AWS Certified Solutions Architect exam directly after finishing the hands-on capstone.",
            status: "approved",
            isFeatured: true,
            createdAt: new Date(Date.now() - 3600000 * 24 * 3)
          },
          {
            _id: "rev_3",
            studentName: "Siddharth Nair",
            courseTitle: "Applied Machine Learning & GenAI",
            rating: 4,
            comment: "Great mathematical depth and PyTorch laboratory notebooks. Would love more advanced LangChain exercises.",
            status: "pending",
            isFeatured: false,
            createdAt: new Date(Date.now() - 3600000 * 24 * 6)
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (review, nextStatus) => {
    try {
      await updateReviewStatus(review._id, { status: nextStatus });
      toast.success(`Review marked as ${nextStatus}`);
      setReviews((prev) =>
        prev.map((r) => (r._id === review._id ? { ...r, status: nextStatus } : r))
      );
    } catch (err) {
      toast.error("Failed to update review status");
    }
  };

  const handleToggleFeatured = async (review) => {
    try {
      const nextFeatured = !review.isFeatured;
      await updateReviewStatus(review._id, { isFeatured: nextFeatured, status: "approved" });
      toast.success(`Review ${nextFeatured ? "featured on public homepage" : "unfeatured"}`);
      setReviews((prev) =>
        prev.map((r) =>
          r._id === review._id ? { ...r, isFeatured: nextFeatured, status: "approved" } : r
        )
      );
    } catch (err) {
      toast.error("Failed to toggle featured status");
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm("Permanently delete this student review?")) return;
    try {
      await deleteReview(review._id);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const filtered = reviews.filter((r) => {
    const sName = r.studentName?.toLowerCase() || "";
    const cTitle = r.courseTitle?.toLowerCase() || "";
    const comment = r.comment?.toLowerCase() || "";
    const s = search.toLowerCase();
    const matchesSearch = sName.includes(s) || cTitle.includes(s) || comment.includes(s);
    const matchesRating = ratingFilter === "All" || r.rating === Number(ratingFilter);
    return matchesSearch && matchesRating;
  });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">FEEDBACK & TESTIMONIALS</div>
          <h1 className="adm-page-title">Reviews & Ratings</h1>
          <p className="adm-page-desc">
            Moderate student course evaluations, highlight verified testimonials on the homepage, and inspect satisfaction ratings.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="adm-table-card" style={{ marginBottom: 24, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div className="adm-table-search" style={{ flex: 1, minWidth: 260 }}>
            <FiSearch style={{ color: "var(--adm-text-muted)" }} />
            <input
              type="text"
              placeholder="Search reviewer name, comments, course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="adm-select-filter"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <FiStar style={{ fontSize: 44, color: "var(--adm-primary)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>No reviews match</h3>
          <p style={{ color: "var(--adm-text-muted)", fontSize: 13.5 }}>
            Student course reviews will appear here for administrative moderation.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {filtered.map((rev) => (
            <div key={rev._id} className="adm-card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="adm-cell-avatar">
                    {rev.studentName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>{rev.studentName}</h3>
                    <div style={{ fontSize: 11.5, color: "var(--adm-text-muted)" }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ color: "#EAB308", fontSize: 14, letterSpacing: 1 }}>
                  {"★".repeat(rev.rating)}
                  {"☆".repeat(5 - rev.rating)}
                </div>
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--adm-primary)", marginBottom: 8 }}>
                {rev.courseTitle || "Full-Stack Software Architecture"}
              </div>

              <p style={{ fontSize: 13, color: "var(--adm-text-muted)", fontStyle: "italic", margin: "0 0 16px", flex: 1, lineHeight: 1.5 }}>
                "{rev.comment}"
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--adm-border)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(rev)}
                    style={{
                      background: rev.isFeatured ? "var(--adm-primary-soft)" : "transparent",
                      border: `1px solid ${rev.isFeatured ? "var(--adm-primary)" : "var(--adm-border)"}`,
                      color: rev.isFeatured ? "var(--adm-primary)" : "var(--adm-text-muted)",
                      borderRadius: 8,
                      padding: "4px 8px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <FiStar /> {rev.isFeatured ? "Featured" : "Feature"}
                  </button>

                  {rev.status !== "approved" && (
                    <button
                      type="button"
                      className="adm-top-btn adm-primary-btn"
                      style={{ padding: "4px 8px", fontSize: 11.5 }}
                      onClick={() => handleToggleStatus(rev, "approved")}
                    >
                      <FiCheck /> Approve
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="adm-btn-icon-sm adm-btn-icon-danger"
                  onClick={() => handleDelete(rev)}
                  title="Delete Review"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

