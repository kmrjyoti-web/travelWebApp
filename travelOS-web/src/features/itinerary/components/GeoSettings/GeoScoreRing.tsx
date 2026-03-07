'use client';
/**
 * GeoScoreRing — SVG circular progress indicator for GEO score.
 * Animates stroke-dashoffset using CSS transition for smooth rendering.
 */
import React from 'react';
import type { GeoScoreTier } from './types';

interface GeoScoreRingProps {
  score: number;
  tier: GeoScoreTier;
  recommendation?: string;
}

const TIER_COLOR: Record<GeoScoreTier, string> = {
  poor: '#ef4444',
  fair: '#f59e0b',
  good: '#22c55e',
  excellent: '#8b5cf6',
};

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~251.2

/**
 * Circular SVG ring that fills proportionally to the GEO score (0–100).
 */
export function GeoScoreRing({ score, tier, recommendation }: GeoScoreRingProps) {
  const safeScore = Math.min(100, Math.max(0, score));
  const dashOffset = CIRCUMFERENCE * (1 - safeScore / 100);
  const color = TIER_COLOR[tier];

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      aria-label={`GEO Score: ${safeScore} - ${tier}`}
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`GEO score ring: ${safeScore} out of 100`}
      >
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="var(--cui-border-color, #e5e7eb)"
          strokeWidth="8"
        />
        {/* Progress arc — starts at top (-90deg = -PI/2) */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        {/* Score text */}
        <text
          x="50"
          y="46"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            fill: color,
          }}
        >
          {safeScore}
        </text>
        {/* Tier label */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: '0.65rem',
            textTransform: 'capitalize',
            fill: 'var(--cui-secondary-color, #6b7280)',
          }}
        >
          {tier.toUpperCase()}
        </text>
      </svg>

      {recommendation && (
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--cui-secondary-color, #6b7280)',
            textAlign: 'center',
            maxWidth: 240,
            margin: 0,
          }}
        >
          {recommendation}
        </p>
      )}
    </div>
  );
}
