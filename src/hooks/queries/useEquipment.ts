import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useRealtimeSubscription } from '@/hooks/useRealtime';

export function useEquipment() {
  const queryClient = useQueryClient();
  
  useRealtimeSubscription('equipment', () => {
    queryClient.invalidateQueries({ queryKey: ['equipment'] });
  });

  return useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('equipment').select('*').is('deleted_at', null);
      if (error) throw error;
      return data;
    },
  });
}
