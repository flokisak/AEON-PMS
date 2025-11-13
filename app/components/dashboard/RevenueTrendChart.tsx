'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../../core/hooks/useCurrency';

interface RevenueData {
  date: string;
  revenue: number;
  target: number;
  growth: number;
}

interface RevenueTrendChartProps {
  data: RevenueData[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const { t } = useTranslation('common');
  const { formatCurrency } = useCurrency();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{t('dashboard.revenueTrend')}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('cs-CZ', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis
              yAxisId="revenue"
              orientation="left"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis
              yAxisId="growth"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'revenue' || name === 'target') {
                  return [formatCurrency(value), name === 'revenue' ? t('dashboard.actualRevenue') : t('dashboard.targetRevenue')];
                }
                return [`${value}%`, t('dashboard.growthRate')];
              }}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('cs-CZ', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              }}
            />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="#10b981"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="revenue"
              dataKey="target"
              fill="#e5e7eb"
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="growth"
              type="monotone"
              dataKey="growth"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-4 text-xs">
        <span className="flex items-center">
          <div className="w-3 h-3 bg-emerald-500 mr-2 rounded"></div>
          <span className="text-neutral-dark">{t('dashboard.actualRevenue')}</span>
        </span>
        <span className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 mr-2 rounded"></div>
          <span className="text-neutral-dark">{t('dashboard.targetRevenue')}</span>
        </span>
        <span className="flex items-center">
          <div className="w-3 h-3 bg-amber-500 mr-2 rounded-full"></div>
          <span className="text-neutral-dark">{t('dashboard.growthRate')}</span>
        </span>
      </div>
    </div>
  );
}