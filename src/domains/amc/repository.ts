import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';

import { AmcContract, PmVisit } from '@/types';
import { Result, ok, err } from '@/types/result';

export class AmcRepository {
  private static get supabase() { return createClient(); }


  static async getContracts(): Promise<Result<AmcContract[]>> {
    try {
      const { data, error } = await this.supabase
        .from('amc_contracts')
        .select('*, customers(company_name)');
      if (error) return err(new Error(error.message));
      const contracts: AmcContract[] = (data || []).map((item: any) => ({
        id: item.id,
        contractNumber: item.contract_number,
        customerId: item.customer_id,
        contractType: item.contract_type,
        startDate: item.start_date,
        endDate: item.end_date,
        billingFrequency: item.billing_frequency,
        contractValue: item.contract_value,
        taxAmount: item.tax_amount,
        totalValue: item.total_value,
        status: item.status,
        notes: item.notes,
        terms: item.terms,
        customerName: item.customers?.company_name
      }));
      return ok(contracts);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async getPmVisits(): Promise<Result<PmVisit[]>> {
    try {
      const { data, error } = await this.supabase
        .from('pm_visits')
        .select('*, customers(company_name), equipment(model, serial_number), profiles!pm_visits_assigned_engineer_id_fkey(full_name)');
      if (error) return err(new Error(error.message));
      const visits: PmVisit[] = (data || []).map((item: any) => ({
        id: item.id,
        visitNumber: item.visit_number,
        amcContractId: item.amc_contract_id,
        customerId: item.customer_id,
        equipmentId: item.equipment_id,
        assignedEngineerId: item.assigned_engineer_id,
        scheduledDate: item.scheduled_date,
        status: item.status,
        checklist: item.checklist,
        batteryVoltageReadings: item.battery_voltage_readings,
        engineerNotes: item.engineer_notes,
        customerSignature: item.customer_signature,
        completedAt: item.completed_at,
        customerName: item.customers?.company_name,
        equipmentModel: item.equipment?.model,
        serialNumber: item.equipment?.serial_number,
        assignedEngineerName: item.profiles?.full_name
      }));
      return ok(visits);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
