import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QuotationsService } from '@/services/QuotationsService'
import { Database } from '@/types/database.types'
import { useRealtimeSubscription } from '@/hooks/useRealtime'
import { useAppMutation } from '@/hooks/useAppMutation'

const quotationsService = new QuotationsService()

export function useQuotations() {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('quotations', () => {
    queryClient.invalidateQueries({ queryKey: ['quotations'] })
  })

  return useQuery({
    queryKey: ['quotations'],
    queryFn: () => quotationsService.getAllQuotations(),
  })
}

export function useQuotation(id: string) {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('quotations', () => {
    queryClient.invalidateQueries({ queryKey: ['quotation', id] })
  })

  return useQuery({
    queryKey: ['quotation', id],
    queryFn: () => quotationsService.getQuotation(id),
    enabled: !!id,
  })
}

export function useCreateQuotation() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (data: Database['public']['Tables']['quotations']['Insert']) => 
      quotationsService.createQuotation(data),
    successMessage: 'Quotation created successfully.',
    errorMessage: 'Failed to create quotation. Please try again.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
    },
  })
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Database['public']['Tables']['quotations']['Update'] }) => 
      quotationsService.updateQuotation(id, updates),
    successMessage: 'Quotation updated successfully.',
    errorMessage: 'Failed to update quotation.',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      queryClient.invalidateQueries({ queryKey: ['quotation', variables.id] })
    },
  })
}

export function useDeleteQuotation() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (id: string) => quotationsService.deleteQuotation(id),
    successMessage: 'Quotation deleted successfully.',
    errorMessage: 'Failed to delete quotation.',
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      queryClient.invalidateQueries({ queryKey: ['quotation', id] })
    },
  })
}
