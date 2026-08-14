import { AuditRepository } from '../repositories/AuditRepository'
import { Database } from '@/types/database.types'

type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']

export class AuditService {
  private repository: AuditRepository

  constructor() {
    this.repository = new AuditRepository()
  }

  async getAllLogs() {
    return await this.repository.getMany()
  }

  async createLog(data: AuditLogInsert) {
    if (!data.action || !data.entity_type || !data.entity_id) {
      throw new Error('Audit log missing required fields')
    }

    return await this.repository.create(data)
  }
}
