import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ServiceTicketService } from '@/services/ServiceTicketService'
import { Database } from '@/types/database.types'
import { useRealtimeSubscription } from '@/hooks/useRealtime'
import { useAppMutation } from '@/hooks/useAppMutation'

const ticketService = new ServiceTicketService()

export function useTickets() {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('service_tickets', () => {
    queryClient.invalidateQueries({ queryKey: ['service_tickets'] })
  })

  return useQuery({
    queryKey: ['service_tickets'],
    queryFn: () => ticketService.getAllTickets(),
  })
}

export function useTicket(id: string) {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('service_tickets', () => {
    queryClient.invalidateQueries({ queryKey: ['service_ticket', id] })
  })

  return useQuery({
    queryKey: ['service_ticket', id],
    queryFn: () => ticketService.getTicket(id),
    enabled: !!id,
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (data: Database['public']['Tables']['service_tickets']['Insert']) => 
      ticketService.createTicket(data),
    successMessage: 'Ticket created successfully.',
    errorMessage: 'Failed to create ticket.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_tickets'] })
    },
  })
}

export function useUpdateTicket() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Database['public']['Tables']['service_tickets']['Update'] }) => 
      ticketService.updateTicket(id, updates),
    successMessage: 'Ticket updated successfully.',
    errorMessage: 'Failed to update ticket.',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['service_tickets'] })
      queryClient.invalidateQueries({ queryKey: ['service_ticket', variables.id] })
    },
  })
}
