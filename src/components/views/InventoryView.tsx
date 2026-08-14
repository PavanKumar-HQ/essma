'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { Boxes, AlertTriangle, Download, Plus, Search, Truck, Layers, QrCode } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Modal } from '@/components/shared/Modal';

export function InventoryView() {
  const { inventory, updateInventoryStock, addInventoryItem } = useCrmStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Inventory State
  const [sku, setSku] = useState('ESSMA-PART-' + Math.floor(1000 + Math.random() * 9000));
  const [name, setName] = useState('Replacement Logic Board v2');
  const [category, setCategory] = useState('Spare Parts');
  const [warehouseLocation, setWarehouseLocation] = useState('Main WH - BLR');
  const [rackNumber, setRackNumber] = useState('Rack A4');
  const [shelfNumber, setShelfNumber] = useState('Shelf 2');
  const [quantityInStock, setQuantityInStock] = useState(10);
  const [minimumThreshold, setMinimumThreshold] = useState(5);
  const [unitCost, setUnitCost] = useState(4500);
  const [sellingPrice, setSellingPrice] = useState(8500);
  const [supplierName, setSupplierName] = useState('Texas Instruments Corp');

  const filtered = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.warehouseLocation.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportXlsx = () => {
    const sheetData = inventory.map((i) => ({
      'SKU': i.sku,
      'Item Name': i.name,
      'Category': i.category,
      'Location': i.warehouseLocation,
      'Rack / Shelf': `${i.rackNumber} / ${i.shelfNumber}`,
      'Quantity In Stock': i.quantityInStock,
      'Min Threshold': i.minimumThreshold,
      'Unit Cost': `₹${i.unitCost}`,
      'Supplier': i.supplierName
    }));
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Warehouse Inventory');
    XLSX.writeFile(workbook, 'ESSMA_Warehouse_Inventory.xlsx');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addInventoryItem({
      sku,
      name,
      category,
      warehouseLocation,
      rackNumber,
      shelfNumber,
      quantityInStock,
      minimumThreshold,
      unitCost,
      sellingPrice,
      supplierName
    });
    setShowAddModal(false);
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
                const isLowStock = item.quantityInStock <= item.minimumThreshold;
                return (
                  <tr key={item.id} className="hover:bg-[var(--color-surface-base)] transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[var(--color-warning)]">{item.sku}</div>
                      <div className="font-bold text-[var(--color-text-main)]">{item.name}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">Supplier: {item.supplierName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[var(--color-text-main)]">{item.warehouseLocation}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">
                        {item.rackNumber} • {item.shelfNumber}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className={`font-bold text-sm ${isLowStock ? 'text-[var(--color-warning)] animate-pulse' : 'text-emerald-500'}`}>
                        {item.quantityInStock} Units
                      </div>
                      {isLowStock && (
                        <span className="text-[9px] bg-[var(--color-warning)]/15 text-[var(--color-warning)] border border-[#FF7A00]/20 px-1 py-0.5 rounded font-bold">
                          LOW STOCK ALERT
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-[var(--color-text-muted)]">₹{item.unitCost.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-500">₹{item.sellingPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => updateInventoryStock(item.id, -1)}
                          className="bg-[var(--color-surface-base)] hover:bg-slate-800 border border-[var(--color-border-subtle)] text-[var(--color-text-main)] px-2 py-1 rounded text-xs font-bold transition"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => updateInventoryStock(item.id, 5)}
                          className="btn-accent px-2 py-1 rounded text-xs font-bold shadow-xs transition"
                        >
                          +5
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
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="modern-input w-full p-2.5"
                >
                  <option value="UPS">UPS</option>
                  <option value="Battery Bank">Battery</option>
                  <option value="Spare Parts">Spare Parts</option>
                  <option value="Consumables">Consumables</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Warehouse</label>
                <input type="text" value={warehouseLocation} onChange={(e) => setWarehouseLocation(e.target.value)} className="modern-input w-full p-2.5" />
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Rack</label>
                <input type="text" value={rackNumber} onChange={(e) => setRackNumber(e.target.value)} className="modern-input w-full p-2.5" />
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Shelf</label>
                <input type="text" value={shelfNumber} onChange={(e) => setShelfNumber(e.target.value)} className="modern-input w-full p-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Qty in Stock</label>
                <input type="number" value={quantityInStock} onChange={(e) => setQuantityInStock(Number(e.target.value))} className="modern-input w-full p-2.5" required />
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
              className="btn-accent px-6 py-2 text-sm"
            >
              Add Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
