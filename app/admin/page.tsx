// app/admin/page.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModules } from '@/core/hooks/useModules';
import { useCurrency } from '@/core/hooks/useCurrency';
import { useProperties } from '@/core/hooks/useProperties';

export default function AdminPage() {
  const { t, i18n } = useTranslation('common');
  const { modules, isLoading, updateModuleStatus } = useModules();
  const { currentCurrency, changeCurrency, allCurrencies, formatCurrency } = useCurrency();
  const { 
    properties, 
    currentProperty, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    switchProperty 
  } = useProperties();
  const [activeTab, setActiveTab] = useState<'modules' | 'property' | 'properties' | 'company' | 'users' | 'employee-access' | 'language'>('modules');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

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
          onClick={() => setActiveTab('properties')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'properties'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.properties')}
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

      {activeTab === 'properties' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{t('admin.manageProperties')}</h2>
            <button
              onClick={() => setShowPropertyForm(true)}
              className="btn-primary"
            >
              {t('admin.addProperty')}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.propertyName')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.type')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.location')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.rooms')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.currency')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.status')}</th>
                  <th className="p-4 text-left font-semibold text-gray-600">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-500">{property.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize">{property.type.replace('_', ' ')}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{property.city}</div>
                        <div className="text-gray-500">{property.country}</div>
                      </div>
                    </td>
                    <td className="p-4">{property.totalRooms}</td>
                    <td className="p-4">{property.currency}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : property.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`admin.${property.status}`)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingProperty(property);
                            setShowPropertyForm(true);
                          }}
                          className="btn-secondary text-sm px-3 py-1"
                        >
                          {t('admin.edit')}
                        </button>
                        {properties.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(t('admin.confirmDeleteProperty'))) {
                                deleteProperty(property.id);
                              }
                            }}
                            className="btn-danger text-sm px-3 py-1"
                          >
                            {t('admin.delete')}
                          </button>
                        )}
                        {currentProperty?.id !== property.id && (
                          <button
                            onClick={() => switchProperty(property.id)}
                            className="btn-secondary text-sm px-3 py-1 bg-green-500 hover:bg-green-600 text-white"
                          >
                            {t('admin.switchTo')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentProperty && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">{t('admin.currentProperty')}</h3>
              <p className="text-blue-700">
                {t('admin.currentlyManaging')}: <strong>{currentProperty.name}</strong> ({currentProperty.city}, {currentProperty.country})
              </p>
            </div>
          )}
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
                onChange={(e) => changeCurrency(e.target.value as any)}
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

      {/* Property Form Modal */}
      {(showPropertyForm || editingProperty) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProperty ? t('admin.editProperty') : t('admin.addNewProperty')}
                </h3>
                <button
                  onClick={() => {
                    setShowPropertyForm(false);
                    setEditingProperty(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <form 
              className="p-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const propertyData = {
                  name: formData.get('name') as string,
                  type: formData.get('type') as any,
                  address: formData.get('address') as string,
                  city: formData.get('city') as string,
                  country: formData.get('country') as string,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                  website: formData.get('website') as string,
                  totalRooms: parseInt(formData.get('totalRooms') as string),
                  currency: formData.get('currency') as string,
                  timezone: formData.get('timezone') as string,
                  status: formData.get('status') as any
                };

                if (editingProperty) {
                  updateProperty(editingProperty.id, propertyData);
                } else {
                  addProperty(propertyData);
                }

                setShowPropertyForm(false);
                setEditingProperty(null);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">{t('admin.propertyName')}</label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={editingProperty?.name || ''} 
                    className="form-input w-full" 
                    required
                  />
                </div>
                <div>
                  <label className="form-label">{t('admin.type')}</label>
                  <select name="type" defaultValue={editingProperty?.type || 'hotel'} className="form-input w-full" required>
                    <option value="hotel">{t('admin.hotel')}</option>
                    <option value="resort">{t('admin.resort')}</option>
                    <option value="motel">{t('admin.motel')}</option>
                    <option value="hostel">{t('admin.hostel')}</option>
                    <option value="apartment">{t('admin.apartment')}</option>
                    <option value="vacation_rental">{t('admin.vacationRental')}</option>
                    <option value="service">{t('admin.service')}</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">{t('admin.address')}</label>
                  <input 
                    type="text" 
                    name="address"
                    defaultValue={editingProperty?.address || ''} 
                    className="form-input w-full" 
                    required
                  />
                </div>
                <div>
                  <label className="form-label">{t('admin.city')}</label>
                  <input 
                    type="text" 
                    name="city"
                    defaultValue={editingProperty?.city || ''} 
                    className="form-input w-full" 
                    required
                  />
                </div>
                <div>
                  <label className="form-label">{t('admin.country')}</label>
                  <input 
                    type="text" 
                    name="country"
                    defaultValue={editingProperty?.country || ''} 
                    className="form-input w-full" 
                    required
                  />
                </div>
                <div>
                  <label className="form-label">{t('admin.phone')}</label>
                  <input 
                    type="tel" 
                    name="phone"
                    defaultValue={editingProperty?.phone || ''} 
                    className="form-input w-full" 
                    required
                  />
                </div>
                <div>
                  <label className="form-label">{t('admin.email')}</label>
                  <input 
                    type="email" 
                    name="email"
                    defaultValue={editingProperty?.email || ''} 
                    className="form-input w-full" 
                    required
                  />
                </div>
                <div>
                  <label className="form-label">{t('admin.website')}</label>
                  <input 
                    type="url" 
                    name="website"
                    defaultValue={editingProperty?.website || ''} 
                    className="form-input w-full" 
                  />
                </div>
                <div>
                  <label className="form-label">{t('admin.totalRooms')}</label>
                  <input 
                    type="number" 
                    name="totalRooms"
                    defaultValue={editingProperty?.totalRooms || 1} 
                    className="form-input w-full" 
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">{t('admin.currency')}</label>
                  <select name="currency" defaultValue={editingProperty?.currency || 'USD'} className="form-input w-full" required>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CZK">CZK - Czech Koruna</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="CHF">CHF - Swiss Franc</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CNY">CNY - Chinese Yuan</option>
                    <option value="SEK">SEK - Swedish Krona</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">{t('admin.timezone')}</label>
                  <select name="timezone" defaultValue={editingProperty?.timezone || 'UTC'} className="form-input w-full" required>
                    <option value="UTC">UTC</option>
                    <option value="Europe/Prague">Europe/Prague</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="America/Los_Angeles">America/Los_Angeles</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                    <option value="Asia/Shanghai">Asia/Shanghai</option>
                    <option value="Australia/Sydney">Australia/Sydney</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">{t('admin.status')}</label>
                  <select name="status" defaultValue={editingProperty?.status || 'active'} className="form-input w-full" required>
                    <option value="active">{t('admin.active')}</option>
                    <option value="inactive">{t('admin.inactive')}</option>
                    <option value="maintenance">{t('admin.maintenance')}</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPropertyForm(false);
                    setEditingProperty(null);
                  }}
                  className="btn-secondary"
                >
                  {t('admin.cancel')}
                </button>
                <button type="submit" className="btn-primary">
                  {editingProperty ? t('admin.updateProperty') : t('admin.addProperty')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}