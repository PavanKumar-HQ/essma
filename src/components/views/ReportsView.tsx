'use client';

import React from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { BarChart3, TrendingUp, UserCheck, ShieldAlert, Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const CITY_REVENUE = [
  { city: 'Bengaluru', revenue: 4200000 },
  { city: 'Mumbai', revenue: 3800000 },
  { city: 'Pune', revenue: 2900000 },
  { city: 'Hyderabad', revenue: 2100000 },
  { city: 'Chennai', revenue: 1900000 }
];

const ENGINEER_SLA = [
  { name: 'Amit Kumar', rating: 4.9, jobs: 142, slaPercent: 99.2 },
  { name: 'Rajesh Sharma', rating: 4.8, jobs: 98, slaPercent: 97.8 }
];

export function ReportsView() {
  const { engineers } = useCrmStore();

  return (
    <div className="space-y-6 text-slate-100 pb-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div>
          <h1 className="text-lg font-black tracking-wider text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" /> EXECUTIVE ANALYTICS & SLA PERFORMANCE
          </h1>
          <p className="text-xs text-slate-400">
            City-wise Revenue Breakdown, Service SLA Compliance & Failure Mode Diagnostics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* City Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue Distribution by City
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CITY_REVENUE} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="city" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engineer Productivity */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> Field Engineers SLA & Customer Ratings
          </div>
          <div className="space-y-3 pt-2">
            {ENGINEER_SLA.map((eng) => (
              <div key={eng.name} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-100">{eng.name}</span>
                  <span className="text-amber-400 font-bold">Rating: {eng.rating}★</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>Jobs Completed: <strong className="text-slate-200">{eng.jobs} Jobs</strong></div>
                  <div>SLA Compliance: <strong className="text-emerald-400">{eng.slaPercent}%</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
