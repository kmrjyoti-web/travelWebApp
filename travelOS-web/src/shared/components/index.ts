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

// ── Smart Toast ──────────────────────────────────────────────────────────────
export { SmartToastRenderer, useToastStore } from './SmartToast';
export type { ToastItem, ToastType } from './SmartToast';

// ── Smart Error ──────────────────────────────────────────────────────────────
export { SmartError } from './SmartError';
export type { SmartErrorProps } from './SmartError';

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

// Phase 4 — DataTable, ConfirmDialog, FilterPanel
export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps } from './ConfirmDialog';

export { useConfirmDialog } from './useConfirmDialog';

export { DataTable } from './DataTable';
export type { DataTableProps, DataTableColumn } from './DataTable';

export { FilterPanel } from './FilterPanel';
export type { FilterPanelProps, FilterField } from './FilterPanel';

// Phase 5 — StatCard, SearchInput, BulkActionsBar
export { StatCard } from './StatCard';
export type { StatCardProps } from './StatCard';

export { SearchInput } from './SearchInput';
export type { SearchInputProps } from './SearchInput';
export { TextField, SelectField, TextareaField } from './TextField';
export type { TextFieldProps, TextFieldVariant, SelectFieldProps, SelectFieldVariant, TextareaFieldProps, TextareaFieldVariant } from './TextField';

export { BulkActionsBar } from './BulkActionsBar';
export type { BulkActionsBarProps, BulkAction } from './BulkActionsBar';

// ── CoreUI Pro components ─────────────────────────────────────────────────────
export { DatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';

export { DateRangePicker } from './DateRangePicker';
export type { DateRangePickerProps } from './DateRangePicker';

export { TimePicker } from './TimePicker';
export type { TimePickerProps } from './TimePicker';

export { Autocomplete } from './Autocomplete';
export type { AutocompleteProps } from './Autocomplete';

export { MultiSelect } from './MultiSelect';
export type { MultiSelectProps } from './MultiSelect';

export { RangeSlider } from './RangeSlider';
export type { RangeSliderProps } from './RangeSlider';

export { Rating } from './Rating';
export type { RatingProps } from './Rating';

export { Popover } from './Popover';
export type { PopoverProps } from './Popover';

export { PasswordInput } from './PasswordInput';
export type { PasswordInputProps } from './PasswordInput';

export { LoadingButton } from './LoadingButton';
export type { LoadingButtonProps } from './LoadingButton';

export { Stepper } from './Stepper';
export type { StepperProps } from './Stepper';

export { Calendar } from './Calendar';
export type { CalendarProps } from './Calendar';

export { SmartTable, SmartPagination } from './SmartTable';
export type { SmartTableProps, SmartPaginationProps } from './SmartTable';

export { VirtualScroller } from './VirtualScroller';
export type { VirtualScrollerProps } from './VirtualScroller';

// ── CoreUI Free additional components ────────────────────────────────────────
export { Accordion, AccordionItem, AccordionHeader, AccordionButton, AccordionBody } from './Accordion';
export type { AccordionProps, AccordionItemProps } from './Accordion';

export { ButtonGroup, ButtonToolbar } from './ButtonGroup';
export type { ButtonGroupProps, ButtonToolbarProps } from './ButtonGroup';

export { InputGroup, InputGroupText } from './InputGroup';
export type { InputGroupProps } from './InputGroup';

export { ListGroup, ListGroupItem } from './ListGroup';

export { FormRange } from './FormRange';
export type { FormRangeProps } from './FormRange';

export { SegmentedControl } from './SegmentedControl';
export type { SegmentedControlProps, SegmentedControlOption } from './SegmentedControl';

// ── Smart wrappers ───────────────────────────────────────────────────────────
export { SmartDialog } from './SmartDialog';
export type { SmartDialogProps } from './SmartDialog';

export { SmartDrawer } from './SmartDrawer';
export type { SmartDrawerProps } from './SmartDrawer';

export { SmartButton } from './SmartButton';
export type { SmartButtonProps } from './SmartButton';

export { PageToolbar } from './PageToolbar';
export type { PageToolbarProps, ToolbarButton, ToolbarItem, ToolbarButtonVariant } from './PageToolbar';

// ── Utility / gate components ─────────────────────────────────────────────────
export { PermissionGate } from './PermissionGate';
export { FeatureGate } from './FeatureGate';
export { LoadingSpinner } from './LoadingSpinner';
