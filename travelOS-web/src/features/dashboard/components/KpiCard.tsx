'use client';

import React from 'react';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';

export interface KpiCardProps {
  /** Label displayed above the value */
  label: string;
  /** The KPI value (formatted string) */
  value: string;
  /** Lucide icon name */
  icon: IconName;
  /** Background color for the icon container */
  iconBg: string;
  /** Icon color */
  iconColor: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon, iconBg, iconColor }) => {
  return (
    <div className="tos-kpi-card" role="status" aria-label={`${label}: ${value}`}>
      <div
        className="tos-kpi-card__icon"
        style={{ background: iconBg }}
        aria-hidden="true"
      >
        <Icon name={icon} size={22} color={iconColor} />
      </div>
      <div className="tos-kpi-card__info">
        <div className="tos-kpi-card__label">{label}</div>
        <div className="tos-kpi-card__value">{value}</div>
      </div>
    </div>
  );
};

KpiCard.displayName = 'KpiCard';
