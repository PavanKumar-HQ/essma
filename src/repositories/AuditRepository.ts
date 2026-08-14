import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

type AuditLogRow = Database['public']['Tables']['audit_logs']['Row']
type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']

export class AuditRepository {
  private get supabase() {
    return createClient()
  }

  async getMany(): Promise<AuditLogRow[]> {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async create(log: AuditLogInsert): Promise<AuditLogRow> {
    const { data, error } = await this.supabase
      .from('audit_logs')
      .insert(log)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
