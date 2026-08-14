import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SuppliersService } from '@/services/SuppliersService'
import { Database } from '@/types/database.types'
import { useRealtimeSubscription } from '@/hooks/useRealtime'
import { useAppMutation } from '@/hooks/useAppMutation'

const suppliersService = new SuppliersService()

export function useSuppliers() {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('suppliers', () => {
    queryClient.invalidateQueries({ queryKey: ['suppliers'] })
  })

  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersService.getAllSuppliers(),
  })
}

export function useSupplier(id: string) {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('suppliers', () => {
    queryClient.invalidateQueries({ queryKey: ['supplier', id] })
  })

  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => suppliersService.getSupplier(id),
    enabled: !!id,
  })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (data: Database['public']['Tables']['suppliers']['Insert']) => 
      suppliersService.createSupplier(data),
    successMessage: 'Supplier created successfully.',
    errorMessage: 'Failed to create supplier. Please try again.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Database['public']['Tables']['suppliers']['Update'] }) => 
      suppliersService.updateSupplier(id, updates),
    successMessage: 'Supplier updated successfully.',
    errorMessage: 'Failed to update supplier.',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] })
    },
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (id: string) => suppliersService.deleteSupplier(id),
    successMessage: 'Supplier deleted successfully.',
    errorMessage: 'Failed to delete supplier.',
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['supplier', id] })
    },
  })
}
