'use client';

import React, { useState } from 'react';
import { useCrmStore } from '@/hooks/useCrm';
import { Quotation, QuotationItem } from '@/types';
import {
  FileText,
  Plus,
  Printer,
  CheckCircle2,
  Send,
  Trash2,
  DollarSign,
  Download,
  X,
  Zap
} from 'lucide-react';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';

export function QuotationsView() {
  const { quotations, customers, createQuotation, updateQuotationStatus } = useCrmStore();
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(quotations[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleConvertToOrder = async () => {
    if (!selectedQuote) return;
    try {
      await updateQuotationStatus(selectedQuote.id, 'Converted to Order');
      toast.success(`Quote ${selectedQuote.quoteNumber} converted to Sales Order!`);
      setSelectedQuote({ ...selectedQuote, status: 'Converted to Order' });
    } catch (e) {
      toast.error('Failed to convert quote to order.');
    }
  };

  // New Quote Builder State
  const [customerId, setCustomerId] = useState(customers[0]?.id || 'cust-101');
  const [discountPercent, setDiscountPercent] = useState(5);
  const [items, setItems] = useState<QuotationItem[]>([
    {
      id: 'qi-new-1',
      description: 'ESSMA PowerMax 100kVA 3-Phase Modular Online UPS',
      category: 'UPS',
      quantity: 1,
      unitPrice: 1450000,
      gstRate: 18,
      totalAmount: 1450000
    }
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxable = subtotal - discountAmount;
  const totalTax = taxable * 0.18;
  const grandTotal = taxable + totalTax;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `qi-${Date.now()}`,
        description: 'ESSMA ProCharge 12V 150Ah Tubular Battery Rack',
        category: 'Battery Bank',
        quantity: 1,
        unitPrice: 380000,
        gstRate: 18,
        totalAmount: 380000
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(
      items.map((i) => {
        if (i.id === id) {
          const updated = { ...i, [field]: value };
          updated.totalAmount = updated.quantity * updated.unitPrice;
          return updated;
        }
        return i;
      })
    );
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);

    const newQuote = await createQuotation({
      version: 1,
      customerId,
      customerName: cust?.companyName || 'Apex Data Technologies',
      gstin: cust?.gstin || '29AAACA12341Z5',
      items,
      subtotal,
      discountPercentage: discountPercent,
      discountAmount,
      cgstAmount: totalTax / 2,
      sgstAmount: totalTax / 2,
      igstAmount: 0,
      totalTax,
      grandTotal,
      termsAndConditions: '1. 50% Advance with PO. 2. Includes 1-Year Onsite Warranty.',
      status: 'Draft',
      createdBy: 'Priya Sundaram',
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10)
    });
    if (newQuote) setSelectedQuote(newQuote);
    setShowCreateModal(false);
  };

  const activeQuotations = quotations.filter(q => q.status !== 'Converted to Order');

  return (
    <div className="space-y-4 font-sans text-[var(--color-text-main)] pb-8 ">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel border border-[var(--color-border-subtle)] p-4 rounded-[10px] shadow-sm  ">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--color-text-main)] flex items-center gap-2 font-heading">
            <FileText className="w-5 h-5 text-[var(--color-warning)]" /> ENTERPRISE QUOTATION BUILDER & GST CALCULATOR
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] font-body">
            Commercial Proposal Generation & 1-Click Order Converter • {activeQuotations.length} Active Quotes
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[var(--color-warning)] hover:bg-[#E06C00] text-white font-bold text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition shadow-sm "
        >
          <Plus className="w-4 h-4" /> Create New Quote
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left List */}
        <div className="lg:col-span-5 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] overflow-hidden flex flex-col h-[600px] shadow-sm ">
          <div className="p-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] text-xs font-bold text-[var(--color-text-main)] ">
            REVENUE PROPOSALS & QUOTES
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#22252A]/10">
            {activeQuotations.map((q) => (
              <div
                key={q.id}
                onClick={() => setSelectedQuote(q)}
                className={`p-3 cursor-pointer transition ${
                  selectedQuote?.id === q.id
                    ? 'bg-[var(--color-warning)]/10 border-l-4 border-[#FF7A00]'
                    : 'hover:bg-[var(--color-surface-base)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold text-[var(--color-warning)]">{q.quoteNumber} (v{q.version})</div>
                    <div className="text-xs font-bold text-[var(--color-text-main)]">{q.customerName}</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">
                    ₹{q.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[var(--color-text-muted)] mt-2">
                  <span>Valid: {q.validUntil}</span>
                  <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-border-subtle)] px-1.5 py-0.5 rounded font-bold">{q.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right PDF Preview Inspector */}
        <div className="lg:col-span-7 glass-panel border border-[var(--color-border-subtle)] rounded-[10px] p-5 space-y-4 shadow-sm ">
          {selectedQuote ? (
            <div className="bg-[var(--color-surface-base)] p-6 rounded-lg border border-[var(--color-border-subtle)] space-y-6 text-[var(--color-text-main)] text-xs ">
              {/* Document Header */}
              <div className="flex justify-between items-start border-b border-[var(--color-border-subtle)] pb-4">
                <div>
                  <div className="text-base font-black text-[var(--color-warning)] tracking-wider font-heading">ESSMA POWER SYSTEMS</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Industrial Commercial Proposal</div>
                  <div className="text-xs text-[var(--color-text-main)] mt-2">To: <strong className="text-[var(--color-text-main)]">{selectedQuote.customerName}</strong></div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">GSTIN: {selectedQuote.gstin}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--color-primary)]">{selectedQuote.quoteNumber}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Date: {selectedQuote.createdAt}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Valid Until: {selectedQuote.validUntil}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="glass-panel border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                    <tr>
                      <th className="py-2 px-2">Item Description</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-2 text-right">Unit Price</th>
                      <th className="py-2 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22252A]/10">
                    {selectedQuote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-2 text-[var(--color-text-main)] font-semibold">{item.description}</td>
                        <td className="py-2.5 px-2 text-center text-[var(--color-text-muted)]">{item.quantity}</td>
                        <td className="py-2.5 px-2 text-right text-[var(--color-text-muted)]">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-2 text-right text-[var(--color-text-main)] font-bold">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Commercial Tax Summary Ledger */}
              <div className="glass-panel p-3 rounded border border-[var(--color-border-subtle)] space-y-1 text-right text-xs">
                <div>Subtotal: <span className="font-bold text-[var(--color-text-main)]">₹{selectedQuote.subtotal.toLocaleString('en-IN')}</span></div>
                <div>Discount ({selectedQuote.discountPercentage}%): <span className="text-[var(--color-warning)]">-₹{selectedQuote.discountAmount.toLocaleString('en-IN')}</span></div>
                <div>GST Tax (18%): <span className="font-bold text-[var(--color-text-muted)]">₹{selectedQuote.totalTax.toLocaleString('en-IN')}</span></div>
                <div className="text-sm font-black text-emerald-500 border-t border-[var(--color-border-subtle)] pt-1.5 mt-1">
                  Grand Total: ₹{selectedQuote.grandTotal.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleConvertToOrder}
                  className="flex-1 bg-[var(--color-warning)] hover:bg-[#E06C00] text-white font-bold py-2 rounded text-xs transition shadow-sm"
                >
                  Convert Proposal → Order
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--color-text-muted)]">Select a quotation to view document</div>
          )}
        </div>
      </div>

      {/* Create Quote Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Quotation"
        width="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm font-sans">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Customer / Lead</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="modern-input w-full p-2.5"
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[var(--color-text-muted)] font-semibold text-xs block mb-1 uppercase tracking-wider">Discount %</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="modern-input w-full p-2.5"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Line Items Builder */}
            <div className="mt-4 border border-[var(--color-border-subtle)] rounded-lg overflow-hidden bg-[var(--color-surface-base)]">
              <div className="p-3 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-[var(--color-surface-panel)]">
                <span className="text-xs font-bold uppercase text-[var(--color-text-main)]">Line Items</span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs bg-[var(--color-primary)] text-white px-2 py-1 rounded flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              <div className="p-3 space-y-3 max-h-[300px] overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-start relative pb-3 border-b border-[var(--color-border-subtle)] last:border-0 last:pb-0">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        placeholder="Item Description"
                        className="modern-input w-full p-2 text-xs"
                        required
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                          className="modern-input w-16 p-2 text-xs"
                          min="1"
                          required
                        />
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                          placeholder="Unit Price"
                          className="modern-input w-full p-2 text-xs"
                          min="0"
                          required
                        />
                        <div className="w-24 p-2 text-xs font-bold text-right self-center text-[var(--color-text-main)]">
                          ₹{item.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-red-400 hover:text-red-500 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-panel)] text-right text-xs space-y-1">
                <div className="text-[var(--color-text-muted)]">Subtotal: ₹{subtotal.toLocaleString('en-IN')}</div>
                <div className="text-[var(--color-warning)]">Discount: -₹{discountAmount.toLocaleString('en-IN')}</div>
                <div className="text-[var(--color-text-muted)]">18% GST: ₹{totalTax.toLocaleString('en-IN')}</div>
                <div className="text-sm font-bold text-emerald-500 pt-1">
                  Grand Total: ₹{grandTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
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
              Generate Quote
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
