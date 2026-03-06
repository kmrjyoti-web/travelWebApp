'use client';

import React, { useState } from 'react';
import { Icon } from '@/shared/components';
import type { IconName } from '@/shared/components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  topPackages,
  PackageScroller,
  PriceTrendChart,
  WatchListWidget,
  TravelAlertsWidget,
  WeatherAdvisoryWidget,
} from './DashboardWidgets';

// ── Mock Data ──────────────────────────────────────────────────────────────────
const searchMarketplaceData = [
  { name: 'Bali', searches: 4500 },
  { name: 'Maldives', searches: 3800 },
  { name: 'Dubai', searches: 3200 },
  { name: 'Paris', searches: 2900 },
  { name: 'Swiss Alps', searches: 2500 },
  { name: 'Tokyo', searches: 2100 },
  { name: 'Phuket', searches: 1800 },
  { name: 'Santorini', searches: 1500 },
  { name: 'Rome', searches: 1200 },
  { name: 'New York', searches: 900 },
];

const searchWebsiteData = [
  { name: 'Kerala', searches: 5200 },
  { name: 'Goa', searches: 4800 },
  { name: 'Rajasthan', searches: 4100 },
  { name: 'Himachal', searches: 3500 },
  { name: 'Andaman', searches: 3100 },
  { name: 'Kashmir', searches: 2800 },
  { name: 'Sikkim', searches: 2200 },
  { name: 'Uttarakhand', searches: 1900 },
  { name: 'Meghalaya', searches: 1400 },
  { name: 'Gujarat', searches: 1100 },
];

const conversionMarketplaceData = [
  { name: 'Bali', rate: 12.5 },
  { name: 'Dubai', rate: 10.2 },
  { name: 'Maldives', rate: 9.8 },
  { name: 'Paris', rate: 8.5 },
  { name: 'Swiss Alps', rate: 7.2 },
];

const conversionWebsiteData = [
  { name: 'Goa', rate: 15.4 },
  { name: 'Kerala', rate: 14.2 },
  { name: 'Rajasthan', rate: 11.8 },
  { name: 'Andaman', rate: 10.5 },
  { name: 'Himachal', rate: 9.1 },
];

type Region = 'World' | 'India' | 'Other';

const trendingSearchData: Record<Region, { month: string; value: number }[]> = {
  World: [
    { month: 'Jan', value: 4000 }, { month: 'Feb', value: 3000 }, { month: 'Mar', value: 5000 },
    { month: 'Apr', value: 4500 }, { month: 'May', value: 6000 }, { month: 'Jun', value: 7000 },
  ],
  India: [
    { month: 'Jan', value: 2000 }, { month: 'Feb', value: 2500 }, { month: 'Mar', value: 3500 },
    { month: 'Apr', value: 3000 }, { month: 'May', value: 4500 }, { month: 'Jun', value: 5000 },
  ],
  Other: [
    { month: 'Jan', value: 1000 }, { month: 'Feb', value: 1200 }, { month: 'Mar', value: 1500 },
    { month: 'Apr', value: 1800 }, { month: 'May', value: 2000 }, { month: 'Jun', value: 2200 },
  ],
};

const trendingVisitData: Record<Region, { month: string; value: number }[]> = {
  World: [
    { month: 'Jan', value: 2000 }, { month: 'Feb', value: 1500 }, { month: 'Mar', value: 2500 },
    { month: 'Apr', value: 2200 }, { month: 'May', value: 3000 }, { month: 'Jun', value: 3500 },
  ],
  India: [
    { month: 'Jan', value: 1000 }, { month: 'Feb', value: 1200 }, { month: 'Mar', value: 1800 },
    { month: 'Apr', value: 1500 }, { month: 'May', value: 2200 }, { month: 'Jun', value: 2500 },
  ],
  Other: [
    { month: 'Jan', value: 500 }, { month: 'Feb', value: 600 }, { month: 'Mar', value: 750 },
    { month: 'Apr', value: 900 }, { month: 'May', value: 1000 }, { month: 'Jun', value: 1100 },
  ],
};

