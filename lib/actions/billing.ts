'use server';

import { getServices } from '@/lib/services';
import { revalidatePath } from 'next/cache';

export async function createBillingTemplate(data: {
  name: string;
  amount: number;
  description?: string;
}) {
  try {
    const { adminBilling } = await getServices();
    const template = await adminBilling.createTemplate(data);
    revalidatePath('/admin/billing');
    return { success: true, data: template };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create template'
    };
  }
}

export async function createBill(data: {
  amount: number;
  dueDate: Date;
  description?: string;
  userId?: string;
  templateId?: string;
  status?: string;
}) {
  try {
    const { adminBilling } = await getServices();
    const bill = await adminBilling.createBill(data);
    revalidatePath('/admin/billing');
    return { success: true, data: bill };
  } catch (error: Error | unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create bill'
    };
  }
}
