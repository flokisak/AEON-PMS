'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStayPackages } from '../logic/useStayPackages';
import { useCurrency } from '@/core/hooks/useCurrency';
import { StayPackage, PackageComponent, PackagePricingRule } from '../../../core/types';
import { FiPackage, FiPlus, FiEdit, FiTrash, FiStar, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi';

function PackageCard({ pkg, onEdit, onDelete, onViewDetails }: {
  pkg: StayPackage;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}) {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'romantic': return 'bg-pink-100 text-pink-800';
      case 'family': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      case 'wellness': return 'bg-green-100 text-green-800';
      case 'luxury': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
            <p className="text-gray-600 text-sm">{pkg.code}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onEdit} className="text-blue-600 hover:text-blue-800 p-2">
              <FiEdit size={18} />
            </button>
            <button onClick={onDelete} className="text-red-600 hover:text-red-800 p-2">
              <FiTrash size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(pkg.category)}`}>
            {pkg.category.toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            pkg.status === 'active' ? 'bg-green-100 text-green-800' :
            pkg.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {pkg.status.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-700 text-sm line-clamp-2">{pkg.description}</p>
      </div>

      {/* Stats */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(pkg.base_price)}</div>
            <div className="text-xs text-gray-600">{t('stayPackages.basePrice')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pkg.minimum_stay}</div>
            <div className="text-xs text-gray-600">{t('stayPackages.minStay')}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <FiUsers className="mx-auto mb-1 text-gray-400" size={16} />
            <div className="text-sm font-medium">{pkg.max_guests}</div>
            <div className="text-xs text-gray-500">{t('stayPackages.guests')}</div>
          </div>
          <div className="text-center">
            <FiStar className="mx-auto mb-1 text-gray-400" size={16} />
            <div className="text-sm font-medium">{pkg.average_rating?.toFixed(1) || t('stayPackages.na')}</div>
            <div className="text-xs text-gray-500">{t('stayPackages.rating')}</div>
          </div>
          <div className="text-center">
            <FiCalendar className="mx-auto mb-1 text-gray-400" size={16} />
            <div className="text-sm font-medium">{pkg.total_bookings}</div>
            <div className="text-xs text-gray-500">{t('stayPackages.bookings')}</div>
          </div>
        </div>

        {/* Highlights */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {pkg.highlights.slice(0, 2).map((highlight, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {highlight}
                </span>
              ))}
              {pkg.highlights.length > 2 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  +{pkg.highlights.length - 2} {t('stayPackages.more')}
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onViewDetails}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          {t('stayPackages.viewDetailsAndBook')}
        </button>
      </div>
    </div>
  );
}

function PackageEditor({ pkg, onSave, onCancel }: {
  pkg?: StayPackage;
  onSave: (data: Omit<StayPackage, 'id' | 'created_at' | 'updated_at' | 'total_bookings' | 'total_revenue' | 'review_count'>) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();
  const [formData, setFormData] = useState<Omit<StayPackage, 'id' | 'created_at' | 'updated_at' | 'total_bookings' | 'total_revenue' | 'review_count'>>({
    code: pkg?.code || '',
    name: pkg?.name || '',
    description: pkg?.description || '',
    short_description: pkg?.short_description || '',
    category: pkg?.category || 'other',
    status: pkg?.status || 'draft',
    base_price: pkg?.base_price || 0,
    currency: pkg?.currency || 'USD',
    minimum_stay: pkg?.minimum_stay || 1,
    maximum_stay: pkg?.maximum_stay,
    max_guests: pkg?.max_guests || 1,
    components: pkg?.components || [],
    pricing_rules: pkg?.pricing_rules || [],
    availability_rules: pkg?.availability_rules || [],
    images: pkg?.images || [],
    highlights: pkg?.highlights || [],
    terms_conditions: pkg?.terms_conditions,
    cancellation_policy: pkg?.cancellation_policy,
    created_by: pkg?.created_by,
    valid_from: pkg?.valid_from || new Date().toISOString().split('T')[0],
    valid_to: pkg?.valid_to,
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'components' | 'pricing' | 'availability'>('basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {pkg ? t('stayPackages.editPackage') : t('stayPackages.createPackage')}
            </h2>
            <div className="flex gap-3">
              <button onClick={onCancel} className="btn-secondary px-4">
                {t('common.cancel')}
              </button>
              <button onClick={handleSubmit} className="btn-primary px-4">
                {pkg ? t('stayPackages.updatePackage') : t('stayPackages.createPackage')}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-1">
            {[
              { id: 'basic', label: t('stayPackages.basicInfo') },
              { id: 'components', label: t('stayPackages.components') },
              { id: 'pricing', label: t('stayPackages.pricingRules') },
              { id: 'availability', label: t('stayPackages.availability') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">{t('stayPackages.packageCode')}</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="form-input w-full"
                    placeholder="např., ROMANCE2024"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">{t('stayPackages.category')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as StayPackage['category'] }))}
                    className="form-input w-full"
                  >
                    <option value="romantic">{t('stayPackages.romantic')}</option>
                    <option value="family">{t('stayPackages.family')}</option>
                    <option value="business">{t('stayPackages.business')}</option>
                    <option value="wellness">{t('stayPackages.wellness')}</option>
                    <option value="adventure">{t('stayPackages.adventure')}</option>
                    <option value="luxury">{t('stayPackages.luxury')}</option>
                    <option value="budget">{t('stayPackages.budget')}</option>
                    <option value="seasonal">{t('stayPackages.seasonal')}</option>
                    <option value="other">{t('stayPackages.other')}</option>
                  </select>
                </div>
              </div>

                <div>
                  <label className="form-label">{t('stayPackages.packageName')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">{t('stayPackages.shortDescription')}</label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    className="form-input w-full"
                    placeholder={t('stayPackages.briefDescriptionForListings')}
                  />
                </div>

                <div>
                  <label className="form-label">{t('stayPackages.fullDescription')}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="form-input w-full"
                    rows={4}
                    required
                  />
                </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="form-label">{t('stayPackages.basePrice')}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_price: +e.target.value }))}
                    className="form-input w-full"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">{t('stayPackages.minStay')} ({t('stayPackages.nights')})</label>
                  <input
                    type="number"
                    value={formData.minimum_stay}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_stay: +e.target.value }))}
                    className="form-input w-full"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">{t('stayPackages.maxStay')} ({t('stayPackages.nights')})</label>
                  <input
                    type="number"
                    value={formData.maximum_stay}
                    onChange={(e) => setFormData(prev => ({ ...prev, maximum_stay: e.target.value ? +e.target.value : undefined }))}
                    className="form-input w-full"
                    min="1"
                  />
                </div>

                <div>
                  <label className="form-label">{t('stayPackages.maxGuests')}</label>
                  <input
                    type="number"
                    value={formData.max_guests}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_guests: +e.target.value }))}
                    className="form-input w-full"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">{t('stayPackages.validFrom')}</label>
                  <input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                    className="form-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">{t('stayPackages.validTo')} ({t('common.optional')})</label>
                  <input
                    type="date"
                    value={formData.valid_to}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_to: e.target.value }))}
                    className="form-input w-full"
                  />
                </div>
              </div>

                <div>
                  <label className="form-label">{t('stayPackages.status')}</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as StayPackage['status'] }))}
                    className="form-input w-full"
                  >
                    <option value="draft">{t('stayPackages.draft')}</option>
                    <option value="active">{t('stayPackages.active')}</option>
                    <option value="inactive">{t('stayPackages.inactive')}</option>
                    <option value="archived">{t('common.archived')}</option>
                  </select>
                </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('stayPackages.packageComponents')}</h3>
                <button className="btn-primary text-sm">{t('stayPackages.addComponent')}</button>
              </div>

              {formData.components.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiPackage size={48} className="mx-auto mb-4 opacity-50" />
                  <p>{t('stayPackages.noComponentsAdded')}</p>
                  <p className="text-sm">{t('stayPackages.addRoomsServicesMeals')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.components.map((component, index) => (
                    <div key={component.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{component.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs ${
                              component.is_mandatory ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {component.is_mandatory ? t('stayPackages.required') : t('stayPackages.optional')}
                            </span>
                          </div>
                          {component.description && (
                            <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                          )}
                          <div className="text-sm text-gray-500">
                            {component.quantity}x @ {formatCurrency(component.unit_price)} = {formatCurrency(component.total_price)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">{t('stayPackages.edit')}</button>
                          <button className="text-red-600 hover:text-red-800 text-sm">{t('stayPackages.remove')}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('stayPackages.pricingRulesConfig')}</h3>
                <button className="btn-primary text-sm">{t('stayPackages.addRule')}</button>
              </div>

              {formData.pricing_rules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiDollarSign size={48} className="mx-auto mb-4 opacity-50" />
                  <p>{t('stayPackages.noPricingRules')}</p>
                  <p className="text-sm">{t('stayPackages.addSeasonalDiscounts')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.pricing_rules.map((rule) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-gray-600">
                            {rule.adjustment_type === 'percentage' ? `${rule.adjustment_value}%` :
                              rule.adjustment_type === 'fixed' ? formatCurrency(rule.adjustment_value) :
                              `${rule.adjustment_value}x multiplier`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">{t('stayPackages.edit')}</button>
                          <button className="text-red-600 hover:text-red-800 text-sm">{t('stayPackages.remove')}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('stayPackages.availability')}</h3>
              <div className="text-center py-8 text-gray-500">
                <FiCalendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t('stayPackages.availabilityConfig')}</p>
                <p className="text-sm">{t('stayPackages.setDateRanges')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StayPackagesPage() {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();
  const { stayPackages, isLoading, createPackage, updatePackage, deletePackage } = useStayPackages();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPackage, setEditingPackage] = useState<StayPackage | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'inactive'>('all');

  const handleCreatePackage = () => {
    setEditingPackage(undefined);
    setShowEditor(true);
  };

  const handleEditPackage = (pkg: StayPackage) => {
    setEditingPackage(pkg);
    setShowEditor(true);
  };

  const handleSavePackage = (data: Omit<StayPackage, 'id' | 'created_at' | 'updated_at' | 'total_bookings' | 'total_revenue' | 'review_count'>) => {
    if (editingPackage) {
      updatePackage.mutate({ id: editingPackage.id, data });
    } else {
      createPackage.mutate(data);
    }
    setShowEditor(false);
  };

  const handleDeletePackage = (id: string) => {
    if (confirm(t('stayPackages.confirmDeletePackage'))) {
      deletePackage.mutate(id);
    }
  };

  const filteredPackages = stayPackages?.filter(pkg => {
    switch (filter) {
      case 'active': return pkg.status === 'active';
      case 'draft': return pkg.status === 'draft';
      case 'inactive': return pkg.status === 'inactive';
      default: return true;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('stayPackages.title')}</h1>
            <p className="text-gray-600 mt-1">{t('stayPackages.description')}</p>
          </div>
          <button
            onClick={handleCreatePackage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
          >
            <FiPlus className="mr-2" />
            {t('stayPackages.createPackage')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-sm text-indigo-600">{t('stayPackages.totalPackages')}</div>
            <div className="text-3xl font-bold text-indigo-600">{stayPackages?.length || 0}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600">{t('stayPackages.activePackages')}</div>
            <div className="text-3xl font-bold text-green-600">
              {stayPackages?.filter(p => p.status === 'active').length || 0}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">{t('stayPackages.totalBookings')}</div>
            <div className="text-3xl font-bold text-blue-600">
              {stayPackages?.reduce((sum, p) => sum + p.total_bookings, 0) || 0}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600">{t('stayPackages.totalRevenue')}</div>
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(stayPackages?.reduce((sum, p) => sum + p.total_revenue, 0) || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex gap-4 items-center">
          <span className="font-medium text-gray-700">{t('stayPackages.filter')}</span>
          <div className="flex gap-2">
            {[
              { value: 'all', label: t('stayPackages.allPackages') },
              { value: 'active', label: t('stayPackages.active') },
              { value: 'draft', label: t('stayPackages.draft') },
              { value: 'inactive', label: t('stayPackages.inactive') },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages?.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onEdit={() => handleEditPackage(pkg)}
            onDelete={() => handleDeletePackage(pkg.id)}
            onViewDetails={() => {/* TODO: Implement package details view */}}
          />
        ))}
      </div>

      {filteredPackages?.length === 0 && (
        <div className="text-center py-12">
          <FiPackage size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('stayPackages.noPackagesFound')}</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' ? t('stayPackages.getStartedCreatePackage') : t(`stayPackages.no${filter.charAt(0).toUpperCase() + filter.slice(1)}Packages`)}
          </p>
          <button
            onClick={handleCreatePackage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            {t('stayPackages.createFirstPackage')}
          </button>
        </div>
      )}

      {/* Package Editor Modal */}
      {showEditor && (
        <PackageEditor
          pkg={editingPackage}
          onSave={handleSavePackage}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}