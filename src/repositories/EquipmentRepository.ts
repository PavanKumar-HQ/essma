import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type EquipmentRow = Database['public']['Tables']['equipment']['Row']
type EquipmentInsert = Database['public']['Tables']['equipment']['Insert']
type EquipmentUpdate = Database['public']['Tables']['equipment']['Update']

export class EquipmentRepository {
  private get supabase() {
    return createClient()
  }

  async getById(id: string): Promise<EquipmentRow | null> {
    const { data, error } = await this.supabase
      .from('equipment')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  }

  async getMany(): Promise<EquipmentRow[]> {
    const { data, error } = await this.supabase
      .from('equipment')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getByCustomerId(customerId: string): Promise<EquipmentRow[]> {
    const { data, error } = await this.supabase
      .from('equipment')
      .select('*')
      .eq('customer_id', customerId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async create(equipment: EquipmentInsert): Promise<EquipmentRow> {
    const { data, error } = await this.supabase
      .from('equipment')
      .insert(equipment)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: EquipmentUpdate): Promise<EquipmentRow> {
    const { data, error } = await this.supabase
      .from('equipment')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('equipment')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
