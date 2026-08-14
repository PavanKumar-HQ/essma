'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import {
  Wrench,
  MapPin,
  CheckCircle2,
  Camera,
  Navigation,
  PenTool,
  Clock,
  Zap,
  Battery,
  X
} from 'lucide-react';
import { SignatureCanvas } from '@/components/shared/SignatureCanvas';
import { ServiceTicket } from '@/types';

export function EngineerAppView() {
  const { engineers, tickets, updateTicketStatus } = useCrmStore();
  const currentEngineer = engineers[0]; // Amit Kumar
  const myTickets = tickets.filter(t => t.assignedTo === 'eng-1' && t.status !== 'Resolved');

  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [sig, setSig] = useState('');

  const handleGpsCheckIn = () => {
    setCheckedIn(true);
  };

  const handleJobComplete = () => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, 'Resolved'); // signature and notes would be saved via another endpoint or modified update
    setSelectedTicket(null);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 text-slate-100 pb-12">
      {/* Mobile Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400">
              AK
            </div>
            <div>
              <div className="font-bold text-slate-100 text-sm">{currentEngineer?.name}</div>
              <div className="text-[11px] text-amber-400">Field Service Engineer</div>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
            {currentEngineer?.availabilityStatus}
          </span>
        </div>

        {/* GPS Check-in Card */}
        <div className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center text-xs">
          <div>
            <div className="text-[10px] text-slate-500">Current GPS Location</div>
            <div className="text-slate-200 flex items-center gap-1 font-sans text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
              {currentEngineer?.currentGpsLocation?.address}
            </div>
          </div>
          <button
            onClick={handleGpsCheckIn}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              checkedIn
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
          >
            {checkedIn ? 'Checked In ✓' : 'GPS Check-In'}
          </button>
        </div>
      </div>

      {/* Engineer Metrics */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="glass-panel p-3 rounded-xl border border-blue-500/30 bg-slate-900">
          <div className="text-xs text-blue-300 font-bold mb-1">Today's Visits</div>
          <div className="text-2xl font-bold">{myTickets.length}</div>
        </div>
        <div className="glass-panel p-3 rounded-xl border border-emerald-500/30 bg-slate-900">
          <div className="text-xs text-emerald-300 font-bold mb-1">SLA Met Rate</div>
          <div className="text-2xl font-bold">100%</div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="mt-6 space-y-3">
        <h3 className="font-bold text-sm text-slate-300">My Assigned Tickets</h3>
        {myTickets.length > 0 ? (
          myTickets.map(ticket => (
            <div key={ticket.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-amber-400">{ticket.ticketNumber}</div>
                  <div className="text-sm font-bold">{ticket.title}</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> {ticket.customerName}</div>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">{ticket.priority}</span>
              </div>
              <button 
                onClick={() => setSelectedTicket(ticket)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 py-2 rounded text-xs mt-2 transition"
              >
                Start Diagnosis
              </button>
            </div>
          ))
        ) : (
          <div className="text-center p-6 text-sm text-slate-500 border border-slate-800 rounded-xl border-dashed">
            No assigned tickets for today.
          </div>
        )}
      </div>

      {/* Diagnosis Sheet Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col p-4">
          <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900 rounded-t-xl">
            <h3 className="font-bold text-sm">{selectedTicket.ticketNumber} - {selectedTicket.title}</h3>
            <button onClick={() => setSelectedTicket(null)}><X className="w-5 h-5 text-slate-400"/></button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 bg-slate-900 px-4 rounded-b-xl">
            {/* Action Steps */}
            <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 space-y-4">
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-200">1. Onsite Photo Attachment</div>
                    <div className="text-[10px] text-slate-500">Capture UPS Nameplate & Battery Bank</div>
                  </div>
                  <button
                    onClick={() => setPhotoCaptured(true)}
                    className={`px-3 py-1.5 rounded flex items-center gap-1 font-bold ${
                      photoCaptured ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-amber-400 border border-slate-700'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    {photoCaptured ? 'Captured ✓' : 'Take Photo'}
                  </button>
                </div>

                <SignatureCanvas
                  label="2. Customer Signature Sign-Off"
                  onSaveSignature={(s) => setSig(s)}
                />
              </div>

              <button
                onClick={handleJobComplete}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded text-xs transition"
              >
                Mark Job Completed & Submit Telemetry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
