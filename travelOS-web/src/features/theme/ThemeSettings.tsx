"use client";

import { useUIKitTheme } from "./ThemeProvider";
import { X, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR_PRESETS = [
  ["#0f4c75", "#3282b8"],
  ["#1a237e", "#3949ab"],
  ["#1b5e20", "#43a047"],
  ["#b71c1c", "#e53935"],
  ["#4a148c", "#8e24aa"],
  ["#01579b", "#039be5"],
  ["#263238", "#546e7a"],
  ["#e65100", "#fb8c00"],
  ["#1b6563", "#222d32"], // Default
  ["#880e4f", "#d81b60"],
  ["#000000", "#212121"],
  ["#3e2723", "#6d4c41"],
  ["#006064", "#00acc1"],
  ["#212121", "#ffb300"],
];

const BACKGROUNDS = [
  "none",
  "#ffffff",
  "https://picsum.photos/seed/space/400/300",
  "https://picsum.photos/seed/abstract/400/300",
  "https://picsum.photos/seed/mountains/400/300",
  "https://picsum.photos/seed/ocean/400/300",
  "https://picsum.photos/seed/city/400/300",
  "https://picsum.photos/seed/night/400/300",
  "https://picsum.photos/seed/paint/400/300",
  "https://picsum.photos/seed/texture/400/300",
  "https://picsum.photos/seed/dark/400/300",
];

export default function ThemeSettings() {
  const { theme, updateTheme, resetTheme, isSettingsOpen, toggleSettings } = useUIKitTheme();

  if (!isSettingsOpen) return null;

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={toggleSettings}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col overflow-hidden text-sm text-gray-700"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Theme Settings</h2>
              <button onClick={toggleSettings} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Theme Mode */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Theme Mode</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`py-2 px-3 border rounded text-xs font-medium transition-colors ${theme.themeMode === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ themeMode: 'light' })}
                    title="Always use light theme"
                  >
                    Light
                  </button>
                  <button
                    className={`py-2 px-3 border rounded text-xs font-medium transition-colors ${theme.themeMode === 'dark' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ themeMode: 'dark' })}
                    title="Always use dark theme"
                  >
                    Dark
                  </button>
                  <button
                    className={`py-2 px-3 border rounded text-xs font-medium transition-colors ${theme.themeMode === 'system' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ themeMode: 'system' })}
                    title="Follow your operating system's theme preference"
                  >
                    System
                  </button>
                  <button
                    className={`py-2 px-3 border rounded text-xs font-medium transition-colors ${theme.themeMode === 'time' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ themeMode: 'time' })}
                    title="Automatically switch to dark mode between 6 PM and 6 AM"
                  >
                    Time Based
                  </button>
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Color Presets</h3>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      className="h-8 rounded overflow-hidden flex border border-gray-200 hover:scale-105 transition-transform"
                      onClick={() => updateTheme({ headerBg: preset[0], sidebarBg: preset[1], accentColor: preset[0] })}
                    >
                      <div className="w-1/2 h-full" style={{ backgroundColor: preset[0] }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: preset[1] }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Colors</h3>
                <div className="space-y-3">
                  <ColorPicker label="Header Background" value={theme.headerBg} onChange={(v) => updateTheme({ headerBg: v })} />
                  <ColorPicker label="Sidebar Background" value={theme.sidebarBg} onChange={(v) => updateTheme({ sidebarBg: v })} />
                  <ColorPicker label="Sidebar Text" value={theme.sidebarText} onChange={(v) => updateTheme({ sidebarText: v })} />
                  <ColorPicker label="Accent Color" value={theme.accentColor} onChange={(v) => updateTheme({ accentColor: v })} />
                  <ColorPicker label="Icon Color" value={theme.iconColor} onChange={(v) => updateTheme({ iconColor: v })} />
                </div>
              </div>

              {/* Appearance */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Font Family</span>
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                      value={theme.fontFamily}
                      onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Open Sans, sans-serif">Open Sans</option>
                      <option value="system-ui, sans-serif">System UI</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Font Weight</span>
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                      value={theme.fontWeight}
                      onChange={(e) => updateTheme({ fontWeight: e.target.value })}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 w-24">Font Size ({theme.fontSize}px)</span>
                    <div className="flex items-center space-x-2 flex-1 justify-end">
                      <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ fontSize: Math.max(10, theme.fontSize - 1) })}><Minus size={14} /></button>
                      <input type="range" min="10" max="24" value={theme.fontSize} onChange={(e) => updateTheme({ fontSize: parseInt(e.target.value) })} className="w-20" />
                      <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ fontSize: Math.min(24, theme.fontSize + 1) })}><Plus size={14} /></button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 w-24">Zoom ({theme.zoom}%)</span>
                    <div className="flex items-center space-x-2 flex-1 justify-end">
                      <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ zoom: Math.max(50, theme.zoom - 10) })}><Minus size={14} /></button>
                      <input type="range" min="50" max="150" step="10" value={theme.zoom} onChange={(e) => updateTheme({ zoom: parseInt(e.target.value) })} className="w-20" />
                      <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ zoom: Math.min(150, theme.zoom + 10) })}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Background Mode */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Card Background</h3>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium border ${theme.cardBgMode === 'solid' ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ cardBgMode: 'solid' })}
                  >
                    Solid
                  </button>
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium border ${theme.cardBgMode === 'child' ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ cardBgMode: 'child' })}
                  >
                    Transparent
                  </button>
                </div>
                {theme.cardBgMode === 'child' && (
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-600 w-24">Opacity ({theme.cardBgOpacity}%)</span>
                    <div className="flex items-center space-x-2 flex-1 justify-end">
                      <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ cardBgOpacity: Math.max(0, theme.cardBgOpacity - 5) })}><Minus size={14} /></button>
                      <input type="range" min="0" max="100" step="5" value={theme.cardBgOpacity} onChange={(e) => updateTheme({ cardBgOpacity: parseInt(e.target.value) })} className="w-20" />
                      <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ cardBgOpacity: Math.min(100, theme.cardBgOpacity + 5) })}><Plus size={14} /></button>
                    </div>
                  </div>
                )}
              </div>

              {/* Background */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">App Background</h3>
                  <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={theme.fullPageBg} onChange={(e) => updateTheme({ fullPageBg: e.target.checked })} className="rounded border-gray-300" />
                    <span>Full Page</span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {BACKGROUNDS.map((bg, i) => (
                    <button
                      key={i}
                      className={`h-12 rounded border ${theme.background === bg ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} overflow-hidden flex items-center justify-center text-xs text-gray-500 hover:border-gray-400`}
                      style={bg.startsWith("http") ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover' } : { backgroundColor: bg === 'none' ? '#f3f4f6' : bg }}
                      onClick={() => updateTheme({ background: bg })}
                    >
                      {bg === "none" && "None"}
                    </button>
                  ))}
                </div>

                {/* Background Opacity */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600 w-24">Opacity ({theme.bgOpacity}%)</span>
                  <div className="flex items-center space-x-2 flex-1 justify-end">
                    <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ bgOpacity: Math.max(0, theme.bgOpacity - 5) })}><Minus size={14} /></button>
                    <input type="range" min="0" max="100" step="5" value={theme.bgOpacity} onChange={(e) => updateTheme({ bgOpacity: parseInt(e.target.value) })} className="w-20" />
                    <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ bgOpacity: Math.min(100, theme.bgOpacity + 5) })}><Plus size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Sidebar Background */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Sidebar Background</h3>
                <div className="grid grid-cols-3 gap-2">
                  {BACKGROUNDS.map((bg, i) => (
                    <button
                      key={i}
                      className={`h-12 rounded border ${theme.sidebarBgImage === bg ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} overflow-hidden flex items-center justify-center text-xs text-gray-500 hover:border-gray-400`}
                      style={bg.startsWith("http") ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover' } : { backgroundColor: bg === 'none' ? '#f3f4f6' : bg }}
                      onClick={() => updateTheme({ sidebarBgImage: bg })}
                    >
                      {bg === "none" && "None"}
                    </button>
                  ))}
                </div>

                {/* Sidebar Background Opacity */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600 w-24">Opacity ({theme.sidebarBgOpacity}%)</span>
                  <div className="flex items-center space-x-2 flex-1 justify-end">
                    <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ sidebarBgOpacity: Math.max(0, theme.sidebarBgOpacity - 5) })}><Minus size={14} /></button>
                    <input type="range" min="0" max="100" step="5" value={theme.sidebarBgOpacity} onChange={(e) => updateTheme({ sidebarBgOpacity: parseInt(e.target.value) })} className="w-20" />
                    <button className="p-1 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100" onClick={() => updateTheme({ sidebarBgOpacity: Math.min(100, theme.sidebarBgOpacity + 5) })}><Plus size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Menu Orientation */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Menu Orientation</h3>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium border ${theme.menuOrientation === 'vertical' ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ menuOrientation: 'vertical' })}
                  >
                    Vertical
                  </button>
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium border ${theme.menuOrientation === 'horizontal' ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ menuOrientation: 'horizontal' })}
                  >
                    Horizontal
                  </button>
                </div>
              </div>

              {/* Layout Width */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Layout Width</h3>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium border ${theme.layoutWidth === 'fluid' ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ layoutWidth: 'fluid' })}
                  >
                    Fluid
                  </button>
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium border ${theme.layoutWidth === 'boxed' ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ layoutWidth: 'boxed' })}
                  >
                    Boxed
                  </button>
                </div>
              </div>

              {/* Sidebar Position */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Sidebar Position</h3>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium border ${theme.sidebarPosition === 'left' ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ sidebarPosition: 'left' })}
                  >
                    Left
                  </button>
                  <button
                    className={`flex-1 py-2 rounded text-sm font-medium border ${theme.sidebarPosition === 'right' ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => updateTheme({ sidebarPosition: 'right' })}
                  >
                    Right
                  </button>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={resetTheme}
                className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded font-medium shadow-sm transition-colors flex items-center justify-center space-x-2"
              >
                <span>Reset to Default</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <div className="relative w-8 h-6 rounded border border-gray-300 overflow-hidden shadow-sm">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
        />
      </div>
    </div>
  );
}
