'use client';

import React from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { History, Shield, Clock } from 'lucide-react';

export function AuditLogsView() {
  const { auditLogs } = useCrmStore();

  return (
    <div className="space-y-4 text-slate-100 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div>
          <h1 className="text-lg font-black tracking-wider text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" /> SYSTEM AUDIT LOGS & RLS COMPLIANCE
          </h1>
          <p className="text-xs text-slate-400">
            Immutable Audit Trail for every CRUD operation, dispatch event, and financial transaction
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3 text-center">Action</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3">Audit Details</th>
                <th className="py-2.5 px-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 text-slate-400 text-[11px] ">{log.timestamp}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-100">{log.userName}</div>
                    <div className="text-[10px] text-amber-400 font-bold">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-300">{log.entityType} ({log.entityId})</td>
                  <td className="py-3 px-3 text-slate-300 text-[11px]">{log.details}</td>
                  <td className="py-3 px-3 text-right text-slate-500 text-[10px] ">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
