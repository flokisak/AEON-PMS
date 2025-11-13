'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBilling } from '../logic/useBilling';
import { useCurrency } from '@/core/hooks/useCurrency';
import { Invoice, InvoiceLineItem, GuestAccount } from '../../../core/types';

interface InvoiceEditorProps {
  invoice: Invoice;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

export function InvoiceEditor({ invoice, onSave, onCancel }: InvoiceEditorProps) {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();
  const { guestAccounts, taxRates, addLineItem, updateLineItem, removeLineItem, invoiceTemplates } = useBilling();
  const [editedInvoice, setEditedInvoice] = useState<Invoice>({ ...invoice });
  const [showAddItem, setShowAddItem] = useState(false);
  const [newLineItem, setNewLineItem] = useState<Partial<InvoiceLineItem>>({
    description: '',
    quantity: 1,
    unit_price: 0,
    category: 'other',
    date: new Date().toISOString().split('T')[0],
  });



  const calculateTotals = (lineItems: InvoiceLineItem[]) => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = lineItems.reduce((sum, item) => sum + (item.tax_amount || 0), 0);
    const total = subtotal + taxAmount - (editedInvoice.discount_amount || 0);
    return { subtotal, taxAmount, total };
  };

  const handleAddLineItem = () => {
    if (newLineItem.description && newLineItem.quantity && newLineItem.unit_price) {
      const total = (newLineItem.quantity || 0) * (newLineItem.unit_price || 0);
      const taxRate = taxRates?.find(tr =>
        tr.applies_to.includes(newLineItem.category || 'other') && tr.is_active
      );
      const taxAmount = taxRate ? total * (taxRate.rate / 100) : 0;

      addLineItem.mutate({
        invoiceId: invoice.id,
        lineItem: {
          ...newLineItem,
          total,
          tax_rate: taxRate?.rate,
          tax_amount: taxAmount,
        } as Omit<InvoiceLineItem, 'id'>,
      });

      setNewLineItem({
        description: '',
        quantity: 1,
        unit_price: 0,
        category: 'other',
        date: new Date().toISOString().split('T')[0],
      });
      setShowAddItem(false);
    }
  };

  const handleUpdateLineItem = (lineItemId: string, updates: Partial<InvoiceLineItem>) => {
    updateLineItem.mutate({
      invoiceId: invoice.id,
      lineItemId,
      updates,
    });
  };

