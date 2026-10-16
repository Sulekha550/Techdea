import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSemester, getSubjects } from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";

export default function Course() {
  const { semesterId } = useParams();
  const [semester, setSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSemester(semesterId), getSubjects(semesterId)])
      .then(([a, b]) => { setSemester(a.data.semester); setSubjects(b.data.subjects || []); })
      .finally(() => setLoading(false));
  }, [semesterId]);

  if (loading) return <Loader />;
  return (
    <div>
      <div className="portal-heading">
        <div><div className="eyebrow">MY SEMESTER</div><h1>{semester?.title}</h1><p>{semester?.course?.name} · Semester {semester?.number}</p></div>
      </div>
      <div className="subject-grid">
        {subjects.map((subject) => (
          <Link className="subject-card" key={subject._id} to={`/learn/subject/${subject._id}`}>
            <span className="subject-code">{subject.code || "SUBJECT"}</span>
            <h3>{subject.name}</h3><p>{subject.description || "Open subject resources and lectures."}</p>
            <span className="subject-open">Open →</span>
          </Link>
        ))}
      </div>
      {!subjects.length && <div className="empty-state"><h3>Subjects not published yet</h3><p>Your admin will add the semester subjects soon.</p></div>}
    </div>
  );
}