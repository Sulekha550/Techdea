import { AdminTablePage } from "./Students.jsx";

export default function Notes() {
  return <AdminTablePage title="Notes & Resources" subtitle="Google Drive is used as the zero-cost file storage layer." loading={false} headers={["Storage","Recommended use","Status"]} rows={[
    ["Google Drive","PDF notes, PYQs, practical files","Ready"],
    ["MongoDB","Store title, type and file URL","Model ready"],
    ["YouTube","Video lectures","Ready"]
  ]} />;
}