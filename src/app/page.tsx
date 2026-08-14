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

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const handleSelectEntity = (tab: NavTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col font-sans selection:bg-[var(--color-primary)] selection:text-white overflow-hidden">
      {/* Top Header */}
      <Header
        onOpenCommandPalette={() => setIsCommandOpen(true)}
        onOpenQrModal={() => setIsQrOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Grouped Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

        {/* Main Content Workspace */}
        <main className="flex-1 h-full bg-transparent overflow-y-auto p-4 sm:p-6 scrollbar-hide">
          {activeTab === 'dashboard' && <DashboardView onNavigate={(t) => setActiveTab(t)} />}
          {activeTab === 'customers' && <CustomersView />}
          {activeTab === 'leads' && <LeadsView />}
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
