import { InstallationsRepository } from '../repositories/InstallationsRepository'
import { Database } from '@/types/database.types'

type InstallationInsert = Database['public']['Tables']['installations']['Insert']
type InstallationUpdate = Database['public']['Tables']['installations']['Update']

export class InstallationsService {
  private repository: InstallationsRepository

  constructor() {
    this.repository = new InstallationsRepository()
  }

  async getInstallation(id: string) {
    const installation = await this.repository.getById(id)
    if (!installation) throw new Error('Installation not found')
    return installation
  }

  async getAllInstallations() {
    return await this.repository.getMany()
  }

  async createInstallation(data: InstallationInsert) {
    if (!data.installation_number) throw new Error('Installation number is required')
    if (!data.customer_id) throw new Error('Customer ID is required')
    if (!data.equipment_id) throw new Error('Equipment ID is required')

    return await this.repository.create(data)
  }

  async updateInstallation(id: string, updates: InstallationUpdate) {
    return await this.repository.update(id, updates)
  }

  async deleteInstallation(id: string) {
    await this.repository.softDelete(id)
  }
}
