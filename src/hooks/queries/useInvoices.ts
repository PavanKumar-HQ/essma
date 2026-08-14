import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useRealtimeSubscription } from '@/hooks/useRealtime';

export function useInvoices() {
  const queryClient = useQueryClient();
  
  useRealtimeSubscription('invoices', () => {
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
  });

  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('invoices').select('*').is('deleted_at', null);
      if (error) throw error;
      return data;
    },
  });
}
