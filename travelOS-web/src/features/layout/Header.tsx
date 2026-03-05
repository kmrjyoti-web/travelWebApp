"use client";

import { useState } from "react";
import {
  Menu,
  Wifi,
  User,
  Download,
  Ticket,
  HelpCircle,
  Settings,
  Bell,
  Command,
  Clock,
  PlayCircle,
  RefreshCw,
  Calendar,
  LogOut,
  X,
  MoreVertical,
} from "lucide-react";
import { useUIKitTheme } from "@/features/theme/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({
  toggleSidebar,
}: {
  toggleSidebar?: () => void;
}) {
  const { toggleSettings } = useUIKitTheme();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="h-14 bg-[var(--header-bg)] text-white flex items-center justify-between px-2 shrink-0 transition-colors duration-300 relative z-30">
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-xl font-bold tracking-wider">
          <span className="text-orange-500 mr-1">Travel</span>OS
        </div>
        <button className="p-1 hover:bg-white/10 rounded" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>

        <div className="relative ml-2">
          <button
            className="flex items-center bg-white/10 hover:bg-white/20 transition-colors px-2 sm:px-3 py-1 rounded text-xs text-left"
            onClick={() => setIsCompanyModalOpen(true)}
          >
            <div className="w-6 h-6 bg-white rounded sm:mr-2 flex items-center justify-center text-[var(--header-bg)] font-bold">A</div>
            <div className="hidden sm:block">
              <div className="font-bold">DEMO Aliya.. (ALIYA)</div>
              <div className="text-[10px] text-gray-300">
                Books From 01-04-2025 to 31-03-2026
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isCompanyModalOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCompanyModalOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden text-gray-800"
                >
                  <div className="bg-[var(--header-bg)] p-4 text-white flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-[var(--header-bg)] font-bold text-lg">A</div>
                      <div>
                        <h3 className="font-bold text-base">DEMO Aliya.. (ALIYA)</h3>
                        <p className="text-xs text-white/80">Travel OS Pvt Ltd</p>
                      </div>
                    </div>
                    <button onClick={() => setIsCompanyModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Financial Year</span>
                      <span className="font-medium">2025 - 2026</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Books From</span>
                      <span className="font-medium">01-04-2025</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-500">GSTIN</span>
                      <span className="font-medium">27AADCB2230M1Z2</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Branch</span>
                      <span className="font-medium">Head Office</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200 flex space-x-2">
                    <button
                      className="flex-1 py-2 px-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded flex items-center justify-center transition-colors text-sm font-medium"
                      onClick={() => setIsCompanyModalOpen(false)}
                    >
                      Switch Company
                    </button>
                    <button
                      className="flex-1 py-2 px-4 bg-[var(--accent-color)] hover:opacity-90 text-white rounded flex items-center justify-center transition-colors text-sm font-medium"
                      onClick={() => setIsCompanyModalOpen(false)}
                    >
                      Edit Details
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden md:flex items-center space-x-1 text-xs text-green-400">
          <Wifi size={14} />
          <span>10 Mb/s</span>
          <span className="text-white ml-2">V. 1.3.212.b</span>
          <div className="w-2 h-2 bg-red-500 rounded-full ml-1"></div>
        </div>
      </div>

      <div className="flex items-center space-x-1 text-xs">
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1">
          {/* Quick Access */}
          <div className="flex items-center space-x-1 mr-2 border-r border-white/20 pr-3">
            <button className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors" title="Watch Video">
              <PlayCircle size={16} />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors" title="Sync">
              <RefreshCw size={16} />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors" title="Calendar">
              <Calendar size={16} />
            </button>
          </div>

          <HeaderIcon icon={<Download size={18} />} label="Pur. Import" />
          <HeaderIcon icon={<Ticket size={18} />} label="Ticket" />
          <HeaderIcon icon={<HelpCircle size={18} />} label="Help" />
          <HeaderIcon icon={<Settings size={18} />} label="Settings" onClick={toggleSettings} />
          <HeaderIcon icon={<Bell size={18} />} label="Notification" />
          <HeaderIcon icon={<Command size={18} />} label="Shortcut" />
          <HeaderIcon icon={<Clock size={18} />} label="History" />
        </div>

        <div className="relative">
          <HeaderIcon icon={<User size={18} />} label="" onClick={() => setIsUserModalOpen(true)} />

          <AnimatePresence>
            {isUserModalOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserModalOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden text-gray-800"
                >
                  <div className="bg-[var(--header-bg)] p-4 text-white flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">Aliya Demo</h3>
                      <p className="text-xs text-white/80">admin@travelos.com</p>
                    </div>
                    <button onClick={() => setIsUserModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Role</span>
                      <span className="font-medium">Administrator</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Status</span>
                      <span className="text-green-600 font-medium flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-500">Last Login</span>
                      <span className="font-medium">Today, 09:41 AM</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <a
                      href="/login"
                      className="w-full py-2 px-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded flex items-center justify-center space-x-2 transition-colors text-sm font-medium mb-2"
                    >
                      <span>View Login Experience</span>
                    </a>
                    <button
                      className="w-full py-2 px-4 bg-white border border-gray-300 hover:bg-gray-100 text-red-600 rounded flex items-center justify-center space-x-2 transition-colors text-sm font-medium"
                      onClick={() => {
                        setIsUserModalOpen(false);
                        // Add logout logic here
                      }}
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center">
          <button
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-2 top-14 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden text-gray-800 lg:hidden"
            >
              <div className="p-2 flex flex-col space-y-1">
                <MobileMenuRow icon={<Download size={18} />} label="Pur. Import" />
                <MobileMenuRow icon={<Ticket size={18} />} label="Ticket" />
                <MobileMenuRow icon={<HelpCircle size={18} />} label="Help" />
                <MobileMenuRow icon={<Settings size={18} />} label="Settings" onClick={() => { setIsMobileMenuOpen(false); toggleSettings(); }} />
                <MobileMenuRow icon={<Bell size={18} />} label="Notification" />
                <MobileMenuRow icon={<Command size={18} />} label="Shortcut" />
                <MobileMenuRow icon={<Clock size={18} />} label="History" />
              </div>
              <div className="p-3 border-t border-gray-100 flex justify-around bg-gray-50">
                <button className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors flex flex-col items-center" title="Watch Video">
                  <PlayCircle size={18} />
                  <span className="text-[10px] mt-1 font-medium">Video</span>
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors flex flex-col items-center" title="Sync">
                  <RefreshCw size={18} />
                  <span className="text-[10px] mt-1 font-medium">Sync</span>
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors flex flex-col items-center" title="Calendar">
                  <Calendar size={18} />
                  <span className="text-[10px] mt-1 font-medium">Calendar</span>
                </button>
              </div>
              <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-green-600 font-medium">
                <div className="flex items-center space-x-1">
                  <Wifi size={14} />
                  <span>10 Mb/s</span>
                </div>
                <span className="text-gray-500">V. 1.3.212.b</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeaderIcon({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button className="flex flex-col items-center justify-center w-14 h-12 hover:bg-white/10 rounded" onClick={onClick}>
      {icon}
      {label && <span className="text-[9px] mt-1">{label}</span>}
    </button>
  );
}

function MobileMenuRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors w-full text-left" onClick={onClick}>
      <span className="text-gray-500">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
