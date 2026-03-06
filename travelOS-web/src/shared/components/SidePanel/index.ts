// Main imperative API — call useSidePanelStore().openPanel() from anywhere
export { useSidePanelStore } from './useSidePanelStore';

// Rendering — add both to your root layout once
export { SidePanelRenderer } from './SidePanel';       // renders open panels via createPortal
export { SidePanelTaskbar } from './SidePanelTaskbar'; // fixed bottom bar for minimized panels

// Types
export type { PanelConfig, PanelInstance, PanelState, ActionButton, ShowAs } from './types';
