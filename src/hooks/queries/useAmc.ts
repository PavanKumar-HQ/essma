import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AmcService } from '@/services/AmcService'
import { Database } from '@/types/database.types'
import { useRealtimeSubscription } from '@/hooks/useRealtime'
import { useAppMutation } from '@/hooks/useAppMutation'

const amcService = new AmcService()

export function useAmcs() {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('amc_contracts', () => {
    queryClient.invalidateQueries({ queryKey: ['amc_contracts'] })
  })

  return useQuery({
    queryKey: ['amc_contracts'],
    queryFn: () => amcService.getAllAmcs(),
  })
}

export function useAmc(id: string) {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('amc_contracts', () => {
    queryClient.invalidateQueries({ queryKey: ['amc_contract', id] })
  })

  return useQuery({
    queryKey: ['amc_contract', id],
    queryFn: () => amcService.getAmc(id),
    enabled: !!id,
  })
}

export function usePmVisits() {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('pm_visits', () => {
    queryClient.invalidateQueries({ queryKey: ['pm_visits'] })
  })

  return useQuery({
    queryKey: ['pm_visits'],
    queryFn: () => amcService.getPmVisits(),
  })
}

export function useCreateAmc() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (data: Database['public']['Tables']['amc_contracts']['Insert']) => 
      amcService.createAmc(data),
    successMessage: 'AMC created successfully.',
    errorMessage: 'Failed to create AMC. Please try again.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amc_contracts'] })
    },
  })
}

export function useUpdateAmc() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Database['public']['Tables']['amc_contracts']['Update'] }) => 
      amcService.updateAmc(id, updates),
    successMessage: 'AMC updated successfully.',
    errorMessage: 'Failed to update AMC.',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['amc_contracts'] })
      queryClient.invalidateQueries({ queryKey: ['amc_contract', variables.id] })
    },
  })
}

export function useDeleteAmc() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (id: string) => amcService.deleteAmc(id),
    successMessage: 'AMC deleted successfully.',
    errorMessage: 'Failed to delete AMC.',
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['amc_contracts'] })
      queryClient.invalidateQueries({ queryKey: ['amc_contract', id] })
    },
  })
}
