import { useEffect, useState } from "react";
import { getAdminEnrollments, updateEnrollment } from "../../services/adminService.js";
import { AdminTablePage } from "./Students.jsx";

export default function Enrollments() {
  const [items,setItems]=useState([]);
  const load=()=>getAdminEnrollments().then(({data})=>setItems(data.enrollments||[]));
  useEffect(load,[]);
  const activate=async id=>{await updateEnrollment(id,{status:"active",paymentStatus:"paid"});load();};
  return <AdminTablePage title="Enrollments" subtitle="Review and activate student semester access." loading={false} headers={["Student","Semester","Payment","Status","Action"]} rows={items.map(x=>[x.student?.name||"—",x.semester?.title||"—",x.paymentStatus,x.status,x.status==="pending"?<button className="table-action" onClick={()=>activate(x._id)}>Activate</button>:"—"])}/>;
}