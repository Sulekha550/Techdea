import { Link } from "react-router-dom";
import { FiArrowRight, FiLayers } from "react-icons/fi";

export default function SemesterCard({ semester, enrolled = false }) {
  return (
    <article className="semester-card">
      <div className="semester-number"><FiLayers /><span>Semester {semester.number}</span></div>
      <h3>{semester.title}</h3>
      <p>{semester.description || "Notes, lectures, PYQs, practical material and practice resources."}</p>
      <div className="semester-bottom">
        <strong>{semester.price > 0 ? `₹${semester.price}` : "Free"}</strong>
        {enrolled ? (
          <Link className="btn btn-primary btn-small" to={`/learn/course/${semester._id}`}>Open</Link>
        ) : (
          <Link className="btn btn-outline btn-small" to={`/courses/${semester.course?._id || semester.course}`}>View</Link>
        )}
      </div>
    </article>
  );
}