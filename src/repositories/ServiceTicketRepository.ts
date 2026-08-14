import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type ServiceTicketRow = Database['public']['Tables']['service_tickets']['Row']
type ServiceTicketInsert = Database['public']['Tables']['service_tickets']['Insert']
type ServiceTicketUpdate = Database['public']['Tables']['service_tickets']['Update']

export class ServiceTicketRepository {
  private get supabase() {
    return createClient()
  }

  async getById(id: string): Promise<ServiceTicketRow | null> {
    const { data, error } = await this.supabase
      .from('service_tickets')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  }

  async getMany(): Promise<ServiceTicketRow[]> {
    const { data, error } = await this.supabase
      .from('service_tickets')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async create(ticket: ServiceTicketInsert): Promise<ServiceTicketRow> {
    const { data, error } = await this.supabase
      .from('service_tickets')
      .insert(ticket)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: ServiceTicketUpdate): Promise<ServiceTicketRow> {
    const { data, error } = await this.supabase
      .from('service_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('service_tickets')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
