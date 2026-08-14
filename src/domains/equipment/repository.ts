import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';
import { Equipment } from '@/types';
import { Result, ok, err } from '@/types/result';

export class EquipmentRepository {
  private static get supabase() { return createClient(); }

  static async getAll(): Promise<Result<Equipment[]>> {
    try {
      const { data, error } = await this.supabase
        .from('equipment')
        .select('*, customers(company_name)')
        .order('created_at', { ascending: false });

      if (error) return err(new Error(error.message));

      const equipment: Equipment[] = (data || []).map((item: any) => ({
        id: item.id,
        customerId: item.customer_id,
        equipmentCode: item.equipment_code,
        equipmentType: item.equipment_type,
        brand: item.brand,
        model: item.model,
        serialNumber: item.serial_number,
        capacity: item.capacity,
        location: item.location,
        installationDate: item.installation_date,
        warrantyStart: item.warranty_start,
        warrantyEnd: item.warranty_end,
        lastServiceDate: item.last_service_date,
        nextServiceDate: item.next_service_date,
        status: item.status,
        condition: item.condition,
        notes: item.notes,
        assetNumber: item.asset_number,
        purchaseDate: item.purchase_date,
        customerName: item.customers?.company_name
      }));

      return ok(equipment);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(eq: Omit<Equipment, 'id' | 'equipmentCode'>): Promise<Result<Equipment>> {
    try {
      const equipment_code = `EQ-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data, error } = await serverMutate.insert({
        table: 'equipment',
        payload: {
          equipment_code,
          customer_id: eq.customerId,
          equipment_type: eq.equipmentType,
          brand: eq.brand,
          model: eq.model,
          serial_number: eq.serialNumber,
          capacity: eq.capacity,
          location: eq.location,
          installation_date: eq.installationDate,
          warranty_start: eq.warrantyStart,
          warranty_end: eq.warrantyEnd,
          last_service_date: eq.lastServiceDate,
          next_service_date: eq.nextServiceDate,
          status: eq.status,
          condition: eq.condition,
          notes: eq.notes,
          asset_number: eq.assetNumber,
          purchase_date: eq.purchaseDate,
        },
        select: '*, customers(company_name)'
      });

      if (error) return err(new Error(error));

      const d: any = data;
      const created: Equipment = {
        id: d.id,
        customerId: d.customer_id,
        equipmentCode: d.equipment_code,
        equipmentType: d.equipment_type,
        brand: d.brand,
        model: d.model,
        serialNumber: d.serial_number,
        capacity: d.capacity,
        location: d.location,
        installationDate: d.installation_date,
        warrantyStart: d.warranty_start,
        warrantyEnd: d.warranty_end,
        lastServiceDate: d.last_service_date,
        nextServiceDate: d.next_service_date,
        status: d.status,
        condition: d.condition,
        notes: d.notes,
        assetNumber: d.asset_number,
        purchaseDate: d.purchase_date,
        customerName: d.customers?.company_name || eq.customerName
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
