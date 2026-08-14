import { createClient } from '@/lib/supabase/client';
import { InventoryItem } from '@/types';
import { Result, ok, err } from '@/types/result';

export class InventoryRepository {
  private static supabase = createClient();

  static async getAll(): Promise<Result<InventoryItem[]>> {
    try {
      const { data, error } = await this.supabase
        .from('inventory_items_view')
        .select('*')
        .order('sku', { ascending: true });

      if (error) return err(new Error(error.message));

      const items: InventoryItem[] = (data || []).map((item: Record<string, any>) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category,
        warehouseLocation: item.warehouse_location,
        rackNumber: item.rack_number || 'RACK-A1',
        shelfNumber: item.shelf_number || 'SHELF-01',
        batchNumber: item.batch_number || 'BT-2026',
        quantityInStock: item.quantity_in_stock,
        reservedQuantity: item.reserved_quantity || 0,
        minimumThreshold: item.minimum_threshold || 5,
        unitCost: item.unit_cost,
        sellingPrice: item.selling_price,
        supplierId: item.supplier_id || 'sup-1',
        supplierName: item.supplier_name || 'Semikron Electronics',
        lastRestockedDate: item.last_restocked_date,
        barcodeQr: item.sku
      }));

      return ok(items);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async updateStock(id: string, deltaQuantity: number): Promise<Result<boolean>> {
    try {
      const { error } = await this.supabase
        .rpc('update_inventory_stock', { p_item_id: id, p_delta: deltaQuantity });

      if (error) return err(new Error(error.message));
      return ok(true);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(item: Omit<InventoryItem, 'id' | 'barcodeQr'>): Promise<Result<InventoryItem>> {
    try {
      const { data, error } = await this.supabase
        .rpc('create_inventory_item_flat', {
          p_organization_id: '00000000-0000-0000-0000-000000000000', // To be updated when auth is fully wired
          p_sku: item.sku,
          p_name: item.name,
          p_category_name: item.category || 'General',
          p_supplier_name: item.supplierName || 'Unknown Supplier',
          p_warehouse_location: item.warehouseLocation || 'Main Warehouse',
          p_rack_number: item.rackNumber || 'RACK-A1',
          p_shelf_number: item.shelfNumber || 'SHELF-01',
          p_quantity_in_stock: item.quantityInStock || 0,
          p_minimum_threshold: item.minimumThreshold || 0,
          p_unit_cost: item.unitCost || 0,
          p_selling_price: item.sellingPrice || 0,
          p_user_id: '00000000-0000-0000-0000-000000000000'
        });

      if (error) return err(new Error(error.message));

      const created: InventoryItem = {
        id: data.id,
        sku: data.sku,
        name: data.name,
        category: item.category,
        warehouseLocation: item.warehouseLocation,
        rackNumber: item.rackNumber,
        shelfNumber: item.shelfNumber,
        batchNumber: item.batchNumber || 'BT-2026',
        quantityInStock: data.current_stock,
        reservedQuantity: data.reserved_stock || 0,
        minimumThreshold: data.minimum_stock || 5,
        unitCost: data.unit_cost,
        sellingPrice: data.selling_price,
        supplierId: data.supplier_id,
        supplierName: item.supplierName,
        lastRestockedDate: new Date().toISOString().substring(0, 10),
        barcodeQr: data.sku
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
