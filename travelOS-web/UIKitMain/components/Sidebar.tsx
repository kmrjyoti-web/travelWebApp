"use client";

import { useState } from "react";
import {
  Search,
  LayoutDashboard,
  Database,
  ShoppingCart,
  ShoppingBag,
  FileText,
  Package,
  Landmark,
  BarChart2,
  Users,
  Grid,
  Wrench,
  Store,
  ChevronRight,
  ChevronDown,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";

export type MenuNode = {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  children?: MenuNode[];
  hasChildren?: boolean;
  isSub?: boolean;
  isDeep?: boolean;
  actionIcon?: React.ReactNode;
};

export const MENU_DATA: MenuNode[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={16} />, active: true },
  {
    label: "Master",
    icon: <Database size={16} />,
    children: [
      { label: "Accounts Master" },
      { label: "Inventory Master" },
      { label: "Rate Master" },
      { label: "Discount Master" },
      {
        label: "Other Master",
        isSub: true,
        children: [{ label: "Station", isDeep: true }],
      },
      { label: "Opening Balance" },
      { label: "Sales Promotions", actionIcon: <Plus size={14} /> },
      { label: "Currency" },
    ],
  },
  { label: "Sale", icon: <ShoppingCart size={16} /> },
  { label: "Purchase", icon: <ShoppingBag size={16} /> },
  {
    label: "Accounting Trans.",
    icon: <FileText size={16} />,
  },
  {
    label: "Stock Management",
    icon: <Package size={16} />,
  },
  { label: "Banking", icon: <Landmark size={16} /> },
  { label: "Report", icon: <BarChart2 size={16} /> },
  { label: "CRM", icon: <Users size={16} /> },
  { label: "Other Products", icon: <Grid size={16} /> },
  {
    label: "Utilities & Tools",
    icon: <Wrench size={16} />,
  },
  { label: "Online Store", icon: <Store size={16} /> },
];

