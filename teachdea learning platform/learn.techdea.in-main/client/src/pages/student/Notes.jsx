import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export default function Notes() {
  const { subjectId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/subjects/" + subjectId).then(async ({ data }) => {
      // Notes API is intentionally simple for MVP; notes can also be attached to lectures.
      const collected = [];
      (data.modules || []).forEach((m) => {
        // no-op; module resources can be added later
      });
      setNotes(collected);
    }).finally(() => setLoading(false));
  }, [subjectId]);

  return (
    <div>
      <div className="portal-heading"><div><div className="eyebrow">RESOURCES</div><h1>Notes & materials</h1><p>Study resources for this subject.</p></div></div>
      {loading ? <Loader /> : notes.length ? notes.map((n) => <a className="resource-row" key={n._id} href={n.fileUrl} target="_blank" rel="noreferrer"><strong>{n.title}</strong><span>{n.type}</span></a>) : <EmptyState title="Notes API is ready" text="The admin notes collection will be connected in the next content-management step." />}
    </div>
  );
}