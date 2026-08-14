import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';
import { Invoice } from '@/types';
import { Result, ok, err } from '@/types/result';

export class FinanceRepository {
  private static get supabase() { return createClient(); }

  static async getInvoices(): Promise<Result<Invoice[]>> {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select('*, customers(company_name), invoice_items(*)')
        .order('created_at', { ascending: false });

      if (error) return err(new Error(error.message));

      const invoices: Invoice[] = (data || []).map((item: any) => ({
        id: item.id,
        invoiceNumber: item.invoice_number,
        customerId: item.customer_id,
        invoiceDate: item.invoice_date,
        dueDate: item.due_date,
        subtotal: item.subtotal,
        taxAmount: item.tax_amount,
        discount: item.discount,
        totalAmount: item.total_amount,
        amountPaid: item.amount_paid,
        balanceAmount: item.balance_amount,
        status: item.status,
        notes: item.notes,
        serviceTicketId: item.service_ticket_id,
        amcId: item.amc_id,
        customerName: item.customers?.company_name,
        invoiceItems: item.invoice_items || []
      }));

      return ok(invoices);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async createInvoice(inv: Omit<Invoice, 'id' | 'invoiceNumber'>): Promise<Result<Invoice>> {
    try {
      const invoiceNumber = `ESSMA-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await serverMutate.insert({
        table: 'invoices',
        payload: {
          invoice_number: invoiceNumber,
          customer_id: inv.customerId,
          invoice_date: inv.invoiceDate,
          due_date: inv.dueDate,
          subtotal: inv.subtotal,
          tax_amount: inv.taxAmount,
          discount: inv.discount,
          total_amount: inv.totalAmount,
          amount_paid: inv.amountPaid ?? 0,
          balance_amount: inv.balanceAmount,
          status: inv.status,
          notes: inv.notes,
          service_ticket_id: inv.serviceTicketId,
          amc_id: inv.amcId
        },
        select: '*, customers(company_name)'
      });

      if (error) return err(new Error(error));

      const d: any = data;
      const created: Invoice = {
        id: d.id,
        invoiceNumber: d.invoice_number,
        customerId: d.customer_id,
        invoiceDate: d.invoice_date,
        dueDate: d.due_date,
        subtotal: d.subtotal,
        taxAmount: d.tax_amount,
        discount: d.discount,
        totalAmount: d.total_amount,
        amountPaid: d.amount_paid,
        balanceAmount: d.balance_amount,
        status: d.status,
        notes: d.notes,
        serviceTicketId: d.service_ticket_id,
        amcId: d.amc_id,
        customerName: d.customers?.company_name || inv.customerName
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
