'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import {
  FileCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Zap,
  BatteryCharging
} from 'lucide-react';
import { SignatureCanvas } from '@/components/shared/SignatureCanvas';

export function AmcView() {
  const { amcContracts, pmVisits, updatePmVisitChecklist } = useCrmStore();
  const [selectedVisit, setSelectedVisit] = useState(pmVisits[0] || null);

  const [mainsChecked, setMainsChecked] = useState(true);
  const [outputChecked, setOutputChecked] = useState(true);
  const [loadPercent, setLoadPercent] = useState(42);
  const [batteryChecked, setBatteryChecked] = useState(true);
  const [fanCleaning, setFanCleaning] = useState(true);
  const [notes, setNotes] = useState('');
  const [signature, setSignature] = useState('');

  const handleCompleteVisit = () => {
    if (!selectedVisit) return;
    updatePmVisitChecklist(
      selectedVisit.id,
      {
        mainsVoltageChecked: mainsChecked,
        outputVoltageChecked: outputChecked,
        upsLoadPercent: loadPercent,
        batteryVoltageLogged: batteryChecked,
        fanCleaningDone: fanCleaning,
        terminalTighteningDone: true
      },
      notes,
      signature
    );
  };

  return (
    <div className="space-y-6 font-sans text-[var(--color-text-main)] pb-12 px-2 animate-fade-in">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-6">
        <div>
          <h1 className="text-xl font-heading font-bold tracking-tight text-white flex items-center gap-3">
            <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20 shadow-[inset_0_0_12px_rgba(59,130,246,0.2)]">
              <FileCheck className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            AMC & Maintenance Engine
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1.5 font-medium">
            Contract Renewals & Scheduled PM Visit Workflows • <span className="text-white font-semibold">{amcContracts.length}</span> Active Contracts
          </p>
        </div>
      </div>

      {/* Contracts Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {amcContracts.map((amc) => (
          <div key={amc.id} className="glass-panel p-5 space-y-4 hover:border-[var(--color-border-strong)] transition-all">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-widest">{amc.contractNumber}</div>
                <h3 className="text-base font-semibold text-white mt-1">{amc.customerName}</h3>
                <div className="text-sm text-[var(--color-text-muted)] mt-0.5">Coverage: <span className="text-[var(--color-text-main)] font-medium">{amc.coverageType}</span></div>
              </div>
              <span
                className={`text-[11px] px-3 py-1 rounded-full font-semibold border ${
                  amc.status === 'Expiring Soon'
                    ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20'
                }`}
              >
                {amc.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-[12px] bg-[var(--color-surface-base)]/50 p-3.5 rounded-xl border border-[var(--color-border-subtle)]">
              <div>
                <span className="text-[var(--color-text-dim)] block mb-0.5">Value</span>
                <span className="font-semibold text-white">₹{amc.totalValue.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[var(--color-text-dim)] block mb-0.5">Visits Done</span>
                <span className="font-semibold text-white">{amc.visitsCompleted} / {amc.totalVisitsScheduled}</span>
              </div>
              <div>
                <span className="text-[var(--color-text-dim)] block mb-0.5">Next Due</span>
                <span className="font-semibold text-[var(--color-primary)]">{amc.nextScheduledVisit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PM Inspection Checklist Execute Box */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-[var(--color-border-subtle)] pb-4">
          <div>
            <div className="text-[11px] text-[var(--color-accent)] font-bold tracking-widest uppercase mb-1">Live PM Visit Execution</div>
            <h2 className="text-lg font-heading font-semibold text-white">
              {selectedVisit?.equipmentModel} <span className="text-[var(--color-text-muted)] text-sm ml-1">(SN: {selectedVisit?.serialNumber})</span>
            </h2>
            <div className="text-sm text-[var(--color-text-muted)] mt-1">{selectedVisit?.customerName}</div>
          </div>
          <span className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs px-3 py-1.5 rounded-full font-semibold">
            {selectedVisit?.status}
          </span>
        </div>

        {/* Step-by-Step Technical Inspection Checklist */}
        <div className="bg-[var(--color-surface-base)]/40 p-5 rounded-xl border border-[var(--color-border-strong)] space-y-5 text-sm shadow-inner">
          <div className="font-semibold text-white border-b border-[var(--color-border-subtle)] pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--color-accent)]" />
              Technical Inspection Checklist
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[var(--color-text-main)]">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${mainsChecked ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border-strong)] group-hover:border-[var(--color-primary)]/50'}`}>
                {mainsChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={mainsChecked} onChange={(e) => setMainsChecked(e.target.checked)} />
              <span className="font-medium">Verify Input 3-Phase Mains (415V ± 2%)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${outputChecked ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border-strong)] group-hover:border-[var(--color-primary)]/50'}`}>
                {outputChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={outputChecked} onChange={(e) => setOutputChecked(e.target.checked)} />
              <span className="font-medium">Verify Output Pure Sine Wave (400V)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${batteryChecked ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border-strong)] group-hover:border-[var(--color-primary)]/50'}`}>
                {batteryChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={batteryChecked} onChange={(e) => setBatteryChecked(e.target.checked)} />
              <span className="font-medium">Log Battery Bank Float & Charge</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${fanCleaning ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border-strong)] group-hover:border-[var(--color-primary)]/50'}`}>
                {fanCleaning && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={fanCleaning} onChange={(e) => setFanCleaning(e.target.checked)} />
              <span className="font-medium">High CFM Fan Dust & Terminal Check</span>
            </label>
          </div>

          <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center gap-3 bg-[var(--color-surface-panel)]/30 -mx-5 -mb-5 p-5 rounded-b-xl">
            <span className="text-[var(--color-text-muted)] font-medium text-xs uppercase tracking-wider">Operating Load:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={loadPercent}
                onChange={(e) => setLoadPercent(Number(e.target.value))}
                className="modern-input w-24 text-center text-[var(--color-primary)] font-bold text-lg py-1.5"
              />
              <span className="text-[var(--color-text-dim)] font-bold text-lg">%</span>
            </div>
          </div>
        </div>

        {/* Digital Signature */}
        <div className="pt-2">
          <SignatureCanvas
            label="Customer PM Completion Authorization"
            onSaveSignature={(sig) => setSignature(sig)}
          />
        </div>

        <button
          onClick={handleCompleteVisit}
          className="w-full btn-accent py-3.5 text-sm rounded-xl uppercase tracking-wider mt-4"
        >
          Submit & Complete PM Visit Report
        </button>
      </div>
    </div>
  );
}
