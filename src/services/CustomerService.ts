import { CustomerRepository } from '../repositories/CustomerRepository'
import { Database } from '@/types/database.types'

type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export class CustomerService {
  private repository: CustomerRepository

  constructor() {
    this.repository = new CustomerRepository()
  }

  async getCustomer(id: string) {
    const customer = await this.repository.getById(id)
    if (!customer) throw new Error('Customer not found')
    return customer
  }

  async getAllCustomers() {
    return await this.repository.getMany()
  }

  async createCustomer(data: CustomerInsert) {
    if (!data.company_name) {
      throw new Error('Company name is required')
    }
    if (!data.customer_code) {
      throw new Error('Customer code is required')
    }

    return await this.repository.create(data)
  }

  async updateCustomer(id: string, updates: CustomerUpdate) {
    return await this.repository.update(id, updates)
  }

  async deleteCustomer(id: string) {
    // Soft delete customer
    await this.repository.softDelete(id)
  }
}
