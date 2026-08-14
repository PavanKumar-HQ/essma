import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CustomerService } from '@/services/CustomerService';
import { Database } from '@/types/database.types';
import { useRealtimeSubscription } from '@/hooks/useRealtime';
import { useAppMutation } from '@/hooks/useAppMutation';

const customerService = new CustomerService();

export function useCustomers() {
  const queryClient = useQueryClient();
  
  // Realtime subscription invalidates the query automatically
  useRealtimeSubscription('customers', () => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  });

  return useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getAllCustomers(),
  });
}

export function useCustomer(id: string) {
  const queryClient = useQueryClient();
  
  useRealtimeSubscription('customers', () => {
    queryClient.invalidateQueries({ queryKey: ['customer', id] });
  });

  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (data: Database['public']['Tables']['customers']['Insert']) => 
      customerService.createCustomer(data),
    successMessage: 'Customer created successfully.',
    errorMessage: 'Failed to create customer. Please try again.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Database['public']['Tables']['customers']['Update'] }) => 
      customerService.updateCustomer(id, updates),
    successMessage: 'Customer updated successfully.',
    errorMessage: 'Failed to update customer.',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    successMessage: 'Customer deleted successfully.',
    errorMessage: 'Failed to delete customer.',
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
    },
  });
}
