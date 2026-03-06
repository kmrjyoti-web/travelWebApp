'use client';
import React, { useState } from 'react';
import { PageHeader, Tabs, TabItem, TabLink } from '@/shared/components';
import { DashboardPanel, ReferralLinksPanel, LeaderboardPanel } from '../components';
import { useAuthStore } from '@/shared/stores/auth.store';

type HubTab = 'dashboard' | 'referral-links' | 'leaderboard';

export function InfluencerHub() {
  const [tab, setTab] = useState<HubTab>('dashboard');
  const userId = useAuthStore((s) => s.user?.id ?? '');

  return (
    <main style={{ padding: '1.5rem' }}>
      <PageHeader
        title="Influencer Program"
        subtitle="Track earnings, manage referral links, and compete on the leaderboard"
        className="mb-4"
      />

      <Tabs style={{ marginBottom: '1.5rem' }}>
        <TabItem>
          <TabLink active={tab === 'dashboard'}     onClick={() => setTab('dashboard')}>Dashboard</TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={tab === 'referral-links'} onClick={() => setTab('referral-links')}>Referral Links</TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={tab === 'leaderboard'}   onClick={() => setTab('leaderboard')}>Leaderboard</TabLink>
        </TabItem>
      </Tabs>

      {tab === 'dashboard'     && <DashboardPanel     influencerId={userId} />}
      {tab === 'referral-links' && <ReferralLinksPanel  influencerId={userId} />}
      {tab === 'leaderboard'   && <LeaderboardPanel />}
    </main>
  );
}
