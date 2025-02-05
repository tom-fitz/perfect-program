import { getServices } from "@/lib/services";
import { getUserContext } from "@/lib/context";
import { redirect } from "next/navigation";
import BillingDashboard from "@/components/billing/BillingDashboard";

export default async function BillingPage() {
  const { adminBilling } = await getServices();
  const { user } = await getUserContext();
  
  if (!user.isAdmin) {
    redirect('/app');
  }

  const [bills, templates] = await Promise.all([
    adminBilling.getBills(),
    adminBilling.getTemplates()
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-powder">Billing Management</h1>
      </div>
      <BillingDashboard 
        bills={bills}
        templates={templates}
      />
    </div>
  );
}