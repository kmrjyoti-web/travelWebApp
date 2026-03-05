'use client';
import React, { useState, useCallback } from 'react';
import ItineraryHeader from '@/features/dashboard/components/ItineraryHeader';
import ItineraryDashboard from '@/features/dashboard/components/ItineraryDashboard';
import { SelfItineraryDrawer, AiItineraryDrawer } from '../components';

export function ItineraryHub() {
  const [selfDrawerOpen, setSelfDrawerOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  const handleOpenSelf = useCallback(() => setSelfDrawerOpen(true), []);
  const handleCloseSelf = useCallback(() => setSelfDrawerOpen(false), []);
  const handleOpenAi = useCallback(() => setAiDrawerOpen(true), []);
  const handleCloseAi = useCallback(() => setAiDrawerOpen(false), []);

  return (
    <>
      <ItineraryHeader onSelfClick={handleOpenSelf} onAiClick={handleOpenAi} />
      <ItineraryDashboard showAiPrompt={false} />
      <SelfItineraryDrawer visible={selfDrawerOpen} onClose={handleCloseSelf} />
      <AiItineraryDrawer visible={aiDrawerOpen} onClose={handleCloseAi} />
    </>
  );
}
