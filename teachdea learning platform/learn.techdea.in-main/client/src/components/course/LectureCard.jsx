export default function LectureCard({ lecture }) {
  return <div className="lecture-row"><div className="lecture-number">{lecture.order}</div><div><h3>{lecture.title}</h3><p>{lecture.duration || "Video lecture"}</p></div></div>;
}