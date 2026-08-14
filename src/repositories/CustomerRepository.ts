import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type CustomerRow = Database['public']['Tables']['customers']['Row']
type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export class CustomerRepository {
  private get supabase() {
    return createClient()
  }

  async getById(id: string): Promise<CustomerRow | null> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  }

  async getMany(): Promise<CustomerRow[]> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async create(customer: CustomerInsert): Promise<CustomerRow> {
    const { data, error } = await this.supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: CustomerUpdate): Promise<CustomerRow> {
    const { data, error } = await this.supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('customers')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
