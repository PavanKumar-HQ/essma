'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { RoleType } from '@/types';
import {
  Search,
  Bell,
  Shield,
  UserCheck,
  AlertTriangle,
  QrCode,
  Zap,
  ChevronDown,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenQrModal: () => void;
  onToggleSidebar?: () => void;
}

const ROLES: RoleType[] = [
  'Super Admin',
  'Admin',
  'Sales',
  'Service Manager',
  'Engineer',
  'Accounts',
  'Inventory Manager'
];

export function Header({ onOpenCommandPalette, onOpenQrModal, onToggleSidebar }: HeaderProps) {
  const { activeRole, setActiveRole, notifications, markNotificationAsRead } = useCrmStore();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 glass-panel border-b-0 rounded-none rounded-b-xl border-[var(--color-border-subtle)] text-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 mx-2 sm:mx-4 mt-2">
      {/* Left: ESSMA Brand & Search Bar */}
      <div className="flex items-center space-x-3 sm:space-x-6">
        <button onClick={onToggleSidebar} className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center font-bold text-white shadow-lg shadow-[var(--color-primary-glow)] transition-transform duration-300 group-hover:scale-105">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
          </div>
          <div>
            <div className="font-heading font-extrabold text-xs sm:text-sm tracking-wide text-white flex items-center gap-2">
              ESSMA OS 
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-mono font-medium">v4.2 PRO</span>
            </div>
            <div className="text-[10px] text-[var(--color-text-muted)] font-medium tracking-tight">Enterprise Power Infrastructure</div>
          </div>
        </div>

        {/* Global Command Search Bar */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center space-x-2 modern-input w-72 justify-between group"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
            <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors text-xs font-medium">Search serial, customer...</span>
          </span>
          <kbd className="bg-[var(--color-surface-base)] px-2 py-0.5 rounded text-[10px] text-[var(--color-text-muted)] font-mono border border-[var(--color-border-strong)] shadow-inner">⌘K</kbd>
        </button>
      </div>

      {/* Right Actions: QR Scanner, Notifications, Role Switcher */}
      <div className="flex items-center space-x-4">
        {/* QR Code Scanner Trigger */}
        <button
          onClick={onOpenQrModal}
          className="flex items-center space-x-1.5 btn-primary px-4 py-2 text-xs"
          title="Scan Equipment QR Code"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">QR Lookup</span>
        </button>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="relative p-2 text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 glow-dot" />
            )}
          </button>

          {/* Dropdown Drawer */}
          {showNotifDrawer && (
            <div className="absolute right-0 mt-3 w-80 glass-panel py-2 z-50 text-xs text-white animate-fade-in origin-top-right">
              <div className="px-4 py-3 border-b border-[var(--color-border-strong)] font-semibold flex justify-between items-center text-[var(--color-text-main)]">
                <span>Notifications</span>
                <span className="text-[10px] bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/30 px-2 py-0.5 rounded-full font-mono">{unreadCount} New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[var(--color-text-dim)]">No active alerts</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-4 cursor-pointer hover:bg-white/5 transition border-b border-[var(--color-border-subtle)] last:border-0 ${
                        !n.read ? 'bg-[var(--color-primary)]/5' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-semibold text-[var(--color-text-main)] flex items-center gap-1.5">
                          {n.severity === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-danger)]" />}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-dim)] font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-[var(--color-text-muted)] text-[11px] mt-1.5 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center space-x-2 modern-input py-2 text-xs transition hover:border-[var(--color-border-strong)]"
          >
            <Shield className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="font-medium text-[var(--color-text-main)]">{activeRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-dim)]" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-3 w-56 glass-panel py-2 z-50 text-xs animate-fade-in origin-top-right">
              <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] font-medium">Switch Role</div>
              <div className="space-y-0.5 px-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setActiveRole(r);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all ${
                      activeRole === r 
                        ? 'text-white font-medium bg-white/10' 
                        : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{r}</span>
                    {activeRole === r && <UserCheck className="w-4 h-4 text-[var(--color-accent)]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
