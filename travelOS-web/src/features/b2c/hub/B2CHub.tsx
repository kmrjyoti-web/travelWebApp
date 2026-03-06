'use client';
import React, { useState } from 'react';
import { PageHeader, Tabs, TabItem, TabLink } from '@/shared/components';
import { HomepagePanel, SearchPanel, WishlistPanel } from '../components';

type HubTab = 'home' | 'search' | 'wishlist';

export function B2CHub() {
  const [tab, setTab] = useState<HubTab>('home');

  return (
    <main style={{ padding: '1.5rem' }}>
      <PageHeader
        title="Marketplace"
        subtitle="Discover curated travel packages — browse, compare, save to wishlist and book"
        className="mb-4"
      />

      <Tabs style={{ marginBottom: '1.5rem' }}>
        <TabItem>
          <TabLink active={tab === 'home'}     onClick={() => setTab('home')}>Home</TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={tab === 'search'}   onClick={() => setTab('search')}>Search Packages</TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={tab === 'wishlist'} onClick={() => setTab('wishlist')}>Wishlist</TabLink>
        </TabItem>
      </Tabs>

      {tab === 'home'     && <HomepagePanel />}
      {tab === 'search'   && <SearchPanel />}
      {tab === 'wishlist' && <WishlistPanel />}
    </main>
  );
}
