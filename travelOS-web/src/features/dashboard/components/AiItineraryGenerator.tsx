'use client';

import React, { useState } from 'react';
import { Icon } from '@/shared/components/Icon';

export const AiItineraryGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    // Future: call AI itinerary API
  };

  return (
    <section className="tos-ai-generator" aria-label="AI Itinerary Generator">
      <div className="tos-ai-generator__title">
        <Icon name="Sparkles" size={22} color="#ffffff" aria-hidden="true" />
        AI Itinerary Generator
      </div>
      <p className="tos-ai-generator__subtitle">
        Describe your dream trip and our AI will craft a personalized, day-by-day itinerary complete
        with activities, hotels, and travel logistics.
      </p>
      <div className="tos-ai-generator__form">
        <input
          className="tos-ai-generator__input"
          type="text"
          placeholder="e.g., A 7-day romantic honeymoon in Bali focusing on beaches and culture..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          aria-label="Describe your trip"
        />
        <button
          className="tos-ai-generator__btn"
          onClick={handleGenerate}
          type="button"
          aria-label="Generate itinerary"
        >
          Generate
          <Icon name="Send" size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

AiItineraryGenerator.displayName = 'AiItineraryGenerator';
