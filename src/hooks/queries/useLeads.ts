import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LeadsService } from '@/services/LeadsService'
import { Database } from '@/types/database.types'
import { useRealtimeSubscription } from '@/hooks/useRealtime'
import { useAppMutation } from '@/hooks/useAppMutation'

const leadsService = new LeadsService()

export function useLeads() {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('leads', () => {
    queryClient.invalidateQueries({ queryKey: ['leads'] })
  })

  return useQuery({
    queryKey: ['leads'],
    queryFn: () => leadsService.getAllLeads(),
  })
}

export function useLead(id: string) {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('leads', () => {
    queryClient.invalidateQueries({ queryKey: ['lead', id] })
  })

  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsService.getLead(id),
    enabled: !!id,
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (data: Database['public']['Tables']['leads']['Insert']) => 
      leadsService.createLead(data),
    successMessage: 'Lead created successfully.',
    errorMessage: 'Failed to create lead. Please try again.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Database['public']['Tables']['leads']['Update'] }) => 
      leadsService.updateLead(id, updates),
    successMessage: 'Lead updated successfully.',
    errorMessage: 'Failed to update lead.',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] })
    },
  })
}

export function useDeleteLead() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (id: string) => leadsService.deleteLead(id),
    successMessage: 'Lead deleted successfully.',
    errorMessage: 'Failed to delete lead.',
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', id] })
    },
  })
}
