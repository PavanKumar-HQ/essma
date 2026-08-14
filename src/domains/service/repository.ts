import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';
import { ServiceTicket } from '@/types';
import { Result, ok, err } from '@/types/result';

export class ServiceTicketRepository {
  private static get supabase() { return createClient(); }

  static async getAll(): Promise<Result<ServiceTicket[]>> {
    try {
      const { data, error } = await this.supabase
        .from('service_tickets')
        .select('*, customers(company_name), equipment(model, serial_number)')
        .order('created_at', { ascending: false });

      if (error) return err(new Error(error.message));

      const tickets: ServiceTicket[] = (data || []).map((item: any) => ({
        id: item.id,
        ticketNumber: item.ticket_number,
        customerId: item.customer_id,
        equipmentId: item.equipment_id,
        title: item.title,
        description: item.description,
        ticketType: item.ticket_type,
        priority: item.priority,
        status: item.status,
        source: item.source,
        assignedTo: item.assigned_to,
        reportedAt: item.reported_at,
        scheduledAt: item.scheduled_at,
        startedAt: item.started_at,
        completedAt: item.completed_at,
        closedAt: item.closed_at,
        customerName: item.customers?.company_name,
        equipmentModel: item.equipment?.model,
        serialNumber: item.equipment?.serial_number
      }));

      return ok(tickets);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(tkt: Omit<ServiceTicket, 'id' | 'ticketNumber' | 'createdAt'>): Promise<Result<ServiceTicket>> {
    try {
      const ticketNumber = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await serverMutate.insert({
        table: 'service_tickets',
        payload: {
          ticket_number: ticketNumber,
          customer_id: tkt.customerId,
          equipment_id: tkt.equipmentId,
          title: tkt.title,
          description: tkt.description,
          ticket_type: tkt.ticketType,
          priority: tkt.priority,
          status: tkt.status,
          source: tkt.source,
          assigned_to: tkt.assignedTo,
        },
        select: '*, customers(company_name), equipment(model, serial_number)'
      });

      if (error) return err(new Error(error));

      const d: any = data;
      const created: ServiceTicket = {
        id: d.id,
        ticketNumber: d.ticket_number,
        customerId: d.customer_id,
        equipmentId: d.equipment_id,
        title: d.title,
        description: d.description,
        ticketType: d.ticket_type,
        priority: d.priority,
        status: d.status,
        source: d.source,
        assignedTo: d.assigned_to,
        reportedAt: d.reported_at,
        scheduledAt: d.scheduled_at,
        startedAt: d.started_at,
        completedAt: d.completed_at,
        closedAt: d.closed_at,
        customerName: d.customers?.company_name || tkt.customerName,
        equipmentModel: d.equipment?.model || tkt.equipmentModel,
        serialNumber: d.equipment?.serial_number || tkt.serialNumber
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async updateStatus(id: string, status: string): Promise<Result<boolean>> {
    try {
      const { error } = await serverMutate.update({
        table: 'service_tickets',
        payload: { status },
        match: { id }
      });
      if (error) return err(new Error(error));
      return ok(true);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
