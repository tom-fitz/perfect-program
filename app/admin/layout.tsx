import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminNavWrapper from "@/components/AdminNavWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const validAdmins = ['tpfitz42@gmail.com'];
  const session = await auth();
  if (!session?.user?.email || !validAdmins.includes(session.user.email)) {
    redirect('/app');
  }

  return (
    <div className="flex-1">
      <div className="flex h-full">
        <AdminNavWrapper />
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}