  const handleRemoveLineItem = (lineItemId: string) => {
    if (confirm('Are you sure you want to remove this line item?')) {
      removeLineItem.mutate({
        invoiceId: invoice.id,
        lineItemId,
      });
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = invoiceTemplates?.find(t => t.id === templateId);
    if (template) {
      template.line_items.forEach(lineItem => {
        addLineItem.mutate({
          invoiceId: invoice.id,
          lineItem: {
            ...lineItem,
            date: new Date().toISOString().split('T')[0],
          },
        });
      });
    }
  };

  const totals = calculateTotals(editedInvoice.line_items);

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">{t('billing.editInvoice')} {invoice.invoice_number}</h2>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="btn-secondary px-4"
              >
                       {t('billing.cancel')}
              </button>
              <button
                onClick={() => onSave(editedInvoice)}
                className="btn-primary px-4"
              >
                 {t('billing.saveChanges')}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="form-label">{t('billing.guestAccount')}</label>
              <select
                value={editedInvoice.guest_account_id}
                onChange={(e) => setEditedInvoice(prev => ({ ...prev, guest_account_id: e.target.value }))}
                className="form-input w-full"
              >
                {guestAccounts?.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.guest_name} ({account.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">{t('billing.issueDate')}</label>
              <input
                type="date"
                value={editedInvoice.issue_date}
                onChange={(e) => setEditedInvoice(prev => ({ ...prev, issue_date: e.target.value }))}
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="form-label">{t('billing.dueDate')}</label>
              <input
                type="date"
                value={editedInvoice.due_date}
                onChange={(e) => setEditedInvoice(prev => ({ ...prev, due_date: e.target.value }))}
                className="form-input w-full"
              />
            </div>
          </div>

          {/* Template Application */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-3">{t('billing.applyInvoiceTemplate')}</h3>
            <div className="flex gap-3">
              <select className="form-input flex-1">
                <option value="">{t('billing.selectTemplate')}</option>
                {invoiceTemplates?.filter(t => t.is_active).map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </select>
              <button
                onClick={(e) => handleApplyTemplate((e.target as HTMLElement).previousElementSibling?.querySelector('select')?.value || '')}
                className="btn-primary px-4"
              >
                 {t('billing.apply')}
              </button>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{t('billing.lineItems')}</h3>
              <button
                onClick={() => setShowAddItem(true)}
                className="btn-primary text-sm px-3 py-1"
              >
                 {t('billing.addItem')}
              </button>
            </div>

            <div className="space-y-3">
              {editedInvoice.line_items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="form-label text-sm">{t('billing.description')}</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateLineItem(item.id, { description: e.target.value })}
                        className="form-input w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="form-label text-sm">{t('billing.qty')}</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const qty = +e.target.value;
                          const total = qty * item.unit_price;
                          handleUpdateLineItem(item.id, { quantity: qty, total });
                        }}
                        className="form-input w-full text-sm"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="form-label text-sm">{t('billing.unitPrice')}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => {
                          const price = +e.target.value;
                          const total = item.quantity * price;
                          handleUpdateLineItem(item.id, { unit_price: price, total });
                        }}
                        className="form-input w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="form-label text-sm">{t('billing.total')}</label>
                      <div className="text-lg font-semibold text-green-600">{formatCurrency(item.total)}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRemoveLineItem(item.id)}
                        className="btn-danger text-xs px-2 py-1"
                      >
                         {t('billing.remove')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Line Item Form */}
            {showAddItem && (
              <div className="border border-gray-200 rounded-lg p-4 mt-4 bg-gray-50">
                <h4 className="font-medium mb-3">{t('billing.addNewLineItem')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input
                    type="text"
                    placeholder={t('billing.description')}
                    value={newLineItem.description}
                    onChange={(e) => setNewLineItem(prev => ({ ...prev, description: e.target.value }))}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder={t('billing.quantity')}
                    value={newLineItem.quantity}
                    onChange={(e) => setNewLineItem(prev => ({ ...prev, quantity: +e.target.value }))}
                    className="form-input"
                    min="1"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder={t('billing.unitPrice')}
                    value={newLineItem.unit_price}
                    onChange={(e) => setNewLineItem(prev => ({ ...prev, unit_price: +e.target.value }))}
                    className="form-input"
                  />
                  <select
                    value={newLineItem.category}
                    onChange={(e) => setNewLineItem(prev => ({ ...prev, category: e.target.value as InvoiceLineItem['category'] }))}
                    className="form-input"
                  >
                    <option value="accommodation">{t('billing.accommodation')}</option>
                    <option value="food_beverage">{t('billing.foodBeverage')}</option>
                    <option value="services">{t('billing.services')}</option>
                    <option value="other">{t('billing.other')}</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddLineItem}
                      className="btn-primary flex-1"
                    >
                       {t('billing.add')}
                    </button>
                    <button
                      onClick={() => setShowAddItem(false)}
                      className="btn-secondary flex-1"
                    >
                      {t('billing.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Totals */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="form-label">{t('billing.discountAmount')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={editedInvoice.discount_amount}
                  onChange={(e) => setEditedInvoice(prev => ({ ...prev, discount_amount: +e.target.value }))}
                  className="form-input w-full"
                  min="0"
                />
              </div>

              <div>
                <label className="form-label">{t('billing.notes')}</label>
                <textarea
                  value={editedInvoice.notes}
                  onChange={(e) => setEditedInvoice(prev => ({ ...prev, notes: e.target.value }))}
                  className="form-input w-full"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{t('billing.subtotal')}:</span>
                  <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('billing.tax')}:</span>
                  <span className="font-semibold">{formatCurrency(totals.taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('billing.discount')}:</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(editedInvoice.discount_amount)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2">
                  <span className="font-semibold">{t('billing.total')}:</span>
                  <span className="font-bold text-lg">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}