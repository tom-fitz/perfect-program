import { auth } from "@/auth";
import AdminNav from "./AdminNav";

export default async function AdminNavWrapper() {
  const session = await auth();
  
  return <AdminNav session={session} />;
} 