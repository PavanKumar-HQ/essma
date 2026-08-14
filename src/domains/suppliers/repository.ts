import { createClient } from '@/lib/supabase/client';
import { Supplier } from '@/types';
import { Result, ok, err } from '@/types/result';

export class SupplierRepository {
  private static supabase = createClient();

  static async getAll(): Promise<Result<Supplier[]>> {
    try {
      const { data, error } = await this.supabase.from('suppliers').select('*');
      if (error) return err(new Error(error.message));
      const suppliers: Supplier[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        code: item.code,
        companyName: item.company_name,
        gstin: item.gstin,
        contactPerson: item.contact_person,
        email: item.email,
        phone: item.phone,
        city: item.city,
        productsSupplied: item.products_supplied || ['IGBT Modules', 'SMF Batteries'],
        rating: item.rating || 4.8,
        totalPurchases: item.total_purchases || 4500000
      }));
      return ok(suppliers);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
