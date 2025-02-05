'use client';

import { useState } from 'react';
import { BillingTemplate } from '@prisma/client';
import { createBill } from '@/lib/actions/billing';

interface NewBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: BillingTemplate[];
}

export default function NewBillModal({
  isOpen,
  onClose,
  templates
}: NewBillModalProps) {
  const [templateId, setTemplateId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Update amount when template is selected
  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    const template = templates.find((t) => t.id === id);
    if (template) {
      setAmount(template.amount.toString());
      setDescription(template.description || '');
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await createBill({
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        description: description || undefined,
        templateId: templateId || undefined,
        status: 'draft'
      });

      if (result.success) {
        onClose();
        // Reset form
        setTemplateId('');
        setAmount('');
        setDescription('');
        setDueDate('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-ebony p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-powder">New Bill</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <label
              htmlFor="template"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Template (Optional)
            </label>
            <select
              id="template"
              value={templateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-powder focus:outline-none focus:ring-2 focus:ring-sunglow"
            >
              <option value="">No template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-powder focus:outline-none focus:ring-2 focus:ring-sunglow"
              required
            />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-powder focus:outline-none focus:ring-2 focus:ring-sunglow"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-powder focus:outline-none focus:ring-2 focus:ring-sunglow"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-powder transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
