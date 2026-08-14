'use client';

import React from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { Truck, ShoppingCart, Star, Building, Phone, Mail } from 'lucide-react';

export function SuppliersView() {
  const { suppliers, purchaseOrders } = useCrmStore();

  return (
    <div className="space-y-4 text-slate-100 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div>
          <h1 className="text-lg font-black tracking-wider text-slate-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" /> SUPPLIERS & PURCHASE ORDERS
          </h1>
          <p className="text-xs text-slate-400">
            OEM Vendor Quality Rating & Procurement Operations • {suppliers.length} Approved Suppliers
          </p>
        </div>
      </div>

      {/* Suppliers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((sup) => (
          <div key={sup.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-bold text-amber-400">{sup.code}</div>
                <h3 className="text-sm font-black text-slate-100">{sup.companyName}</h3>
                <div className="text-xs text-slate-400">GSTIN: {sup.gstin} • {sup.city}</div>
              </div>
              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {sup.rating}
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1 text-xs text-slate-300">
              <div>Contact: <strong className="text-slate-100">{sup.contactPerson}</strong> ({sup.phone})</div>
              <div>Products Supplied: <span className="text-amber-400">{sup.productsSupplied.join(', ')}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
