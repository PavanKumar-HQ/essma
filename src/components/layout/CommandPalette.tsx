'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useCrmStore } from '@/hooks/useCrm';
import { Search, Zap, Users, LifeBuoy, FileText, Receipt, Boxes, X } from 'lucide-react';
import { NavTab } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (tab: NavTab, detailId?: string) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectEntity }: CommandPaletteProps) {
  const { customers, equipment, tickets, invoices, quotations, inventory } = useCrmStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden font-mono text-slate-200">
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-950">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Serial Number, Customer, Ticket ID, Invoice #, Battery SKU..."
            className="w-full bg-transparent py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/50">
          {/* Equipment & Serial Numbers */}
          <div className="py-2">
            <div className="px-3 text-[10px] uppercase font-bold text-amber-400 mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Power Infrastructure Assets (Serial #)
            </div>
            {equipment
              .filter(
                (e) =>
                  e.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
                  e.modelName.toLowerCase().includes(search.toLowerCase()) ||
                  e.customerName.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, 4)
              .map((eq) => (
                <div
                  key={eq.id}
                  onClick={() => {
                    onSelectEntity('equipment', eq.id);
                    onClose();
                  }}
                  className="px-3 py-2 hover:bg-slate-800 rounded cursor-pointer flex justify-between items-center text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{eq.serialNumber}</div>
                    <div className="text-[11px] text-slate-400">{eq.modelName} • {eq.customerName}</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-300">
                    Health: {eq.healthScore}%
                  </span>
                </div>
              ))}
          </div>

          {/* Customers */}
          <div className="py-2">
            <div className="px-3 text-[10px] uppercase font-bold text-blue-400 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Enterprise Customers
            </div>
            {customers
              .filter(
                (c) =>
                  c.companyName.toLowerCase().includes(search.toLowerCase()) ||
                  c.code.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, 4)
              .map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectEntity('customers', c.id);
                    onClose();
                  }}
                  className="px-3 py-2 hover:bg-slate-800 rounded cursor-pointer flex justify-between items-center text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{c.companyName}</div>
                    <div className="text-[11px] text-slate-400">{c.code} • {c.city}</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
                    {c.totalEquipmentCount} Equipment Assets
                  </span>
                </div>
              ))}
          </div>

          {/* Service Tickets */}
          <div className="py-2">
            <div className="px-3 text-[10px] uppercase font-bold text-red-400 mb-1 flex items-center gap-1">
              <LifeBuoy className="w-3 h-3" /> Service Tickets
            </div>
            {tickets
              .filter(
                (t) =>
                  t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
                  t.customerName.toLowerCase().includes(search.toLowerCase()) ||
                  t.issueType.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, 3)
              .map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectEntity('tickets', t.id);
                    onClose();
                  }}
                  className="px-3 py-2 hover:bg-slate-800 rounded cursor-pointer flex justify-between items-center text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{t.ticketNumber} - {t.issueType}</div>
                    <div className="text-[11px] text-slate-400">{t.customerName}</div>
                  </div>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-bold">
                    {t.priority}
                  </span>
                </div>
              ))}
          </div>

          {/* Invoices */}
          <div className="py-2">
            <div className="px-3 text-[10px] uppercase font-bold text-emerald-400 mb-1 flex items-center gap-1">
              <Receipt className="w-3 h-3" /> Invoices & GST
            </div>
            {invoices
              .filter((inv) => inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()))
              .slice(0, 3)
              .map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => {
                    onSelectEntity('invoices', inv.id);
                    onClose();
                  }}
                  className="px-3 py-2 hover:bg-slate-800 rounded cursor-pointer flex justify-between items-center text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{inv.invoiceNumber}</div>
                    <div className="text-[11px] text-slate-400">{inv.customerName}</div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    ₹{inv.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
