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
  Battery
} from 'lucide-react';
import { SignatureCanvas } from '@/components/shared/SignatureCanvas';

export function EngineerAppView() {
  const { engineers, tickets, updateTicketStatus } = useCrmStore();
  const currentEngineer = engineers[0]; // Amit Kumar
  const assignedJobs = tickets.filter((t) => t.assignedEngineerId === currentEngineer?.id || true);

  const [checkedIn, setCheckedIn] = useState(false);
  const [activeJob, setActiveJob] = useState(assignedJobs[0] || null);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [sig, setSig] = useState('');

  const handleGpsCheckIn = () => {
    setCheckedIn(true);
  };

  const handleJobComplete = () => {
    if (!activeJob) return;
    updateTicketStatus(activeJob.id, 'Resolved', 'Field repair and battery cell balancing completed on site.', sig);
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

      {/* Today's Job Queue */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase flex items-center justify-between">
          <span>TODAY'S FIELD DISPATCH QUEUE</span>
          <span className="text-amber-400">{assignedJobs.length} Jobs Assigned</span>
        </div>

        <div className="space-y-2">
          {assignedJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setActiveJob(job)}
              className={`p-3 rounded-lg border cursor-pointer transition text-xs space-y-1 ${
                activeJob?.id === job.id
                  ? 'bg-amber-500/10 border-amber-500'
                  : 'bg-slate-950 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-400">{job.ticketNumber}</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold">
                  {job.priority}
                </span>
              </div>
              <div className="font-bold text-slate-100">{job.issueType}</div>
              <div className="text-[11px] text-slate-400">{job.customerName} • {job.siteAddress}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Job Step-by-Step Execution */}
      {activeJob && (
        <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-xl space-y-4">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] text-amber-400 font-bold">JOB EXECUTION MODE</span>
            <h3 className="text-sm font-bold text-slate-100">{activeJob.issueType}</h3>
            <div className="text-xs text-slate-400">{activeJob.customerName}</div>
          </div>

          {/* Action Steps */}
          <div className="space-y-3 text-xs">
            {/* Step 1: Photos */}
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

            {/* Step 2: Customer Signature */}
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
      )}
    </div>
  );
}
