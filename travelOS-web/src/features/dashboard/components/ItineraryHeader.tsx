"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { User, Store, Sparkles } from 'lucide-react';

interface ItineraryHeaderProps {
  onSelfClick?: () => void;
  onMarketplaceClick?: () => void;
  onAiClick?: () => void;
}

export default function ItineraryHeader({ onSelfClick, onMarketplaceClick, onAiClick }: ItineraryHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Itinerary</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1">Add Itinerary:</span>

        <button
          type="button"
          onClick={onSelfClick}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <User size={16} />
          <span>Self</span>
        </button>

        <button
          type="button"
          onClick={onMarketplaceClick}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Store size={16} />
          <span>Search Marketplace</span>
        </button>

        <button
          type="button"
          onClick={onAiClick}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-purple-500/25"
        >
          <Sparkles size={16} />
          <span>Create With AI</span>
        </button>
      </div>
    </motion.div>
  );
}
