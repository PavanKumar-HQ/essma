import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtimeSubscription(tableName: string, onUpdate: () => void) {
  const callbackRef = useRef(onUpdate);

  useEffect(() => {
    callbackRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const supabase = createClient();
    const channelId = `realtime_${tableName}_${Math.random().toString(36).substring(2, 7)}`;

    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => {
          callbackRef.current();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]);
}
