'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBilling } from '../logic/useBilling';
import { Invoice } from '../../../core/types';
import { InvoiceDetailView } from './InvoiceDetailView';
import { InvoiceEditor } from './InvoiceEditor';
import { GuestAccountsView } from './GuestAccountsView';
import { PaymentProcessingView } from './PaymentProcessingView';
import { ReportsView } from './ReportsView';
import { useCurrency } from '@/core/hooks/useCurrency';

type ViewType = 'invoices' | 'guest-accounts' | 'payments' | 'reports';

export function BillingPage() {
  const { t } = useTranslation('common');
  const { invoices, guestAccounts, isLoading, updateInvoice } = useBilling();
  const { formatCurrency, convertFromBase } = useCurrency();
  const [currentView, setCurrentView] = useState<ViewType>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = () => {
      // Force re-render to update all displayed amounts
      window.location.reload();
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-emerald-50 text-emerald-700';
      case 'unpaid': return 'bg-amber-50 text-amber-700';
      case 'overdue': return 'bg-red-50 text-red-700';
      case 'draft': return 'bg-neutral-100 text-neutral-700';
      case 'sent': return 'bg-cyan-50 text-cyan-700';
      case 'cancelled': return 'bg-neutral-100 text-neutral-600';
      case 'refunded': return 'bg-purple-50 text-purple-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusLabel = (status: Invoice['status']) => {
    return t(`billing.${status}`);
  };

  const handleSaveInvoice = (updatedInvoice: Invoice) => {
    updateInvoice.mutate({
      id: updatedInvoice.id,
      data: updatedInvoice
    });
    setEditingInvoice(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">{t('billing.loading')}</p>
      </div>
    );
  }

  if (selectedInvoice) {
    return (
      <InvoiceDetailView
        invoice={selectedInvoice}
        onBack={() => setSelectedInvoice(null)}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">{t('billing.title')} & Financial Management</h1>
            <p className="text-neutral-dark">Comprehensive billing system for hospitality operations</p>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-600">
                {formatCurrency(invoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0)}
              </div>
               <div className="text-neutral-dark">{t('billing.totalRevenue')}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">
                {formatCurrency(invoices?.reduce((sum, inv) => sum + inv.paid_amount, 0) || 0)}
              </div>
               <div className="text-neutral-dark">{t('billing.totalPaid')}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(invoices?.reduce((sum, inv) => sum + inv.balance, 0) || 0)}
              </div>
               <div className="text-neutral-dark">{t('billing.outstanding')}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-neutral-light rounded-lg p-1 border border-neutral-medium">
          {[
            { id: 'invoices', label: t('billing.invoices'), count: invoices?.length || 0 },
            { id: 'guest-accounts', label: t('billing.guestAccounts'), count: guestAccounts?.length || 0 },
            { id: 'payments', label: t('billing.payments') },
            { id: 'reports', label: t('billing.reports') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as ViewType)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === tab.id
                  ? 'bg-white text-primary shadow-sm border border-neutral-medium'
                  : 'text-neutral-dark hover:text-primary'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Views */}
      {currentView === 'invoices' && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-medium">
          <div className="p-6 border-b border-neutral-medium">
            <div className="flex justify-between items-center">
               <h2 className="text-lg font-semibold text-foreground">{t('billing.invoices')}</h2>
              <div className="flex gap-3">
                 <select className="border border-neutral-medium rounded-lg px-3 py-2 text-sm bg-white">
                  <option>{t('billing.allStatus')}</option>
                  <option>{t('billing.paid')}</option>
                  <option>{t('billing.unpaid')}</option>
                  <option>{t('billing.overdue')}</option>
                  <option>{t('billing.draft')}</option>
                </select>
                 <button className="btn-primary px-4 py-2 text-sm">
                  {t('billing.newInvoice')}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="p-4 text-left font-semibold text-foreground">{t('billing.invoiceNumber')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('billing.guest')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('billing.issueDate')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('billing.dueDate')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('billing.amount')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('billing.paid')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('billing.balance')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('billing.status')}</th>
                  <th className="p-4 text-left font-semibold text-foreground">{t('billing.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {invoices?.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                    <td className="p-4 font-medium text-primary">{invoice.invoice_number}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-foreground">{invoice.guest_name}</div>
                        {invoice.guest_email && (
                          <div className="text-sm text-neutral-dark">{invoice.guest_email}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-neutral-dark">{new Date(invoice.issue_date).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-neutral-dark">{new Date(invoice.due_date).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold text-foreground">{formatCurrency(invoice.total_amount)}</td>
                    <td className="p-4 text-emerald-600">{formatCurrency(invoice.paid_amount)}</td>
                    <td className="p-4 font-semibold text-red-600">{formatCurrency(invoice.balance)}</td>
                    <td className="p-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                         {getStatusLabel(invoice.status)}
                       </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                         <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          {t('billing.view')}
                        </button>
                        <button
                          onClick={() => setEditingInvoice(invoice)}
                          className="text-neutral-dark hover:text-primary text-sm font-medium"
                        >
                          {t('billing.edit')}
                        </button>
                        {invoice.balance > 0 && (
                          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            {t('billing.pay')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {invoices?.length === 0 && (
            <div className="text-center py-12">
               <p className="text-neutral-dark mb-4">{t('billing.noInvoices')}</p>
               <button className="btn-primary px-4 py-2 text-sm">
                 {t('billing.createFirstInvoice')}
               </button>
            </div>
          )}
        </div>
      )}

      {currentView === 'guest-accounts' && <GuestAccountsView />}
      {currentView === 'payments' && <PaymentProcessingView />}
      {currentView === 'reports' && <ReportsView />}

      {editingInvoice && (
        <InvoiceEditor
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
          onCancel={() => setEditingInvoice(null)}
        />
      )}
    </div>
  );
}