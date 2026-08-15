'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Target,
  FileText,
  ShoppingBag,
  Zap,
  Wrench,
  LifeBuoy,
  FileCheck,
  UserCheck,
  Boxes,
  Package,
  Truck,
  Receipt,
  CreditCard,
  BarChart3,
  UserCog,
  Shield,
  Settings,
  History
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'customers'
  | 'leads'
  | 'quotations'
  | 'orders'
  | 'equipment'
  | 'installations'
  | 'tickets'
  | 'amc'
  | 'engineers'
  | 'engineer-app'
  | 'inventory'
  | 'suppliers'
  | 'invoices'
  | 'reports'
  | 'audit-logs';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

interface NavGroup {
  groupName: string;
  items: { id: NavTab; label: string; icon: React.ElementType }[];
}

import { useCrmStore } from '@/hooks/useCrm';
import { RoleType } from '@/types';

export const ROLE_ALLOWED_TABS: Record<RoleType, NavTab[]> = {
  'Super Admin': ['dashboard', 'customers', 'leads', 'quotations', 'orders', 'equipment', 'installations', 'tickets', 'amc', 'engineers', 'engineer-app', 'inventory', 'suppliers', 'invoices', 'reports', 'audit-logs'],
  'Admin': ['dashboard', 'customers', 'leads', 'quotations', 'orders', 'equipment', 'installations', 'tickets', 'amc', 'engineers', 'engineer-app', 'inventory', 'suppliers', 'invoices', 'reports', 'audit-logs'],
  'Sales': ['dashboard', 'customers', 'leads', 'quotations', 'orders', 'reports'],
  'Service Manager': ['dashboard', 'customers', 'equipment', 'installations', 'tickets', 'amc', 'engineers', 'engineer-app', 'reports'],
  'Engineer': ['tickets', 'engineer-app', 'equipment', 'installations'],
  'Accounts': ['dashboard', 'customers', 'invoices', 'quotations', 'reports'],
  'Inventory Manager': ['dashboard', 'inventory', 'suppliers', 'equipment']
};

export function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  const { activeRole } = useCrmStore();
  const allowed = ROLE_ALLOWED_TABS[activeRole] || ROLE_ALLOWED_TABS['Super Admin'];

  const groups: NavGroup[] = [
    {
      groupName: 'Operations',
      items: (
        [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'leads', label: 'Leads Pipeline', icon: Target },
          { id: 'quotations', label: 'Quotations', icon: FileText }
        ] as { id: NavTab; label: string; icon: React.ElementType }[]
      ).filter(item => allowed.includes(item.id))
    },
    {
      groupName: 'Field Service',
      items: (
        [
          { id: 'equipment', label: 'Power Assets (UPS)', icon: Zap },
          { id: 'installations', label: 'Installations', icon: Wrench },
          { id: 'tickets', label: 'Service Tickets', icon: LifeBuoy },
          { id: 'amc', label: 'AMC & Maintenance', icon: FileCheck },
          { id: 'engineers', label: 'Engineers Fleet', icon: UserCheck },
          { id: 'engineer-app', label: 'Engineer Mobile View', icon: Wrench }
        ] as { id: NavTab; label: string; icon: React.ElementType }[]
      ).filter(item => allowed.includes(item.id))
    },
    {
      groupName: 'Warehouse',
      items: (
        [
          { id: 'inventory', label: 'Stock & Batteries', icon: Boxes },
          { id: 'suppliers', label: 'Suppliers & POs', icon: Truck }
        ] as { id: NavTab; label: string; icon: React.ElementType }[]
      ).filter(item => allowed.includes(item.id))
    },
    {
      groupName: 'Finance & Analytics',
      items: (
        [
          { id: 'invoices', label: 'GST Invoices', icon: Receipt },
          { id: 'reports', label: 'Analytics & SLA', icon: BarChart3 }
        ] as { id: NavTab; label: string; icon: React.ElementType }[]
      ).filter(item => allowed.includes(item.id))
    },
    {
      groupName: 'Administration',
      items: (
        [
          { id: 'audit-logs', label: 'Audit Logs', icon: History }
        ] as { id: NavTab; label: string; icon: React.ElementType }[]
      ).filter(item => allowed.includes(item.id))
    }
  ].filter(group => group.items.length > 0);

  return (
    <aside className="w-64 h-[calc(100%-2rem)] my-4 ml-4 glass-panel border-[var(--color-border-subtle)] text-[var(--color-text-main)] flex flex-col justify-between shrink-0 select-none overflow-hidden sticky top-4">
      <div className="py-6 px-4 overflow-y-auto flex-1 space-y-8 scrollbar-hide">
        {groups.map((group) => (
          <div key={group.groupName}>
            <div className="px-3 mb-3 text-[11px] uppercase tracking-wider font-semibold text-[var(--color-text-dim)] font-heading">
              {group.groupName}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent text-[var(--color-primary)] shadow-[inset_2px_0_0_0_var(--color-primary)]'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-dim)] group-hover:text-[var(--color-text-muted)]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-[var(--color-border-subtle)] bg-white/5 backdrop-blur-md text-[11px] text-[var(--color-text-muted)] flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)] animate-pulse" />
          <span>System Status</span>
        </span>
        <span className="text-[var(--color-accent)] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10">Online</span>
      </div>
    </aside>
  );
}
