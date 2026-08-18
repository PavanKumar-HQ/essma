'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { Lead } from '@/types';
import { Target, Plus, Search, DollarSign, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';

import { hasPermission } from '@/lib/permissions';

interface LeadsViewProps {
  onNavigate?: (tab: any) => void;
}

export function LeadsView({ onNavigate }: LeadsViewProps) {
  const { activeRole, leads, convertLeadToQuote, createLead } = useCrmStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [requirement, setRequirement] = useState('100kVA Online UPS');
  const [budget, setBudget] = useState(1500000);

  const filtered = leads.filter(
    (l: any) =>
      l.companyName.toLowerCase().includes(search.toLowerCase()) ||
      l.leadNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleConvert = (leadId: string) => {
    const createdQuote = convertLeadToQuote(leadId);
    if (createdQuote) {
      toast.success(`Lead converted to Quotation ${createdQuote.quoteNumber}! Opening Quotations View...`);
      if (onNavigate) onNavigate('quotations');
    } else {
      toast.success(`Lead converted to Draft Quotation in CRM Store!`);
      if (onNavigate) onNavigate('quotations');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead({
      companyName,
      contactPerson,
      email,
      phone,
      city,
      requirement,
      estimatedKva: 100,
      budget,
      source: 'Website',
      status: 'Qualified',
      probability: 70,
      assignedSalespersonId: null,
      assignedSalespersonName: undefined,
      expectedClosureDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10)
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 font-sans text-[var(--color-text-main)] pb-8 ">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel border border-[var(--color-border-subtle)] p-4 rounded-[10px] shadow-sm  ">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--color-text-main)] flex items-center gap-2 font-heading">
            <Target className="w-5 h-5 text-[var(--color-warning)]" /> SALES CRM & LEADS PIPELINE
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] font-body">
            Opportunity Scoring & 1-Click Lead-to-Quotation Progression • {leads.length} Active Leads
          </p>
        </div>

        {hasPermission(activeRole, 'lead.create') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-accent text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm "
          >
            <Plus className="w-4 h-4" /> Add Sales Opportunity
          </button>
        )}
      </div>

      {/* Leads Table */}
      <div className="glass-panel border border-[var(--color-border-subtle)] rounded-[10px] overflow-hidden shadow-sm ">
        <div className="p-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] flex items-center gap-2 ">
          <Search className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunity #, company..."
            className="bg-transparent text-xs text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] w-full focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs ">
            <thead className="bg-[var(--color-surface-base)] border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
              <tr>
                <th className="py-3 px-4">Lead # & Company</th>
                <th className="py-3 px-4">Requirement</th>
                <th className="py-3 px-4 text-right">Budget</th>
                <th className="py-3 px-4 text-center">Probability</th>
                <th className="py-3 px-4 text-center">Pipeline Status</th>
                <th className="py-3 px-4 text-center">Convert Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22252A]/10">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-[var(--color-surface-base)] transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[var(--color-warning)]">{lead.leadNumber}</div>
                    <div className="font-bold text-[var(--color-text-main)]">{lead.companyName}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{lead.contactPerson} ({lead.city})</div>
                    <div className="flex justify-between items-center text-[10px] text-[var(--color-text-muted)] mt-3 border-t border-[var(--color-border-subtle)] pt-2">
                      <span>{lead.assignedSalespersonName || 'Unassigned'}</span>
                      <span className="font-bold text-emerald-500">₹{(lead.budget || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--color-text-muted)] font-sans">{lead.requirement}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-500">
                    ₹{(lead.budget || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-[var(--color-warning)]">{lead.probability}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[#FF7A00]/20 px-2 py-1 rounded text-[10px] font-bold">
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleConvert(lead.id)}
                      className="bg-[var(--color-primary)] hover:bg-[#1b54c8] text-white font-bold px-3 py-1.5 rounded text-[11px] flex items-center gap-1 mx-auto transition shadow-sm"
                    >
                      <span>Convert → Quote</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Lead Opportunity"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-sm font-sans">
          <div className="space-y-3">
            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="modern-input w-full p-2.5"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="modern-input w-full p-2.5"
                  required
                />
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="modern-input w-full p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Requirement Details</label>
              <input
                type="text"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className="modern-input w-full p-2.5"
                placeholder="e.g. 100kVA Online UPS with 1Hr Backup"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Estimated Budget (₹)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="modern-input w-full p-2.5 "
                  required
                />
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="modern-input w-full p-2.5"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border-subtle)] mt-4">
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
              Save Sales Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
