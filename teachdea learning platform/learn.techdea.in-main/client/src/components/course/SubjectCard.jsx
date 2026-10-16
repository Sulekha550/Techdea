export default function SubjectCard({ subject }) {
  return <div className="subject-card"><span className="subject-code">{subject.code || "SUBJECT"}</span><h3>{subject.name}</h3><p>{subject.description}</p></div>;
}