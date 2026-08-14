import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';
import { Lead } from '@/types';
import { Result, ok, err } from '@/types/result';

export class LeadRepository {
  private static get supabase() { return createClient(); }

  static async getAll(): Promise<Result<Lead[]>> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .select('*, profiles!leads_assigned_salesperson_id_fkey(full_name)');
      if (error) return err(new Error(error.message));
      const leads: Lead[] = (data || []).map((item: any) => ({
        id: item.id,
        leadNumber: item.lead_number,
        companyName: item.company_name,
        contactPerson: item.contact_person,
        email: item.email,
        phone: item.phone,
        city: item.city,
        requirement: item.requirement,
        estimatedKva: item.estimated_kva,
        budget: item.budget,
        source: item.source,
        status: item.status,
        probability: item.probability,
        assignedSalespersonId: item.assigned_salesperson_id,
        assignedSalespersonName: item.profiles?.full_name,
        expectedClosureDate: item.expected_closure_date,
        createdAt: item.created_at
      }));
      return ok(leads);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(lead: Omit<Lead, 'id' | 'leadNumber' | 'createdAt'>): Promise<Result<Lead>> {
    try {
      const leadNumber = `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`;

      const { data, error } = await serverMutate.insert({
        table: 'leads',
        payload: {
          lead_number: leadNumber,
          company_name: lead.companyName,
          contact_person: lead.contactPerson,
          email: lead.email,
          phone: lead.phone,
          city: lead.city,
          requirement: lead.requirement,
          estimated_kva: lead.estimatedKva,
          budget: lead.budget,
          source: lead.source,
          status: lead.status,
          probability: lead.probability,
          assigned_salesperson_id: lead.assignedSalespersonId,
          expected_closure_date: lead.expectedClosureDate,
        }
      });

      if (error) return err(new Error(error));

      const d: any = data;
      const created: Lead = {
        id: d.id,
        leadNumber: d.lead_number,
        companyName: d.company_name,
        contactPerson: d.contact_person,
        email: d.email,
        phone: d.phone,
        city: d.city,
        requirement: d.requirement,
        estimatedKva: d.estimated_kva,
        budget: d.budget,
        source: d.source,
        status: d.status,
        probability: d.probability,
        assignedSalespersonId: d.assigned_salesperson_id,
        assignedSalespersonName: lead.assignedSalespersonName,
        expectedClosureDate: d.expected_closure_date,
        createdAt: d.created_at
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
