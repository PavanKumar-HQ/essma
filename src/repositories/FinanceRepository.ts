import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export class FinanceRepository {
  private get supabase() {
    return createClient()
  }

  async getInvoiceById(id: string): Promise<InvoiceRow | null> {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  }

  async getInvoices(): Promise<InvoiceRow[]> {
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async createInvoice(invoice: InvoiceInsert): Promise<InvoiceRow> {
    const { data, error } = await this.supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateInvoice(id: string, updates: InvoiceUpdate): Promise<InvoiceRow> {
    const { data, error } = await this.supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async softDeleteInvoice(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('invoices')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
