import { AmcRepository } from '../repositories/AmcRepository'
import { Database } from '@/types/database.types'

type AmcInsert = Database['public']['Tables']['amc_contracts']['Insert']
type AmcUpdate = Database['public']['Tables']['amc_contracts']['Update']

export class AmcService {
  private repository: AmcRepository

  constructor() {
    this.repository = new AmcRepository()
  }

  async getAmc(id: string) {
    const amc = await this.repository.getById(id)
    if (!amc) throw new Error('AMC not found')
    return amc
  }

  async getAllAmcs() {
    return await this.repository.getMany()
  }

  async getPmVisits() {
    return await this.repository.getPmVisits()
  }

  async createAmc(data: AmcInsert) {
    if (!data.contract_number) throw new Error('Contract number is required')
    if (!data.customer_id) throw new Error('Customer ID is required')

    return await this.repository.create(data)
  }

  async updateAmc(id: string, updates: AmcUpdate) {
    return await this.repository.update(id, updates)
  }

  async deleteAmc(id: string) {
    await this.repository.softDelete(id)
  }
}
