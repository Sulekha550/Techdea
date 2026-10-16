import { useEffect, useState } from "react";
import { getCourses, getSemesters } from "../../services/courseService.js";
import { createSemester, deleteSemester } from "../../services/adminService.js";
import { AdminTablePage } from "./Students.jsx";

export default function Semesters() {
  const [items, setItems] = useState([]); const [courses, setCourses] = useState([]); const [show, setShow] = useState(false);
  const [form, setForm] = useState({ course: "", number: 1, title: "", description: "", price: 0, isPublished: true });
  const load = () => getSemesters().then(({data}) => setItems(data.semesters || []));
  useEffect(() => { load(); getCourses().then(({data}) => setCourses(data.courses || [])); }, []);
  const submit = async e => { e.preventDefault(); await createSemester({...form, number:Number(form.number), price:Number(form.price)}); setShow(false); load(); };
  const remove = async id => { if(confirm("Disable this semester?")) { await deleteSemester(id); load(); } };

  return <AdminTablePage title="Semesters" subtitle="Create semester packages and set their price." loading={false} headers={["Semester","Course","Price","Published","Action"]} rows={items.map(x => [x.title, x.course?.name || "—", x.price > 0 ? `₹${x.price}` : "Free", x.isPublished ? "Yes":"No", <button className="table-action danger" onClick={() => remove(x._id)}>Disable</button>])}>
    <button className="btn btn-primary" onClick={() => setShow(!show)}>+ Add Semester</button>
    {show && <form className="inline-form" onSubmit={submit}>
      <select required value={form.course} onChange={e=>setForm({...form,course:e.target.value})}><option value="">Select course</option>{courses.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select>
      <input type="number" min="1" placeholder="Semester" value={form.number} onChange={e=>setForm({...form,number:e.target.value})}/>
      <input required placeholder="Title e.g. 5th Semester Complete" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
      <input type="number" min="0" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
      <button className="btn btn-primary">Save</button>
    </form>}
  </AdminTablePage>;
}