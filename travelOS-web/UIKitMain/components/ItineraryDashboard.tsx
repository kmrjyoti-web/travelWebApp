"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Map, 
  Globe, 
  Download, 
  Sparkles, 
  Store, 
  Globe2, 
  Layers, 
  TrendingUp,
  Search,
  ArrowRight,
  MapPin,
  Send
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  topPackages, 
  PackageScroller, 
  PriceTrendChart, 
  WatchListWidget, 
  TravelAlertsWidget, 
  WeatherAdvisoryWidget 
} from './DashboardWidgets';

// --- MOCK DATA ---
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

const trendingSearchData = {
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
  ]
};

const trendingVisitData = {
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
  ]
};

// --- COMPONENTS ---

const KpiCard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-20px" }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 hover:shadow-md transition-shadow"
  >
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
      <Icon className={colorClass.replace('bg-', 'text-').replace('10', '500')} size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
    </div>
  </motion.div>
);

export default function ItineraryDashboard() {
  const [trendingSearchRegion, setTrendingSearchRegion] = useState<'World' | 'India' | 'Other'>('World');
  const [trendingVisitRegion, setTrendingVisitRegion] = useState<'World' | 'India' | 'Other'>('World');
  const [aiPrompt, setAiPrompt] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* AI Prompt Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-1"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="text-purple-300" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Itinerary Generator</h2>
          </div>
          <p className="text-purple-200/80 mb-6 max-w-2xl">
            Describe your dream trip, and our AI will instantly craft a personalized, day-by-day itinerary complete with activities, hotels, and travel logistics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="text-purple-300/50" size={20} />
              </div>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., A 7-day romantic honeymoon in Bali focusing on beaches and culture..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              <span>Generate</span>
              <Send size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Itineraries" value="12,450" icon={Map} colorClass="bg-blue-500" delay={0.1} />
        <KpiCard title="My Itineraries" value="142" icon={Globe} colorClass="bg-emerald-500" delay={0.2} />
        <KpiCard title="Downloaded" value="3,890" icon={Download} colorClass="bg-amber-500" delay={0.3} />
        <KpiCard title="AI Generated" value="8,210" icon={Sparkles} colorClass="bg-purple-500" delay={0.4} />
        <KpiCard title="Marketplace" value="5,120" icon={Store} colorClass="bg-pink-500" delay={0.5} />
        <KpiCard title="Website" value="4,830" icon={Globe2} colorClass="bg-cyan-500" delay={0.6} />
        <KpiCard title="Both (Mkt & Web)" value="2,500" icon={Layers} colorClass="bg-indigo-500" delay={0.7} />
        <KpiCard title="Conversion Rate" value="14.2%" icon={TrendingUp} colorClass="bg-rose-500" delay={0.8} />
      </div>

      {/* Top 10 Searches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <Store className="mr-2 text-pink-500" size={20} />
              Top 10 Search - Marketplace
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={searchMarketplaceData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" className="dark:opacity-10" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#f9fafb', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)', color: 'var(--tooltip-text, #000)' }} />
                <Bar dataKey="searches" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <Globe2 className="mr-2 text-cyan-500" size={20} />
              Top 10 Search - Website
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={searchWebsiteData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" className="dark:opacity-10" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#f9fafb', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)', color: 'var(--tooltip-text, #000)' }} />
                <Bar dataKey="searches" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top 10 Conversions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <TrendingUp className="mr-2 text-emerald-500" size={20} />
              Top Conversions - Marketplace
            </h3>
          </div>
          <div className="space-y-4">
            {conversionMarketplaceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(item.rate / 15) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 w-12 text-right">{item.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <TrendingUp className="mr-2 text-blue-500" size={20} />
              Top Conversions - Website
            </h3>
          </div>
          <div className="space-y-4">
            {conversionWebsiteData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(item.rate / 16) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 w-12 text-right">{item.rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* New Widgets Row 1: Package Scrollers */}
      <PackageScroller title="Top 10 Packages" packages={topPackages.slice(0, 5)} />
      <PackageScroller title="Top 10 Offers This Week" packages={topPackages.filter(p => p.isOffer)} highlightLowest={true} />

      {/* New Widgets Row 2: Price Trends & Watch List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceTrendChart />
        </div>
        <div className="lg:col-span-1">
          <WatchListWidget />
        </div>
      </div>

      {/* New Widgets Row 3: Alerts & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TravelAlertsWidget />
        <WeatherAdvisoryWidget />
      </div>

      {/* Trending Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <Search className="mr-2 text-indigo-500" size={20} />
              Trending Searches
            </h3>
            <select 
              value={trendingSearchRegion}
              onChange={(e) => setTrendingSearchRegion(e.target.value as any)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
            >
              <option value="World">World</option>
              <option value="India">India</option>
              <option value="Other">Other Countries</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendingSearchData[trendingSearchRegion]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSearch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:opacity-10" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)', color: 'var(--tooltip-text, #000)' }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSearch)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <MapPin className="mr-2 text-orange-500" size={20} />
              Trending Visits
            </h3>
            <select 
              value={trendingVisitRegion}
              onChange={(e) => setTrendingVisitRegion(e.target.value as any)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2 outline-none"
            >
              <option value="World">World</option>
              <option value="India">India</option>
              <option value="Other">Other Countries</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendingVisitData[trendingVisitRegion]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:opacity-10" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)', color: 'var(--tooltip-text, #000)' }} />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorVisit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
