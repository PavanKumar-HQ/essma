import { useState, useEffect, useCallback } from 'react';
import { CustomerRepository } from '@/domains/customers/repository';
import { EquipmentRepository } from '@/domains/equipment/repository';
import { ServiceTicketRepository } from '@/domains/service/repository';
import { InventoryRepository } from '@/domains/inventory/repository';
import { FinanceRepository } from '@/domains/finance/repository';
import { AmcRepository } from '@/domains/amc/repository';
import { LeadRepository } from '@/domains/leads/repository';
import { QuotationRepository } from '@/domains/quotations/repository';
import { InstallationRepository } from '@/domains/installations/repository';
import { SupplierRepository } from '@/domains/suppliers/repository';
import { AuditRepository } from '@/domains/audit/repository';
import {
  Customer,
  Equipment,
  ServiceTicket,
  InventoryItem,
  Invoice,
  AmcContract,
  PmVisit,
  Lead,
  Quotation,
  InstallationTask,
  Supplier,
  AuditLog,
  SystemNotification,
  RoleType
} from '@/types';
import { useRealtimeSubscription } from './useRealtime';
import { demoCustomers, demoEquipment, demoTickets, demoLeads, demoQuotations, demoInvoices, demoInventory } from '@/lib/demoData';

// ─── Demo Mode Toggle ─────────────────────────────────────────────────────────
// Set NEXT_PUBLIC_DEMO_MODE=true in .env.local to populate UI with demo data.
// Set to false (or remove) to connect to live Supabase database.
const USE_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export function useCrmStore() {
  const [activeRole, setActiveRole] = useState<RoleType>('Super Admin');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [amcContracts, setAmcContracts] = useState<AmcContract[]>([]);
  const [pmVisits, setPmVisits] = useState<PmVisit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [installations, setInstallations] = useState<InstallationTask[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);

    // Demo mode: load rich display data; mutations still go to Supabase
    if (USE_DEMO) {
      setCustomers(demoCustomers);
      setEquipment(demoEquipment);
      setTickets(demoTickets);
      setLeads(demoLeads);
      setQuotations(demoQuotations);
      setInvoices(demoInvoices);
      setInventory(demoInventory);
      // Still load live Supabase data for AMC, installations, etc.
      const [amcRes, pmRes, instRes, supRes, auditRes, notifRes] = await Promise.all([
        AmcRepository.getContracts(),
        AmcRepository.getPmVisits(),
        InstallationRepository.getAll(),
        SupplierRepository.getAll(),
        AuditRepository.getLogs(),
        AuditRepository.getNotifications()
      ]);
      if (amcRes.success) setAmcContracts(amcRes.data);
      if (pmRes.success) setPmVisits(pmRes.data);
      if (instRes.success) setInstallations(instRes.data);
      if (supRes.success) setSuppliers(supRes.data);
      if (auditRes.success) setAuditLogs(auditRes.data);
      if (notifRes.success) setNotifications(notifRes.data);
      setLoading(false);
      return;
    }

    // Live mode: fetch everything from Supabase
    const [custRes, eqRes, tktRes, invRes, invcRes, amcRes, pmRes, leadRes, qtRes, instRes, supRes, auditRes, notifRes] = await Promise.all([
      CustomerRepository.getAll(),
      EquipmentRepository.getAll(),
      ServiceTicketRepository.getAll(),
      InventoryRepository.getAll(),
      FinanceRepository.getInvoices(),
      AmcRepository.getContracts(),
      AmcRepository.getPmVisits(),
      LeadRepository.getAll(),
      QuotationRepository.getAll(),
      InstallationRepository.getAll(),
      SupplierRepository.getAll(),
      AuditRepository.getLogs(),
      AuditRepository.getNotifications()
    ]);

    if (custRes.success) setCustomers(custRes.data);
    if (eqRes.success) setEquipment(eqRes.data);
    if (tktRes.success) setTickets(tktRes.data);
    if (invRes.success) setInventory(invRes.data);
    if (invcRes.success) setInvoices(invcRes.data);
    if (amcRes.success) setAmcContracts(amcRes.data);
    if (pmRes.success) setPmVisits(pmRes.data);
    if (leadRes.success) setLeads(leadRes.data);
    if (qtRes.success) setQuotations(qtRes.data);
    if (instRes.success) setInstallations(instRes.data);
    if (supRes.success) setSuppliers(supRes.data);
    if (auditRes.success) setAuditLogs(auditRes.data);
    if (notifRes.success) setNotifications(notifRes.data);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ─── Realtime Subscriptions (all key tables) ────────────────────────────────
  useRealtimeSubscription('service_tickets', fetchAllData);
  useRealtimeSubscription('equipment', fetchAllData);
  useRealtimeSubscription('inventory_items', fetchAllData);
  useRealtimeSubscription('invoices', fetchAllData);
  useRealtimeSubscription('customers', fetchAllData);
  useRealtimeSubscription('leads', fetchAllData);
  useRealtimeSubscription('quotations', fetchAllData);

  return {
    activeRole,
    setActiveRole,
    loading,

    // ─── Customers ───────────────────────────────────────────────────────────
    customers,
    createCustomer: async (cust: any): Promise<Customer | null> => {
      const res = await CustomerRepository.create(cust);
      if (res.success) {
        // Optimistic update: prepend to state immediately
        setCustomers((prev) => [res.data, ...prev]);
        return res.data;
      }
      throw res.error;
    },

    // ─── Equipment ───────────────────────────────────────────────────────────
    equipment,
    createEquipment: async (eq: any): Promise<Equipment | null> => {
      const res = await EquipmentRepository.create(eq);
      if (res.success) {
        setEquipment((prev) => [res.data, ...prev]);
        return res.data;
      }
      throw res.error;
    },
    updateEquipmentHealth: () => {},

    // ─── Service Tickets ─────────────────────────────────────────────────────
    tickets,
    createServiceTicket: async (tkt: any): Promise<ServiceTicket | null> => {
      const res = await ServiceTicketRepository.create(tkt);
      if (res.success) {
        setTickets((prev) => [res.data, ...prev]);
        return res.data;
      }
      throw res.error;
    },
    updateTicketStatus: async (id: string, status: any, notes?: string, sig?: string) => {
      // Optimistic update
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status, description: notes || t.description }
            : t
        )
      );
      
      // Only persist if it's a valid UUID
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isValidUUID) {
        const res = await ServiceTicketRepository.updateStatus(id, status);
        if (!res.success) {
          console.error('updateTicketStatus failed:', res.error);
          throw new Error('updateTicketStatus failed');
        }
      }
    },

    // ─── Inventory ───────────────────────────────────────────────────────────
    inventory,
    updateInventoryStock: async (id: string, delta: number) => {
      // Optimistic update for demo items (IDs don't exist in DB)
      setInventory((prev) =>
        prev.map((item) => {
          const newQuantity = Math.max(0, (item.currentStock || 0) + delta);
          return item.id === id ? { ...item, currentStock: newQuantity } : item;
        })
      );
      // Also try persisting if the item has a real UUID
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isValidUUID) {
        const res = await InventoryRepository.updateStock(id, delta);
        if (!res.success) console.error('updateInventoryStock failed:', res.error);
      }
    },
    addInventoryItem: async (item: any): Promise<InventoryItem | null> => {
      const res = await InventoryRepository.create(item);
      if (res.success) {
        setInventory((prev) => [res.data, ...prev]);
        return res.data;
      }
      throw res.error;
    },

    // ─── Finance / Invoices ──────────────────────────────────────────────────
    invoices,
    createInvoice: async (inv: any): Promise<Invoice | null> => {
      const payload = { ...inv, paidAmount: inv.paidAmount ?? 0, balanceDue: inv.grandTotal };
      const res = await FinanceRepository.createInvoice(payload);
      if (res.success) {
        setInvoices((prev) => [res.data, ...prev]);
        return res.data;
      }
      throw res.error;
    },

    // ─── AMC ─────────────────────────────────────────────────────────────────
    amcContracts,
    pmVisits,
    updatePmVisitChecklist: async (id: string, checklist: any, notes?: string, sig?: string) => {
      // Optimistic UI update
      setPmVisits((prev) =>
        prev.map((v) => (v.id === id ? { ...v, checklist, engineerNotes: notes, customerSignature: sig } : v))
      );
      // Persist to Supabase
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isValidUUID) {
        const { serverMutate } = await import('@/lib/supabase/admin');
        const { error } = await serverMutate.update({
          table: 'pm_visits',
          payload: { checklist, engineer_notes: notes, customer_signature: sig, status: 'Completed', completed_at: new Date().toISOString() },
          match: { id }
        });
        if (error) console.error('updatePmVisitChecklist failed:', error);
      }
    },

    // ─── Leads ───────────────────────────────────────────────────────────────
    leads,
    createLead: async (lead: any): Promise<Lead | null> => {
      const res = await LeadRepository.create(lead);
      if (res.success) {
        setLeads((prev) => [res.data, ...prev]);
        return res.data;
      }
      throw res.error;
    },
    convertLeadToQuote: (leadId: string): Quotation | null => {
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return null;
      // Build a draft quotation from lead data and push it via createQuotation
      const draftQuote: Quotation = {
        id: `draft-${Date.now()}`,
        quoteNumber: `ESSMA-QT-DRAFT-${Math.floor(100 + Math.random() * 900)}`,
        version: 1,
        leadId: lead.id,
        customerId: lead.id,
        customerName: lead.companyName,
        gstin: '',
        items: [],
        subtotal: lead.budget || 0,
        discountPercentage: 0,
        discountAmount: 0,
        cgstAmount: (lead.budget || 0) * 0.09,
        sgstAmount: (lead.budget || 0) * 0.09,
        igstAmount: 0,
        totalTax: (lead.budget || 0) * 0.18,
        grandTotal: (lead.budget || 0) * 1.18,
        termsAndConditions: '1. 50% Advance with PO. 2. 1-Year Onsite Warranty.',
        status: 'Draft',
        createdBy: lead.assignedSalespersonName || 'Unassigned',
        createdAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10)
      };
      setQuotations((prev) => [draftQuote, ...prev]);
      return draftQuote;
    },

    // ─── Quotations ──────────────────────────────────────────────────────────
    quotations,
    createQuotation: async (quote: any): Promise<Quotation | null> => {
      const res = await QuotationRepository.create(quote);
      if (res.success) {
        setQuotations((prev) => [res.data, ...prev]);
        return res.data;
      }
      throw res.error;
    },
    updateQuotationStatus: async (id: string, status: Quotation['status']) => {
      // Optimistic update
      setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
      
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isValidUUID) {
        const res = await QuotationRepository.update(id, { status });
        if (!res.success) {
          console.error('updateQuotationStatus failed:', res.error);
          throw new Error('updateQuotationStatus failed');
        }
      }
    },

    // ─── Suppliers ───────────────────────────────────────────────────────────
    installations,
    suppliers,
    createSupplier: async (supplier: any) => {
      const res = await SupplierRepository.create(supplier);
      if (res.success) {
        setSuppliers((prev) => [res.data, ...prev]);
        return res.data;
      }
      throw res.error;
    },
    purchaseOrders: [],
    notifications,
    markNotificationAsRead: (id: string) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    auditLogs,

    // ─── Engineers (static for now, will be fetched from users table) ────────
    engineers: [
      {
        id: 'usr-3',
        name: 'Amit Kumar',
        email: 'amit.eng@essma.in',
        phone: '+91 97123 88990',
        role: 'Engineer',
        availabilityStatus: 'Available',
        rating: 4.9,
        completedJobsCount: 142,
        currentGpsLocation: { lat: 12.9716, lng: 77.5946, address: 'Electronic City Phase 1, Bengaluru' },
        createdAt: '2025-02-01'
      },
      {
        id: 'usr-4',
        name: 'Ravi Prasad',
        email: 'ravi.eng@essma.in',
        phone: '+91 97654 32109',
        role: 'Engineer',
        availabilityStatus: 'On Job',
        rating: 4.7,
        completedJobsCount: 98,
        currentGpsLocation: { lat: 13.0827, lng: 80.2707, address: 'Anna Salai, Chennai' },
        createdAt: '2025-04-01'
      }
    ]
  };
}
