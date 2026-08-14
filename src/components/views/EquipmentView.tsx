'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { Equipment } from '@/types';
import {
  Zap,
  Plus,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Battery,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as XLSX from 'xlsx';
import { Modal } from '@/components/shared/Modal';

export function EquipmentView() {
  const { equipment, customers, createEquipment, updateEquipmentHealth } = useCrmStore();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(equipment[0] || null);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Equipment Form State
  const [modelName, setModelName] = useState('ESSMA PowerMax 60kVA UPS');
  const [category, setCategory] = useState<any>('UPS');
  const [capacityKva, setCapacityKva] = useState(60);
  const [serialNumber, setSerialNumber] = useState(`ESSMA-UPS-60KVA-${Math.floor(10000 + Math.random() * 90000)}`);
  const [customerId, setCustomerId] = useState(customers[0]?.id || 'cust-101');
  const [batteryType, setBatteryType] = useState('12V 100Ah SMF');
  const [batteryQuantity, setBatteryQuantity] = useState(32);

  const filteredEquipment = equipment.filter(
    (e) =>
      e.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.modelName.toLowerCase().includes(search.toLowerCase()) ||
      e.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportXlsx = () => {
    const sheetData = equipment.map((e) => ({
      'Serial Number': e.serialNumber,
      'Model': e.modelName,
      'Category': e.category,
      'Capacity (kVA)': e.capacityKva,
      'Customer': e.customerName,
      'Health Score': `${e.healthScore}%`,
      'Warranty Status': e.warrantyStatus,
      'AMC Status': e.amcStatus,
      'Next PM Due': e.nextMaintenanceDueDate
    }));
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipment Fleet');
    XLSX.writeFile(workbook, 'ESSMA_Power_Assets.xlsx');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    const created = await createEquipment({
      serialNumber,
      modelName,
      category,
      capacityKva,
      capacityKw: capacityKva * 0.9,
      phase: '3-Phase',
      batteryType,
      batteryQuantity,
      customerId,
      customerName: cust?.companyName || 'Apex Data',
      branchId: cust?.branches[0]?.id || 'br-1',
      siteAddress: cust?.branches[0]?.address || 'Site Hub',
      city: cust?.city || 'Bengaluru',
      installationDate: new Date().toISOString().substring(0, 10),
      warrantyStartDate: new Date().toISOString().substring(0, 10),
      warrantyEndDate: new Date(Date.now() + 730 * 86400000).toISOString().substring(0, 10),
      warrantyStatus: 'Active',
      amcStatus: 'Covered',
      healthScore: 98,
      lastInspectionDate: new Date().toISOString().substring(0, 10),
      nextMaintenanceDueDate: new Date(Date.now() + 90 * 86400000).toISOString().substring(0, 10)
    });
    if (created) setSelectedEquipment(created);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 font-sans text-[var(--color-text-main)] pb-8 ">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel border border-[var(--color-border-subtle)] p-4 rounded-[10px] shadow-sm  ">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--color-text-main)] flex items-center gap-2 font-heading">
            <Zap className="w-5 h-5 text-[var(--color-warning)]" /> POWER INFRASTRUCTURE ASSETS (EPIMS)
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] font-body">
            Tracked Assets Lifecycle Engine • {equipment.length} Registered Systems
          </p>
        </div>

        <div className="flex items-center gap-2 ">
          <button
            onClick={handleExportXlsx}
            className="bg-[var(--color-surface-base)] hover:bg-white/10 text-[var(--color-text-main)] border border-[var(--color-border-subtle)] text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Export XLSX
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-accent text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Register UPS/Asset
          </button>
        </div>
      </div>

      {/* Main Split Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Asset Table List */}
        <div className="lg:col-span-5 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] overflow-hidden flex flex-col h-[600px] shadow-sm ">
          {/* Search & Filter */}
          <div className="p-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] flex items-center gap-2 ">
            <Search className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter serial #, model, customer..."
              className="bg-transparent text-xs text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] w-full focus:outline-none"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#22252A]/10">
            {filteredEquipment.map((eq) => (
              <div
                key={eq.id}
                onClick={() => setSelectedEquipment(eq)}
                className={`p-3 cursor-pointer transition ${
                  selectedEquipment?.id === eq.id
                    ? 'bg-[var(--color-warning)]/10 border-l-4 border-[#FF7A00]'
                    : 'hover:bg-[var(--color-surface-base)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-[var(--color-text-main)]">{eq.serialNumber}</div>
                    <div className="text-xs font-bold text-[var(--color-warning)]">{eq.modelName}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{eq.customerName}</div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      eq.healthScore > 90
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[#FF7A00]/20'
                    }`}
                  >
                    {eq.healthScore}% Health
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Asset Inspector */}
        <div className="lg:col-span-7 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] p-5 space-y-4 shadow-sm ">
          {selectedEquipment ? (
            <>
              {/* Asset Title Bar */}
              <div className="flex justify-between items-start border-b border-[var(--color-border-subtle)] pb-4">
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] ">SERIAL: {selectedEquipment.serialNumber}</div>
                  <h2 className="text-lg font-black text-[var(--color-text-main)] font-heading">{selectedEquipment.modelName}</h2>
                  <div className="text-xs text-[var(--color-primary)] font-bold">{selectedEquipment.customerName}</div>
                </div>

                <div className="p-2 glass-panel rounded border border-[var(--color-border-subtle)] shadow-sm">
                  <QRCodeSVG value={selectedEquipment.serialNumber} size={70} bgColor="transparent" fgColor="var(--color-text-main)" />
                </div>
              </div>

              {/* Asset Health Metrics */}
              <div className="grid grid-cols-3 gap-3 ">
                <div className="bg-[var(--color-surface-base)] p-3 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Health Score</span>
                  <div className="text-lg font-bold text-emerald-500 flex items-center gap-1">
                    <Activity className="w-4 h-4 text-emerald-500" /> {selectedEquipment.healthScore}%
                  </div>
                </div>

                <div className="bg-[var(--color-surface-base)] p-3 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Warranty Status</span>
                  <div className="text-xs font-bold text-[var(--color-warning)] mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[var(--color-warning)]" /> {selectedEquipment.warrantyStatus}
                  </div>
                </div>

                <div className="bg-[var(--color-surface-base)] p-3 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">AMC Coverage</span>
                  <div className="text-xs font-bold text-[var(--color-primary)] mt-1">
                    {selectedEquipment.amcStatus}
                  </div>
                </div>
              </div>

              {/* Technical Specifications Ledger */}
              <div className="bg-[var(--color-surface-base)] p-4 rounded-lg border border-[var(--color-border-subtle)] space-y-2 text-xs ">
                <div className="font-bold text-[var(--color-text-main)] uppercase tracking-wider text-[11px] border-b border-[var(--color-border-subtle)] pb-1">
                  TECHNICAL SPECIFICATIONS
                </div>
                <div className="grid grid-cols-2 gap-2 text-[var(--color-text-muted)] mt-2">
                  <div>• Capacity Rating: <span className="text-[var(--color-warning)] font-bold">{selectedEquipment.capacityKva} kVA / {selectedEquipment.capacityKw} kW</span></div>
                  <div>• Electrical Phase: <span className="text-[var(--color-text-main)] font-bold">{selectedEquipment.phase}</span></div>
                  <div>• Battery Configuration: <span className="text-[var(--color-text-main)] font-bold">{selectedEquipment.batteryType}</span></div>
                  <div>• Battery Quantity: <span className="text-[var(--color-text-main)] font-bold">{selectedEquipment.batteryQuantity} Nos</span></div>
                  <div>• Installation Date: <span className="text-[var(--color-text-main)] font-bold">{selectedEquipment.installationDate}</span></div>
                  <div>• Next PM Due: <span className="text-[var(--color-warning)] font-bold">{selectedEquipment.nextMaintenanceDueDate}</span></div>
                </div>
              </div>

              {/* Live Battery Voltage Log Simulation */}
              <div className="bg-[var(--color-surface-base)] p-4 rounded-lg border border-[var(--color-border-subtle)] space-y-3">
                <div className="flex justify-between items-center text-xs ">
                  <span className="font-bold text-[var(--color-text-main)] uppercase flex items-center gap-1.5">
                    <Battery className="w-4 h-4 text-[var(--color-primary)]" /> Battery Bank Voltage Telemetry
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">32 Cells Monitored</span>
                </div>

                <div className="grid grid-cols-8 gap-2 text-[10px] ">
                  {Array.from({ length: 16 }, (_, i) => {
                    const volt = (13.4 + (i % 3) * 0.1).toFixed(1);
                    return (
                      <div key={i} className="glass-panel border border-[var(--color-border-subtle)] p-1.5 rounded text-center shadow-xs">
                        <span className="text-[var(--color-text-muted)] text-[9px]">#{i + 1}</span>
                        <div className="text-emerald-500 font-bold">{volt}V</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-[var(--color-text-muted)]">Select an asset from the left to inspect telemetry</div>
          )}
        </div>
      </div>

      {/* Add New Equipment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Power Asset"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-sm font-sans">
          <div className="space-y-3">
            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Model Name</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="modern-input w-full p-2.5"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Capacity (kVA)</label>
                <input
                  type="number"
                  value={capacityKva}
                  onChange={(e) => setCapacityKva(Number(e.target.value))}
                  className="modern-input w-full p-2.5"
                />
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="modern-input w-full p-2.5"
                >
                  <option value="UPS">UPS</option>
                  <option value="Inverter">Inverter</option>
                  <option value="Battery Bank">Battery Bank</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Assign Customer</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="modern-input w-full p-2.5"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Serial Number (QR Code)</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="modern-input w-full p-2.5 text-[var(--color-warning)] font-bold "
                required
              />
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
              Save Equipment Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
