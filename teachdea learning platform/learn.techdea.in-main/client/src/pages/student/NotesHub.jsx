import { Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState.jsx";

export default function NotesHub() {
  return (
    <div>
      <div className="portal-heading">
        <div>
          <div className="eyebrow">RESOURCES</div>
          <h1>Notes</h1>
          <p>Lesson notes and PDFs appear inside each course player when an instructor attaches them.</p>
        </div>
      </div>
      <EmptyState
        title="Open a course to view notes"
        text="This page does not invent a separate notes library. Attached files stay with the lesson."
        action={<Link className="btn btn-primary" to="/my-courses">Go to my courses</Link>}
      />
    </div>
  );
}
