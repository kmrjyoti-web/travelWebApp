'use client';
import React, { useState } from 'react';
import { PageHeader, Tabs, TabItem, TabLink } from '@/shared/components';
import { ListingsPanel, OrdersPanel, RFQsPanel } from '../components';

type B2BTab = 'listings' | 'orders' | 'rfqs';

export function B2BHub() {
  const [activeTab, setActiveTab] = useState<B2BTab>('listings');

  const handleCreateRFQ = () => setActiveTab('rfqs');

  return (
    <main style={{ padding: '1.5rem' }}>
      <PageHeader title="B2B Marketplace" className="mb-4" />

      <Tabs className="mb-4">
        <TabItem>
          <TabLink active={activeTab === 'listings'} onClick={() => setActiveTab('listings')}>
            Listings
          </TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
            My Orders
          </TabLink>
        </TabItem>
        <TabItem>
          <TabLink active={activeTab === 'rfqs'} onClick={() => setActiveTab('rfqs')}>
            RFQs
          </TabLink>
        </TabItem>
      </Tabs>

      {activeTab === 'listings' && <ListingsPanel />}
      {activeTab === 'orders'   && <OrdersPanel />}
      {activeTab === 'rfqs'     && <RFQsPanel onCreateRFQ={handleCreateRFQ} />}
    </main>
  );
}
