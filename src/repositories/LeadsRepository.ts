import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type LeadRow = Database['public']['Tables']['leads']['Row']
type LeadInsert = Database['public']['Tables']['leads']['Insert']
type LeadUpdate = Database['public']['Tables']['leads']['Update']

export class LeadsRepository {
  private get supabase() {
    return createClient()
  }

  async getById(id: string): Promise<LeadRow | null> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  }

  async getMany(): Promise<LeadRow[]> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async create(lead: LeadInsert): Promise<LeadRow> {
    const { data, error } = await this.supabase
      .from('leads')
      .insert(lead)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: LeadUpdate): Promise<LeadRow> {
    const { data, error } = await this.supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('leads')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
