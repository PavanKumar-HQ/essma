import { createClient } from '@/lib/supabase/client';
import { Lead } from '@/types';
import { Result, ok, err } from '@/types/result';

export class LeadRepository {
  private static supabase = createClient();

  static async getAll(): Promise<Result<Lead[]>> {
    try {
      const { data, error } = await this.supabase.from('leads').select('*');
      if (error) return err(new Error(error.message));
      const leads: Lead[] = (data || []).map((item: Record<string, any>) => ({
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
        source: item.source || 'Website',
        status: item.status || 'New',
        probability: item.probability || 50,
        assignedSalespersonId: item.assigned_salesperson_id || 'usr-4',
        assignedSalespersonName: 'Priya Sundaram',
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
      const { data, error } = await this.supabase
        .from('leads')
        .insert({
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
          probability: lead.probability
        })
        .select()
        .single();
      if (error) return err(new Error(error.message));
      const created: Lead = {
        id: data.id,
        leadNumber: data.lead_number,
        companyName: data.company_name,
        contactPerson: data.contact_person,
        email: data.email,
        phone: data.phone,
        city: data.city,
        requirement: data.requirement,
        estimatedKva: data.estimated_kva,
        budget: data.budget,
        source: data.source,
        status: data.status,
        probability: data.probability,
        assignedSalespersonId: lead.assignedSalespersonId,
        assignedSalespersonName: lead.assignedSalespersonName,
        expectedClosureDate: data.expected_closure_date,
        createdAt: data.created_at
      };
      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
