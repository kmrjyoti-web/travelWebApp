export type LayoutVariant = 'default' | 'auth' | 'admin' | 'public' | 'minimal';

export interface LayoutConfig {
  variant: LayoutVariant;
  sidebarOpen?: boolean;
  sidebarPosition?: 'left' | 'right';
  menuOrientation?: 'vertical' | 'horizontal';
  layoutWidth?: 'fluid' | 'boxed';
}
