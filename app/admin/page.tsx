// app/admin/page.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModules } from '@/core/hooks/useModules';
import { useCurrency } from '@/core/hooks/useCurrency';

export default function AdminPage() {
  const { t, i18n } = useTranslation('common');
  const { modules, isLoading, updateModuleStatus } = useModules();
  const { currentCurrency, changeCurrency, allCurrencies, formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'modules' | 'property' | 'company' | 'users' | 'employee-access' | 'fees' | 'language'>('modules');

  if (isLoading) return <div>{t('admin.loading')}</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('admin.title')}</h1>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'modules'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.modules')}
        </button>
        <button
          onClick={() => setActiveTab('property')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'property'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.propertySettings')}
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'company'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.companySettings')}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.userManagement')}
        </button>
        <button
          onClick={() => setActiveTab('employee-access')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'employee-access'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.employeeAccess')}
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'fees'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.feesTaxes')}
        </button>
        <button
          onClick={() => setActiveTab('language')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'language'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.language')} & {t('admin.currency')}
        </button>
      </div>

      {activeTab === 'modules' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('admin.moduleAdministration')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.name')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.version')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.status')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {modules?.map((mod) => (
                  <tr key={mod.id} className="border-t border-gray-200">
                    <td className="p-4 font-medium">{mod.name}</td>
                    <td className="p-4">{mod.version}</td>
                    <td className="p-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mod.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`admin.${mod.status}`)}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => updateModuleStatus.mutate({
                          id: mod.id,
                          status: mod.status === 'active' ? 'inactive' : 'active'
                        })}
                         className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          mod.status === 'active'
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {mod.status === 'active' ? t('admin.deactivate') : t('admin.activate')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'property' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('admin.propertySettings')}</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">{t('admin.hotelName')}</label>
                <input type="text" defaultValue="AEON Hotel" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.address')}</label>
                <input type="text" defaultValue="123 Main St, City, State" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.phone')}</label>
                <input type="tel" defaultValue="+1-555-123-4567" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.email')}</label>
                <input type="email" defaultValue="info@aeonhotel.com" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.website')}</label>
                <input type="url" defaultValue="https://aeonhotel.com" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.totalRooms')}</label>
                <input type="number" defaultValue="100" className="form-input w-full" />
              </div>
            </div>
            <button type="submit" className="btn-primary">{t('admin.savePropertySettings')}</button>
          </form>
        </div>
      )}

      {activeTab === 'company' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('admin.companySettings')}</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">{t('admin.companyName')}</label>
                <input type="text" defaultValue="AEON Hospitality Group" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.taxId')}</label>
                <input type="text" defaultValue="12-3456789" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.registrationNumber')}</label>
                <input type="text" defaultValue="REG123456" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.legalAddress')}</label>
                <input type="text" defaultValue="456 Business Ave, City, State" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.contactPhone')}</label>
                <input type="tel" defaultValue="+1-555-987-6543" className="form-input w-full" />
              </div>
              <div>
                <label className="form-label">{t('admin.contactEmail')}</label>
                <input type="email" defaultValue="legal@aeonhospitality.com" className="form-input w-full" />
              </div>
            </div>
            <button type="submit" className="btn-primary">{t('admin.saveCompanySettings')}</button>
          </form>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('admin.userManagement')}</h2>
          <div className="mb-6">
            <button className="btn-primary">{t('admin.addNewUser')}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.name')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.email')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.role')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.status')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                 <tr className="border-t border-gray-200">
                   <td className="p-4 font-medium">John Doe</td>
                   <td className="p-4">john@aeonhotel.com</td>
                   <td className="p-4">{t('admin.admin')}</td>
                   <td className="p-4">
                     <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{t('admin.active')}</span>
                   </td>
                   <td className="p-4">
                     <button className="btn-secondary text-sm px-3 py-1 mr-2">{t('admin.edit')}</button>
                     <button className="btn-danger text-sm px-3 py-1">{t('admin.deactivate')}</button>
                   </td>
                 </tr>
                 <tr className="border-t border-gray-200">
                   <td className="p-4 font-medium">Jane Smith</td>
                   <td className="p-4">jane@aeonhotel.com</td>
                   <td className="p-4">{t('admin.manager')}</td>
                   <td className="p-4">
                     <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{t('admin.active')}</span>
                   </td>
                   <td className="p-4">
                     <button className="btn-secondary text-sm px-3 py-1 mr-2">{t('admin.edit')}</button>
                     <button className="btn-danger text-sm px-3 py-1">{t('admin.deactivate')}</button>
                   </td>
                 </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'employee-access' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('admin.employeeManagementAccess')}</h2>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">{t('admin.moduleAccessControl')}</h3>
              <p className="text-blue-700 text-sm mb-4">
                {t('admin.moduleAccessDescription')}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-600">{t('admin.userRole')}</th>
                    <th className="p-4 text-left font-semibold text-gray-600">{t('admin.viewEmployees')}</th>
                    <th className="p-4 text-left font-semibold text-gray-600">{t('admin.addEditEmployees')}</th>
                    <th className="p-4 text-left font-semibold text-gray-600">{t('admin.deleteEmployees')}</th>
                    <th className="p-4 text-left font-semibold text-gray-600">{t('admin.shiftPlanning')}</th>
                    <th className="p-4 text-left font-semibold text-gray-600">{t('admin.payrollAccess')}</th>
                    <th className="p-4 text-left font-semibold text-gray-600">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                   <tr className="border-t border-gray-200">
                     <td className="p-4 font-medium">{t('admin.admin')}</td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <button className="btn-secondary text-sm px-3 py-1">{t('admin.update')}</button>
                     </td>
                   </tr>
                   <tr className="border-t border-gray-200">
                     <td className="p-4 font-medium">{t('admin.manager')}</td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <button className="btn-secondary text-sm px-3 py-1">{t('admin.update')}</button>
                     </td>
                   </tr>
                   <tr className="border-t border-gray-200">
                     <td className="p-4 font-medium">{t('admin.supervisor')}</td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" defaultChecked className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <button className="btn-secondary text-sm px-3 py-1">{t('admin.update')}</button>
                     </td>
                   </tr>
                   <tr className="border-t border-gray-200">
                     <td className="p-4 font-medium">{t('admin.employee')}</td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <input type="checkbox" className="w-4 h-4" />
                     </td>
                     <td className="p-4">
                       <button className="btn-secondary text-sm px-3 py-1">{t('admin.update')}</button>
                     </td>
                   </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">{t('admin.departmentRestrictions')}</h3>
              <p className="text-yellow-700 text-sm mb-4">
                {t('admin.departmentRestrictionsDescription')}
              </p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 mr-2" />
                  <span className="text-sm">{t('admin.enableDepartmentAccessControl')}</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 mr-2" />
                  <span className="text-sm">{t('admin.allowCrossDepartmentScheduling')}</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 mr-2" />
                  <span className="text-sm">{t('admin.restrictPayrollAccess')}</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="btn-primary">{t('admin.saveAccessSettings')}</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fees' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('admin.feesTaxesConfiguration')}</h2>
          
          {/* Local Accommodation Fee Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">{t('admin.localAccommodationFee')}</h3>
            <p className="text-blue-700 text-sm">
              {t('admin.localAccommodationFeeDescription')}
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  <input type="checkbox" defaultChecked className="w-4 h-4 mr-2" />
                  {t('admin.enableLocalFee')}
                </label>
                <p className="text-sm text-gray-600 mt-1">{t('admin.enableLocalFeeDescription')}</p>
              </div>
              <div>
                <label className="form-label">{t('admin.feeAmountPerNight')}</label>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue="50" min="0" max="1000" step="1" className="form-input flex-1" />
                  <span className="text-gray-600">{t('admin.czKcPerNight')}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{t('admin.typicalRangeNote')}</p>
              </div>
            </div>

            {/* Age-based rules */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">{t('admin.ageBasedRules')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">{t('admin.adultAge')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue="18" min="0" max="30" className="form-input w-20" />
                    <span className="text-gray-600">{t('admin.yearsAndOlder')}</span>
                  </div>
                </div>
                <div>
                  <label className="form-label">{t('admin.childAgeLimit')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue="15" min="0" max="25" className="form-input w-20" />
                    <span className="text-gray-600">{t('admin.yearsAndYounger')}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t('admin.freeForChildren')}</p>
                </div>
                <div>
                  <label className="form-label">{t('admin.youthFee')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue="25" min="0" max="1000" step="1" className="form-input w-20" />
                    <span className="text-gray-600">{t('admin.czKcPerNight')}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{t('admin.forAgesBetween', { adult: 18, child: 15 })}</p>
                </div>
              </div>
            </div>

            {/* Exemptions */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">{t('admin.exemptions')}</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 mr-3" />
                  <div>
                    <span className="font-medium">{t('admin.czechCitizensExempt')}</span>
                    <p className="text-sm text-gray-600">{t('admin.czechCitizensExemptDescription')}</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="w-4 h-4 mr-3" />
                  <div>
                    <span className="font-medium">{t('admin.euCitizensReduced')}</span>
                    <p className="text-sm text-gray-600">{t('admin.euCitizensReducedDescription')}</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 mr-3" />
                  <div>
                    <span className="font-medium">{t('admin.longStayExemption')}</span>
                    <p className="text-sm text-gray-600">{t('admin.longStayExemptionDescription')}</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 mr-3" />
                  <div>
                    <span className="font-medium">{t('admin.businessTravelExemption')}</span>
                    <p className="text-sm text-gray-600">{t('admin.businessTravelExemptionDescription')}</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Reporting Settings */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">{t('admin.reportingSettings')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">{t('admin.reportingFrequency')}</label>
                  <select className="form-input w-full">
                    <option value="monthly">{t('admin.monthly')}</option>
                    <option value="quarterly">{t('admin.quarterly')}</option>
                    <option value="annually">{t('admin.annually')}</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">{t('admin.reportRecipient')}</label>
                  <input type="email" defaultValue="finance@aeonhotel.com" className="form-input w-full" />
                  <p className="text-sm text-gray-600 mt-1">{t('admin.reportRecipientDescription')}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" className="btn-secondary">{t('admin.cancel')}</button>
              <button type="submit" className="btn-primary">{t('admin.saveFeeSettings')}</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'language' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('admin.languageSettings')}</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.selectLanguage')}</label>
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="form-input w-full max-w-xs"
              >
                <option value="cs">Čeština</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.selectCurrency')}</label>
              <select
                value={currentCurrency}
                onChange={(e) => changeCurrency(e.target.value as 'USD' | 'EUR' | 'CZK' | 'GBP')}
                className="form-input w-full max-w-xs"
              >
                {allCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">{t('admin.currentCurrency')}</h3>
              <p className="text-blue-700">
                {formatCurrency(100)} {t('admin.conversionRate')}: 1 USD = {formatCurrency(1, 'USD')}
              </p>
            </div>
            
            <p className="text-sm text-gray-600">
              {t('admin.languageChangeNote')}
            </p>
            <p className="text-sm text-gray-600">
              {t('admin.currencyChangeNote')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}