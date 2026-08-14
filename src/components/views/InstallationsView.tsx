'use client';

import React from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { Wrench, CheckCircle2, Clock, UserCheck, ShieldCheck, MapPin } from 'lucide-react';

export function InstallationsView() {
  const { installations } = useCrmStore();

  const stages = [
    'Site Survey',
    'Quotation',
    'Approved',
    'Installation In Progress',
    'Commissioning',
    'Customer Training',
    'Handover Completed'
  ];

  return (
    <div className="space-y-4 text-slate-100 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div>
          <h1 className="text-lg font-black tracking-wider text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" /> INSTALLATION & COMMISSIONING TRACKER
          </h1>
          <p className="text-xs text-slate-400">
            End-to-End Installation Lifecycle Progression • {installations.length} Active Installations
          </p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="space-y-4">
        {installations.map((inst: any) => (
          <div key={inst.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-bold text-amber-400">{inst.installationNumber}</div>
                <h3 className="text-sm font-black text-slate-100">{inst.equipmentModel}</h3>
                <div className="text-xs text-slate-400">{inst.customerName} • {inst.siteAddress}</div>
              </div>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded font-bold">
                Stage: {inst.stage}
              </span>
            </div>

            {/* Stepper Progression */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 text-[10px]">
              {stages.map((stg, i) => {
                const currentIdx = stages.indexOf(inst.stage);
                const isPassed = i <= currentIdx;
                return (
                  <div
                    key={stg}
                    className={`p-2 rounded border text-center font-bold ${
                      isPassed
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    {i + 1}. {stg}
                  </div>
                );
              })}
            </div>

            {/* Technical Checklist */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-300 uppercase text-[10px] border-b border-slate-800 pb-1">
                Commissioning Checklist
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Site Survey Completed
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Input Voltage Verified (415V)
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Earthing Resistance &lt; 1Ω
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Battery Bank DC Wiring
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full Load Test Passed
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
