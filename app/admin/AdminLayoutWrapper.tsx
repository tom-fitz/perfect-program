import AdminLayout from './layout';

export default function AdminLayoutWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