// ── Shared styles ──────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: 'var(--cui-body-bg, #fff)',
  padding: '1.5rem',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px rgba(0,0,0,.08)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
};

const CARD_TITLE: React.CSSProperties = {
  margin: 0,
  fontSize: '1.125rem',
  fontWeight: 700,
  color: 'var(--cui-body-color, #374151)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const SELECT_STYLE: React.CSSProperties = {
  background: 'var(--cui-body-bg, #f9fafb)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
  color: 'var(--cui-body-color, #374151)',
  fontSize: '0.875rem',
  borderRadius: '0.5rem',
  padding: '0.375rem 0.5rem',
  outline: 'none',
  cursor: 'pointer',
};

const TOOLTIP_CONTENT_STYLE = {
  borderRadius: '0.5rem',
  border: 'none',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
  backgroundColor: 'var(--cui-body-bg, #fff)',
  color: 'var(--cui-body-color, #000)',
};

// ── KpiCard ────────────────────────────────────────────────────────────────────
interface KpiCardProps {
  title: string;
  value: string;
  iconName: IconName;
  iconColor: string;
}

const KpiCard = ({ title, value, iconName, iconColor }: KpiCardProps) => (
  <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: `${iconColor}1a`, flexShrink: 0 }}>
      <Icon name={iconName} size={24} style={{ color: iconColor }} />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--cui-secondary-color, #6b7280)', fontWeight: 500 }}>{title}</p>
      <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--cui-body-color, #111827)' }}>{value}</h3>
    </div>
  </div>
);

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ItineraryDashboard({ showAiPrompt = true }: { showAiPrompt?: boolean }) {
  const [trendingSearchRegion, setTrendingSearchRegion] = useState<Region>('World');
  const [trendingVisitRegion, setTrendingVisitRegion]   = useState<Region>('World');
  const [aiPrompt, setAiPrompt] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '80rem', margin: '0 auto', paddingBottom: '2.5rem' }}>

      {/* AI Prompt Card */}
      {showAiPrompt && (
        <div style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #0f172a 100%)', padding: '1px', overflow: 'hidden' }}>
          <div style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(12px)', borderRadius: 'calc(1rem - 1px)', padding: '2rem', border: '1px solid rgba(255,255,255,.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,.1)', borderRadius: '0.5rem' }}>
                <Icon name="Sparkles" size={24} style={{ color: '#d8b4fe' }} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em' }}>
                AI Itinerary Generator
              </h2>
            </div>
            <p style={{ color: 'rgba(216,180,254,.8)', marginBottom: '1.5rem', maxWidth: '42rem' }}>
              Describe your dream trip, and our AI will instantly craft a personalized, day-by-day itinerary complete with activities, hotels, and travel logistics.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  <Icon name="MapPin" size={20} style={{ color: 'rgba(216,180,254,.5)' }} />
                </div>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., A 7-day romantic honeymoon in Bali focusing on beaches and culture..."
                  style={{ width: '100%', paddingLeft: '3rem', paddingRight: '1rem', paddingTop: '1rem', paddingBottom: '1rem', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '0.75rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <button
                style={{ padding: '1rem 2rem', background: 'linear-gradient(to right, #a855f7, #6366f1)', color: '#fff', fontWeight: 600, borderRadius: '0.75rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Generate</span>
                <Icon name="Send" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <KpiCard title="Total Itineraries" value="12,450"  iconName="Map"        iconColor="#3b82f6" />
        <KpiCard title="My Itineraries"    value="142"     iconName="Globe"      iconColor="#10b981" />
        <KpiCard title="Downloaded"        value="3,890"   iconName="Download"   iconColor="#f59e0b" />
        <KpiCard title="AI Generated"      value="8,210"   iconName="Sparkles"   iconColor="#a855f7" />
        <KpiCard title="Marketplace"       value="5,120"   iconName="Store"      iconColor="#ec4899" />
        <KpiCard title="Website"           value="4,830"   iconName="Earth"      iconColor="#06b6d4" />
        <KpiCard title="Both (Mkt & Web)"  value="2,500"   iconName="Layers"     iconColor="#6366f1" />
        <KpiCard title="Conversion Rate"   value="14.2%"   iconName="TrendingUp" iconColor="#f43f5e" />
      </div>

      {/* Top 10 Searches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        <div style={CARD}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={CARD_TITLE}>
              <Icon name="Store" size={20} style={{ color: '#ec4899' }} />
              Top 10 Search - Marketplace
            </h3>
          </div>
          <div style={{ height: '18rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={searchMarketplaceData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(249,250,251,.5)' }} contentStyle={TOOLTIP_CONTENT_STYLE} />
                <Bar dataKey="searches" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={CARD}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={CARD_TITLE}>
              <Icon name="Earth" size={20} style={{ color: '#06b6d4' }} />
              Top 10 Search - Website
            </h3>
          </div>
          <div style={{ height: '18rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={searchWebsiteData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: 'rgba(249,250,251,.5)' }} contentStyle={TOOLTIP_CONTENT_STYLE} />
                <Bar dataKey="searches" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 10 Conversions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        <div style={CARD}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={CARD_TITLE}>
              <Icon name="TrendingUp" size={20} style={{ color: '#10b981' }} />
              Top Conversions - Marketplace
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {conversionMarketplaceData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'var(--cui-secondary-bg, #f3f4f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--cui-secondary-color, #6b7280)', flexShrink: 0 }}>
                    {index + 1}
                  </div>
                  <span style={{ fontWeight: 500, color: 'var(--cui-body-color, #374151)' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '8rem', height: '0.5rem', background: 'var(--cui-secondary-bg, #f3f4f6)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#10b981', borderRadius: '9999px', width: `${(item.rate / 15) * 100}%` }} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669', width: '3rem', textAlign: 'right' }}>{item.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={CARD}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={CARD_TITLE}>
              <Icon name="TrendingUp" size={20} style={{ color: '#3b82f6' }} />
              Top Conversions - Website
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {conversionWebsiteData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'var(--cui-secondary-bg, #f3f4f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--cui-secondary-color, #6b7280)', flexShrink: 0 }}>
                    {index + 1}
                  </div>
                  <span style={{ fontWeight: 500, color: 'var(--cui-body-color, #374151)' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '8rem', height: '0.5rem', background: 'var(--cui-secondary-bg, #f3f4f6)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#3b82f6', borderRadius: '9999px', width: `${(item.rate / 16) * 100}%` }} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2563eb', width: '3rem', textAlign: 'right' }}>{item.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Package Scrollers */}
      <PackageScroller title="Top 10 Packages" packages={topPackages.slice(0, 5)} />
      <PackageScroller title="Top 10 Offers This Week" packages={topPackages.filter(p => p.isOffer)} highlightLowest={true} />

      {/* Price Trends & Watch List */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <PriceTrendChart />
        <WatchListWidget />
      </div>

      {/* Alerts & Weather */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        <TravelAlertsWidget />
        <WeatherAdvisoryWidget />
      </div>

      {/* Trending Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        <div style={CARD}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={CARD_TITLE}>
              <Icon name="Search" size={20} style={{ color: '#6366f1' }} />
              Trending Searches
            </h3>
            <select
              value={trendingSearchRegion}
              onChange={(e) => setTrendingSearchRegion(e.target.value as Region)}
              style={SELECT_STYLE}
            >
              <option value="World">World</option>
              <option value="India">India</option>
              <option value="Other">Other Countries</option>
            </select>
          </div>
          <div style={{ height: '16rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendingSearchData[trendingSearchRegion]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSearch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip contentStyle={TOOLTIP_CONTENT_STYLE} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSearch)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={CARD}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={CARD_TITLE}>
              <Icon name="MapPin" size={20} style={{ color: '#f97316' }} />
              Trending Visits
            </h3>
            <select
              value={trendingVisitRegion}
              onChange={(e) => setTrendingVisitRegion(e.target.value as Region)}
              style={SELECT_STYLE}
            >
              <option value="World">World</option>
              <option value="India">India</option>
              <option value="Other">Other Countries</option>
            </select>
          </div>
          <div style={{ height: '16rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendingVisitData[trendingVisitRegion]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip contentStyle={TOOLTIP_CONTENT_STYLE} />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorVisit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
