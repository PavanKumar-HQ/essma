import { createClient } from '@/lib/supabase/client';
import { AuditLog, SystemNotification } from '@/types';
import { Result, ok, err } from '@/types/result';

export class AuditRepository {
  private static supabase = createClient();

  static async getLogs(): Promise<Result<AuditLog[]>> {
    try {
      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) return err(new Error(error.message));
      const logs: AuditLog[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        timestamp: item.created_at,
        userId: item.user_id || '',
        userName: item.user_id || 'System',
        userRole: 'Super Admin',
        action: item.action,
        entityType: item.entity_type,
        entityId: item.entity_id,
        details: JSON.stringify(item.new_data || item.old_data || {}),
        ipAddress: item.ip_address
      }));
      return ok(logs);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async getNotifications(): Promise<Result<SystemNotification[]>> {
    try {
      // notifications table has different shape - user_id is required, so filter by user session
      // For now we safely return empty if the query fails due to RLS
      const { data, error } = await this.supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        // RLS error means no user context - return empty gracefully
        console.warn('Notifications query failed (likely RLS):', error.message);
        return ok([]);
      }

      const notifs: SystemNotification[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        timestamp: item.created_at,
        title: item.title,
        message: item.message || '',
        type: item.type as SystemNotification['type'],
        severity: 'info',
        read: item.is_read || false
      }));
      return ok(notifs);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
