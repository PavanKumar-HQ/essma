'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { Boxes, AlertTriangle, Download, Plus, Search, Truck, Layers, QrCode } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Modal } from '@/components/shared/Modal';
import { hasPermission } from '@/lib/permissions';
import { useAppMutation } from '@/hooks/useAppMutation';
import { toast } from 'sonner';

export function InventoryView() {
  const { inventory, suppliers, updateInventoryStock, addInventoryItem, activeRole } = useCrmStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Inventory State
  const [sku, setSku] = useState('ESSMA-PART-' + Math.floor(1000 + Math.random() * 9000));
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('Pcs');
  const [minimumThreshold, setMinimumThreshold] = useState(5);
  const [unitCost, setUnitCost] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');

  const filtered = inventory.filter(
    (i) =>
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportXlsx = () => {
    const sheetData = inventory.map((i) => ({
      'SKU': i.sku,
      'Item Name': i.name,
      'Category': i.categoryName,
      'Location': 'Main Warehouse',
      'Quantity In Stock': i.currentStock || 0,
      'Min Threshold': i.minimumStock || 0,
      'Unit Cost': `₹${i.unitCost || 0}`,
      'Supplier': i.supplierName
    }));
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Warehouse Inventory');
    XLSX.writeFile(workbook, 'ESSMA_Warehouse_Inventory.xlsx');
  };

  const addMutation = useAppMutation({
    mutationFn: async (payload: any) => {
      // Simulate validation & permission checks
      if (!hasPermission('Super Admin', 'inventory.create')) {
        throw new Error('You do not have permission to create inventory items.');
      }
      return await addInventoryItem(payload);
    },
    successMessage: '✅ Inventory item created successfully.',
    onSuccess: () => {
      setShowAddModal(false);
    }
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate({
      sku,
      name,
      description,
      unit,
      categoryId: null,
      minimumStock: minimumThreshold,
      maximumStock: null,
      currentStock: 0,
      reservedStock: 0,
      unitCost,
      sellingPrice,
      supplierId: selectedSupplierId || null,
      status: 'Active'
    });
  };

  return (
    <div className="space-y-4 font-sans text-[var(--color-text-main)] pb-8 ">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel border border-[var(--color-border-subtle)] p-4 rounded-[10px] shadow-sm  ">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--color-text-main)] flex items-center gap-2 font-heading">
            <Boxes className="w-5 h-5 text-[var(--color-warning)]" /> WAREHOUSE INVENTORY & BATTERY STOCK
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] font-body">
            Serial-Level Rack & Shelf Location Tracking • Low Stock Triggers • {inventory.length} SKUs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportXlsx}
            className="bg-[var(--color-surface-base)] hover:bg-slate-800 text-[var(--color-text-main)] border border-[var(--color-border-subtle)] text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition font-semibold shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-accent text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm "
          >
            <Plus className="w-4 h-4" /> Add Stock
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel border border-[var(--color-border-subtle)] rounded-[10px] overflow-hidden shadow-sm ">
        <div className="p-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] flex items-center gap-2 ">
          <Search className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, battery name, rack location..."
            className="bg-transparent text-xs text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] w-full focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto ">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--color-surface-base)] border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
              <tr>
                <th className="py-2.5 px-3">SKU & Item Name</th>
                <th className="py-2.5 px-3">Warehouse Position</th>
                <th className="py-2.5 px-3 text-center">In Stock Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Cost</th>
                <th className="py-2.5 px-3 text-right">Selling Price</th>
                <th className="py-2.5 px-3 text-center">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22252A]/10">
              {filtered.map((item) => {
                const isLowStock = (item.currentStock || 0) <= (item.minimumStock || 0);
                return (
                  <tr key={item.id} className="hover:bg-[var(--color-surface-base)] transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[var(--color-warning)]">{item.sku}</div>
                      <div className="font-bold text-[var(--color-text-main)]">{item.name}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">Supplier: {item.supplierName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[var(--color-text-main)]">Main Warehouse</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className={`font-bold text-sm ${isLowStock ? 'text-[var(--color-warning)] animate-pulse' : 'text-emerald-500'}`}>
                        {item.currentStock || 0} Units
                      </div>
                      {isLowStock && (
                        <span className="text-[9px] bg-[var(--color-warning)]/15 text-[var(--color-warning)] border border-[#FF7A00]/20 px-1 py-0.5 rounded font-bold">
                          LOW STOCK ALERT
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-[var(--color-text-muted)]">₹{(item.unitCost || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-500">₹{(item.sellingPrice || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => {
                            if (hasPermission(activeRole, 'inventory.adjust')) {
                              toast.info(`Quick Adjust triggered for SKU: ${item.sku}`);
                            } else {
                              toast.error(`Role '${activeRole}' does not have permission to adjust inventory.`);
                            }
                          }}
                          className="bg-[var(--color-surface-base)] hover:bg-slate-800 border border-[var(--color-border-subtle)] text-[var(--color-text-main)] px-2 py-1 rounded text-xs font-bold transition"
                        >
                          Adjust
                        </button>
                        <button
                          onClick={() => {
                            if (hasPermission(activeRole, 'inventory.receive')) {
                              toast.info(`Receive Stock workflow initiated for ${item.name}`);
                            } else {
                              toast.error(`Role '${activeRole}' does not have permission to receive stock.`);
                            }
                          }}
                          className="btn-accent px-2 py-1 rounded text-xs font-bold shadow-xs transition"
                        >
                          Receive
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Inventory Item"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-sm font-sans">
          <div className="space-y-3">
            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="modern-input w-full p-2.5 text-[var(--color-warning)] font-bold"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="modern-input w-full p-2.5"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="modern-input w-full p-2.5"
                >
                  <option value="Pcs">Pcs</option>
                  <option value="Nos">Nos</option>
                  <option value="Set">Set</option>
                  <option value="Kg">Kg</option>
                  <option value="Ltr">Ltr</option>
                  <option value="Mtr">Mtr</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="modern-input w-full p-2.5" placeholder="Optional description" />
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Min Threshold</label>
                <input type="number" value={minimumThreshold} onChange={(e) => setMinimumThreshold(Number(e.target.value))} className="modern-input w-full p-2.5" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Unit Cost (₹)</label>
                <input type="number" value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value))} className="modern-input w-full p-2.5" required />
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Selling Price (₹)</label>
                <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="modern-input w-full p-2.5" required />
              </div>
            </div>
            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Supplier (optional)</label>
              <select value={selectedSupplierId} onChange={(e) => setSelectedSupplierId(e.target.value)} className="modern-input w-full p-2.5">
                <option value="">-- No Supplier --</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.companyName}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border-subtle)] mt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="btn-accent px-6 py-2 text-sm disabled:opacity-50"
            >
              {addMutation.isPending ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
