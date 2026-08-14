import { createClient } from '@/lib/supabase/client';
import { AuditLog, SystemNotification } from '@/types';
import { Result, ok, err } from '@/types/result';

export class AuditRepository {
  private static supabase = createClient();

  static async getLogs(): Promise<Result<AuditLog[]>> {
    try {
      const { data, error } = await this.supabase.from('audit_logs').select('*').order('timestamp', { ascending: false });
      if (error) return err(new Error(error.message));
      const logs: AuditLog[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        timestamp: item.timestamp,
        userId: item.user_id,
        userName: item.user_name,
        userRole: item.user_role,
        action: item.action,
        entityType: item.entity_type,
        entityId: item.entity_id,
        details: item.details,
        ipAddress: item.ip_address
      }));
      return ok(logs);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async getNotifications(): Promise<Result<SystemNotification[]>> {
    try {
      const { data, error } = await this.supabase.from('notifications').select('*').order('timestamp', { ascending: false });
      if (error) return err(new Error(error.message));
      const notifs: SystemNotification[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        timestamp: item.timestamp,
        title: item.title,
        message: item.message,
        type: item.type,
        severity: item.severity || 'info',
        read: item.read || false
      }));
      return ok(notifs);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
