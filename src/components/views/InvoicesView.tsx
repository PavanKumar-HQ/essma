'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { Invoice } from '@/types';
import { Receipt, Plus, Download, Search, CheckCircle2, AlertCircle, DollarSign, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Modal } from '@/components/shared/Modal';

export function InvoicesView() {
  const { invoices, customers, createInvoice } = useCrmStore();
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Invoice State
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [invoiceType, setInvoiceType] = useState<any>('Standard');
  const [items, setItems] = useState([{ description: 'UPS Maintenance Service', quantity: 1, unitPrice: 15000, total: 15000 }]);

  const filtered = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const totalTax = subtotal * 0.18;
  const grandTotal = subtotal + totalTax;

  const handleAddItem = () => {
    setItems([...items, { description: 'Spare Parts', quantity: 1, unitPrice: 5000, total: 5000 }]);
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index] };
    if (field === 'quantity') {
      item.quantity = Number(value);
      item.total = item.quantity * item.unitPrice;
    } else if (field === 'unitPrice') {
      item.unitPrice = Number(value);
      item.total = item.quantity * item.unitPrice;
    } else {
      (item as any)[field] = value;
    }
    newItems[index] = item;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleExportXlsx = () => {
    const sheetData = invoices.map((inv) => ({
      'Invoice Number': inv.invoiceNumber,
      'Type': inv.invoiceType,
      'Customer': inv.customerName,
      'Issue Date': inv.issueDate,
      'Due Date': inv.dueDate,
      'Subtotal': inv.subtotal,
      'Tax Amount': inv.totalTax,
      'Grand Total': inv.grandTotal,
      'Payment Status': inv.paymentStatus
    }));
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'GST Invoices');
    XLSX.writeFile(workbook, 'ESSMA_Invoices.xlsx');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);

    const newInvoice = await createInvoice({
      customerId,
      customerName: cust?.companyName || 'Apex Data Technologies',
      gstin: cust?.gstin || '29AAACA12341Z5',
      invoiceType,
      items,
      subtotal,
      cgstAmount: totalTax / 2,
      sgstAmount: totalTax / 2,
      igstAmount: 0,
      totalTax,
      grandTotal,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().substring(0, 10),
      paymentStatus: 'Pending'
    });
    if (newInvoice) setSelectedInvoice(newInvoice);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-4 font-sans text-[var(--color-text-main)] pb-8 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel border border-[var(--color-border-subtle)] p-4 rounded-[10px] shadow-sm  ">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--color-text-main)] flex items-center gap-2 font-heading">
            <Receipt className="w-5 h-5 text-emerald-500" /> FINANCE & GST INVOICING LEDGER
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] font-body">
            GST CGST/SGST/IGST Invoice Generation & Collection Ledger • {invoices.length} Invoices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportXlsx}
            className="bg-[var(--color-surface-base)] hover:bg-slate-800 text-[var(--color-text-main)] border border-[var(--color-border-subtle)] text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-[var(--color-primary)]" /> Export CSV
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-accent text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm "
          >
            <Plus className="w-4 h-4" /> Generate Invoice
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left List */}
        <div className="lg:col-span-5 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] overflow-hidden flex flex-col h-[600px] shadow-sm ">
          <div className="p-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] flex items-center gap-2 ">
            <Search className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice #, customer..."
              className="bg-transparent text-xs text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] w-full focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#22252A]/10">
            {filtered.map((inv) => (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className={`p-3 cursor-pointer transition ${
                  selectedInvoice?.id === inv.id
                    ? 'bg-[var(--color-warning)]/10 border-l-4 border-[#FF7A00]'
                    : 'hover:bg-[var(--color-surface-base)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-[var(--color-warning)]">{inv.invoiceNumber}</div>
                    <div className="text-xs font-bold text-[var(--color-text-main)]">{inv.customerName}</div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      inv.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[#FF7A00]/20'
                    }`}
                  >
                    {inv.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[var(--color-text-muted)] mt-2">
                  <span>Due: {inv.dueDate}</span>
                  <span className="font-bold text-emerald-500">₹{inv.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] p-5 space-y-4 shadow-sm ">
          {selectedInvoice ? (
            <div className="bg-[var(--color-surface-base)] p-6 rounded-lg border border-[var(--color-border-subtle)] space-y-6 text-[var(--color-text-main)] text-xs ">
              <div className="flex justify-between items-start border-b border-[var(--color-border-subtle)] pb-4">
                <div>
                  <div className="text-base font-black text-emerald-500 font-heading">TAX INVOICE</div>
                  <div className="text-xs text-[var(--color-text-main)] font-bold">{selectedInvoice.customerName}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">GSTIN: {selectedInvoice.gstin}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--color-warning)]">{selectedInvoice.invoiceNumber}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Issue Date: {selectedInvoice.issueDate}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Due Date: {selectedInvoice.dueDate}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-[var(--color-text-muted)] uppercase text-[10px]">Invoice Line Items</div>
                {selectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center glass-panel p-2.5 rounded border border-[var(--color-border-subtle)] text-xs shadow-xs">
                    <div>
                      <div className="font-bold text-[var(--color-text-main)]">{item.description}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="font-bold text-emerald-500">₹{item.total.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-3 rounded border border-[var(--color-border-subtle)] space-y-1 text-right text-xs">
                <div>Subtotal: ₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</div>
                <div>CGST + SGST (18%): ₹{selectedInvoice.totalTax.toLocaleString('en-IN')}</div>
                <div className="text-sm font-black text-emerald-500 border-t border-[var(--color-border-subtle)] pt-1 mt-1">
                  Grand Total: ₹{selectedInvoice.grandTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Select an invoice</div>
          )}
        </div>
      </div>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Generate Tax Invoice"
        width="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm font-sans">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Bill To Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="modern-input w-full p-2.5"
                  required
                >
                  <option value="" disabled>Select Customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Invoice Type</label>
                <select
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className="modern-input w-full p-2.5"
                >
                  <option value="Standard">Standard Invoice</option>
                  <option value="Proforma">Proforma Invoice</option>
                  <option value="AMC">AMC Contract</option>
                </select>
              </div>
            </div>

            {/* Line Items Builder */}
            <div className="mt-4 border border-[var(--color-border-subtle)] rounded-lg overflow-hidden bg-[var(--color-surface-base)]">
              <div className="p-3 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-[var(--color-surface-panel)]">
                <span className="text-xs font-bold uppercase text-[var(--color-text-main)]">Invoice Line Items</span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs bg-[var(--color-primary)] text-white px-2 py-1 rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              <div className="p-3 space-y-3 max-h-[250px] overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start relative pb-3 border-b border-[var(--color-border-subtle)] last:border-0 last:pb-0">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                        placeholder="Item Description"
                        className="modern-input w-full p-2 text-xs"
                        required
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                          className="modern-input w-16 p-2 text-xs"
                          min="1"
                          required
                        />
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                          placeholder="Unit Price"
                          className="modern-input w-full p-2 text-xs"
                          min="0"
                          required
                        />
                        <div className="w-24 p-2 text-xs font-bold text-right self-center text-[var(--color-text-main)]">
                          ₹{item.total.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-red-400 hover:text-red-500 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-panel)] text-right text-xs space-y-1 ">
                <div className="text-[var(--color-text-muted)]">Subtotal: ₹{subtotal.toLocaleString('en-IN')}</div>
                <div className="text-[var(--color-text-muted)]">18% GST: ₹{totalTax.toLocaleString('en-IN')}</div>
                <div className="text-sm font-bold text-emerald-500 pt-1">
                  Grand Total: ₹{grandTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border-subtle)] mt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-accent px-6 py-2 text-sm"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
