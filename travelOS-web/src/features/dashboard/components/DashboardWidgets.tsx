"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SelectField } from '@/shared/components';
import {
  MapPin,
  Star,
  Clock,
  TrendingDown,
  AlertTriangle,
  Info,
  CloudRain,
  Sun,
  Cloud,
  Wind,
  ShieldAlert,
  Bell,
  Newspaper,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// --- MOCK DATA ---

export const topPackages = [
  { id: 1, title: "Bali Paradise Escape", location: "Bali, Indonesia", image: "https://picsum.photos/seed/bali/400/300", price: 899, originalPrice: 1200, duration: "7 Days", rating: 4.8, isOffer: true },
  { id: 2, title: "Swiss Alps Adventure", location: "Zurich, Switzerland", image: "https://picsum.photos/seed/swiss/400/300", price: 1499, originalPrice: 1800, duration: "5 Days", rating: 4.9, isOffer: false },
  { id: 3, title: "Maldives Honeymoon", location: "Malé, Maldives", image: "https://picsum.photos/seed/maldives/400/300", price: 2199, originalPrice: 2500, duration: "6 Days", rating: 5.0, isOffer: true },
  { id: 4, title: "Tokyo City Explorer", location: "Tokyo, Japan", image: "https://picsum.photos/seed/tokyo/400/300", price: 1150, originalPrice: 1300, duration: "8 Days", rating: 4.7, isOffer: false },
  { id: 5, title: "Dubai Luxury Stay", location: "Dubai, UAE", image: "https://picsum.photos/seed/dubai/400/300", price: 950, originalPrice: 1100, duration: "4 Days", rating: 4.6, isOffer: true },
  { id: 6, title: "Parisian Romance", location: "Paris, France", image: "https://picsum.photos/seed/paris/400/300", price: 1350, originalPrice: 1600, duration: "5 Days", rating: 4.8, isOffer: false },
  { id: 7, title: "Santorini Getaway", location: "Santorini, Greece", image: "https://picsum.photos/seed/greece/400/300", price: 1250, originalPrice: 1500, duration: "6 Days", rating: 4.9, isOffer: true },
  { id: 8, title: "Phuket Beach Resort", location: "Phuket, Thailand", image: "https://picsum.photos/seed/phuket/400/300", price: 650, originalPrice: 850, duration: "5 Days", rating: 4.5, isOffer: true },
  { id: 9, title: "Rome Historical Tour", location: "Rome, Italy", image: "https://picsum.photos/seed/rome/400/300", price: 1050, originalPrice: 1200, duration: "7 Days", rating: 4.7, isOffer: false },
  { id: 10, title: "New York Highlights", location: "New York, USA", image: "https://picsum.photos/seed/ny/400/300", price: 1550, originalPrice: 1800, duration: "5 Days", rating: 4.6, isOffer: false },
];

export const priceTrendData = [
  { month: 'Jan', Bali: 900, Paris: 1200, Dubai: 1100, Tokyo: 1300 },
  { month: 'Feb', Bali: 850, Paris: 1150, Dubai: 1050, Tokyo: 1250 },
  { month: 'Mar', Bali: 950, Paris: 1300, Dubai: 1150, Tokyo: 1400 },
  { month: 'Apr', Bali: 1000, Paris: 1400, Dubai: 1200, Tokyo: 1500 },
  { month: 'May', Bali: 1100, Paris: 1500, Dubai: 1000, Tokyo: 1450 },
  { month: 'Jun', Bali: 1200, Paris: 1600, Dubai: 900, Tokyo: 1350 },
];

export const watchList = [
  { id: 1, title: "Kyoto Cherry Blossoms", location: "Kyoto, Japan", price: 1200, drop: 150 },
  { id: 2, title: "Amalfi Coast Drive", location: "Amalfi, Italy", price: 1450, drop: 0 },
  { id: 3, title: "Northern Lights Igloo", location: "Tromsø, Norway", price: 1800, drop: 200 },
];

export const travelAlerts = [
  { id: 1, type: 'alert', country: 'Japan', message: 'Typhoon warning in southern regions. Flights may be delayed.', severity: 'high', time: '2 hours ago' },
  { id: 2, type: 'news', country: 'France', message: 'Eiffel Tower extends visiting hours for the summer season.', severity: 'info', time: '5 hours ago' },
  { id: 3, type: 'advisory', country: 'Global', message: 'New visa requirements for Schengen area starting next month.', severity: 'medium', time: '1 day ago' },
  { id: 4, type: 'alert', country: 'Indonesia', message: 'Volcanic ash cloud near Bali. Airport operating normally but monitor status.', severity: 'medium', time: '2 days ago' },
];

// --- COMPONENTS ---

export const PackageScroller = ({ title, packages, highlightLowest = false }: { title: string, packages: any[], highlightLowest?: boolean }) => {
  const lowestPrice = Math.min(...packages.map(p => p.price));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar -mx-2 px-2">
        {packages.map((pkg, idx) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`flex-shrink-0 w-64 rounded-xl overflow-hidden border ${highlightLowest && pkg.price === lowestPrice ? 'border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 group cursor-pointer hover:shadow-lg transition-all`}
          >
            <div className="relative h-40 overflow-hidden">
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              {pkg.isOffer && (
                <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                  Special Offer
                </div>
              )}
              {highlightLowest && pkg.price === lowestPrice && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center">
                  <TrendingDown size={12} className="mr-1" /> Lowest
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-800 dark:text-white truncate pr-2">{pkg.title}</h4>
                <div className="flex items-center text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                  <Star size={10} className="mr-1 fill-current" /> {pkg.rating}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-3">
                <MapPin size={12} className="mr-1" /> {pkg.location}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 line-through">${pkg.originalPrice}</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">${pkg.price}</p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                  <Clock size={12} className="mr-1" /> {pkg.duration}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const PriceTrendChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
          <TrendingDown className="mr-2 text-indigo-500" size={20} />
          Top Price Trends (Country Wise)
        </h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:opacity-10" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)', color: 'var(--tooltip-text, #000)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            <Line type="monotone" dataKey="Bali" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Paris" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Dubai" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Tokyo" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export const WatchListWidget = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
          <Bookmark className="mr-2 text-amber-500" size={20} />
          My Watch List
        </h3>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {watchList.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{item.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <MapPin size={10} className="mr-1" /> {item.location}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-indigo-600 dark:text-indigo-400">${item.price}</p>
              {item.drop > 0 ? (
                <p className="text-xs text-emerald-500 font-medium flex items-center justify-end mt-1">
                  <TrendingDown size={10} className="mr-1" /> -${item.drop}
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">No change</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        + Add to Watch List
      </button>
    </motion.div>
  );
};

export const TravelAlertsWidget = () => {
  const [filter, setFilter] = useState('All');

  const filteredAlerts = filter === 'All' ? travelAlerts : travelAlerts.filter(a => a.country === filter || a.country === 'Global');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
          <Bell className="mr-2 text-rose-500" size={20} />
          Travel Alerts & News
        </h3>
        <SelectField
          label="Region"
          variant="outlined"
          size="sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Regions</option>
          <option value="Japan">Japan</option>
          <option value="France">France</option>
          <option value="Indonesia">Indonesia</option>
        </SelectField>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <div className={`p-2 rounded-full flex-shrink-0 ${
              alert.type === 'alert' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
              alert.type === 'news' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>
              {alert.type === 'alert' ? <AlertTriangle size={16} /> :
               alert.type === 'news' ? <Newspaper size={16} /> :
               <ShieldAlert size={16} />}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  alert.severity === 'high' ? 'text-rose-500' :
                  alert.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                }`}>
                  {alert.country}
                </span>
                <span className="text-[10px] text-gray-400">{alert.time}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const WeatherAdvisoryWidget = () => {
  const [country, setCountry] = useState('Japan');
  const [city, setCity] = useState('Tokyo');

  // Mock dynamic data based on selection
  const isJapan = country === 'Japan';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
          <CloudRain className="mr-2 text-cyan-500" size={20} />
          Weather & Advisory
        </h3>
      </div>

      <div className="flex space-x-2 mb-4">
        <div style={{ flex: 1 }}>
          <SelectField
            label="Country"
            variant="outlined"
            size="sm"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setCity(e.target.value === 'Japan' ? 'Tokyo' : 'Paris'); }}
          >
            <option value="Japan">Japan</option>
            <option value="France">France</option>
            <option value="Indonesia">Indonesia</option>
          </SelectField>
        </div>
        <div style={{ flex: 1 }}>
          <SelectField
            label="City"
            variant="outlined"
            size="sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {isJapan ? (
              <>
                <option value="Tokyo">Tokyo</option>
                <option value="Kyoto">Kyoto</option>
              </>
            ) : (
              <>
                <option value="Paris">Paris</option>
                <option value="Lyon">Lyon</option>
              </>
            )}
          </SelectField>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Weather */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-4 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-20">
            {isJapan ? <Sun size={100} /> : <CloudRain size={100} />}
          </div>
          <div className="relative z-10">
            <p className="text-xs font-medium opacity-80 mb-1">Current Weather</p>
            <h4 className="text-3xl font-bold">{isJapan ? '24°C' : '16°C'}</h4>
            <p className="text-sm font-medium mt-1 flex items-center">
              {isJapan ? <Sun size={14} className="mr-1" /> : <CloudRain size={14} className="mr-1" />}
              {isJapan ? 'Sunny & Clear' : 'Light Rain'}
            </p>
          </div>
          <div className="relative z-10 flex justify-between text-xs mt-4 opacity-80">
            <span className="flex items-center"><Wind size={12} className="mr-1" /> {isJapan ? '12 km/h' : '18 km/h'}</span>
            <span className="flex items-center"><Cloud size={12} className="mr-1" /> {isJapan ? '10%' : '80%'}</span>
          </div>
        </div>

        {/* Advisory */}
        <div className={`rounded-xl p-4 flex flex-col justify-between border ${isJapan ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'}`}>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isJapan ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>Travel Advisory</p>
            <div className="flex items-start space-x-2">
              {isJapan ? (
                <ShieldAlert size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              <h4 className={`font-bold text-sm leading-tight ${isJapan ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'}`}>
                {isJapan ? 'Level 1: Exercise Normal Precautions' : 'Level 2: Exercise Increased Caution'}
              </h4>
            </div>
          </div>
          <p className={`text-xs mt-3 ${isJapan ? 'text-emerald-700 dark:text-emerald-400/80' : 'text-amber-700 dark:text-amber-400/80'}`}>
            {isJapan ? 'Overall safe for travel. Standard safety measures apply.' : 'Be aware of local protests in major cities. Avoid large gatherings.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
