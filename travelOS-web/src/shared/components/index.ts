import './components.css';

// Icon (Rule 4 — ONLY way to use lucide-react in features)
export { Icon } from './Icon';
export type { IconName, IconProps } from './Icon';

// Primitives
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Spinner } from './Spinner';
export type { SpinnerProps } from './Spinner';

export { Alert, AlertHeading, AlertLink } from './Alert';
export type { AlertProps } from './Alert';

export { Avatar, AvatarGroup } from './Avatar';
export type { AvatarProps, AvatarGroupProps } from './Avatar';

export { Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';

export { Collapse } from './Collapse';
export type { CollapseProps } from './Collapse';

export { Progress, ProgressBar } from './Progress';
export type { ProgressProps } from './Progress';

// Data Display
export {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardTitle,
  CardSubtitle,
  CardText,
  CardImage,
} from './Card';
export type { CardProps } from './Card';

export {
  Table,
  TableHead,
  TableBody,
  TableFoot,
  TableRow,
  TableHeaderCell,
  TableDataCell,
  TableCaption,
} from './Table';
export type { TableProps } from './Table';

// Navigation
export { Tabs, TabItem, TabLink, TabContent, TabPane } from './Tabs';

export {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  DropdownHeader,
} from './Dropdown';
export type { DropdownProps } from './Dropdown';

export { Pagination, PaginationItem } from './Pagination';
export type { PaginationProps } from './Pagination';

// Overlays
export { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from './Modal';
export type { ModalProps } from './Modal';

export { Offcanvas, OffcanvasHeader, OffcanvasTitle, OffcanvasBody } from './Offcanvas';
export type { OffcanvasProps } from './Offcanvas';

export { Toast, ToastBody, ToastClose, Toaster } from './Toast';
export type { ToastProps } from './Toast';

// Layout Grid
export { Container, Row, Col } from './Grid';
export type { ContainerProps, RowProps, ColProps } from './Grid';

// Forms
export * from './forms';

// Layout (barrel populated in Phase 4)
export * from './layout';

// Business components (Phase 2)
export { PageHeader } from './PageHeader';
export type { PageHeaderProps } from './PageHeader';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps, EmptyStateAction } from './EmptyState';

export { StatusBadge, ColorBadge } from './StatusBadge';
export type { StatusBadgeProps, ColorBadgeProps } from './StatusBadge';

export { FormErrors } from './FormErrors';
export type { FormErrorsProps } from './FormErrors';

export { FormSubmitOverlay } from './FormSubmitOverlay';
export type { FormSubmitOverlayProps } from './FormSubmitOverlay';

export { ActionsMenu } from './ActionsMenu';
export type { ActionsMenuProps, ActionMenuItem } from './ActionsMenu';

export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb';

export { TableSkeleton } from './TableSkeleton';
export type { TableSkeletonProps } from './TableSkeleton';

// SidePanel — unified drawer with minimize/maximize/fullscreen/new-tab + Windows taskbar
export { SidePanelRenderer, SidePanelTaskbar, useSidePanelStore } from './SidePanel';
export type { PanelConfig, PanelInstance, PanelState, ActionButton } from './SidePanel';
