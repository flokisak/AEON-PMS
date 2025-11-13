'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAIRevenueManager } from '../logic/useAIRevenueManager';
import { useCurrency } from '@/core/hooks/useCurrency';
import { FiTrendingUp, FiDollarSign, FiCalendar, FiTarget, FiSettings, FiPackage, FiCoffee, FiHome, FiCalendar as FiEvent, FiPlus, FiEdit2, FiSave, FiX } from 'react-icons/fi';

function MetricCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color} border border-neutral-medium`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-dark">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <Icon className="text-2xl text-neutral-dark" />
      </div>
    </div>
  );
}

export function AIRevenueManagerPage() {
  console.log('AIRevenueManagerPage rendered');
  const { t } = useTranslation('common');
  const { 
    revenueData, 
    isLoading, 
    pricingSuggestions, 
    factors, 
    updatePrice,
    roomPricing,
    updateRoomPrice,
    upsellItems,
    updateUpsellPrice,
    minibarItems,
    updateMinibarPrice,
    eventSpaces,
    updateEventSpacePrice,
    otherRevenue,
    updateOtherRevenue
  } = useAIRevenueManager();
  const { formatCurrency } = useCurrency();
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'upsells' | 'minibar' | 'events' | 'other'>('overview');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});

  // Add currency change listener for auto-refresh
  useEffect(() => {
    const handleCurrencyChange = () => {
      window.location.reload();
    };
    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  const totalRevenue = revenueData?.reduce((sum, data) => sum + data.revenue, 0) || 0;
  const avgOccupancy = revenueData?.length ? Math.round(revenueData.reduce((sum, data) => sum + data.occupancy, 0) / revenueData.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">{t('aiRevenueManager.title')}</h1>
        <p className="text-neutral-dark">{t('aiRevenueManager.description')}</p>
      </div>

       {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title={t('aiRevenueManager.totalRevenue')}
          value={formatCurrency(totalRevenue)}
          icon={FiDollarSign}
          color="border-emerald-400"
        />
        <MetricCard
          title={t('aiRevenueManager.averageOccupancy')}
          value={`${avgOccupancy}%`}
          icon={FiTarget}
          color="border-primary"
        />
        <MetricCard
          title={t('aiRevenueManager.localFees')}
          value={formatCurrency(2500)}
          icon={FiDollarSign}
          color="border-blue-400"
        />
        <MetricCard
          title={t('aiRevenueManager.activeSuggestions')}
          value={pricingSuggestions.length}
          icon={FiTrendingUp}
          color="border-cyan-400"
        />
        <MetricCard
          title={t('aiRevenueManager.revenueGrowth')}
          value="+12.5%"
          icon={FiCalendar}
          color="border-amber-400"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-medium">
        <div className="flex flex-wrap border-b border-neutral-medium">
          {[
            { id: 'overview', label: t('aiRevenueManager.overview'), icon: FiTrendingUp },
            { id: 'pricing', label: t('aiRevenueManager.roomPricing'), icon: FiHome },
            { id: 'upsells', label: t('aiRevenueManager.upsells'), icon: FiPackage },
            { id: 'minibar', label: t('aiRevenueManager.minibar'), icon: FiCoffee },
            { id: 'events', label: t('aiRevenueManager.eventSpaces'), icon: FiEvent },
            { id: 'other', label: t('aiRevenueManager.otherRevenue'), icon: FiDollarSign }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-neutral-dark hover:text-foreground hover:bg-neutral-light/50'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* AI Factors */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
                <h2 className="text-lg font-semibold mb-4 text-foreground">{t('aiRevenueManager.aiAnalysisFactors')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {factors.map((factor, index) => (
                    <div key={index} className="p-4 bg-neutral-light rounded-lg border border-neutral-medium">
                      <h3 className="font-medium text-foreground">{factor.name}</h3>
                      <p className="text-2xl font-bold text-primary">{factor.value}</p>
                      <p className="text-sm text-neutral-dark">{factor.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Fees Analysis */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
                <h2 className="text-lg font-semibold mb-4 text-foreground">{t('aiRevenueManager.localFeesAnalysis')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800">{t('aiRevenueManager.adultFees')}</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(1800)}</p>
                    <p className="text-sm text-blue-700">36 {t('aiRevenueManager.adults')}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-medium text-green-800">{t('aiRevenueManager.youthFees')}</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(500)}</p>
                    <p className="text-sm text-green-700">20 {t('aiRevenueManager.youths')}</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-medium text-amber-800">{t('aiRevenueManager.exemptGuests')}</h3>
                    <p className="text-2xl font-bold text-amber-600">12</p>
                    <p className="text-sm text-amber-700">{t('aiRevenueManager.noFeeApplied')}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-medium text-purple-800">{t('aiRevenueManager.monthlyProjection')}</h3>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(75000)}</p>
                    <p className="text-sm text-purple-700">{t('aiRevenueManager.basedOnCurrentOccupancy')}</p>
                  </div>
                </div>
                <div className="border-t border-neutral-medium pt-4">
                  <h3 className="font-medium mb-3 text-foreground">{t('aiRevenueManager.feeBreakdown')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-neutral-light rounded">
                      <span className="text-sm">{t('aiRevenueManager.adultFee')}: 50 Kč × 36 {t('aiRevenueManager.nights')}</span>
                      <span className="font-medium">{formatCurrency(1800)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-neutral-light rounded">
                      <span className="text-sm">{t('aiRevenueManager.youthFee')}: 25 Kč × 20 {t('aiRevenueManager.nights')}</span>
                      <span className="font-medium">{formatCurrency(500)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                      <span className="text-sm text-green-800">{t('aiRevenueManager.czechCitizensExempt')}</span>
                      <span className="font-medium text-green-800">{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200 font-semibold">
                      <span>{t('aiRevenueManager.totalLocalFees')}</span>
                      <span>{formatCurrency(2300)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Suggestions */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
                <h2 className="text-lg font-semibold mb-4 text-foreground">{t('aiRevenueManager.aiPricingSuggestions')}</h2>
                <div className="space-y-4">
                  {pricingSuggestions.map((suggestion, index) => (
                    <div key={index} className="border border-neutral-medium rounded-lg p-4 hover:bg-neutral-light/50 transition-all duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{suggestion.roomType}</h3>
                        <button
                          onClick={() => setSelectedRoomType(selectedRoomType === suggestion.roomType ? null : suggestion.roomType)}
                          className="text-primary hover:text-primary-dark text-sm font-medium"
                        >
                          {selectedRoomType === suggestion.roomType ? t('aiRevenueManager.hideDetails') : t('aiRevenueManager.showDetails')}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-neutral-dark">{t('aiRevenueManager.currentPrice')}</p>
                          <p className="text-xl font-bold text-foreground">{formatCurrency(suggestion.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-dark">{t('aiRevenueManager.suggestedPrice')}</p>
                          <p className={`text-xl font-bold ${suggestion.suggestedPrice > suggestion.currentPrice ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(suggestion.suggestedPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-dark">{t('aiRevenueManager.potentialRevenue')}</p>
                          <p className="text-xl font-bold text-cyan-600">
                            {formatCurrency((suggestion.suggestedPrice - suggestion.currentPrice) * 10)}
                          </p>
                        </div>
                      </div>
                      <p className="text-neutral-dark mb-4">{suggestion.reason}</p>
                      {selectedRoomType === suggestion.roomType && (
                        <div className="border-t border-neutral-medium pt-4">
                          <h4 className="font-medium mb-2 text-foreground">{t('aiRevenueManager.detailedAnalysis')}</h4>
                          <ul className="list-disc list-inside text-sm text-neutral-dark space-y-1">
                            <li>{t('aiRevenueManager.competitorPrices')}: {formatCurrency(suggestion.currentPrice - 5)} - {formatCurrency(suggestion.currentPrice + 15)}</li>
                            <li>{t('aiRevenueManager.seasonalDemand')}: {t('aiRevenueManager.summerPeak')}</li>
                            <li>{t('aiRevenueManager.localEvents')}: {t('aiRevenueManager.conferenceInCity')}</li>
                            <li>{t('aiRevenueManager.historicalOccupancy')}: 85% {t('aiRevenueManager.forThisPeriod')}</li>
                          </ul>
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => updatePrice.mutate({ roomType: suggestion.roomType, newPrice: suggestion.suggestedPrice })}
                              className="btn-success px-4 py-2 text-sm"
                            >
                              {t('aiRevenueManager.applySuggestion')}
                            </button>
                            <button
                              onClick={() => {/* TODO: dismiss logic */}}
                              className="bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                            >
                              {t('aiRevenueManager.dismiss')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Room Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">{t('aiRevenueManager.roomPricing')}</h2>
                <button className="btn-primary flex items-center gap-2">
                  <FiPlus className="h-4 w-4" />
                  {t('aiRevenueManager.addRoomType')}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomPricing.map((room) => (
                  <div key={room.id} className="bg-neutral-light rounded-lg p-4 border border-neutral-medium">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{room.name}</h3>
                        <p className="text-sm text-neutral-dark">{room.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingItem(room.id);
                          setEditValues({ [room.id]: room.basePrice.toString() });
                        }}
                        className="text-primary hover:text-primary-dark"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-dark">{t('aiRevenueManager.basePrice')}</span>
                        {editingItem === room.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues[room.id] || ''}
                              onChange={(e) => setEditValues({ ...editValues, [room.id]: e.target.value })}
                              className="w-24 px-2 py-1 border border-neutral-medium rounded text-sm"
                            />
                            <button
                              onClick={() => {
                                updateRoomPrice.mutate({ id: room.id, price: parseFloat(editValues[room.id]) });
                                setEditingItem(null);
                              }}
                              className="text-green-600 hover:text-green-700"
                            >
                              <FiSave className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(null);
                                setEditValues({});
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium">{formatCurrency(room.basePrice)}</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-dark">{t('aiRevenueManager.maxOccupancy')}</span>
                        <span className="font-medium">{room.maxOccupancy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upsells Tab */}
          {activeTab === 'upsells' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">{t('aiRevenueManager.upsells')}</h2>
                <button className="btn-primary flex items-center gap-2">
                  <FiPlus className="h-4 w-4" />
                  {t('aiRevenueManager.addUpsell')}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-light">
                    <tr>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.itemName')}</th>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.description')}</th>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.price')}</th>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.category')}</th>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upsellItems.map((item) => (
                      <tr key={item.id} className="border-t border-neutral-medium">
                        <td className="p-3 font-medium text-foreground">{item.name}</td>
                        <td className="p-3 text-neutral-dark">{item.description}</td>
                        <td className="p-3">
                          {editingItem === item.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues[item.id] || ''}
                                onChange={(e) => setEditValues({ ...editValues, [item.id]: e.target.value })}
                                className="w-24 px-2 py-1 border border-neutral-medium rounded text-sm"
                              />
                              <button
                                onClick={() => {
                                  updateUpsellPrice.mutate({ id: item.id, price: parseFloat(editValues[item.id]) });
                                  setEditingItem(null);
                                }}
                                className="text-green-600 hover:text-green-700"
                              >
                                <FiSave className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingItem(null);
                                  setEditValues({});
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{formatCurrency(item.price)}</span>
                              <button
                                onClick={() => {
                                  setEditingItem(item.id);
                                  setEditValues({ [item.id]: item.price.toString() });
                                }}
                                className="text-primary hover:text-primary-dark ml-2"
                              >
                                <FiEdit2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-neutral-dark">{item.category}</td>
                        <td className="p-3">
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            {t('aiRevenueManager.delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Minibar Tab */}
          {activeTab === 'minibar' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">{t('aiRevenueManager.minibar')}</h2>
                <button className="btn-primary flex items-center gap-2">
                  <FiPlus className="h-4 w-4" />
                  {t('aiRevenueManager.addItem')}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {minibarItems.map((item) => (
                  <div key={item.id} className="bg-neutral-light rounded-lg p-4 border border-neutral-medium">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <button
                        onClick={() => {
                          setEditingItem(item.id);
                          setEditValues({ [item.id]: item.price.toString() });
                        }}
                        className="text-primary hover:text-primary-dark"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-neutral-dark mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-dark">{t('aiRevenueManager.price')}</span>
                      {editingItem === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editValues[item.id] || ''}
                            onChange={(e) => setEditValues({ ...editValues, [item.id]: e.target.value })}
                            className="w-20 px-2 py-1 border border-neutral-medium rounded text-sm"
                          />
                          <button
                            onClick={() => {
                              updateMinibarPrice.mutate({ id: item.id, price: parseFloat(editValues[item.id]) });
                              setEditingItem(null);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <FiSave className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(null);
                              setEditValues({});
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-medium">{formatCurrency(item.price)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Spaces Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">{t('aiRevenueManager.eventSpaces')}</h2>
                <button className="btn-primary flex items-center gap-2">
                  <FiPlus className="h-4 w-4" />
                  {t('aiRevenueManager.addEventSpace')}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventSpaces.map((space) => (
                  <div key={space.id} className="bg-neutral-light rounded-lg p-4 border border-neutral-medium">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{space.name}</h3>
                        <p className="text-sm text-neutral-dark">{space.description}</p>
                        <p className="text-sm text-neutral-dark mt-1">{t('aiRevenueManager.capacity')}: {space.capacity}</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingItem(space.id);
                          setEditValues({ [space.id]: space.hourlyRate.toString() });
                        }}
                        className="text-primary hover:text-primary-dark"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-dark">{t('aiRevenueManager.hourlyRate')}</span>
                        {editingItem === space.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues[space.id] || ''}
                              onChange={(e) => setEditValues({ ...editValues, [space.id]: e.target.value })}
                              className="w-24 px-2 py-1 border border-neutral-medium rounded text-sm"
                            />
                            <button
                              onClick={() => {
                                updateEventSpacePrice.mutate({ id: space.id, rate: parseFloat(editValues[space.id]) });
                                setEditingItem(null);
                              }}
                              className="text-green-600 hover:text-green-700"
                            >
                              <FiSave className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(null);
                                setEditValues({});
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium">{formatCurrency(space.hourlyRate)}</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-dark">{t('aiRevenueManager.dailyRate')}</span>
                        <span className="font-medium">{formatCurrency(space.dailyRate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Revenue Tab */}
          {activeTab === 'other' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">{t('aiRevenueManager.otherRevenue')}</h2>
                <button className="btn-primary flex items-center gap-2">
                  <FiPlus className="h-4 w-4" />
                  {t('aiRevenueManager.addRevenueStream')}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-light">
                    <tr>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.streamName')}</th>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.description')}</th>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.pricingModel')}</th>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.price')}</th>
                      <th className="p-3 text-left font-semibold text-foreground">{t('aiRevenueManager.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otherRevenue.map((stream) => (
                      <tr key={stream.id} className="border-t border-neutral-medium">
                        <td className="p-3 font-medium text-foreground">{stream.name}</td>
                        <td className="p-3 text-neutral-dark">{stream.description}</td>
                        <td className="p-3 text-neutral-dark">{stream.pricingModel}</td>
                        <td className="p-3">
                          {editingItem === stream.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues[stream.id] || ''}
                                onChange={(e) => setEditValues({ ...editValues, [stream.id]: e.target.value })}
                                className="w-24 px-2 py-1 border border-neutral-medium rounded text-sm"
                              />
                              <button
                                onClick={() => {
                                  updateOtherRevenue.mutate({ id: stream.id, price: parseFloat(editValues[stream.id]) });
                                  setEditingItem(null);
                                }}
                                className="text-green-600 hover:text-green-700"
                              >
                                <FiSave className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingItem(null);
                                  setEditValues({});
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{formatCurrency(stream.price)}</span>
                              <button
                                onClick={() => {
                                  setEditingItem(stream.id);
                                  setEditValues({ [stream.id]: stream.price.toString() });
                                }}
                                className="text-primary hover:text-primary-dark ml-2"
                              >
                                <FiEdit2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            {t('aiRevenueManager.delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Overview - Moved to Bottom */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
        <h2 className="text-lg font-semibold mb-4 text-foreground">{t('aiRevenueManager.revenueOverview')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-light">
              <tr>
                <th className="p-4 text-left font-semibold text-foreground">{t('aiRevenueManager.date')}</th>
                <th className="p-4 text-left font-semibold text-foreground">{t('aiRevenueManager.revenue')}</th>
                <th className="p-4 text-left font-semibold text-foreground">{t('aiRevenueManager.occupancy')}</th>
                <th className="p-4 text-left font-semibold text-foreground">{t('aiRevenueManager.adr')}</th>
              </tr>
            </thead>
            <tbody>
              {revenueData?.map((data) => (
                <tr key={data.date} className="border-t border-neutral-medium hover:bg-neutral-light/50">
                  <td className="p-4 font-medium text-foreground">{new Date(data.date).toLocaleDateString()}</td>
                  <td className="p-4 text-neutral-dark">{formatCurrency(data.revenue)}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-full bg-neutral-medium rounded-full h-2 mr-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${data.occupancy}%` }}></div>
                      </div>
                      {data.occupancy}%
                    </div>
                  </td>
                  <td className="p-4 text-neutral-dark">{formatCurrency(Math.round(data.revenue / (data.occupancy / 100)))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Factors */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
        <h2 className="text-lg font-semibold mb-4 text-foreground">{t('aiRevenueManager.aiAnalysisFactors')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {factors.map((factor, index) => (
            <div key={index} className="p-4 bg-neutral-light rounded-lg border border-neutral-medium">
              <h3 className="font-medium text-foreground">{factor.name}</h3>
              <p className="text-2xl font-bold text-primary">{factor.value}</p>
              <p className="text-sm text-neutral-dark">{factor.impact}</p>
            </div>
          ))}
        </div>
      </div>

       {/* Local Fees Analysis */}
       <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
         <h2 className="text-lg font-semibold mb-4 text-foreground">{t('aiRevenueManager.localFeesAnalysis')}</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
             <h3 className="font-medium text-blue-800">{t('aiRevenueManager.adultFees')}</h3>
             <p className="text-2xl font-bold text-blue-600">{formatCurrency(1800)}</p>
             <p className="text-sm text-blue-700">36 {t('aiRevenueManager.adults')}</p>
           </div>
           <div className="bg-green-50 p-4 rounded-lg border border-green-200">
             <h3 className="font-medium text-green-800">{t('aiRevenueManager.youthFees')}</h3>
             <p className="text-2xl font-bold text-green-600">{formatCurrency(500)}</p>
             <p className="text-sm text-green-700">20 {t('aiRevenueManager.youths')}</p>
           </div>
           <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
             <h3 className="font-medium text-amber-800">{t('aiRevenueManager.exemptGuests')}</h3>
             <p className="text-2xl font-bold text-amber-600">12</p>
             <p className="text-sm text-amber-700">{t('aiRevenueManager.noFeeApplied')}</p>
           </div>
           <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
             <h3 className="font-medium text-purple-800">{t('aiRevenueManager.monthlyProjection')}</h3>
             <p className="text-2xl font-bold text-purple-600">{formatCurrency(75000)}</p>
             <p className="text-sm text-purple-700">{t('aiRevenueManager.basedOnCurrentOccupancy')}</p>
           </div>
         </div>
         <div className="border-t border-neutral-medium pt-4">
           <h3 className="font-medium mb-3 text-foreground">{t('aiRevenueManager.feeBreakdown')}</h3>
           <div className="space-y-2">
             <div className="flex justify-between items-center p-2 bg-neutral-light rounded">
               <span className="text-sm">{t('aiRevenueManager.adultFee')}: 50 Kč × 36 {t('aiRevenueManager.nights')}</span>
               <span className="font-medium">{formatCurrency(1800)}</span>
             </div>
             <div className="flex justify-between items-center p-2 bg-neutral-light rounded">
               <span className="text-sm">{t('aiRevenueManager.youthFee')}: 25 Kč × 20 {t('aiRevenueManager.nights')}</span>
               <span className="font-medium">{formatCurrency(500)}</span>
             </div>
             <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
               <span className="text-sm text-green-800">{t('aiRevenueManager.czechCitizensExempt')}</span>
               <span className="font-medium text-green-800">{formatCurrency(0)}</span>
             </div>
             <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200 font-semibold">
               <span>{t('aiRevenueManager.totalLocalFees')}</span>
               <span>{formatCurrency(2300)}</span>
             </div>
           </div>
         </div>
       </div>

       {/* Pricing Suggestions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
        <h2 className="text-lg font-semibold mb-4 text-foreground">{t('aiRevenueManager.aiPricingSuggestions')}</h2>
        <div className="space-y-4">
          {pricingSuggestions.map((suggestion, index) => (
            <div key={index} className="border border-neutral-medium rounded-lg p-4 hover:bg-neutral-light/50 transition-all duration-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-foreground">{suggestion.roomType}</h3>
                <button
                  onClick={() => setSelectedRoomType(selectedRoomType === suggestion.roomType ? null : suggestion.roomType)}
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  {selectedRoomType === suggestion.roomType ? t('aiRevenueManager.hideDetails') : t('aiRevenueManager.showDetails')}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-neutral-dark">{t('aiRevenueManager.currentPrice')}</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(suggestion.currentPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">{t('aiRevenueManager.suggestedPrice')}</p>
                  <p className={`text-xl font-bold ${suggestion.suggestedPrice > suggestion.currentPrice ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(suggestion.suggestedPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">{t('aiRevenueManager.potentialRevenue')}</p>
                  <p className="text-xl font-bold text-cyan-600">
                    {formatCurrency((suggestion.suggestedPrice - suggestion.currentPrice) * 10)} {/* Mock calculation */}
                  </p>
                </div>
              </div>
              <p className="text-neutral-dark mb-4">{suggestion.reason}</p>
              {selectedRoomType === suggestion.roomType && (
                <div className="border-t border-neutral-medium pt-4">
                  <h4 className="font-medium mb-2 text-foreground">{t('aiRevenueManager.detailedAnalysis')}</h4>
                  <ul className="list-disc list-inside text-sm text-neutral-dark space-y-1">
                    <li>{t('aiRevenueManager.competitorPrices')}: {formatCurrency(suggestion.currentPrice - 5)} - {formatCurrency(suggestion.currentPrice + 15)}</li>
                    <li>{t('aiRevenueManager.seasonalDemand')}: {t('aiRevenueManager.summerPeak')}</li>
                    <li>{t('aiRevenueManager.localEvents')}: {t('aiRevenueManager.conferenceInCity')}</li>
                    <li>{t('aiRevenueManager.historicalOccupancy')}: 85% {t('aiRevenueManager.forThisPeriod')}</li>
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updatePrice.mutate({ roomType: suggestion.roomType, newPrice: suggestion.suggestedPrice })}
                      className="btn-success px-4 py-2 text-sm"
                    >
                      {t('aiRevenueManager.applySuggestion')}
                    </button>
                    <button
                      onClick={() => {/* TODO: dismiss logic */}}
                      className="bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      {t('aiRevenueManager.dismiss')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}