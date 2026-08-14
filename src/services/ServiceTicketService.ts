import { ServiceTicketRepository } from '../repositories/ServiceTicketRepository'
import { Database } from '@/types/database.types'

type ServiceTicketInsert = Database['public']['Tables']['service_tickets']['Insert']
type ServiceTicketUpdate = Database['public']['Tables']['service_tickets']['Update']

export class ServiceTicketService {
  private repository: ServiceTicketRepository

  constructor() {
    this.repository = new ServiceTicketRepository()
  }

  async getTicket(id: string) {
    const ticket = await this.repository.getById(id)
    if (!ticket) throw new Error('Ticket not found')
    return ticket
  }

  async getAllTickets() {
    return await this.repository.getMany()
  }

  async createTicket(data: ServiceTicketInsert) {
    if (!data.title || !data.customer_id) {
      throw new Error('Title and Customer are required to create a ticket')
    }
    
    // Default status if not provided
    if (!data.status) {
      data.status = 'new'
    }

    return await this.repository.create(data)
  }

  async updateTicketStatus(id: string, newStatus: string) {
    // Here we would validate status transitions (e.g. new -> assigned -> in_progress -> completed)
    return await this.repository.update(id, { status: newStatus })
  }

  async updateTicket(id: string, updates: ServiceTicketUpdate) {
    return await this.repository.update(id, updates)
  }

  async deleteTicket(id: string) {
    await this.repository.softDelete(id)
  }
}
