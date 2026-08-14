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
                  (e.serialNumber || '').toLowerCase().includes(search.toLowerCase()) ||
                  (e.model || '').toLowerCase().includes(search.toLowerCase()) ||
                  (e.customerName || '').toLowerCase().includes(search.toLowerCase())
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
                    <div className="font-bold text-slate-100">{eq.model || 'Unknown Model'}</div>
                    <div className="text-[11px] text-slate-400">{eq.serialNumber || 'No Serial'}</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
                    {eq.condition || 'N/A'}
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
                  c.customerCode.toLowerCase().includes(search.toLowerCase())
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
                    <div className="text-[11px] text-slate-400">{c.customerCode} • {c.city}</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
                    {c.customerType || 'Customer'}
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
                  (t.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
                  (t.title || '').toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, 4)
              .map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => {
                    onSelectEntity('tickets', ticket.id);
                    onClose();
                  }}
                  className="px-3 py-2 hover:bg-slate-800 rounded cursor-pointer flex justify-between items-center text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{ticket.ticketNumber}</div>
                    <div className="text-[11px] text-slate-400">{ticket.customerName} • {ticket.title}</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-300">
                    {ticket.status}
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
                  <span className="text-[10px] text-emerald-400 font-bold ml-2">
                    ₹{inv.totalAmount?.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
