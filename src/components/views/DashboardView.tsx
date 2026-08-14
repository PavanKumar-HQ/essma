'use client';

import React from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import {
  DollarSign,
  Wrench,
  LifeBuoy,
  FileCheck,
  UserCheck,
  AlertTriangle,
  Boxes,
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import {
  AreaChart,
  Area,
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

const REVENUE_DATA = [
  { month: 'Jan', revenue: 2400000, target: 2000000 },
  { month: 'Feb', revenue: 3100000, target: 2200000 },
  { month: 'Mar', revenue: 2800000, target: 2500000 },
  { month: 'Apr', revenue: 3900000, target: 2800000 },
  { month: 'May', revenue: 4200000, target: 3000000 },
  { month: 'Jun', revenue: 3800000, target: 3200000 },
  { month: 'Jul', revenue: 4900000, target: 3500000 },
  { month: 'Aug', revenue: 5200000, target: 4000000 }
];

const LEAD_FUNNEL_DATA = [
  { stage: 'New Leads', count: 28 },
  { stage: 'Qualified', count: 19 },
  { stage: 'Proposal Sent', count: 12 },
  { stage: 'Negotiation', count: 8 },
  { stage: 'Won Orders', count: 5 }
];

const SERVICE_TRENDS_DATA = [
  { name: 'Preventive Maint', value: 45, color: '#3b82f6' },
  { name: 'Battery Degradation', value: 30, color: '#f59e0b' },
  { name: 'UPS Tripping/Overload', value: 15, color: '#ef4444' },
  { name: 'Fan/Cooling Fault', value: 10, color: '#10b981' }
];

interface DashboardViewProps {
  onNavigate: (tab: any) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const { activeRole, equipment, tickets, amcContracts, inventory, engineers } = useCrmStore();

  const openTickets = tickets.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved');
  const emergencyTickets = tickets.filter((t) => t.priority === 'Emergency' && t.status !== 'Closed');
  const lowStockItems = inventory.filter((i) => i.quantityInStock <= i.minimumThreshold);
  const expiringAmcs = amcContracts.filter((a) => a.status === 'Expiring Soon');

  return (
    <div className="space-y-6 font-sans text-[var(--color-text-main)] pb-12 px-2 animate-fade-in">
      {/* Top Banner & Operational Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold tracking-tight text-white font-heading">ESSMA OPERATIONS COMMAND</h1>
            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              ROLE: {activeRole}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-2 font-medium">
            Real-time telemetry across <span className="text-white font-semibold">{equipment.length}</span> Mission-Critical Power Assets & Service Fleets.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('tickets')}
            className="btn-accent text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition"
          >
            <LifeBuoy className="w-4 h-4" /> Service Dispatch ({openTickets.length})
          </button>
          <button
            onClick={() => onNavigate('equipment')}
            className="bg-[var(--color-surface-panel)] hover:bg-[var(--color-surface-panel-hover)] border border-[var(--color-border-strong)] text-white text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm"
          >
            <Zap className="w-4 h-4 text-[var(--color-warning)]" /> Assets Fleet
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 ">
        <div className="glass-panel p-4 space-y-2 hover:border-[var(--color-border-strong)] transition-all">
          <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest flex justify-between font-bold">
            <span>Daily Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          </div>
          <div className="text-xl font-bold text-white">₹4,41,670</div>
          <div className="text-[10px] text-[var(--color-accent)] flex items-center gap-1 font-sans font-medium">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs last week
          </div>
        </div>

        <div
          onClick={() => onNavigate('tickets')}
          className="glass-panel p-4 space-y-2 cursor-pointer hover:border-[var(--color-warning)] transition-all group"
        >
          <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest flex justify-between font-bold">
            <span>Emergency Tickets</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-warning)] animate-pulse" />
          </div>
          <div className="text-xl font-bold text-[var(--color-warning)] group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all">{emergencyTickets.length} Active</div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-sans">Response SLA: &lt; 2 hrs</div>
        </div>

        <div
          onClick={() => onNavigate('amc')}
          className="glass-panel p-4 space-y-2 cursor-pointer hover:border-[var(--color-primary)] transition-all group"
        >
          <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest flex justify-between font-bold">
            <span>AMC Expiring</span>
            <FileCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          </div>
          <div className="text-xl font-bold text-[var(--color-primary)] group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all">{expiringAmcs.length} Contracts</div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-sans">Requires Renewal</div>
        </div>

        <div
          onClick={() => onNavigate('engineers')}
          className="glass-panel p-4 space-y-2 cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest flex justify-between font-bold">
            <span>Engineers Fleet</span>
            <UserCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          </div>
          <div className="text-xl font-bold text-white">{engineers.length} On Duty</div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-sans">Avg SLA: 98.4%</div>
        </div>

        <div
          onClick={() => onNavigate('inventory')}
          className="glass-panel p-4 space-y-2 cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest flex justify-between font-bold">
            <span>Low Stock Alerts</span>
            <Boxes className="w-3.5 h-3.5 text-[var(--color-warning)]" />
          </div>
          <div className="text-xl font-bold text-[var(--color-warning)]">{lowStockItems.length} Items</div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-sans">Re-order required</div>
        </div>

        <div
          onClick={() => onNavigate('equipment')}
          className="glass-panel p-4 space-y-2 cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest flex justify-between font-bold">
            <span>UPS Health Score</span>
            <Activity className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          </div>
          <div className="text-xl font-bold text-[var(--color-accent)]">95.2% Avg</div>
          <div className="text-[10px] text-[var(--color-text-muted)] font-sans">Telemetry Active</div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Revenue vs Target */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-5">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-white uppercase flex items-center gap-2 font-heading tracking-wide">
              <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" /> Financial Performance (Revenue vs Target)
            </span>
            <span className="text-[11px] text-[var(--color-text-dim)] font-medium tracking-widest">FY 2026 (In ₹)</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#6b7280" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(22, 25, 32, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#3b82f6' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sales Funnel */}
        <div className="glass-panel p-6 space-y-5">
          <div className="text-sm font-bold text-white uppercase flex items-center gap-2 font-heading tracking-wide">
            <Zap className="w-4 h-4 text-[var(--color-warning)]" /> Sales Funnel Conversion
          </div>
          <div className="h-64 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={LEAD_FUNNEL_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis dataKey="stage" type="category" stroke="#9ca3af" fontSize={11} width={100} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(22, 25, 32, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '8px', fontSize: '12px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Action Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Open Emergency Service Tickets */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-white uppercase flex items-center gap-2 font-heading tracking-wide">
              <ShieldAlert className="w-4 h-4 text-[var(--color-warning)]" /> Live Emergency Dispatch Feed
            </span>
            <button onClick={() => onNavigate('tickets')} className="text-[var(--color-primary)] hover:text-white transition-colors text-[11px] font-bold tracking-widest uppercase bg-[var(--color-primary)]/10 px-2 py-1 rounded">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {tickets.slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => onNavigate('tickets')}
                className="bg-white/5 border border-[var(--color-border-subtle)] p-4 rounded-xl hover:border-[var(--color-warning)] cursor-pointer transition-all text-xs space-y-2 group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white group-hover:text-[var(--color-warning)] transition-colors">{t.ticketNumber} <span className="text-[var(--color-text-dim)] mx-1">|</span> {t.issueType}</span>
                  <span className="bg-[var(--color-warning)]/15 text-[var(--color-warning)] text-[10px] px-2 py-0.5 rounded-full font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]">
                    {t.priority}
                  </span>
                </div>
                <div className="text-[var(--color-text-muted)] text-[11px] font-medium">{t.customerName} • {t.siteAddress}</div>
                <div className="flex justify-between items-center text-[10px] text-[var(--color-text-dim)] pt-2 border-t border-[var(--color-border-subtle)] mt-1">
                  <span>Engineer: <strong className="text-[var(--color-text-main)] ml-1">{t.assignedEngineerName}</strong></span>
                  <span>Status: <strong className="text-[var(--color-primary)] ml-1">{t.status}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Service Type */}
        <div className="glass-panel p-6 space-y-4">
          <div className="text-sm font-bold text-white uppercase flex items-center gap-2 font-heading tracking-wide">
            <Wrench className="w-4 h-4 text-[var(--color-primary)]" /> Maintenance & Failure Analysis
          </div>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SERVICE_TRENDS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="transparent"
                >
                  {SERVICE_TRENDS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(22, 25, 32, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px] px-4">
            {SERVICE_TRENDS_DATA.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                <span className="text-[var(--color-text-muted)] font-medium">{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
