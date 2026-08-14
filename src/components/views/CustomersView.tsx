'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { useAppMutation } from '@/hooks/useAppMutation';
import { Users, Plus, Building, MapPin, Zap, Search, Phone, Mail } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { Customer } from '@/types';

export function CustomersView() {
  const { customers, equipment, invoices, createCustomer, loading: isLoadingCustomers } = useCrmStore();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [industry, setIndustry] = useState('IT & Data Center');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0] || null;

  const filteredCustomers = customers.filter(
    (c) =>
      c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      c.customerCode?.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  );

  const customerEquipment = equipment.filter((e) => e.customerId === selectedCustomer?.id);
  const customerInvoices = invoices.filter((i) => i.customerId === selectedCustomer?.id);

  const { mutate: addCustomer, isPending: isSubmitting } = useAppMutation({
    mutationFn: async () => {
      const created = await createCustomer({
        companyName,
        contactPerson: contactName,
        email: contactEmail,
        phone: contactPhone,
        gstNumber: gstin || '29AAACX99991Z1',
        customerType: industry,
        city: city,
        status: 'Active'
      });
      return created;
    },
    successMessage: 'Customer account created successfully.',
    errorMessage: 'Failed to create customer. Please try again.',
    onSuccess: (created) => {
      if (created) setSelectedCustomerId(created.id);
      setShowAddModal(false);
      setCompanyName('');
      setGstin('');
      setIndustry('IT & Data Center');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setCity('Bengaluru');
    }
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer();
  };

  if (isLoadingCustomers) {
    return <div className="p-8 text-center font-sans text-sm text-[var(--color-text-muted)] animate-pulse">Loading Customers from Database...</div>;
  }

  return (
    <div className="space-y-4 font-sans text-[var(--color-text-main)] pb-8 ">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel border border-[var(--color-border-subtle)] p-4 rounded-[10px] shadow-sm  ">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--color-text-main)] flex items-center gap-2 font-heading">
            <Users className="w-5 h-5 text-[var(--color-primary)]" /> ENTERPRISE CUSTOMERS REGISTRY
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] font-body">
            Multi-Branch Account Management & Asset Fleet History • {customers.length} Accounts
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[var(--color-warning)] hover:bg-[#E06C00] text-white font-bold text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm "
        >
          <Plus className="w-4 h-4" /> Add Customer Account
        </button>
      </div>

      {/* Split Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left List */}
        <div className="lg:col-span-5 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] overflow-hidden flex flex-col h-[600px] shadow-sm ">
          <div className="p-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] flex items-center gap-2 ">
            <Search className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, code, city..."
              className="bg-transparent text-xs text-[var(--color-text-main)] placeholder-slate-500 w-full focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#22252A]/10">
            {filteredCustomers.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCustomerId(c.id)}
                className={`p-3 cursor-pointer transition ${
                  selectedCustomer?.id === c.id
                    ? 'bg-[var(--color-warning)]/10 border-l-4 border-[#FF7A00]'
                    : 'hover:bg-[var(--color-surface-base)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-[var(--color-warning)]">{c.customerCode}</div>
                    <div className="text-xs font-bold text-[var(--color-text-main)]">{c.companyName}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{c.city} • {c.customerType}</div>
                  </div>
                  <span className="text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[#246BFD]/20 px-1.5 py-0.5 rounded font-bold">
                    {equipment.filter(e => e.customerId === c.id).length} Assets
                  </span>
                </div>
              </div>
            ))}
            {filteredCustomers.length === 0 && (
              <div className="p-4 text-xs text-center text-[var(--color-text-muted)]">
                No customers found.
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] p-5 space-y-4 shadow-sm ">
          {selectedCustomer ? (
            <>
              {/* Account Header */}
              <div className="flex justify-between items-start border-b border-[var(--color-border-subtle)] pb-4">
                <div>
                  <div className="text-xs text-[var(--color-text-muted)]">CODE: {selectedCustomer.customerCode}</div>
                  <h2 className="text-lg font-black text-[var(--color-text-main)] font-heading">{selectedCustomer.companyName}</h2>
                  <div className="text-xs text-[var(--color-warning)] font-bold">GSTIN: {selectedCustomer.gstNumber || 'N/A'}</div>
                </div>
                <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs px-2.5 py-1 rounded font-bold uppercase">
                  {selectedCustomer.status || 'Active'}
                </span>
              </div>

              {/* Primary Contact Details */}
              <div className="bg-[var(--color-surface-base)] p-4 rounded-lg border border-[var(--color-border-subtle)] space-y-2 text-xs">
                <div className="font-bold text-[var(--color-text-main)] uppercase tracking-wider text-[11px] border-b border-[#22252A]/10 pb-1">
                  PRIMARY CONTACT & DETAILS
                </div>
                <div className="grid grid-cols-2 gap-2 text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                    <span>Contact: <strong className="text-[var(--color-text-main)]">{selectedCustomer.contactPerson || 'N/A'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span>{selectedCustomer.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedCustomer.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                    <span>{selectedCustomer.city || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Installed Power Infrastructure Fleet */}
              <div className="bg-[var(--color-surface-base)] p-4 rounded-lg border border-[var(--color-border-subtle)] space-y-2 text-xs">
                <div className="font-bold text-[var(--color-text-main)] uppercase tracking-wider text-[11px] border-b border-[#22252A]/10 pb-1 flex justify-between">
                  <span>INSTALLED POWER ASSETS ({customerEquipment.length})</span>
                  <Zap className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                </div>
                <div className="space-y-1.5">
                  {customerEquipment.map((eq) => (
                    <div key={eq.id} className="glass-panel p-2.5 rounded border border-[var(--color-border-subtle)] flex justify-between items-center text-[11px] shadow-xs">
                      <div>
                        <div className="font-bold text-[var(--color-warning)]">{eq.serialNumber}</div>
                        <div className="text-[var(--color-text-main)]">{eq.model} - {eq.brand}</div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {eq.condition || 'Good'}
                      </span>
                    </div>
                  ))}
                  {customerEquipment.length === 0 && (
                    <div className="text-[var(--color-text-muted)] italic py-2">No assets registered to this customer.</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-[var(--color-text-muted)]">Select a customer account</div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Customer Account"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="modern-input w-full p-2.5 text-sm"
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">GSTIN</label>
                <input
                  type="text"
                  required
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="modern-input w-full p-2.5 text-sm"
                  placeholder="29AAACX..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="modern-input w-full p-2.5 text-sm"
                >
                  <option>IT & Data Center</option>
                  <option>Manufacturing</option>
                  <option>Healthcare</option>
                  <option>Banking & Finance</option>
                  <option>Telecom</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            
            <div className="pt-2 border-t border-[var(--color-border-subtle)]">
              <label className="block text-xs font-semibold text-[var(--color-text-main)] mb-2 uppercase tracking-wider">Primary Contact Details</label>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="modern-input w-full p-2.5 text-sm"
                  placeholder="Contact Person Name"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="modern-input w-full p-2.5 text-sm"
                    placeholder="Email Address"
                  />
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="modern-input w-full p-2.5 text-sm"
                    placeholder="Phone Number"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="modern-input w-full p-2.5 text-sm"
                  placeholder="City"
                />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
