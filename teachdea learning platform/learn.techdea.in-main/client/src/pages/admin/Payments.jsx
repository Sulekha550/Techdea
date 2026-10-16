import { useEffect, useState } from "react";
import { getAdminPayments } from "../../services/adminService.js";
import { AdminTablePage } from "./Students.jsx";

export default function Payments() {
  const [items,setItems]=useState([]);
  useEffect(()=>{getAdminPayments().then(({data})=>setItems(data.payments||[]));},[]);
  return <AdminTablePage title="Payments" subtitle="Payment records from the platform." loading={false} headers={["Student","Semester","Amount","Status","Date"]} rows={items.map(x=>[x.student?.name||"—",x.semester?.title||"—",`₹${x.amount}`,x.status,new Date(x.createdAt).toLocaleDateString()])}/>;
}