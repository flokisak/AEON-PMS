'use client';

import { useTranslation } from 'react-i18next';
import { useBilling } from '../logic/useBilling';
import { GuestAccount } from '../../../core/types';

export function GuestAccountsView() {
  const { t } = useTranslation('common');
  const { guestAccounts, isLoading } = useBilling();

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{t('billing.guestAccountsTitle')}</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {t('billing.newGuestAccount')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-600">{t('billing.accountId')}</th>
              <th className="p-4 text-left font-semibold text-gray-600">{t('billing.guestName')}</th>
              <th className="p-4 text-left font-semibold text-gray-600">{t('billing.contact')}</th>
              <th className="p-4 text-left font-semibold text-gray-600">{t('billing.currentBalance')}</th>
              <th className="p-4 text-left font-semibold text-gray-600">{t('billing.totalCharged')}</th>
              <th className="p-4 text-left font-semibold text-gray-600">{t('billing.totalPaid')}</th>
              <th className="p-4 text-left font-semibold text-gray-600">{t('billing.status')}</th>
              <th className="p-4 text-left font-semibold text-gray-600">{t('billing.lastActivity')}</th>
              <th className="p-4 text-left font-semibold text-gray-600">{t('billing.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {guestAccounts?.map((account) => (
              <tr key={account.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-medium text-blue-600">{account.id}</td>
                <td className="p-4 font-medium">{account.guest_name}</td>
                <td className="p-4">
                  <div className="text-sm">
                    {account.email && <div>{account.email}</div>}
                    {account.phone && <div className="text-gray-600">{account.phone}</div>}
                  </div>
                </td>
                <td className={`p-4 font-semibold ${account.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(account.current_balance)}
                </td>
                <td className="p-4">{formatCurrency(account.total_charged)}</td>
                <td className="p-4 text-green-600">{formatCurrency(account.total_paid)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.status === 'active' ? 'bg-green-100 text-green-800' :
                    account.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {account.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-sm">{new Date(account.last_activity).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                     <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                       {t('billing.viewDetails')}
                     </button>
                     <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                       {t('billing.statement')}
                     </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {guestAccounts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('billing.noGuestAccounts')}</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {t('billing.createFirstAccount')}
          </button>
        </div>
      )}
    </div>
  );
}