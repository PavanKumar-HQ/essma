'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { Truck, Star, Plus } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';

export function SuppliersView() {
  const { suppliers, createSupplier } = useCrmStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const result = await createSupplier({ companyName, gstin, contactPerson, email, phone, city });
      if (result) {
        toast.success(`Supplier "${result.companyName}" added successfully!`);
        setShowAddModal(false);
        setCompanyName(''); setGstin(''); setContactPerson(''); setEmail(''); setPhone(''); setCity('');
      } else {
        toast.error('Failed to add supplier.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-4 font-sans text-[var(--color-text-main)] pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel border border-[var(--color-border-subtle)] p-4 rounded-[10px] shadow-sm">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--color-text-main)] flex items-center gap-2 font-heading">
            <Truck className="w-5 h-5 text-[var(--color-warning)]" /> SUPPLIERS & PURCHASE ORDERS
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] font-body">
            OEM Vendor Quality Rating & Procurement Operations • {suppliers.length} Approved Suppliers
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[var(--color-warning)] hover:bg-[#E06C00] text-white font-bold text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      {/* Suppliers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.length === 0 ? (
          <div className="col-span-2 glass-panel p-8 text-center text-[var(--color-text-muted)] text-sm">
            No suppliers found. Add your first supplier.
          </div>
        ) : suppliers.map((sup) => (
          <div key={sup.id} className="glass-panel border border-[var(--color-border-subtle)] p-5 rounded-xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-bold text-[var(--color-warning)]">{sup.code}</div>
                <h3 className="text-sm font-black text-white">{sup.companyName}</h3>
                <div className="text-xs text-[var(--color-text-muted)]">GSTIN: {sup.gstin} • {sup.city}</div>
              </div>
              <div className="flex items-center gap-1 text-[var(--color-warning)] font-bold text-xs bg-[var(--color-warning)]/10 px-2 py-0.5 rounded border border-[var(--color-warning)]/30">
                <Star className="w-3.5 h-3.5 fill-[var(--color-warning)]" /> {sup.rating}
              </div>
            </div>

            <div className="bg-white/5 border border-[var(--color-border-subtle)] p-2.5 rounded space-y-1 text-xs text-[var(--color-text-muted)]">
              <div>Contact: <strong className="text-white">{sup.contactPerson}</strong> ({sup.phone})</div>
              <div>Email: <span className="text-[var(--color-primary)]">{sup.email}</span></div>
              <div>Products: <span className="text-[var(--color-warning)]">{sup.productsSupplied.join(', ')}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Supplier" width="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="modern-input w-full p-2.5" required />
            </div>
            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">GSTIN</label>
              <input type="text" value={gstin} onChange={(e) => setGstin(e.target.value)} className="modern-input w-full p-2.5" />
            </div>
            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Contact Person</label>
              <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="modern-input w-full p-2.5" />
            </div>
            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="modern-input w-full p-2.5" />
            </div>
            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="modern-input w-full p-2.5" />
            </div>
            <div className="col-span-2">
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">City / Address</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="modern-input w-full p-2.5" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border-subtle)]">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-accent px-6 py-2 text-sm disabled:opacity-50">
              {isPending ? 'Saving...' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
