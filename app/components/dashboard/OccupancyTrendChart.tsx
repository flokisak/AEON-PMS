'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTranslation } from 'react-i18next';

interface OccupancyData {
  date: string;
  occupancy: number;
  trend: number;
}

interface OccupancyTrendChartProps {
  data: OccupancyData[];
}

export function OccupancyTrendChart({ data }: OccupancyTrendChartProps) {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{t('dashboard.occupancyTrend')}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`${value}%`, t('dashboard.occupancyRate')]}
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
            <Area
              type="monotone"
              dataKey="occupancy"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-4 text-xs">
        <span className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 mr-2 rounded"></div>
          <span className="text-neutral-dark">{t('dashboard.actualOccupancy')}</span>
        </span>
        <span className="flex items-center">
          <div className="w-3 h-3 border border-red-500 mr-2 rounded" style={{backgroundColor: 'transparent'}}></div>
          <span className="text-neutral-dark">{t('dashboard.trendLine')}</span>
        </span>
      </div>
    </div>
  );
}