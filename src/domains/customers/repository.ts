import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';
import { Customer } from '@/types';
import { Result, ok, err } from '@/types/result';

export class CustomerRepository {
  private static get supabase() { return createClient(); }

  static async getAll(): Promise<Result<Customer[]>> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return err(new Error(error.message));

      const customers: Customer[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        customerCode: item.customer_code,
        companyName: item.company_name,
        contactPerson: item.contact_person,
        email: item.email,
        phone: item.phone,
        alternatePhone: item.alternate_phone,
        gstNumber: item.gst_number,
        panNumber: item.pan_number,
        billingAddress: item.billing_address,
        serviceAddress: item.service_address,
        city: item.city,
        state: item.state,
        pincode: item.pincode,
        customerType: item.customer_type,
        status: item.status,
        notes: item.notes,
        createdAt: item.created_at
      }));

      return ok(customers);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(cust: Omit<Customer, 'id' | 'customerCode' | 'createdAt'>): Promise<Result<Customer>> {
    try {
      const customer_code = `CUST-2026-${Math.floor(100 + Math.random() * 900)}`;

      const { data, error } = await serverMutate.insert({
        table: 'customers',
        payload: {
          customer_code,
          company_name: cust.companyName,
          contact_person: cust.contactPerson,
          email: cust.email,
          phone: cust.phone,
          alternate_phone: cust.alternatePhone,
          gst_number: cust.gstNumber,
          pan_number: cust.panNumber,
          billing_address: cust.billingAddress,
          service_address: cust.serviceAddress,
          city: cust.city,
          state: cust.state,
          pincode: cust.pincode,
          customer_type: cust.customerType,
          status: cust.status,
          notes: cust.notes,
        }
      });

      if (error) return err(new Error(error));

      const d: any = data;
      const created: Customer = {
        id: d.id,
        customerCode: d.customer_code,
        companyName: d.company_name,
        contactPerson: d.contact_person,
        email: d.email,
        phone: d.phone,
        alternatePhone: d.alternate_phone,
        gstNumber: d.gst_number,
        panNumber: d.pan_number,
        billingAddress: d.billing_address,
        serviceAddress: d.service_address,
        city: d.city,
        state: d.state,
        pincode: d.pincode,
        customerType: d.customer_type,
        status: d.status,
        notes: d.notes,
        createdAt: d.created_at
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
