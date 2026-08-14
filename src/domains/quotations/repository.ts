import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';
import { Quotation } from '@/types';
import { Result, ok, err } from '@/types/result';

export class QuotationRepository {
  private static get supabase() { return createClient(); }

  static async getAll(): Promise<Result<Quotation[]>> {
    try {
      const { data, error } = await this.supabase.from('quotations').select('*').order('created_at', { ascending: false });
      if (error) return err(new Error(error.message));
      const quotes: Quotation[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        quoteNumber: item.quote_number,
        version: item.version || 1,
        customerId: item.customer_id,
        customerName: item.customer_name || 'Apex Data',
        gstin: item.gstin || '29AAACA12341Z5',
        items: item.items || [],
        subtotal: item.subtotal,
        discountPercentage: item.discount_percentage || 0,
        discountAmount: item.discount_amount || 0,
        cgstAmount: item.cgst_amount || 0,
        sgstAmount: item.sgst_amount || 0,
        igstAmount: item.igst_amount || 0,
        totalTax: item.total_tax,
        grandTotal: item.grand_total,
        termsAndConditions: item.terms || '1. 50% Advance. 2. 1-Year Onsite Warranty.',
        status: item.status || 'Sent',
        createdBy: item.created_by || 'Priya Sundaram',
        createdAt: item.created_at,
        validUntil: item.valid_until
      }));
      return ok(quotes);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(quote: Omit<Quotation, 'id' | 'quoteNumber' | 'createdAt'>): Promise<Result<Quotation>> {
    try {
      const quoteNumber = `ESSMA-QT-2026-${Math.floor(100 + Math.random() * 900)}`;

      const { data, error } = await serverMutate.insert({
        table: 'quotations',
        payload: {
          quote_number: quoteNumber,
          customer_id: quote.customerId,
          gstin: quote.gstin,
          items: quote.items,
          subtotal: quote.subtotal,
          discount_percentage: quote.discountPercentage,
          discount_amount: quote.discountAmount,
          cgst_amount: quote.cgstAmount,
          sgst_amount: quote.sgstAmount,
          igst_amount: quote.igstAmount,
          total_tax: quote.totalTax,
          grand_total: quote.grandTotal,
          terms: quote.termsAndConditions,
          status: quote.status,
          created_by: quote.createdBy,
          valid_until: quote.validUntil,
          version: quote.version
        }
      });

      if (error) return err(new Error(error));

      const d: any = data;
      const created: Quotation = {
        id: d.id,
        quoteNumber: d.quote_number,
        version: d.version || quote.version,
        customerId: d.customer_id,
        customerName: quote.customerName,
        gstin: quote.gstin,
        items: d.items || quote.items,
        subtotal: d.subtotal,
        discountPercentage: d.discount_percentage || quote.discountPercentage,
        discountAmount: d.discount_amount || quote.discountAmount,
        cgstAmount: d.cgst_amount || quote.cgstAmount,
        sgstAmount: d.sgst_amount || quote.sgstAmount,
        igstAmount: d.igst_amount || 0,
        totalTax: d.total_tax,
        grandTotal: d.grand_total,
        termsAndConditions: d.terms || quote.termsAndConditions,
        status: d.status,
        createdBy: d.created_by || quote.createdBy,
        createdAt: d.created_at,
        validUntil: d.valid_until || quote.validUntil
      };
      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async update(id: string, updates: Partial<Record<string, any>>): Promise<Result<boolean>> {
    try {
      const { error } = await serverMutate.update({
        table: 'quotations',
        payload: updates,
        match: { id }
      });
      if (error) return err(new Error(error));
      return ok(true);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
