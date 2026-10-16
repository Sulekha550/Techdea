import { Link } from "react-router-dom";
import { FiArrowRight, FiClock, FiStar, FiUsers, FiUser } from "react-icons/fi";

export default function CourseCard({ course, progress }) {
  const fallbackThumb =
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop";
  const thumbnail = course.thumbnail || course.image || fallbackThumb;
  const isFree = (course.price || 0) <= 0;
  const sale = course.discountPrice && course.price > course.discountPrice;

  return (
    <article className="course-card">
      <div className="course-card-thumb-wrap">
        <img src={thumbnail} alt="" className="course-card-thumb" loading="lazy" />
        <span className="course-badge-level">{course.level || "All Levels"}</span>
      </div>

      <div className="course-card-body">
        <span className="course-category-tag">
          {course.category || course.branch || "Technology"}
        </span>
        <h3 className="course-card-title">{course.name}</h3>
        <p className="course-card-desc">
          {course.shortDescription || course.description || "Professional technical training with structured lessons and career-focused practice."}
        </p>

        <div className="course-card-meta">
          {course.instructor?.name && (
            <span><FiUser /> {course.instructor.name}</span>
          )}
          <span><FiStar style={{ color: "var(--warning)" }} /> {course.rating || "4.8"}</span>
          <span><FiUsers /> {(course.studentsCount || 0).toLocaleString()} Students</span>
        </div>
        <div className="course-card-meta">
          <span><FiClock /> {course.duration || "Self-paced"}</span>
          <span>{course.level || "All Levels"}</span>
        </div>

        {progress !== undefined && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="course-card-footer">
          <div>
            {isFree ? (
              <span className="course-card-price free">Free</span>
            ) : (
              <span className="course-card-price">
                ₹{course.discountPrice || course.price}
                {sale && <span className="original-price">₹{course.price}</span>}
              </span>
            )}
          </div>
          <Link className="btn btn-primary btn-small" to={`/courses/${course._id || course.slug}`}>
            View Course <FiArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
