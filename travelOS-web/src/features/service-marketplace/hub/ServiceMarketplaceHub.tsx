'use client';
import React, { useState } from 'react';
import { PageHeader, Tabs, TabItem, TabLink } from '@/shared/components';
import { ListingsPanel, BookingsPanel, CreateListingForm } from '../components';

type HubTab = 'listings' | 'bookings' | 'create';

const CARD: React.CSSProperties = {
  background: 'var(--cui-card-bg, #fff)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
  borderRadius: '0.75rem',
  padding: '1.5rem',
};

export function ServiceMarketplaceHub() {
  const [tab, setTab] = useState<HubTab>('listings');

  const goToCreate = () => setTab('create');
  const goToListings = () => setTab('listings');

  return (
    <main style={{ padding: '1.5rem' }}>
      <PageHeader
        title="Service Marketplace"
        subtitle="Discover and manage ancillary travel services — visa, guides, photographers, transfers & more"
        className="mb-4"
      />

      <Tabs style={{ marginBottom: '1.5rem' }}>
        <TabItem>
          <TabLink active={tab === 'listings'}  onClick={() => setTab('listings')}>Browse Listings</TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={tab === 'bookings'}  onClick={() => setTab('bookings')}>My Bookings</TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={tab === 'create'}    onClick={() => setTab('create')}>Add Listing</TabLink>
        </TabItem>
      </Tabs>

      {tab === 'listings' && (
        <ListingsPanel
          onCreateNew={goToCreate}
          onView={(id) => {
            // Detail view can be extended with SidePanel; for now navigate to tab
            void id;
          }}
        />
      )}

      {tab === 'bookings' && <BookingsPanel />}

      {tab === 'create' && (
        <div style={CARD}>
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: 'var(--cui-body-color)' }}>
            New Service Listing
          </h3>
          <CreateListingForm onCreated={goToListings} onCancel={goToListings} />
        </div>
      )}
    </main>
  );
}
