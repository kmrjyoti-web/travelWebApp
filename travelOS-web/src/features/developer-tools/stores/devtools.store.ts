import { create } from 'zustand';

export type DevToolsTab =
  | 'api-health'
  | 'error-log'
  | 'ui-kit'
  | 'stores'
  | 'permissions'
  | 'network'
  | 'system'
  | 'flags'
  | 'query-cache'
  | 'feature-docs';

export interface ErrorLogEntry {
  id: string;
  timestamp: number;
  message: string;
  source?: string;
  stack?: string;
  type: 'error' | 'unhandledrejection';
}

export interface NetworkLogEntry {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  status?: number;
  duration?: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  error?: string;
}

interface DevToolsState {
  isOpen: boolean;
  activeTab: DevToolsTab;
  errors: ErrorLogEntry[];
  networkLogs: NetworkLogEntry[];
  isPinned: boolean;
}

interface DevToolsActions {
  toggle: () => void;
  open: () => void;
  close: () => void;
  setTab: (tab: DevToolsTab) => void;
  addError: (entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>) => void;
  clearErrors: () => void;
  addNetworkLog: (entry: Omit<NetworkLogEntry, 'id' | 'timestamp'>) => void;
  clearNetworkLogs: () => void;
  togglePin: () => void;
}

export type DevToolsStore = DevToolsState & DevToolsActions;

let errorCounter = 0;
let networkCounter = 0;

export const useDevToolsStore = create<DevToolsStore>((set) => ({
  isOpen: false,
  activeTab: 'stores',
  errors: [],
  networkLogs: [],
  isPinned: false,

  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setTab: (tab) => set({ activeTab: tab }),

  addError: (entry) =>
    set((s) => ({
      errors: [
        { ...entry, id: `err-${++errorCounter}`, timestamp: Date.now() },
        ...s.errors,
      ].slice(0, 100),
    })),
  clearErrors: () => set({ errors: [] }),

  addNetworkLog: (entry) =>
    set((s) => ({
      networkLogs: [
        { ...entry, id: `net-${++networkCounter}`, timestamp: Date.now() },
        ...s.networkLogs,
      ].slice(0, 200),
    })),
  clearNetworkLogs: () => set({ networkLogs: [] }),

  togglePin: () => set((s) => ({ isPinned: !s.isPinned })),
}));
