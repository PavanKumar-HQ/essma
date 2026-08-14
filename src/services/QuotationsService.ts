import { QuotationsRepository } from '../repositories/QuotationsRepository'
import { Database } from '@/types/database.types'

type QuotationInsert = Database['public']['Tables']['quotations']['Insert']
type QuotationUpdate = Database['public']['Tables']['quotations']['Update']

export class QuotationsService {
  private repository: QuotationsRepository

  constructor() {
    this.repository = new QuotationsRepository()
  }

  async getQuotation(id: string) {
    const quotation = await this.repository.getById(id)
    if (!quotation) throw new Error('Quotation not found')
    return quotation
  }

  async getAllQuotations() {
    return await this.repository.getMany()
  }

  async createQuotation(data: QuotationInsert) {
    if (!data.quote_number) throw new Error('Quote number is required')
    if (!data.customer_id) throw new Error('Customer ID is required')

    return await this.repository.create(data)
  }

  async updateQuotation(id: string, updates: QuotationUpdate) {
    return await this.repository.update(id, updates)
  }

  async deleteQuotation(id: string) {
    await this.repository.softDelete(id)
  }
}
