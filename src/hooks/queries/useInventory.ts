import { useQuery, useQueryClient } from '@tanstack/react-query'
import { InventoryService } from '@/services/InventoryService'
import { Database } from '@/types/database.types'
import { useRealtimeSubscription } from '@/hooks/useRealtime'
import { useAppMutation } from '@/hooks/useAppMutation'

const inventoryService = new InventoryService()

export function useInventory() {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('inventory_items', () => {
    queryClient.invalidateQueries({ queryKey: ['inventory_items'] })
  })

  return useQuery({
    queryKey: ['inventory_items'],
    queryFn: () => inventoryService.getAllItems(),
  })
}

export function useInventoryItem(id: string) {
  const queryClient = useQueryClient()
  
  useRealtimeSubscription('inventory_items', () => {
    queryClient.invalidateQueries({ queryKey: ['inventory_item', id] })
  })

  return useQuery({
    queryKey: ['inventory_item', id],
    queryFn: () => inventoryService.getItem(id),
    enabled: !!id,
  })
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: (data: Database['public']['Tables']['inventory_items']['Insert']) => 
      inventoryService.createItem(data),
    successMessage: 'Item created successfully.',
    errorMessage: 'Failed to create item.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] })
    },
  })
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient()

  return useAppMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Database['public']['Tables']['inventory_items']['Update'] }) => 
      inventoryService.updateItem(id, updates),
    successMessage: 'Item updated successfully.',
    errorMessage: 'Failed to update item.',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] })
      queryClient.invalidateQueries({ queryKey: ['inventory_item', variables.id] })
    },
  })
}
