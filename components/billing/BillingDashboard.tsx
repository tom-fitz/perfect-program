'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Billing, BillingTemplate } from '@prisma/client';
import BillList from './BillList';
import NewBillModal from './NewBillModal';
import NewTemplateModal from './NewTemplateModal';


type BillWithDetails = Billing & {
  user: { name: string | null; email: string | null; } | null;
  template: BillingTemplate | null;
};

interface BillingDashboardProps {
  bills: BillWithDetails[];
  templates: BillingTemplate[];
}

export default function BillingDashboard({ bills, templates }: BillingDashboardProps) {
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);

  const draftBills = bills.filter(bill => bill.status === 'draft');
  const pendingBills = bills.filter(bill => bill.status === 'pending' || bill.status === 'overdue');
  const paidBills = bills.filter(bill => bill.status === 'paid');

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <button
          onClick={() => setIsNewBillModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Bill
        </button>
        <button
          onClick={() => setIsNewTemplateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-powder/20 text-powder rounded-lg hover:bg-powder/10 transition-colors font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      <div className="grid gap-8">
        {draftBills.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-powder">Draft Bills</h2>
            <BillList bills={draftBills} />
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-4 text-powder">Outstanding Bills</h2>
          <BillList bills={pendingBills} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-powder">Paid Bills</h2>
          <BillList bills={paidBills} />
        </section>
      </div>

      <NewBillModal
        isOpen={isNewBillModalOpen}
        onClose={() => setIsNewBillModalOpen(false)}
        templates={templates}
      />

      <NewTemplateModal
        isOpen={isNewTemplateModalOpen}
        onClose={() => setIsNewTemplateModalOpen(false)}
      />
    </div>
  );
} 