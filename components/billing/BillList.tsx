import { formatCurrency } from '@/lib/utils';
import { Billing, BillingTemplate } from '@prisma/client';

type BillWithDetails = Billing & {
  user: { name: string | null; email: string | null; } | null;
  template: BillingTemplate | null;
};

interface BillListProps {
  bills: BillWithDetails[];
}

export default function BillList({ bills }: BillListProps) {
  if (bills.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No bills to display
      </div>
    );
  }

  return (
    <div className="bg-ebony rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left p-4 text-gray-400 font-medium">Client</th>
            <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
            <th className="text-left p-4 text-gray-400 font-medium">Due Date</th>
            <th className="text-left p-4 text-gray-400 font-medium">Status</th>
            <th className="text-left p-4 text-gray-400 font-medium">Template</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id} className="border-b border-gray-800 last:border-0">
              <td className="p-4 text-powder">
                {bill.user ? (
                  <div>
                    <div>{bill.user.name}</div>
                    <div className="text-sm text-gray-400">{bill.user.email}</div>
                  </div>
                ) : (
                  <span className="text-gray-400">Unassigned</span>
                )}
              </td>
              <td className="p-4 text-powder">{formatCurrency(bill.amount)}</td>
              <td className="p-4 text-powder">
                {new Date(bill.dueDate).toLocaleDateString()}
              </td>
              <td className="p-4">
                <StatusBadge status={bill.status} />
              </td>
              <td className="p-4 text-powder">
                {bill.template?.name || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    draft: 'bg-gray-900/50 text-gray-300',
    pending: 'bg-blue-900/50 text-blue-300',
    paid: 'bg-green-900/50 text-green-300',
    overdue: 'bg-red-900/50 text-red-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
} 