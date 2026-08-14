import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type QuotationRow = Database['public']['Tables']['quotations']['Row']
type QuotationInsert = Database['public']['Tables']['quotations']['Insert']
type QuotationUpdate = Database['public']['Tables']['quotations']['Update']

export class QuotationsRepository {
  private get supabase() {
    return createClient()
  }

  async getById(id: string): Promise<QuotationRow | null> {
    const { data, error } = await this.supabase
      .from('quotations')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  }

  async getMany(): Promise<QuotationRow[]> {
    const { data, error } = await this.supabase
      .from('quotations')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async create(quotation: QuotationInsert): Promise<QuotationRow> {
    const { data, error } = await this.supabase
      .from('quotations')
      .insert(quotation)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: QuotationUpdate): Promise<QuotationRow> {
    const { data, error } = await this.supabase
      .from('quotations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('quotations')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
