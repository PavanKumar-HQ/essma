import { createClient } from '@/lib/supabase/client';
import { Quotation } from '@/types';
import { Result, ok, err } from '@/types/result';

export class QuotationRepository {
  private static supabase = createClient();

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
      const { data, error } = await this.supabase
        .from('quotations')
        .insert({
          quote_number: quoteNumber,
          customer_id: quote.customerId,
          customer_name: quote.customerName,
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
        })
        .select()
        .single();
      if (error) return err(new Error(error.message));
      const created: Quotation = {
        id: data.id,
        quoteNumber: data.quote_number,
        version: data.version || quote.version,
        customerId: data.customer_id,
        customerName: quote.customerName,
        gstin: quote.gstin,
        items: data.items || quote.items,
        subtotal: data.subtotal,
        discountPercentage: data.discount_percentage || quote.discountPercentage,
        discountAmount: data.discount_amount || quote.discountAmount,
        cgstAmount: data.cgst_amount || quote.cgstAmount,
        sgstAmount: data.sgst_amount || quote.sgstAmount,
        igstAmount: data.igst_amount || 0,
        totalTax: data.total_tax,
        grandTotal: data.grand_total,
        termsAndConditions: data.terms || quote.termsAndConditions,
        status: data.status,
        createdBy: data.created_by || quote.createdBy,
        createdAt: data.created_at,
        validUntil: data.valid_until || quote.validUntil
      };
      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async update(id: string, updates: Partial<Record<string, any>>): Promise<Result<boolean>> {
    try {
      const { error } = await this.supabase
        .from('quotations')
        .update(updates)
        .eq('id', id);
      if (error) return err(new Error(error.message));
      return ok(true);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
