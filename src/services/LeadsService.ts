import { LeadsRepository } from '../repositories/LeadsRepository'
import { Database } from '@/types/database.types'

type LeadInsert = Database['public']['Tables']['leads']['Insert']
type LeadUpdate = Database['public']['Tables']['leads']['Update']

export class LeadsService {
  private repository: LeadsRepository

  constructor() {
    this.repository = new LeadsRepository()
  }

  async getLead(id: string) {
    const lead = await this.repository.getById(id)
    if (!lead) throw new Error('Lead not found')
    return lead
  }

  async getAllLeads() {
    return await this.repository.getMany()
  }

  async createLead(data: LeadInsert) {
    if (!data.company_name) throw new Error('Company name is required')
    if (!data.lead_number) throw new Error('Lead number is required')

    return await this.repository.create(data)
  }

  async updateLead(id: string, updates: LeadUpdate) {
    return await this.repository.update(id, updates)
  }

  async deleteLead(id: string) {
    await this.repository.softDelete(id)
  }
}
