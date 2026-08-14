import { InventoryRepository } from '../repositories/InventoryRepository'
import { Database } from '@/types/database.types'

type InventoryItemInsert = Database['public']['Tables']['inventory_items']['Insert']
type InventoryItemUpdate = Database['public']['Tables']['inventory_items']['Update']

export class InventoryService {
  private repository: InventoryRepository

  constructor() {
    this.repository = new InventoryRepository()
  }

  async getItem(id: string) {
    const item = await this.repository.getById(id)
    if (!item) throw new Error('Inventory item not found')
    return item
  }

  async getAllItems() {
    return await this.repository.getMany()
  }

  async createItem(data: InventoryItemInsert) {
    if (!data.name || !data.sku) {
      throw new Error('Name and SKU are required to create an inventory item')
    }
    
    // Default current_stock if not provided
    if (data.current_stock === undefined) {
      data.current_stock = 0
    }

    return await this.repository.create(data)
  }

  async updateItem(id: string, updates: InventoryItemUpdate) {
    return await this.repository.update(id, updates)
  }

  async deleteItem(id: string) {
    await this.repository.softDelete(id)
  }
}
