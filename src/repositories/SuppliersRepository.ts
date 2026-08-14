import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type SupplierRow = Database['public']['Tables']['suppliers']['Row']
type SupplierInsert = Database['public']['Tables']['suppliers']['Insert']
type SupplierUpdate = Database['public']['Tables']['suppliers']['Update']

export class SuppliersRepository {
  private get supabase() {
    return createClient()
  }

  async getById(id: string): Promise<SupplierRow | null> {
    const { data, error } = await this.supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async getMany(): Promise<SupplierRow[]> {
    const { data, error } = await this.supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async create(supplier: SupplierInsert): Promise<SupplierRow> {
    const { data, error } = await this.supabase
      .from('suppliers')
      .insert(supplier)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: SupplierUpdate): Promise<SupplierRow> {
    const { data, error } = await this.supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Suppliers might not have deleted_at in schema, assuming hard delete or just update status
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('suppliers')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
