import { createClient } from '@/lib/supabase/client';
import { AmcContract, PmVisit } from '@/types';
import { Result, ok, err } from '@/types/result';

export class AmcRepository {
  private static supabase = createClient();

  static async getContracts(): Promise<Result<AmcContract[]>> {
    try {
      const { data, error } = await this.supabase.from('amc_contracts').select('*');
      if (error) return err(new Error(error.message));
      const contracts: AmcContract[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        contractNumber: item.contract_number,
        customerId: item.customer_id,
        customerName: item.customer_name || 'Apex Data',
        equipmentIds: [],
        coverageType: item.coverage_type || 'Comprehensive',
        startDate: item.start_date,
        endDate: item.end_date,
        totalValue: item.total_value,
        visitFrequency: item.visit_frequency || 'Quarterly',
        totalVisitsScheduled: item.total_visits_scheduled || 4,
        visitsCompleted: item.visits_completed || 0,
        visitsMissed: 0,
        status: item.status || 'Active',
        assignedEngineerId: item.assigned_engineer_id || 'usr-3',
        assignedEngineerName: 'Amit Kumar',
        nextScheduledVisit: item.next_scheduled_visit || '2026-10-15'
      }));
      return ok(contracts);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async getPmVisits(): Promise<Result<PmVisit[]>> {
    try {
      const { data, error } = await this.supabase.from('pm_visits').select('*');
      if (error) return err(new Error(error.message));
      const visits: PmVisit[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        visitNumber: item.visit_number,
        amcContractId: item.amc_contract_id,
        customerId: item.customer_id,
        customerName: item.customer_name || 'Fortis Hospital',
        equipmentId: item.equipment_id,
        equipmentModel: item.equipment_model || 'ESSMA 60kVA UPS',
        serialNumber: item.serial_number || 'ESSMA-UPS-60KVA-77419',
        assignedEngineerId: item.assigned_engineer_id || 'usr-3',
        assignedEngineerName: 'Amit Kumar',
        scheduledDate: item.scheduled_date,
        status: item.status || 'Scheduled',
        checklist: item.checklist || {
          mainsVoltageChecked: true,
          outputVoltageChecked: true,
          upsLoadPercent: 42,
          batteryVoltageLogged: true,
          fanCleaningDone: true,
          terminalTighteningDone: true
        },
        batteryVoltageReadings: Array.from({ length: 16 }, (_, i) => ({ batteryIndex: i + 1, voltage: 13.6 }))
      }));
      return ok(visits);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
