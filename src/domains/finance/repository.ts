import { createClient } from '@/lib/supabase/client';
import { Invoice } from '@/types';
import { Result, ok, err } from '@/types/result';

export class FinanceRepository {
  private static supabase = createClient();

  static async getInvoices(): Promise<Result<Invoice[]>> {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return err(new Error(error.message));

      const invoices: Invoice[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        invoiceNumber: item.invoice_number,
        invoiceType: item.invoice_type,
        customerId: item.customer_id,
        customerName: item.customer_name,
        gstin: item.gstin,
        issueDate: item.issue_date,
        dueDate: item.due_date,
        items: item.items || [],
        subtotal: item.subtotal,
        cgst: item.total_tax / 2,
        sgst: item.total_tax / 2,
        igst: 0,
        totalTax: item.total_tax,
        grandTotal: item.grand_total,
        paidAmount: item.paid_amount,
        balanceDue: item.grand_total - item.paid_amount,
        paymentStatus: item.payment_status,
        pdfUrl: item.pdf_url
      }));

      return ok(invoices);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async createInvoice(inv: Omit<Invoice, 'id' | 'invoiceNumber'>): Promise<Result<Invoice>> {
    try {
      const invoiceNumber = `ESSMA-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data, error } = await this.supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          invoice_type: inv.invoiceType,
          customer_id: inv.customerId,
          customer_name: inv.customerName,
          gstin: inv.gstin,
          issue_date: inv.issueDate,
          due_date: inv.dueDate,
          items: inv.items,
          subtotal: inv.subtotal,
          total_tax: inv.totalTax,
          grand_total: inv.grandTotal,
          paid_amount: inv.paidAmount ?? 0,
          payment_status: inv.paymentStatus
        })
        .select()
        .single();

      if (error) return err(new Error(error.message));

      const created: Invoice = {
        id: data.id,
        invoiceNumber: data.invoice_number,
        invoiceType: data.invoice_type,
        customerId: data.customer_id,
        customerName: data.customer_name,
        gstin: data.gstin,
        issueDate: data.issue_date,
        dueDate: data.due_date,
        items: inv.items,
        subtotal: data.subtotal,
        cgst: data.total_tax / 2,
        sgst: data.total_tax / 2,
        igst: 0,
        totalTax: data.total_tax,
        grandTotal: data.grand_total,
        paidAmount: data.paid_amount,
        balanceDue: data.grand_total - data.paid_amount,
        paymentStatus: data.payment_status
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
