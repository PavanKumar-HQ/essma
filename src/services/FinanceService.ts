import { FinanceRepository } from '../repositories/FinanceRepository'
import { Database } from '@/types/database.types'

type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export class FinanceService {
  private repository: FinanceRepository

  constructor() {
    this.repository = new FinanceRepository()
  }

  async getInvoice(id: string) {
    const invoice = await this.repository.getInvoiceById(id)
    if (!invoice) throw new Error('Invoice not found')
    return invoice
  }

  async getAllInvoices() {
    return await this.repository.getInvoices()
  }

  async createInvoice(data: InvoiceInsert) {
    if (!data.invoice_number) throw new Error('Invoice number is required')
    if (!data.customer_id) throw new Error('Customer ID is required')

    return await this.repository.createInvoice(data)
  }

  async updateInvoice(id: string, updates: InvoiceUpdate) {
    return await this.repository.updateInvoice(id, updates)
  }

  async deleteInvoice(id: string) {
    await this.repository.softDeleteInvoice(id)
  }
}
