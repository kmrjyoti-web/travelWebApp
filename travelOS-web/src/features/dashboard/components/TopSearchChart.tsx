'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';

export interface TopSearchItem {
  name: string;
  value: number;
}

export interface TopSearchChartProps {
  /** Chart title */
  title: string;
  /** Icon shown next to title */
  icon: IconName;
  /** Icon color */
  iconColor: string;
  /** Data for the chart */
  data: TopSearchItem[];
  /** Bar color */
  barColor: string;
}

export const TopSearchChart: React.FC<TopSearchChartProps> = ({
  title,
  icon,
  iconColor,
  data,
  barColor,
}) => {
  return (
    <div className="tos-chart-card" role="img" aria-label={title}>
      <div className="tos-chart-card__title">
        <Icon name={icon} size={18} color={iconColor} aria-hidden="true" />
        {title}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, bottom: 0, left: 80 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 13, fill: 'var(--tos-text-secondary)' }}
            width={80}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--tos-tooltip-bg)',
              border: `1px solid var(--tos-tooltip-border)`,
              borderRadius: 'var(--tos-border-radius)',
              color: 'var(--tos-tooltip-text)',
              fontSize: 13,
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

TopSearchChart.displayName = 'TopSearchChart';
