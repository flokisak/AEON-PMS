'use client';

import { useTranslation } from 'react-i18next';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiStar, FiClock } from 'react-icons/fi';
import { useCurrency } from '../../../core/hooks/useCurrency';

interface DashboardMetricsProps {
  totalRevenue: number;
  monthlyGrowth: number;
  averageRating: number;
  totalGuests: number;
  averageStayDuration: number;
  bookingConversionRate: number;
}

export function DashboardMetrics({
  totalRevenue,
  monthlyGrowth,
  averageRating,
  totalGuests,
  averageStayDuration,
  bookingConversionRate
}: DashboardMetricsProps) {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();

  const metrics = [
    {
      title: t('dashboard.totalRevenue'),
      value: formatCurrency(totalRevenue),
      change: monthlyGrowth,
      changeLabel: t('dashboard.vsLastMonth'),
      icon: FiDollarSign,
      color: 'border-emerald-400',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      title: t('dashboard.totalGuests'),
      value: totalGuests.toLocaleString(),
      change: 12.5,
      changeLabel: t('dashboard.vsLastMonth'),
      icon: FiUsers,
      color: 'border-blue-400',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: t('dashboard.averageRating'),
      value: averageRating.toFixed(1),
      change: 0.3,
      changeLabel: t('dashboard.vsLastMonth'),
      icon: FiStar,
      color: 'border-amber-400',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      title: t('dashboard.averageStay'),
      value: `${averageStayDuration} ${t('dashboard.nights')}`,
      change: -0.2,
      changeLabel: t('dashboard.vsLastMonth'),
      icon: FiClock,
      color: 'border-purple-400',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: t('dashboard.bookingConversion'),
      value: `${bookingConversionRate}%`,
      change: 5.2,
      changeLabel: t('dashboard.vsLastMonth'),
      icon: FiTrendingUp,
      color: 'border-cyan-400',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`text-xl ${metric.textColor}`} />
            </div>
            <div className={`flex items-center text-sm ${metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {metric.change >= 0 ? (
                <FiTrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <FiTrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium">
                {metric.change >= 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-dark mb-1">{metric.title}</p>
            <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
            <p className="text-xs text-neutral-dark">{metric.changeLabel}</p>
          </div>
        </div>
      ))}
    </div>
  );
}