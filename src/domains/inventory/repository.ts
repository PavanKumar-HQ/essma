import { createClient } from '@/lib/supabase/client';
import { serverMutate } from '@/lib/supabase/admin';
import { InventoryItem } from '@/types';
import { Result, ok, err } from '@/types/result';

export class InventoryRepository {
  private static get supabase() { return createClient(); }

  static async getAll(): Promise<Result<InventoryItem[]>> {
    try {
      const { data, error } = await this.supabase
        .from('inventory_items')
        .select('*, inventory_categories(name), suppliers(name)')
        .order('sku', { ascending: true });

      if (error) return err(new Error(error.message));

      const items: InventoryItem[] = (data || []).map((item: any) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        categoryId: item.category_id,
        description: item.description,
        unit: item.unit,
        currentStock: item.current_stock,
        minimumStock: item.minimum_stock,
        maximumStock: item.maximum_stock,
        reservedStock: item.reserved_stock,
        unitCost: item.unit_cost,
        sellingPrice: item.selling_price,
        supplierId: item.supplier_id,
        status: item.status,
        categoryName: item.inventory_categories?.name,
        supplierName: item.suppliers?.name
      }));

      return ok(items);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async updateStock(id: string, deltaQuantity: number): Promise<Result<boolean>> {
    try {
      const { error } = await serverMutate.rpc({
        rpc: 'update_inventory_stock',
        args: { p_item_id: id, p_delta: deltaQuantity }
      });
      if (error) return err(new Error(error));
      return ok(true);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  static async create(item: Omit<InventoryItem, 'id' | 'barcodeQr'>): Promise<Result<InventoryItem>> {
    try {
      const { data, error } = await serverMutate.insert({
        table: 'inventory_items',
        payload: {
          sku: item.sku,
          name: item.name,
          category_id: item.categoryId,
          description: item.description,
          unit: item.unit,
          current_stock: item.currentStock || 0,
          minimum_stock: item.minimumStock || 0,
          maximum_stock: item.maximumStock,
          reserved_stock: item.reservedStock || 0,
          unit_cost: item.unitCost || 0,
          selling_price: item.sellingPrice || 0,
          supplier_id: item.supplierId,
          status: item.status || 'Active',
        },
        select: '*, inventory_categories(name), suppliers(name)'
      });

      if (error) return err(new Error(error));

      const d: any = data;
      const created: InventoryItem = {
        id: d.id,
        sku: d.sku,
        name: d.name,
        categoryId: d.category_id,
        description: d.description,
        unit: d.unit,
        currentStock: d.current_stock,
        minimumStock: d.minimum_stock,
        maximumStock: d.maximum_stock,
        reservedStock: d.reserved_stock,
        unitCost: d.unit_cost,
        sellingPrice: d.selling_price,
        supplierId: d.supplier_id,
        status: d.status,
        categoryName: d.inventory_categories?.name || item.categoryName,
        supplierName: d.suppliers?.name || item.supplierName
      };

      return ok(created);
    } catch (e: any) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
