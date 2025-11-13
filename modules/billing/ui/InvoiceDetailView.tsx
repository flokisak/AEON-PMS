'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBilling } from '../logic/useBilling';
import { Invoice, Payment } from '../../../core/types';
import { useCurrency } from '@/core/hooks/useCurrency';

interface InvoiceDetailViewProps {
  invoice: Invoice;
  onBack: () => void;
}

export function InvoiceDetailView({ invoice, onBack }: InvoiceDetailViewProps) {
  const { t } = useTranslation('common');
  const { addPayment } = useBilling();
  const { formatCurrency } = useCurrency();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: invoice.balance,
    payment_method: 'credit_card' as Payment['payment_method'],
    reference_number: '',
    notes: '',
  });

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-600';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'accommodation': return 'bg-blue-100 text-blue-800';
      case 'food_beverage': return 'bg-green-100 text-green-800';
      case 'services': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayment.mutate({
      invoice_id: invoice.id,
      amount: paymentForm.amount,
      payment_method: paymentForm.payment_method,
      payment_date: new Date().toISOString().split('T')[0],
      reference_number: paymentForm.reference_number || undefined,
      notes: paymentForm.notes || undefined,
      processed_by: 'Front Desk',
    });
    setShowPaymentForm(false);
    setPaymentForm({
      amount: invoice.balance,
      payment_method: 'credit_card',
      reference_number: '',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Invoice {invoice.invoice_number}</h1>
              <p className="text-gray-600">{invoice.guest_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {invoice.status.toUpperCase()}
            </span>
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && invoice.status !== 'refunded' && (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Record Payment
              </button>
            )}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">{t('billing.totalAmount')}</div>
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(invoice.total_amount)}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600">Paid Amount</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(invoice.paid_amount)}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-red-600">Balance Due</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(invoice.balance)}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">{t('billing.dueDate')}</div>
            <div className="text-lg font-bold text-blue-600">
              {new Date(invoice.due_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{t('billing.lineItems')}</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {invoice.line_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-800">{item.description}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('billing.quantity')}: {item.quantity} × {formatCurrency(item.unit_price)}
                      {item.reference && ` • ${item.reference}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{formatCurrency(item.total)}</div>
                    {item.tax_amount && item.tax_amount > 0 && (
                      <div className="text-sm text-gray-600">{t('billing.tax')}: {formatCurrency(item.tax_amount)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Invoice Totals */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('billing.subtotal')}:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('billing.tax')}:</span>
                  <span>{formatCurrency(invoice.tax_amount)}</span>
                </div>
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t('billing.discount')}:</span>
                    <span>-{formatCurrency(invoice.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-2">
                  <span>{t('billing.total')}:</span>
                  <span>{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History & Actions */}
        <div className="space-y-6">
          {/* Payment History */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
            </div>
            <div className="p-6">
              {invoice.payments.length > 0 ? (
                <div className="space-y-3">
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-green-600">{formatCurrency(payment.amount)}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {payment.payment_method.replace('_', ' ')}
                        {payment.reference_number && ` • ${payment.reference_number}`}
                      </div>
                      {payment.notes && (
                        <div className="text-sm text-gray-500 mt-1">{payment.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No payments recorded</p>
              )}
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Guest Information</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium">{invoice.guest_name}</div>
              </div>
              {invoice.guest_email && (
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{invoice.guest_email}</div>
                </div>
              )}
              {invoice.guest_phone && (
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="font-medium">{invoice.guest_phone}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-600">{t('billing.issueDate')}</div>
                <div className="font-medium">{new Date(invoice.issue_date).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Record Payment</h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: +e.target.value }))}
                    className="form-input w-full"
                    max={invoice.balance}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Payment Method</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, payment_method: e.target.value as Payment['payment_method'] }))}
                    className="form-input w-full"
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="digital_wallet">Digital Wallet</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Reference Number (optional)</label>
                  <input
                    type="text"
                    value={paymentForm.reference_number}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, reference_number: e.target.value }))}
                    className="form-input w-full"
                    placeholder="Transaction ID, check number, etc."
                  />
                </div>

                <div>
                  <label className="form-label">{t('billing.notesOptional')}</label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="form-input w-full"
                    rows={3}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="btn-secondary px-4"
                  >
                    {t('billing.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-4"
                  >
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}