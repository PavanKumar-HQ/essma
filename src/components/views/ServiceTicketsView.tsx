'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { ServiceTicket } from '@/types';
import {
  LifeBuoy,
  Plus,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  X,
  FileCheck,
  Zap
} from 'lucide-react';
import { SignatureCanvas } from '@/components/shared/SignatureCanvas';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';

export function ServiceTicketsView() {
  const { tickets, equipment, engineers, createServiceTicket, updateTicketStatus } = useCrmStore();
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(tickets[0] || null);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for Dispatching Ticket
  const [equipmentId, setEquipmentId] = useState(equipment[0]?.id || '');
  const [issueType, setIssueType] = useState<any>('Battery Backup Failure');
  const [priority, setPriority] = useState<any>('Emergency');
  const [assignedEngineerId, setAssignedEngineerId] = useState(engineers[0]?.id || '');
  
  // Right-pane detail state
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [signatureData, setSignatureData] = useState('');

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      (t.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eq = equipment.find((item) => item.id === equipmentId);
    const eng = engineers.find((e) => e.id === assignedEngineerId);

    const created = await createServiceTicket({
      customerId: eq?.customerId || '11111111-1111-1111-1111-111111111111',
      customerName: eq?.customerName || 'Apex Data Technologies',
      equipmentId,
      equipmentModel: eq?.model || 'Unknown Model',
      serialNumber: eq?.serialNumber || 'UNKNOWN',
      siteAddress: eq?.location || 'Unknown Location',
      issueType,
      priority,
      status: 'Assigned',
      reportedBy: 'Onsite Operations Lead',
      reportedPhone: '+91 98450 11223',
      assignedEngineerId,
      assignedEngineerName: eng?.name || 'Amit Kumar',
      diagnosisNotes: 'Reported backup failure under load test.',
      slaMet: true
    });
    if (created) setSelectedTicket(created);
    setShowCreateModal(false);
  };

  const handleStatusChange = async (status: ServiceTicket['status']) => {
    if (!selectedTicket) return;
    try {
      await updateTicketStatus(selectedTicket.id, status, diagnosisNotes, signatureData);
      toast.success(`Ticket marked as ${status} successfully!`);
    } catch (error) {
      toast.error('Failed to update ticket status.');
    }
  };

  return (
    <div className="space-y-4 font-sans text-[var(--color-text-main)] pb-8 ">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel border border-[var(--color-border-subtle)] p-4 rounded-[10px] shadow-sm  ">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--color-text-main)] flex items-center gap-2 font-heading">
            <LifeBuoy className="w-5 h-5 text-[var(--color-warning)]" /> FIELD SERVICE TICKET DISPATCH
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] font-body">
            Emergency Service Escalations & SLA Management • {tickets.length} Registered Tickets
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[var(--color-warning)] hover:bg-[#E06C00] text-white font-bold text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm "
        >
          <Plus className="w-4 h-4" /> Dispatch Service Ticket
        </button>
      </div>

      {/* Main Split-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left List */}
        <div className="lg:col-span-5 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] overflow-hidden flex flex-col h-[600px] shadow-sm ">
          <div className="p-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] flex items-center gap-2 ">
            <Search className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket #, customer, issue..."
              className="bg-transparent text-xs text-[var(--color-text-main)] placeholder-slate-500 w-full focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#22252A]/10">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3 cursor-pointer transition ${
                  selectedTicket?.id === t.id
                    ? 'bg-[var(--color-warning)]/10 border-l-4 border-[#FF7A00]'
                    : 'hover:bg-[var(--color-surface-base)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-[var(--color-warning)]">{t.ticketNumber}</div>
                    <div className="text-xs font-bold text-[var(--color-text-main)]">{t.title}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">{t.customerName}</div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      t.priority === 'Emergency'
                        ? 'bg-[var(--color-warning)]/15 text-[var(--color-warning)] animate-pulse border border-[#FF7A00]/20'
                        : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[#246BFD]/20'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[var(--color-text-muted)] mt-2">
                  <span>Eng: {t.assignedEngineerName}</span>
                  <span className="text-[var(--color-primary)] font-bold">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] p-5 space-y-4 shadow-sm ">
          {selectedTicket ? (
            <>
              {/* Title & Status */}
              <div className="flex justify-between items-start border-b border-[var(--color-border-subtle)] pb-4">
                <div>
                  <div className="text-xs text-[var(--color-text-muted)] ">TICKET: {selectedTicket.ticketNumber}</div>
                  <h2 className="text-lg font-black text-[var(--color-text-main)] font-heading">{selectedTicket.title}</h2>
                  <div className="text-xs text-[var(--color-primary)] font-bold">{selectedTicket.customerName}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[#246BFD]/30 text-xs px-2.5 py-1 rounded font-bold ">
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Ticket Key Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs ">
                <div className="bg-[var(--color-surface-base)] p-3 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase">Equipment</span>
                  <div className="font-bold text-[var(--color-warning)] text-[11px] truncate">{selectedTicket.equipmentModel}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">SN: {selectedTicket.serialNumber}</div>
                </div>

                <div className="bg-[var(--color-surface-base)] p-3 rounded-lg border border-[var(--color-border-subtle)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase">Assigned Tech</span>
                  <div className="font-bold text-[var(--color-text-main)] text-[11px] flex items-center gap-1 mt-1">
                    <UserCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {selectedTicket.assignedEngineerName}
                  </div>
                </div>

                <div className="bg-[var(--color-surface-base)] p-3 rounded-lg border border-[var(--color-border-subtle)] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase">SLA Response Status</span>
                  <div className="font-bold text-emerald-500 text-[11px] flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" /> Met (1.2 hrs)
                  </div>
                </div>
              </div>

              {/* Diagnostics */}
              <div className="bg-[var(--color-surface-base)] p-4 rounded-lg border border-[var(--color-border-subtle)] space-y-2 text-xs ">
                <div className="font-bold text-[var(--color-text-main)] uppercase tracking-wider text-[11px] border-b border-[var(--color-border-subtle)] pb-1 flex justify-between">
                  <span>Diagnostics</span>
                  <Zap className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                </div>
                <p className="text-xs text-[var(--color-text-muted)] whitespace-pre-line leading-relaxed pt-1">
                  {selectedTicket.description || 'No diagnosis notes provided.'}
                </p>
              </div>

              {/* Diagnosis & Resolution Notes Input */}
              <div className="space-y-1 text-xs">
                <label className="text-[var(--color-text-muted)] block font-bold ">Engineer Resolution Notes</label>
                <textarea
                  rows={3}
                  value={diagnosisNotes || selectedTicket.description || ''}
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  placeholder="Enter technical diagnostic findings, replaced SCR components or battery replacement notes..."
                  className="modern-input w-full p-2.5 text-xs "
                />
              </div>

              {/* Digital Customer Sign-off */}
              <SignatureCanvas
                label="Customer Sign-off Signature"
                onSaveSignature={(sig) => setSignatureData(sig)}
              />

              {/* Status Update Actions */}
              <div className="flex gap-2 pt-2 border-t border-[var(--color-border-subtle)] mt-4">
                <button
                  onClick={() => handleStatusChange('In Progress')}
                  className="flex-1 btn-primary py-2 rounded text-xs"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleStatusChange('Resolved')}
                  className="flex-1 btn-accent py-2 rounded text-xs"
                >
                  Mark Resolved & Issue Invoice
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-[var(--color-text-muted)]">Select a ticket to manage dispatch</div>
          )}
        </div>
      </div>

      {/* Dispatch Ticket Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Dispatch Service Ticket"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm font-sans">
          <div className="space-y-3">
            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Select Power Asset (Equipment)</label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                className="modern-input w-full p-2.5"
                required
              >
                <option value="" disabled>-- Select Equipment --</option>
                {equipment.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.serialNumber} - {eq.model} ({eq.customerName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Issue Type</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="modern-input w-full p-2.5"
                >
                  <option value="UPS Tripping">UPS Tripping</option>
                  <option value="Battery Backup Failure">Battery Backup Failure</option>
                  <option value="Overheating">Overheating</option>
                  <option value="Noise / Fan Fault">Noise / Fan Fault</option>
                  <option value="Output Voltage Distortion">Output Voltage Distortion</option>
                </select>
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="modern-input w-full p-2.5 text-[var(--color-warning)] font-bold"
                >
                  <option value="Emergency">Emergency (1hr SLA)</option>
                  <option value="High">High (4hr SLA)</option>
                  <option value="Medium">Medium (NBD)</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Assign Engineer (Fleet)</label>
              <select
                value={assignedEngineerId}
                onChange={(e) => setAssignedEngineerId(e.target.value)}
                className="modern-input w-full p-2.5"
              >
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} - {eng.availabilityStatus}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border-subtle)] mt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-accent px-6 py-2 text-sm"
            >
              Dispatch Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
