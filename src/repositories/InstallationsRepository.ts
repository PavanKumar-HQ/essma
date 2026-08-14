import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type InstallationRow = Database['public']['Tables']['installations']['Row']
type InstallationInsert = Database['public']['Tables']['installations']['Insert']
type InstallationUpdate = Database['public']['Tables']['installations']['Update']

export class InstallationsRepository {
  private get supabase() {
    return createClient()
  }

  async getById(id: string): Promise<InstallationRow | null> {
    const { data, error } = await this.supabase
      .from('installations')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  }

  async getMany(): Promise<InstallationRow[]> {
    const { data, error } = await this.supabase
      .from('installations')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async create(installation: InstallationInsert): Promise<InstallationRow> {
    const { data, error } = await this.supabase
      .from('installations')
      .insert(installation)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, updates: InstallationUpdate): Promise<InstallationRow> {
    const { data, error } = await this.supabase
      .from('installations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('installations')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
