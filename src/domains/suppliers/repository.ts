import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';
import { Supplier } from '@/types';
import { Result, ok, err } from '@/types/result';

export class SupplierRepository {
  private static get supabase() { return createClient(); }

  static async getAll(): Promise<Result<Supplier[]>> {
    try {
      const { data, error } = await this.supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });
      if (error) return err(new Error(error.message));
      const suppliers: Supplier[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        code: item.id.substring(0, 8).toUpperCase(),
        companyName: item.name,
        gstin: item.gst_number || 'N/A',
        contactPerson: item.contact_person || 'N/A',
        email: item.email || 'N/A',
        phone: item.phone || 'N/A',
        city: item.address || 'N/A',
        productsSupplied: ['Batteries', 'UPS Parts'],
        rating: 4.5,
        totalPurchases: 0
      }));
      return ok(suppliers);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(supplier: Omit<Supplier, 'id' | 'code' | 'productsSupplied' | 'rating' | 'totalPurchases'>): Promise<Result<Supplier>> {
    try {
      const { data, error } = await serverMutate.insert({
        table: 'suppliers',
        payload: {
          name: supplier.companyName,
          gst_number: supplier.gstin,
          contact_person: supplier.contactPerson,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.city,
          status: 'Active'
        }
      });

      if (error) return err(new Error(error));

      const d: any = data;
      const created: Supplier = {
        id: d.id,
        code: d.id.substring(0, 8).toUpperCase(),
        companyName: d.name,
        gstin: d.gst_number || '',
        contactPerson: d.contact_person || '',
        email: d.email || '',
        phone: d.phone || '',
        city: d.address || '',
        productsSupplied: [],
        rating: 4.5,
        totalPurchases: 0
      };
      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
