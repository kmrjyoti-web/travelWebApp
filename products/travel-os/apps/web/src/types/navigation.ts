export interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
