'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBilling } from '../logic/useBilling';
import { BillingReport } from '../../../core/types';

export function ReportsView() {
  const { t } = useTranslation('common');
  const { invoices, generateReport } = useBilling();
  const [reportType, setReportType] = useState<BillingReport['report_type']>('daily_revenue');
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    return {
      start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: now.toISOString().split('T')[0],
    };
  });
  const [generatedReport, setGeneratedReport] = useState<BillingReport | null>(null);

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const handleGenerateReport = () => {
    generateReport.mutate({
      type: reportType,
      startDate: dateRange.start,
      endDate: dateRange.end,
    }, {
      onSuccess: (report) => setGeneratedReport(report),
    });
  };

  const reportOptions = [
    { value: 'daily_revenue', label: t('billing.dailyRevenueReport') },
    { value: 'monthly_revenue', label: t('billing.monthlyRevenueReport') },
    { value: 'outstanding_balances', label: t('billing.outstandingBalancesReport') },
    { value: 'payment_methods', label: t('billing.paymentMethodsReport') },
    { value: 'tax_summary', label: t('billing.taxSummary') },
    { value: 'guest_ledger', label: t('billing.guestLedger') },
  ];

  return (
    <div className="space-y-6">
      {/* Report Generator */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('billing.generateReport')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="form-label">{t('billing.reportType')}</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as BillingReport['report_type'])}
              className="form-input w-full"
            >
              {reportOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">{t('billing.startDate')}</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="form-label">{t('billing.endDate')}</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="form-input w-full"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          className="btn-primary px-6 py-2"
        >
          {t('billing.generate')}
        </button>
      </div>

      {/* Report Display */}
      {generatedReport && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {reportOptions.find(opt => opt.value === generatedReport.report_type)?.label}
              </h2>
               <div className="text-sm text-gray-600">
                 {t('billing.generated')}: {new Date(generatedReport.generated_at).toLocaleString()}
               </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {t('billing.period')}: {new Date(generatedReport.date_range.start).toLocaleDateString()} - {new Date(generatedReport.date_range.end).toLocaleDateString()}
            </div>
          </div>

          <div className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {generatedReport.total_revenue !== undefined && (
                <div className="bg-green-50 p-4 rounded-lg">
                   <div className="text-sm text-green-600">{t('billing.totalRevenueCard')}</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(generatedReport.total_revenue)}
                  </div>
                </div>
              )}

              {generatedReport.total_payments !== undefined && (
                <div className="bg-blue-50 p-4 rounded-lg">
                   <div className="text-sm text-blue-600">{t('billing.totalPaymentsCard')}</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(generatedReport.total_payments)}
                  </div>
                </div>
              )}

              {generatedReport.outstanding_balance !== undefined && (
                <div className="bg-red-50 p-4 rounded-lg">
                   <div className="text-sm text-red-600">{t('billing.outstandingBalanceCard')}</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(generatedReport.outstanding_balance)}
                  </div>
                </div>
              )}
            </div>

            {/* Report Content */}
            <div className="space-y-4">
              {generatedReport.report_type === 'daily_revenue' && (
                <div>
                   <h3 className="text-lg font-semibold mb-4">{t('billing.revenueBreakdown')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left font-semibold text-gray-600">{t('billing.date')}</th>
                          <th className="p-3 text-left font-semibold text-gray-600">{t('billing.invoicesCount')}</th>
                          <th className="p-3 text-left font-semibold text-gray-600">{t('billing.revenue')}</th>
                          <th className="p-3 text-left font-semibold text-gray-600">{t('billing.payments')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Mock daily data - in real app this would be calculated */}
                        <tr className="border-t border-gray-200">
                          <td className="p-3">{new Date().toLocaleDateString()}</td>
                          <td className="p-3">{invoices?.length || 0}</td>
                          <td className="p-3 font-semibold">{formatCurrency(invoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0)}</td>
                          <td className="p-3 text-green-600">{formatCurrency(invoices?.reduce((sum, inv) => sum + inv.paid_amount, 0) || 0)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {generatedReport.report_type === 'outstanding_balances' && (
                <div>
                   <h3 className="text-lg font-semibold mb-4">{t('billing.outstandingBalancesByGuest')}</h3>
                  <div className="space-y-3">
                    {invoices?.filter(inv => inv.balance > 0).map(invoice => (
                      <div key={invoice.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium">{invoice.guest_name}</div>
                          <div className="text-sm text-gray-600">{invoice.invoice_number}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-red-600">{formatCurrency(invoice.balance)}</div>
                           <div className="text-sm text-gray-600">{t('billing.due')}: {new Date(invoice.due_date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {generatedReport.report_type === 'payment_methods' && (
                <div>
                   <h3 className="text-lg font-semibold mb-4">{t('billing.paymentMethodsSummary')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['cash', 'credit_card', 'bank_transfer', 'check'].map(method => {
                      const count = invoices?.reduce((sum, inv) =>
                        sum + inv.payments.filter(p => p.payment_method === method).length, 0
                      ) || 0;
                      const amount = invoices?.reduce((sum, inv) =>
                        sum + inv.payments.filter(p => p.payment_method === method).reduce((s, p) => s + p.amount, 0), 0
                      ) || 0;

                      return (
                        <div key={method} className="p-4 border border-gray-200 rounded-lg">
                          <div className="font-medium capitalize">{method.replace('_', ' ')}</div>
                          <div className="text-2xl font-bold text-blue-600">{count}</div>
                           <div className="text-sm text-gray-600">{t('billing.transactions')}</div>
                          <div className="text-lg font-semibold text-green-600 mt-2">{formatCurrency(amount)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-sm text-gray-600">{t('billing.totalInvoices')}</div>
          <div className="text-3xl font-bold text-blue-600">{invoices?.length || 0}</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-sm text-gray-600">{t('billing.paidInvoices')}</div>
          <div className="text-3xl font-bold text-green-600">
            {invoices?.filter(inv => inv.status === 'paid').length || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-sm text-gray-600">Outstanding</div>
          <div className="text-3xl font-bold text-red-600">
            {formatCurrency(invoices?.reduce((sum, inv) => sum + inv.balance, 0) || 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-sm text-gray-600">{t('billing.avgInvoiceValue')}</div>
          <div className="text-3xl font-bold text-purple-600">
            {formatCurrency((invoices?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0) / (invoices?.length || 1))}
          </div>
        </div>
      </div>
    </div>
  );
}