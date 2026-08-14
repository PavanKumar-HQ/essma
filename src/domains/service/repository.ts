import { createClient } from '@/lib/supabase/client';
import { ServiceTicket } from '@/types';
import { Result, ok, err } from '@/types/result';

export class ServiceTicketRepository {
  private static supabase = createClient();

  static async getAll(): Promise<Result<ServiceTicket[]>> {
    try {
      const { data, error } = await this.supabase
        .from('service_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return err(new Error(error.message));

      const tickets: ServiceTicket[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        ticketNumber: item.ticket_number,
        customerId: item.customer_id,
        customerName: item.customer_name || 'Customer Account',
        equipmentId: item.equipment_id,
        equipmentModel: item.equipment_model || 'ESSMA Online UPS',
        serialNumber: item.serial_number || 'SN-UPS-001',
        siteAddress: item.site_address,
        issueType: item.issue_type,
        priority: item.priority,
        status: item.status,
        reportedBy: item.reported_by,
        reportedPhone: item.reported_phone,
        assignedEngineerId: item.assigned_engineer_id,
        assignedEngineerName: item.assigned_engineer_name || 'Amit Kumar',
        diagnosisNotes: item.diagnosis_notes,
        customerSignature: item.customer_signature_url,
        slaMet: item.sla_met,
        createdAt: item.created_at,
        resolvedAt: item.resolved_at
      }));

      return ok(tickets);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(tkt: Omit<ServiceTicket, 'id' | 'ticketNumber' | 'createdAt'>): Promise<Result<ServiceTicket>> {
    try {
      const ticketNumber = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data, error } = await this.supabase
        .from('service_tickets')
        .insert({
          ticket_number: ticketNumber,
          customer_id: tkt.customerId,
          equipment_id: tkt.equipmentId,
          title: tkt.issueType,
          priority: tkt.priority,
          status: tkt.status
        })
        .select()
        .single();

      if (error) return err(new Error(error.message));

      const created: ServiceTicket = {
        id: data.id,
        ticketNumber: data.ticket_number,
        customerId: data.customer_id,
        customerName: tkt.customerName,
        equipmentId: data.equipment_id,
        equipmentModel: tkt.equipmentModel,
        serialNumber: tkt.serialNumber,
        siteAddress: tkt.siteAddress,
        issueType: data.issue_type,
        priority: data.priority,
        status: data.status,
        reportedBy: data.reported_by,
        reportedPhone: data.reported_phone,
        assignedEngineerId: data.assigned_engineer_id,
        assignedEngineerName: tkt.assignedEngineerName,
        diagnosisNotes: data.diagnosis_notes,
        slaMet: data.sla_met,
        createdAt: data.created_at
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async updateStatus(id: string, status: ServiceTicket['status'], diagnosisNotes?: string, signatureUrl?: string): Promise<Result<boolean>> {
    try {
      const { error } = await this.supabase
        .from('service_tickets')
        .update({
          status
        })
        .eq('id', id);

      if (error) return err(new Error(error.message));
      return ok(true);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
