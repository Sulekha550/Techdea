import { useEffect, useState } from "react";
import { getSemesters, getSubjects } from "../../services/courseService.js";
import { createSubject, deleteSubject } from "../../services/adminService.js";
import { AdminTablePage } from "./Students.jsx";

export default function Subjects() {
  const [items,setItems]=useState([]),[semesters,setSemesters]=useState([]),[show,setShow]=useState(false);
  const [form,setForm]=useState({semester:"",name:"",code:"",description:"",order:0});
  const load=()=>getSubjects().then(({data})=>setItems(data.subjects||[]));
  useEffect(()=>{load();getSemesters().then(({data})=>setSemesters(data.semesters||[]));},[]);
  const submit=async e=>{e.preventDefault();await createSubject({...form,order:Number(form.order)});setShow(false);load();};
  const remove=async id=>{if(confirm("Disable subject?")){await deleteSubject(id);load();}};
  return <AdminTablePage title="Subjects" subtitle="Add subjects under published semesters." loading={false} headers={["Subject","Code","Semester","Order","Action"]} rows={items.map(x=>[x.name,x.code||"—",x.semester?.title||"—",x.order,<button className="table-action danger" onClick={()=>remove(x._id)}>Disable</button>])}>
    <button className="btn btn-primary" onClick={()=>setShow(!show)}>+ Add Subject</button>
    {show&&<form className="inline-form" onSubmit={submit}><select required value={form.semester} onChange={e=>setForm({...form,semester:e.target.value})}><option value="">Select semester</option>{semesters.map(s=><option key={s._id} value={s._id}>{s.title}</option>)}</select><input required placeholder="Subject name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="Code" value={form.code} onChange={e=>setForm({...form,code:e.target.value})}/><input type="number" placeholder="Order" value={form.order} onChange={e=>setForm({...form,order:e.target.value})}/><button className="btn btn-primary">Save</button></form>}
  </AdminTablePage>;
}