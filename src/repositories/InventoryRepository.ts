import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type InventoryItemRow = Database['public']['Tables']['inventory_items']['Row']
type InventoryItemInsert = Database['public']['Tables']['inventory_items']['Insert']
type InventoryItemUpdate = Database['public']['Tables']['inventory_items']['Update']

export class InventoryRepository {
  private get supabase() {
    return createClient()
  }

  async getById(id: string): Promise<InventoryItemRow | null> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  }

  async getMany(): Promise<InventoryItemRow[]> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true })

    if (error) throw error
    return data
  }

  async create(item: InventoryItemInsert): Promise<InventoryItemRow> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: InventoryItemUpdate): Promise<InventoryItemRow> {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('inventory_items')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
