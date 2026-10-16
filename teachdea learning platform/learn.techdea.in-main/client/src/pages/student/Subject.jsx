import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSubject, getLectures } from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";

export default function Subject() {
  const { subjectId } = useParams();
  const [data, setData] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubject(subjectId).then(async ({ data: result }) => {
      setData(result);
      const all = [];
      for (const module of result.modules || []) {
        const response = await getLectures(module._id);
        all.push(...(response.data.lectures || []).map((lecture) => ({ ...lecture, moduleTitle: module.title })));
      }
      setLectures(all);
    }).finally(() => setLoading(false));
  }, [subjectId]);

  if (loading) return <Loader />;
  return (
    <div>
      <div className="portal-heading"><div><div className="eyebrow">{data?.subject?.code || "SUBJECT"}</div><h1>{data?.subject?.name}</h1><p>{data?.subject?.description}</p></div></div>
      <div className="subject-toolbar">
        <Link className="btn btn-outline" to={`/notes/${subjectId}`}>Notes & Resources</Link>
        <Link className="btn btn-primary" to={`/tests/${subjectId}`}>Practice Tests</Link>
      </div>
      <div className="lecture-list">
        {lectures.map((lecture) => (
          <Link className="lecture-row" key={lecture._id} to={`/learn/lecture/${lecture._id}`}>
            <div className="lecture-number">{lecture.order}</div>
            <div><span className="muted">{lecture.moduleTitle}</span><h3>{lecture.title}</h3><p>{lecture.duration || "Video lecture"}</p></div>
            <span>→</span>
          </Link>
        ))}
      </div>
      {!lectures.length && <div className="empty-state"><h3>No lectures published</h3><p>Lectures will appear here when the admin publishes them.</p></div>}
    </div>
  );
}