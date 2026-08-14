import { SuppliersRepository } from '../repositories/SuppliersRepository'
import { Database } from '@/types/database.types'

type SupplierInsert = Database['public']['Tables']['suppliers']['Insert']
type SupplierUpdate = Database['public']['Tables']['suppliers']['Update']

export class SuppliersService {
  private repository: SuppliersRepository

  constructor() {
    this.repository = new SuppliersRepository()
  }

  async getSupplier(id: string) {
    const supplier = await this.repository.getById(id)
    if (!supplier) throw new Error('Supplier not found')
    return supplier
  }

  async getAllSuppliers() {
    return await this.repository.getMany()
  }

  async createSupplier(data: SupplierInsert) {
    if (!data.name) throw new Error('Supplier name is required')

    return await this.repository.create(data)
  }

  async updateSupplier(id: string, updates: SupplierUpdate) {
    return await this.repository.update(id, updates)
  }

  async deleteSupplier(id: string) {
    await this.repository.delete(id)
  }
}