function filterMenu(menu: MenuNode[], query: string): MenuNode[] {
  if (!query) return menu;

  const lowerQuery = query.toLowerCase();

  return menu
    .map((item) => {
      const match = item.label.toLowerCase().includes(lowerQuery);
      let filteredChildren: MenuNode[] | undefined;

      if (item.children) {
        filteredChildren = filterMenu(item.children, query);
      }

      if (match || (filteredChildren && filteredChildren.length > 0)) {
        return { ...item, children: filteredChildren };
      }
      return null;
    })
    .filter(Boolean) as MenuNode[];
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-[var(--accent-color)] text-white rounded px-0.5">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const { theme } = useTheme();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Master: true,
    "Other Master": true,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const effectiveIsOpen = isOpen || isHovered;

  const toggleMenu = (menu: string) => {
    if (!effectiveIsOpen) return;
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const filteredMenu = filterMenu(MENU_DATA, searchQuery);

  const renderMenu = (nodes: MenuNode[], depth = 0) => {
    return nodes.map((node, idx) => {
      if (node.children) {
        const isExpanded = searchQuery ? true : expandedMenus[node.label];
        return (
          <MenuSection
            key={`${depth}-${idx}`}
            icon={node.icon}
            label={node.label}
            isExpanded={isExpanded}
            onClick={() => toggleMenu(node.label)}
            isOpen={effectiveIsOpen}
            isSub={node.isSub}
            searchQuery={searchQuery}
          >
            {renderMenu(node.children, depth + 1)}
          </MenuSection>
        );
      }

      if (depth > 0) {
        return (
          <SubMenuItem
            key={`${depth}-${idx}`}
            label={node.label}
            hasChildren={node.hasChildren}
            actionIcon={node.actionIcon}
            isDeep={node.isDeep}
            isOpen={effectiveIsOpen}
            searchQuery={searchQuery}
          />
        );
      }

      return (
        <MenuItem
          key={`${depth}-${idx}`}
          icon={node.icon}
          label={node.label}
          active={node.active}
          hasChildren={node.hasChildren}
          isOpen={effectiveIsOpen}
          searchQuery={searchQuery}
        />
      );
    });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: effectiveIsOpen ? 256 : 64 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`text-[var(--sidebar-text)] flex flex-col shrink-0 h-full overflow-y-auto overflow-x-hidden text-sm relative z-20 transition-colors duration-300 ${theme.sidebarPosition === 'right' ? 'border-l border-white/10' : 'border-r border-white/10'}`}
    >
      {/* Sidebar Blur Layer */}
      <div className="absolute inset-0 z-0 backdrop-blur-md pointer-events-none" />

      {/* Sidebar Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-300 pointer-events-none"
        style={{ 
          backgroundImage: 'var(--sidebar-bg-image)',
          backgroundColor: 'var(--sidebar-bg)',
          opacity: 'var(--sidebar-bg-opacity)'
        }}
      />

      {/* Sidebar Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="p-2 flex justify-center">
          {effectiveIsOpen ? (
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Type to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 text-white px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
              />
              <Search
                size={14}
                className="absolute right-3 top-2 text-[var(--icon-color)]"
              />
            </div>
          ) : (
            <div className="w-10 h-8 bg-black/20 rounded flex items-center justify-center cursor-pointer">
              <Search size={14} className="text-[var(--icon-color)]" />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto pb-4 overflow-x-hidden">
          {renderMenu(filteredMenu)}
        </nav>
      </div>
    </motion.aside>
  );
}

function MenuItem({
  icon,
  label,
  active,
  hasChildren,
  isOpen,
  searchQuery,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasChildren?: boolean;
  isOpen: boolean;
  searchQuery: string;
}) {
  return (
    <div
      className={`flex items-center ${
        isOpen ? "justify-between px-4" : "justify-center px-0"
      } py-2.5 cursor-pointer hover:bg-black/20 ${
        active
          ? "bg-black/20 border-l-4 border-[var(--accent-color)] text-white"
          : "border-l-4 border-transparent"
      }`}
      title={!isOpen ? label : undefined}
    >
      <div className="flex items-center space-x-3 whitespace-nowrap">
        <span className={active ? "text-[var(--accent-color)]" : "text-[var(--icon-color)]"}>
          {icon}
        </span>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <HighlightText text={label} query={searchQuery} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {isOpen && hasChildren && (
        <ChevronRight size={14} className="text-gray-500 shrink-0" />
      )}
    </div>
  );
}

function MenuSection({
  icon,
  label,
  isExpanded,
  onClick,
  children,
  isSub,
  isOpen,
  searchQuery,
}: {
  icon?: React.ReactNode;
  label: string;
  isExpanded: boolean;
  onClick: () => void;
  children: React.ReactNode;
  isSub?: boolean;
  isOpen: boolean;
  searchQuery: string;
}) {
  return (
    <div>
      <div
        className={`flex items-center ${
          isOpen ? "justify-between px-4" : "justify-center px-0"
        } py-2.5 cursor-pointer hover:bg-black/20 border-l-4 border-transparent ${
          isSub && isOpen ? "pl-10" : ""
        }`}
        onClick={onClick}
        title={!isOpen ? label : undefined}
      >
        <div className="flex items-center space-x-3 whitespace-nowrap">
          {icon && <span className="text-[var(--icon-color)]">{icon}</span>}
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className={`overflow-hidden ${isSub ? "text-[var(--icon-color)]" : ""}`}
              >
                <HighlightText text={label} query={searchQuery} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {isOpen &&
          (isExpanded ? (
            <ChevronDown size={14} className="text-[var(--icon-color)] shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-[var(--icon-color)] shrink-0" />
          ))}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="bg-black/20 overflow-hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="py-1"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubMenuItem({
  label,
  hasChildren,
  actionIcon,
  isDeep,
  isOpen,
  searchQuery,
}: {
  label: string;
  hasChildren?: boolean;
  actionIcon?: React.ReactNode;
  isDeep?: boolean;
  isOpen: boolean;
  searchQuery: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`flex items-center justify-between py-2 cursor-pointer hover:text-white text-[var(--icon-color)] ${
        isDeep ? "pl-14 pr-4" : "pl-10 pr-4"
      }`}
    >
      <div className="flex items-center space-x-2 relative whitespace-nowrap">
        <div className="absolute -left-4 top-1/2 w-3 border-t border-white/20"></div>
        <div className="absolute -left-4 -top-4 bottom-1/2 border-l border-white/20"></div>
        <span className="text-xs">
          <HighlightText text={label} query={searchQuery} />
        </span>
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        {hasChildren && <ChevronRight size={12} className="text-[var(--icon-color)]" />}
        {actionIcon && (
          <span className="text-[var(--icon-color)] hover:text-white">{actionIcon}</span>
        )}
      </div>
    </div>
  );
}
