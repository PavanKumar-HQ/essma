import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type AmcRow = Database['public']['Tables']['amc_contracts']['Row']
type AmcInsert = Database['public']['Tables']['amc_contracts']['Insert']
type AmcUpdate = Database['public']['Tables']['amc_contracts']['Update']

type PmVisitRow = Database['public']['Tables']['pm_visits']['Row']

export class AmcRepository {
  private get supabase() {
    return createClient()
  }

  async getById(id: string): Promise<AmcRow | null> {
    const { data, error } = await this.supabase
      .from('amc_contracts')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  }

  async getMany(): Promise<AmcRow[]> {
    const { data, error } = await this.supabase
      .from('amc_contracts')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getPmVisits(): Promise<PmVisitRow[]> {
    const { data, error } = await this.supabase
      .from('pm_visits')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async create(amc: AmcInsert): Promise<AmcRow> {
    const { data, error } = await this.supabase
      .from('amc_contracts')
      .insert(amc)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: AmcUpdate): Promise<AmcRow> {
    const { data, error } = await this.supabase
      .from('amc_contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('amc_contracts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
