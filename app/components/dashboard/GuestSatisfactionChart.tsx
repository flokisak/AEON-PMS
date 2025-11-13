'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';

interface SatisfactionData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface GuestSatisfactionChartProps {
  data: SatisfactionData[];
  averageRating: number;
}

export function GuestSatisfactionChart({ data, averageRating }: GuestSatisfactionChartProps) {
  const { t } = useTranslation('common');

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{t('dashboard.guestSatisfaction')}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{averageRating.toFixed(1)}</div>
          <div className="text-xs text-neutral-dark">{t('dashboard.averageRating')}</div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`${value}%`, t('dashboard.responses')]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 mr-2 rounded"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-neutral-dark">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}