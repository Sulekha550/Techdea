import { useEffect, useState } from "react";
import { getStudents, updateStudentStatus } from "../../services/adminService.js";
import Loader from "../../components/common/Loader.jsx";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => getStudents().then(({ data }) => setStudents(data.students || [])).finally(() => setLoading(false));
  useEffect(load, []);

  const toggle = async (student) => {
    await updateStudentStatus(student._id, !student.isActive);
    load();
  };

  return <AdminTablePage title="Students" subtitle="Manage registered students." loading={loading} headers={["Name", "Email", "Status", "Joined", "Action"]} rows={students.map((s) => [s.name, s.email, s.isActive ? "Active" : "Disabled", new Date(s.createdAt).toLocaleDateString(), <button className="table-action" onClick={() => toggle(s)}>{s.isActive ? "Disable" : "Enable"}</button>])} />;
}

export function AdminTablePage({ title, subtitle, loading, headers, rows, children }) {
  return <div><div className="admin-page-head"><div><div className="eyebrow">MANAGEMENT</div><h1>{title}</h1><p>{subtitle}</p></div>{children}</div>{loading ? <Loader /> : <div className="table-card"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>) : <tr><td colSpan={headers.length} className="table-empty">No records found.</td></tr>}</tbody></table></div>}</div>;
}