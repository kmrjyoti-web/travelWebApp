"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { MENU_DATA, MenuNode } from "./Sidebar";

export default function HorizontalMenu() {
  const { theme } = useTheme();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMouseEnter = (label: string) => {
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div 
      className="w-full relative z-20 flex items-center px-4 transition-colors duration-300 border-b border-white/10"
      style={{ 
        backgroundColor: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        opacity: 'var(--sidebar-bg-opacity)'
      }}
    >
      <div className="flex space-x-1 w-full overflow-x-auto no-scrollbar py-2">
        {MENU_DATA.map((node) => (
          <div
            key={node.label}
            className="relative flex-shrink-0"
            onMouseEnter={() => handleMouseEnter(node.label)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm ${
                node.active 
                  ? "bg-[var(--accent-color)] text-white" 
                  : "hover:bg-white/10"
              }`}
            >
              {node.icon && <span className="text-[var(--icon-color)]">{node.icon}</span>}
              <span className="whitespace-nowrap">{node.label}</span>
              {node.children && <ChevronDown size={14} className="ml-1 opacity-70" />}
            </button>

            <AnimatePresence>
              {activeMenu === node.label && node.children && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 w-48 py-1 rounded-md shadow-lg border border-white/10"
                  style={{ backgroundColor: 'var(--sidebar-bg)' }}
                >
                  {node.children.map((child) => (
                    <HorizontalSubMenu key={child.label} node={child} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalSubMenu({ node }: { node: MenuNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/10 transition-colors text-left"
      >
        <div className="flex items-center space-x-2">
          {node.icon && <span className="text-[var(--icon-color)]">{node.icon}</span>}
          <span>{node.label}</span>
        </div>
        <div className="flex items-center space-x-2">
          {node.actionIcon && <span className="text-[var(--icon-color)] hover:text-white">{node.actionIcon}</span>}
          {node.children && <ChevronRight size={14} className="opacity-70" />}
        </div>
      </button>

      <AnimatePresence>
        {isHovered && node.children && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-1 w-48 py-1 rounded-md shadow-lg border border-white/10"
            style={{ backgroundColor: 'var(--sidebar-bg)' }}
          >
            {node.children.map((child) => (
              <HorizontalSubMenu key={child.label} node={child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
