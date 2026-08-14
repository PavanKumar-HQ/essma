import { useQuery, useQueryClient } from '@tanstack/react-query'
import { InstallationsService } from '@/services/InstallationsService'
import { Database } from '@/types/database.types'
import { useRealtimeSubscription } from '@/hooks/useRealtime'
import { useAppMutation } from '@/hooks/useAppMutation'

const installationsService = new InstallationsService()

export function useInstallations() {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('installations', () => {
    queryClient.invalidateQueries({ queryKey: ['installations'] })
  })

  return useQuery({
    queryKey: ['installations'],
    queryFn: () => installationsService.getAllInstallations(),
  })
}

export function useInstallation(id: string) {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('installations', () => {
    queryClient.invalidateQueries({ queryKey: ['installation', id] })
  })

  return useQuery({
    queryKey: ['installation', id],
    queryFn: () => installationsService.getInstallation(id),
    enabled: !!id,
  })
}

export function useCreateInstallation() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (data: Database['public']['Tables']['installations']['Insert']) => 
      installationsService.createInstallation(data),
    successMessage: 'Installation created successfully.',
    errorMessage: 'Failed to create installation. Please try again.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['installations'] })
    },
  })
}

export function useUpdateInstallation() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Database['public']['Tables']['installations']['Update'] }) => 
      installationsService.updateInstallation(id, updates),
    successMessage: 'Installation updated successfully.',
    errorMessage: 'Failed to update installation.',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['installations'] })
      queryClient.invalidateQueries({ queryKey: ['installation', variables.id] })
    },
  })
}

export function useDeleteInstallation() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (id: string) => installationsService.deleteInstallation(id),
    successMessage: 'Installation deleted successfully.',
    errorMessage: 'Failed to delete installation.',
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['installations'] })
      queryClient.invalidateQueries({ queryKey: ['installation', id] })
    },
  })
}
