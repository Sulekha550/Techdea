import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLecture } from "../../services/courseService.js";
import Loader from "../../components/common/Loader.jsx";

export default function Lecture() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLecture(lectureId).then(({ data }) => setLecture(data.lecture)).finally(() => setLoading(false));
  }, [lectureId]);

  if (loading) return <Loader />;

  const video = lecture?.videoId
    ? `https://www.youtube.com/embed/${lecture.videoId}?rel=0`
    : lecture?.videoUrl;

  return (
    <div>
      <Link className="back-link" to="-1">← Back to subject</Link>
      <div className="lecture-page">
        <div className="video-wrap">
          {video ? (
            <iframe src={video} title={lecture.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : <div className="video-placeholder">Video not added yet</div>}
        </div>
        <div className="lecture-info">
          <div className="eyebrow">LECTURE</div>
          <h1>{lecture.title}</h1>
          <p>{lecture.description || "Watch the lecture and use the attached resources for practice."}</p>
          {lecture.noteUrl && <a className="btn btn-outline" href={lecture.noteUrl} target="_blank" rel="noreferrer">Open Notes</a>}
          {lecture.resourceUrl && <a className="btn btn-outline" href={lecture.resourceUrl} target="_blank" rel="noreferrer">Open Resource</a>}
        </div>
      </div>
    </div>
  );
}