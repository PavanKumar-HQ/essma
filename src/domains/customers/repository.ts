import { createClient } from '@/lib/supabase/client';
import { Customer } from '@/types';
import { Result, ok, err } from '@/types/result';

export class CustomerRepository {
  private static supabase = createClient();

  static async getAll(): Promise<Result<Customer[]>> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return err(new Error(error.message));

      const customers: Customer[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        code: item.code,
        companyName: item.company_name,
        gstin: item.gstin,
        industry: item.industry || 'Industrial',
        primaryContactName: item.primary_contact_name,
        primaryContactEmail: item.primary_contact_email,
        primaryContactPhone: item.primary_contact_phone,
        city: item.city,
        branches: [],
        status: item.status || 'Active',
        totalEquipmentCount: item.total_equipment_count || 0,
        activeAmcContractsCount: item.active_amc_contracts_count || 0,
        totalRevenue: item.total_revenue || 0,
        createdAt: item.created_at
      }));

      return ok(customers);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(cust: Omit<Customer, 'id' | 'code' | 'createdAt'>): Promise<Result<Customer>> {
    try {
      const code = `CUST-2026-${Math.floor(100 + Math.random() * 900)}`;
      const { data, error } = await this.supabase
        .from('customers')
        .insert({
          code,
          company_name: cust.companyName,
          gstin: cust.gstin,
          industry: cust.industry,
          primary_contact_name: cust.primaryContactName,
          primary_contact_email: cust.primaryContactEmail,
          primary_contact_phone: cust.primaryContactPhone,
          city: cust.city,
          status: cust.status,
          total_equipment_count: cust.totalEquipmentCount,
          active_amc_contracts_count: cust.activeAmcContractsCount,
          total_revenue: cust.totalRevenue
        })
        .select()
        .single();

      if (error) return err(new Error(error.message));

      const created: Customer = {
        id: data.id,
        code: data.code,
        companyName: data.company_name,
        gstin: data.gstin,
        industry: data.industry,
        primaryContactName: data.primary_contact_name,
        primaryContactEmail: data.primary_contact_email,
        primaryContactPhone: data.primary_contact_phone,
        city: data.city,
        branches: [],
        status: data.status,
        totalEquipmentCount: data.total_equipment_count,
        activeAmcContractsCount: data.active_amc_contracts_count,
        totalRevenue: data.total_revenue,
        createdAt: data.created_at
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
