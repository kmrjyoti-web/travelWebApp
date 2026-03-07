'use client';
import React, { useState } from 'react';
import { StatCard, Alert, Button, useConfirmDialog, TextField } from '@/shared/components';
import { useInfluencerDashboard, useRedeemPoints } from '../hooks/useInfluencer';

function fmt(n: number) {
  if (n >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

const TIER_COLOR: Record<string, string> = {
  bronze:   '#cd7f32',
  silver:   '#9ca3af',
  gold:     '#f59e0b',
  platinum: '#a78bfa',
  diamond:  '#06b6d4',
};

const CARD: React.CSSProperties = {
  background: 'var(--cui-card-bg, #fff)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
  borderRadius: '0.75rem',
  padding: '1.25rem',
};

interface DashboardPanelProps {
  influencerId: string;
}

export function DashboardPanel({ influencerId }: DashboardPanelProps) {
  const { data, isLoading, error } = useInfluencerDashboard(influencerId);
  const [redeemAmt, setRedeemAmt] = useState<number>(100);
  const { confirm, ConfirmDialogPortal } = useConfirmDialog();

  const { mutate: redeem, isPending: redeeming } = useRedeemPoints(influencerId);

  if (error) return <Alert color="danger">Failed to load influencer dashboard.</Alert>;

  const profile  = data?.profile;
  const earnings = data?.earnings;
  const tierColor = TIER_COLOR[profile?.tier ?? 'bronze'] ?? '#9ca3af';

  const handleRedeem = async () => {
    const ok = await confirm({ title: 'Redeem Points', message: `Redeem ${redeemAmt} points for commission credit?` });
    if (ok) redeem({ points: redeemAmt });
  };

  return (
    <>
      <ConfirmDialogPortal />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Profile banner */}
        <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: tierColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0,
          }}>
            {profile?.displayName?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cui-body-color)' }}>
                {isLoading ? '—' : profile?.displayName}
              </span>
              {profile?.isVerified && (
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#065f46', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>
                  Verified
                </span>
              )}
              <span style={{ fontSize: '0.75rem', background: tierColor, color: '#fff', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: 700, textTransform: 'capitalize' }}>
                {isLoading ? '—' : profile?.tier}
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--cui-secondary-color, #6b7280)', marginTop: '0.25rem' }}>
              {isLoading ? '—' : profile?.followerCount.toLocaleString()} followers
              · {isLoading ? '—' : profile?.totalBookingsDriven} bookings driven
            </div>
          </div>
          {/* Points badge */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--cui-secondary-color)', textTransform: 'uppercase', fontWeight: 600 }}>Points Balance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cui-primary, #1B4F72)' }}>
              {isLoading ? '—' : profile?.pointsBalance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          <StatCard title="Total Earnings"   value={isLoading ? '—' : fmt(earnings?.totalEarnings ?? 0)}   icon="TrendingUp"     iconColor="#10b981" />
          <StatCard title="Pending Earnings" value={isLoading ? '—' : fmt(earnings?.pendingEarnings ?? 0)} icon="Clock"          iconColor="#f59e0b" />
          <StatCard title="Paid Earnings"    value={isLoading ? '—' : fmt(earnings?.paidEarnings ?? 0)}    icon="CircleCheck"    iconColor="#3b82f6" />
          <StatCard title="Bookings Driven"  value={isLoading ? '—' : (earnings?.totalBookings ?? 0)}      icon="BookOpen"       iconColor="#6366f1" />
          <StatCard title="Referral Links"   value={isLoading ? '—' : (data?.referralLinks ?? 0)}          icon="Link"           iconColor="#a855f7" />
        </div>

        {/* Redeem Points */}
        <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--cui-body-color)' }}>Redeem Points</p>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--cui-secondary-color)' }}>
              Convert your points balance to commission credit.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 110 }}>
              <TextField
                label="Points"
                variant="outlined"
                size="sm"
                type="number"
                min={1}
                max={profile?.pointsBalance ?? 0}
                value={redeemAmt}
                onChange={(e) => setRedeemAmt(Number(e.target.value))}
              />
            </div>
            <Button color="primary" disabled={redeeming || !profile?.pointsBalance} onClick={handleRedeem}>
              {redeeming ? 'Redeeming…' : 'Redeem'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
