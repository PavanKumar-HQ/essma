import { EquipmentRepository } from '../repositories/EquipmentRepository'
import { Database } from '@/types/database.types'

type EquipmentInsert = Database['public']['Tables']['equipment']['Insert']
type EquipmentUpdate = Database['public']['Tables']['equipment']['Update']

export class EquipmentService {
  private repository: EquipmentRepository

  constructor() {
    this.repository = new EquipmentRepository()
  }

  async getEquipment(id: string) {
    const equipment = await this.repository.getById(id)
    if (!equipment) throw new Error('Equipment not found')
    return equipment
  }

  async getAllEquipment() {
    return await this.repository.getMany()
  }

  async getEquipmentByCustomer(customerId: string) {
    return await this.repository.getByCustomerId(customerId)
  }

  async createEquipment(data: EquipmentInsert) {
    if (!data.equipment_code) throw new Error('Equipment code is required')
    if (!data.customer_id) throw new Error('Customer ID is required')

    return await this.repository.create(data)
  }

  async updateEquipment(id: string, updates: EquipmentUpdate) {
    return await this.repository.update(id, updates)
  }

  async deleteEquipment(id: string) {
    await this.repository.softDelete(id)
  }
}
