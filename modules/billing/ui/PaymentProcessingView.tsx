'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBilling } from '../logic/useBilling';
import { Payment, Invoice } from '../../../core/types';

export function PaymentProcessingView() {
  const { t } = useTranslation('common');
  const { invoices, addPayment, transferPayment, splitAccount, voidInvoice } = useBilling();
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    payment_method: 'credit_card' as Payment['payment_method'],
    reference_number: '',
    notes: '',
  });
  const [transferForm, setTransferForm] = useState({
    fromInvoiceId: 0,
    toInvoiceId: 0,
    amount: 0,
    reason: '',
  });
  const [splitForm, setSplitForm] = useState({
    invoiceId: 0,
    reason: '',
    splits: [{ guest_account_id: '', percentage: 50 }, { guest_account_id: '', percentage: 50 }],
  });
  const [activeTab, setActiveTab] = useState<'record' | 'transfer' | 'split' | 'void'>('record');

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const selectedInvoiceData = invoices?.find(inv => inv.id === selectedInvoice);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInvoice) {
      addPayment.mutate({
        invoice_id: selectedInvoice,
        amount: paymentForm.amount,
        payment_method: paymentForm.payment_method,
        payment_date: new Date().toISOString().split('T')[0],
        reference_number: paymentForm.reference_number || undefined,
        notes: paymentForm.notes || undefined,
        processed_by: 'Front Desk',
      });
      setPaymentForm({
        amount: 0,
        payment_method: 'credit_card',
        reference_number: '',
        notes: '',
      });
      setSelectedInvoice(null);
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    transferPayment.mutate({
      fromInvoiceId: transferForm.fromInvoiceId,
      toInvoiceId: transferForm.toInvoiceId,
      amount: transferForm.amount,
      reason: transferForm.reason,
    });
    setTransferForm({
      fromInvoiceId: 0,
      toInvoiceId: 0,
      amount: 0,
      reason: '',
    });
  };

  const handleSplitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    splitAccount.mutate({
      invoiceId: splitForm.invoiceId,
      splits: splitForm.splits.filter(s => s.guest_account_id && s.percentage > 0),
      reason: splitForm.reason,
    });
    setSplitForm({
      invoiceId: 0,
      reason: '',
      splits: [{ guest_account_id: '', percentage: 50 }, { guest_account_id: '', percentage: 50 }],
    });
  };

  const handleVoidInvoice = (invoiceId: number) => {
    const reason = prompt(t('billing.enterVoidReason') + ':');
    if (reason) {
      voidInvoice.mutate({ invoiceId, reason });
    }
  };

  const unpaidInvoices = invoices?.filter(inv => inv.balance > 0) || [];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {[
            { id: 'record', label: t('billing.recordPayment') },
            { id: 'transfer', label: t('billing.transferPayment') },
            { id: 'split', label: t('billing.splitAccount') },
            { id: 'void', label: t('billing.voidInvoice') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Record Payment Tab */}
        {activeTab === 'record' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('billing.recordPayment')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">{t('billing.selectInvoice')}</label>
                  <select
                    value={selectedInvoice || ''}
                    onChange={(e) => {
                      const invoiceId = +e.target.value;
                      setSelectedInvoice(invoiceId);
                      const invoice = invoices?.find(inv => inv.id === invoiceId);
                      if (invoice) {
                        setPaymentForm(prev => ({ ...prev, amount: invoice.balance }));
                      }
                    }}
                    className="form-input w-full"
                  >
                    <option value="">{t('billing.chooseInvoice')}</option>
                    {unpaidInvoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoice_number} - {invoice.guest_name} (Balance: {formatCurrency(invoice.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                     <label className="form-label">{t('billing.amount')}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: +e.target.value }))}
                      className="form-input w-full"
                      max={selectedInvoiceData?.balance || 0}
                      required
                    />
                  </div>

                  <div>
                     <label className="form-label">{t('billing.paymentMethod')}</label>
                    <select
                      value={paymentForm.payment_method}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, payment_method: e.target.value as Payment['payment_method'] }))}
                      className="form-input w-full"
                    >
                      <option value="cash">{t('billing.cash')}</option>
                      <option value="credit_card">{t('billing.creditCard')}</option>
                      <option value="debit_card">{t('billing.debitCard')}</option>
                      <option value="bank_transfer">{t('billing.bankTransfer')}</option>
                      <option value="check">{t('billing.check')}</option>
                      <option value="digital_wallet">{t('billing.digitalWallet')}</option>
                      <option value="other">{t('billing.other')}</option>
                    </select>
                  </div>

                  <div>
                     <label className="form-label">{t('billing.referenceOptional')}</label>
                    <input
                      type="text"
                      value={paymentForm.reference_number}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, reference_number: e.target.value }))}
                      className="form-input w-full"
                      placeholder={t('billing.referencePlaceholder')}
                    />
                  </div>

                  <div>
                     <label className="form-label">{t('billing.notesOptional')}</label>
                    <textarea
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="form-input w-full"
                      rows={3}
                      placeholder={t('billing.notesPlaceholder')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedInvoice || paymentForm.amount <= 0}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                       {t('billing.recordPayment')}
                  </button>
                </form>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('billing.quickActions')}</h3>
              <div className="space-y-3">
                {unpaidInvoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{invoice.guest_name}</div>
                        <div className="text-sm text-gray-600">{invoice.invoice_number}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">{formatCurrency(invoice.balance)}</div>
                         <div className="text-sm text-gray-500">{t('billing.due')}: {new Date(invoice.due_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice.id);
                        setPaymentForm(prev => ({ ...prev, amount: invoice.balance }));
                      }}
                      className="btn-primary text-sm w-full"
                    >
                      {t('billing.recordPayment')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transfer Payment Tab */}
        {activeTab === 'transfer' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('billing.transferBetweenInvoices')}</h3>
            <form onSubmit={handleTransferSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="form-label">{t('billing.fromInvoice')}</label>
                <select
                  value={transferForm.fromInvoiceId}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, fromInvoiceId: +e.target.value }))}
                  className="form-input w-full"
                  required
                >
                  <option value={0}>{t('billing.selectSourceInvoice')}</option>
                  {invoices?.filter(inv => inv.paid_amount > 0).map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number} - {invoice.guest_name} ({t('billing.paid')}: {formatCurrency(invoice.paid_amount)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                 <label className="form-label">{t('billing.toInvoice')}</label>
                <select
                  value={transferForm.toInvoiceId}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, toInvoiceId: +e.target.value }))}
                  className="form-input w-full"
                  required
                >
                  <option value={0}>{t('billing.selectDestinationInvoice')}</option>
                  {invoices?.filter(inv => inv.balance > 0).map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number} - {invoice.guest_name} (Balance: {formatCurrency(invoice.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                 <label className="form-label">{t('billing.amountToTransfer')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, amount: +e.target.value }))}
                  className="form-input w-full"
                  required
                />
              </div>

              <div>
                 <label className="form-label">{t('billing.reason')}</label>
                <input
                  type="text"
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="form-input w-full"
                  placeholder={t('billing.reasonForTransfer')}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="btn-primary w-full">
                   {t('billing.transferPayment')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Split Account Tab */}
        {activeTab === 'split' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('billing.splitAccount')}</h3>
            <form onSubmit={handleSplitSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="form-label">{t('billing.invoiceToSplit')}</label>
                  <select
                    value={splitForm.invoiceId}
                    onChange={(e) => setSplitForm(prev => ({ ...prev, invoiceId: +e.target.value }))}
                    className="form-input w-full"
                    required
                  >
                     <option value={0}>{t('billing.chooseInvoice')}</option>
                    {invoices?.filter(inv => inv.status !== 'cancelled').map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoice_number} - {invoice.guest_name} ({formatCurrency(invoice.total_amount)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                   <label className="form-label">{t('billing.reasonForSplit')}</label>
                  <input
                    type="text"
                    value={splitForm.reason}
                    onChange={(e) => setSplitForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="form-input w-full"
                    placeholder={t('billing.splitPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                 <h4 className="font-medium mb-3">{t('billing.splitConfiguration')}</h4>
                <div className="space-y-3">
                  {splitForm.splits.map((split, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="flex-1">
                         <label className="form-label text-sm">{t('billing.guestAccount')}</label>
                        <input
                          type="text"
                          placeholder={t('billing.guestAccountPlaceholder')}
                          value={split.guest_account_id}
                          onChange={(e) => {
                            const newSplits = [...splitForm.splits];
                            newSplits[index].guest_account_id = e.target.value;
                            setSplitForm(prev => ({ ...prev, splits: newSplits }));
                          }}
                          className="form-input w-full"
                          required
                        />
                      </div>
                      <div className="w-24">
                        <label className="form-label text-sm">%</label>
                        <input
                          type="number"
                          value={split.percentage}
                          onChange={(e) => {
                            const newSplits = [...splitForm.splits];
                            newSplits[index].percentage = +e.target.value;
                            setSplitForm(prev => ({ ...prev, splits: newSplits }));
                          }}
                          className="form-input w-full"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                      {splitForm.splits.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSplits = splitForm.splits.filter((_, i) => i !== index);
                            setSplitForm(prev => ({ ...prev, splits: newSplits }));
                          }}
                          className="btn-danger text-sm px-3 py-2"
                        >
                           {t('billing.remove')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSplitForm(prev => ({
                    ...prev,
                    splits: [...prev.splits, { guest_account_id: '', percentage: 0 }]
                  }))}
                  className="btn-secondary text-sm mt-3"
                >
                   {t('billing.addAnotherSplit')}
                </button>
              </div>

              <button type="submit" className="btn-primary">
                 {t('billing.splitAccount')}
              </button>
            </form>
          </div>
        )}

        {/* Void Invoice Tab */}
        {activeTab === 'void' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('billing.voidInvoice')}</h3>
            <div className="space-y-4">
              {invoices?.filter(inv => inv.status !== 'cancelled').map((invoice) => (
                <div key={invoice.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium">{invoice.guest_name}</div>
                      <div className="text-sm text-gray-600">{invoice.invoice_number}</div>
                      <div className="text-sm text-gray-500">
                        {t('billing.total')}: {formatCurrency(invoice.total_amount)} • {t('billing.paid')}: {formatCurrency(invoice.paid_amount)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleVoidInvoice(invoice.id)}
                      className="btn-danger text-sm"
                    >
                       {t('billing.voidInvoice')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{t('billing.recentPayments')}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                 <th className="p-4 text-left font-semibold text-gray-600">{t('billing.date')}</th>
                 <th className="p-4 text-left font-semibold text-gray-600">{t('billing.invoice')}</th>
                 <th className="p-4 text-left font-semibold text-gray-600">{t('billing.guest')}</th>
                 <th className="p-4 text-left font-semibold text-gray-600">{t('billing.amount')}</th>
                 <th className="p-4 text-left font-semibold text-gray-600">{t('billing.paymentMethod')}</th>
                 <th className="p-4 text-left font-semibold text-gray-600">{t('billing.referenceNumber')}</th>
                 <th className="p-4 text-left font-semibold text-gray-600">{t('billing.processedBy')}</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.flatMap(invoice =>
                invoice.payments.map(payment => ({
                  ...payment,
                  invoice_number: invoice.invoice_number,
                  guest_name: invoice.guest_name
                }))
              ).sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
              .slice(0, 20)
              .map((payment) => (
                <tr key={payment.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-sm">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-blue-600">{payment.invoice_number}</td>
                  <td className="p-4">{payment.guest_name}</td>
                  <td className="p-4 font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                  <td className="p-4 capitalize text-sm">{payment.payment_method.replace('_', ' ')}</td>
                  <td className="p-4 text-sm">{payment.reference_number || '-'}</td>
                  <td className="p-4 text-sm">{payment.processed_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!invoices || invoices.flatMap(inv => inv.payments).length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('billing.noPaymentsRecorded')}</p>
          </div>
        )}
      </div>
    </div>
  );
}