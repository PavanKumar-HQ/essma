import { createClient } from '@/lib/supabase/client';
import { Equipment } from '@/types';
import { Result, ok, err } from '@/types/result';

export class EquipmentRepository {
  private static supabase = createClient();

  static async getAll(): Promise<Result<Equipment[]>> {
    try {
      const { data, error } = await this.supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return err(new Error(error.message));

      const equipment: Equipment[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        serialNumber: item.serial_number,
        modelName: item.model_name,
        category: item.category,
        capacityKva: item.capacity_kva,
        capacityKw: item.capacity_kw,
        phase: item.phase,
        batteryType: item.battery_type,
        batteryQuantity: item.battery_quantity,
        customerId: item.customer_id,
        customerName: item.customer_name || 'Customer Account',
        branchId: item.branch_id || 'br-1',
        siteAddress: item.site_address,
        city: item.city,
        installationDate: item.installation_date,
        warrantyStartDate: item.warranty_start_date,
        warrantyEndDate: item.warranty_end_date,
        warrantyStatus: item.warranty_status,
        amcStatus: item.amc_status,
        healthScore: item.health_score,
        lastInspectionDate: item.last_inspection_date,
        nextMaintenanceDueDate: item.next_maintenance_due_date,
        qrCodeUrl: item.qr_code_url
      }));

      return ok(equipment);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(eq: Omit<Equipment, 'id' | 'qrCodeUrl'>): Promise<Result<Equipment>> {
    try {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(eq.serialNumber)}`;
      const { data, error } = await this.supabase
        .from('equipment')
        .insert({
          serial_number: eq.serialNumber,
          model_name: eq.modelName,
          category: eq.category,
          capacity_kva: eq.capacityKva,
          capacity_kw: eq.capacityKw,
          phase: eq.phase,
          battery_type: eq.batteryType,
          battery_quantity: eq.batteryQuantity,
          customer_id: eq.customerId,
          site_address: eq.siteAddress,
          city: eq.city,
          installation_date: eq.installationDate,
          warranty_status: eq.warrantyStatus,
          amc_status: eq.amcStatus,
          health_score: eq.healthScore,
          qr_code_url: qrCodeUrl
        })
        .select()
        .single();

      if (error) return err(new Error(error.message));

      const created: Equipment = {
        id: data.id,
        serialNumber: data.serial_number,
        modelName: data.model_name,
        category: data.category,
        capacityKva: data.capacity_kva,
        capacityKw: data.capacity_kw,
        phase: data.phase,
        batteryType: data.battery_type,
        batteryQuantity: data.battery_quantity,
        customerId: data.customer_id,
        customerName: eq.customerName,
        branchId: data.branch_id || 'br-1',
        siteAddress: data.site_address,
        city: data.city,
        installationDate: data.installation_date,
        warrantyStartDate: data.warranty_start_date,
        warrantyEndDate: data.warranty_end_date,
        warrantyStatus: data.warranty_status,
        amcStatus: data.amc_status,
        healthScore: data.health_score,
        lastInspectionDate: data.last_inspection_date,
        nextMaintenanceDueDate: data.next_maintenance_due_date,
        qrCodeUrl: data.qr_code_url
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
