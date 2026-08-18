'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { QrScannerModal } from '@/components/shared/QrScannerModal';

import { DashboardView } from '@/components/views/DashboardView';
import { EquipmentView } from '@/components/views/EquipmentView';
import { ServiceTicketsView } from '@/components/views/ServiceTicketsView';
import { AmcView } from '@/components/views/AmcView';
import { EngineerAppView } from '@/components/views/EngineerAppView';
import { QuotationsView } from '@/components/views/QuotationsView';
import { CustomersView } from '@/components/views/CustomersView';
import { InventoryView } from '@/components/views/InventoryView';
import { InvoicesView } from '@/components/views/InvoicesView';
import { LeadsView } from '@/components/views/LeadsView';
import { InstallationsView } from '@/components/views/InstallationsView';
import { SuppliersView } from '@/components/views/SuppliersView';
import { ReportsView } from '@/components/views/ReportsView';
import { AuditLogsView } from '@/components/views/AuditLogsView';

import { useCrmStore } from '@/hooks/useCrm';
import { ROLE_ALLOWED_TABS } from '@/components/layout/Sidebar';

export default function Home() {
  const { activeRole } = useCrmStore();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Auto-redirect active tab if switching to a role that doesn't permit the current tab
  React.useEffect(() => {
    const allowed = ROLE_ALLOWED_TABS[activeRole] || ROLE_ALLOWED_TABS['Super Admin'];
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0] || 'dashboard');
    }
  }, [activeRole, activeTab]);

  const handleSelectEntity = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col font-sans selection:bg-[var(--color-primary)] selection:text-white overflow-hidden">
      {/* Top Header */}
      <Header
        onOpenCommandPalette={() => setIsCommandOpen(true)}
        onOpenQrModal={() => setIsQrOpen(true)}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Grouped Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }} 
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 w-full h-full bg-transparent overflow-y-auto p-4 sm:p-6 scrollbar-hide">
          {activeTab === 'dashboard' && <DashboardView onNavigate={(t) => setActiveTab(t)} />}
          {activeTab === 'customers' && <CustomersView />}
          {activeTab === 'leads' && <LeadsView onNavigate={(t) => setActiveTab(t)} />}
          {activeTab === 'quotations' && <QuotationsView />}
          {activeTab === 'orders' && <QuotationsView />}
          {activeTab === 'equipment' && <EquipmentView />}
          {activeTab === 'installations' && <InstallationsView />}
          {activeTab === 'tickets' && <ServiceTicketsView />}
          {activeTab === 'amc' && <AmcView />}
          {activeTab === 'engineers' && <ReportsView />}
          {activeTab === 'engineer-app' && <EngineerAppView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'suppliers' && <SuppliersView />}
          {activeTab === 'invoices' && <InvoicesView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'audit-logs' && <AuditLogsView />}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectEntity={handleSelectEntity}
      />

      <QrScannerModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />
    </div>
  );
}
