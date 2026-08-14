import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';

import { InstallationTask } from '@/types';
import { Result, ok, err } from '@/types/result';

export class InstallationRepository {
  private static get supabase() { return createClient(); }


  static async getAll(): Promise<Result<InstallationTask[]>> {
    try {
      const { data, error } = await this.supabase.from('installations').select('*');
      if (error) return err(new Error(error.message));
      const installations: InstallationTask[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        installationNumber: item.installation_number,
        customerId: item.customer_id,
        customerName: item.customer_name || 'Apex Data',
        equipmentId: item.equipment_id,
        equipmentModel: item.equipment_model || 'ESSMA 120kVA UPS',
        serialNumber: item.serial_number || 'ESSMA-UPS-120KVA-88912',
        siteAddress: item.site_address,
        scheduledDate: item.scheduled_date,
        assignedEngineerId: item.assigned_engineer_id || null,
        assignedEngineerName: item.assigned_engineer_id || 'Unassigned',
        stage: item.stage || 'Commissioning',
        checklist: item.checklist || {
          siteSurveyDone: true,
          inputVoltageVerified: true,
          earthingChecked: true,
          batteryBankConnected: true,
          loadTestPassed: true,
          customerTrained: false
        }
      }));
      return ok(installations);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
