'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';

export function DashboardAiPrompt() {
  const [aiPrompt, setAiPrompt] = useState('');

  return (
    <section className="tos-ai-prompt" aria-label="AI Itinerary Generator">
      <h2 className="tos-ai-prompt__title">
        <Icon name="Sparkles" size={24} aria-hidden />
        AI Itinerary Generator
      </h2>
      <p className="tos-ai-prompt__description">
        Describe your dream trip and our AI will craft a personalized, day-by-day
        itinerary complete with activities, hotels, and travel logistics.
      </p>
      <div className="tos-ai-prompt__input-row">
        <input
          type="text"
          className="tos-ai-prompt__input"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="e.g., A 7-day romantic honeymoon in Bali focusing on beaches and culture…"
          aria-label="Describe your trip"
        />
        <button className="tos-ai-prompt__btn" type="button">
          Generate
          <Icon name="Send" size={18} aria-hidden />
        </button>
      </div>
    </section>
  );
}
