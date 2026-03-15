/** UI Kit Browser — Component Registry (data-only, no JSX). Under 300 lines. */

export type CategoryKey =
  | 'icon-gallery' | 'basic-inputs' | 'advanced-inputs' | 'special-inputs'
  | 'selection-controls' | 'buttons' | 'overlays' | 'display'
  | 'table' | 'forms-schema' | 'toolbar' | 'import-patterns';

export interface PropEntry { name: string; type: string; default?: string; required?: boolean; description: string; }
export interface CSSTokenEntry { token: string; defaultValue: string; override?: string; description: string; }
export interface EventEntry { name: string; signature: string; description: string; }
export interface SlotEntry  { name: string; type: string; description: string; }
export interface CodeExample { label: string; code: string; }
export interface ComponentEntry {
  name: string; coreui: string; path: string; importPath: string;
  category: CategoryKey; description: string;
  props: PropEntry[]; cssTokens: CSSTokenEntry[];
  events: EventEntry[]; slots: SlotEntry[];
  codeExamples: CodeExample[]; notes?: string;
}
export interface CategoryDef { key: CategoryKey; label: string; icon: string; }

export const CATEGORIES: CategoryDef[] = [
  { key: 'icon-gallery',       label: 'Icon Gallery',       icon: '🎨' },
  { key: 'basic-inputs',       label: 'Basic Inputs',       icon: '📝' },
  { key: 'advanced-inputs',    label: 'Advanced Inputs',    icon: '🔧' },
  { key: 'special-inputs',     label: 'Special Inputs',     icon: '✨' },
  { key: 'selection-controls', label: 'Selection Controls', icon: '☑️' },
  { key: 'buttons',            label: 'Buttons',            icon: '🔘' },
  { key: 'overlays',           label: 'Overlays',           icon: '📦' },
  { key: 'display',            label: 'Display',            icon: '👁️' },
  { key: 'table',              label: 'Table',              icon: '📊' },
  { key: 'forms-schema',       label: 'Forms & Schema',     icon: '📋' },
  { key: 'toolbar',            label: 'Toolbar',            icon: '🛠️' },
  { key: 'import-patterns',    label: 'Import Patterns',    icon: '📦' },
];

/* Helpers */
const P = (name: string, type: string, description: string, def?: string, required?: boolean): PropEntry =>
  ({ name, type, description, ...(def !== undefined && { default: def }), ...(required && { required }) });
const E = (name: string, signature: string, description: string): EventEntry => ({ name, signature, description });
const C = (label: string, code: string): CodeExample => ({ label, code });
const short = (
  name: string, coreui: string, path: string, cat: CategoryKey,
  desc: string, props: PropEntry[] = [], code: CodeExample[] = [],
): ComponentEntry => ({
  name, coreui, path, importPath: '@/shared/components', category: cat, description: desc,
  props, cssTokens: [], events: [], slots: [], codeExamples: code,
});

export const COMPONENTS: ComponentEntry[] = [
  /* ----------  BASIC INPUTS  ---------- */
  {
    name: 'TextField', coreui: 'native <input>',
    path: 'src/shared/components/TextField/TextField.tsx', importPath: '@/shared/components',
    category: 'basic-inputs',
    description: 'Material-style floating label text input. Use for ALL text/number/date inputs.',
    props: [
      P('label', 'string', 'Floating label text'),
      P('variant', "'outlined'|'filled'|'standard'", 'Visual variant', "'outlined'"),
      P('size', "'xs'|'sm'|'md'", 'Field height (32px / 42px / 54px)', "'md'"),
      P('startIcon', 'IconName', 'Lucide icon at start'),
      P('endIcon', 'IconName', 'Lucide icon at end'),
      P('error', 'boolean', 'Show error state', 'false'),
      P('helperText', 'string', 'Helper or error text below'),
      P('required', 'boolean', 'Required asterisk', 'false'),
      P('disabled', 'boolean', 'Disable input', 'false'),
    ],
    cssTokens: [
      { token: '--tos-input-border', defaultValue: '#d1d5db', description: 'Border color at rest' },
      { token: '--tos-primary', defaultValue: '#4f46e5', description: 'Focus border + label color' },
      { token: '--tos-danger', defaultValue: '#dc2626', description: 'Error state color' },
      { token: '--tos-card-bg', defaultValue: '#fff', description: 'Background (outlined label bg)' },
      { token: '--tos-text', defaultValue: '#111827', description: 'Input text color' },
      { token: '--tos-text-muted', defaultValue: '#6b7280', description: 'Label color at rest' },
    ],
    events: [
      E('onChange', '(e: ChangeEvent<HTMLInputElement>) => void', 'Fires on value change'),
      E('onFocus', '(e: FocusEvent<HTMLInputElement>) => void', 'Fires on focus'),
      E('onBlur', '(e: FocusEvent<HTMLInputElement>) => void', 'Fires on blur'),
    ],
    codeExamples: [
      C('Basic', '<TextField label="Email" type="email" />'),
      C('Small + Icon', '<TextField label="Search" size="sm" startIcon="Search" />'),
      C('Error', '<TextField label="Name" error helperText="Required" />'),
    ],
    notes: "GOLDEN RULE: Use TextField for ALL text inputs. Never use raw <input>. Ref forwarded.",
  },
  {
    name: 'SelectField', coreui: 'native <select>',
    path: 'src/shared/components/TextField/SelectField.tsx', importPath: '@/shared/components',
    category: 'basic-inputs',
    description: 'Material-style floating label select. Use for ALL dropdowns.',
    props: [
      P('label', 'string', 'Floating label'),
      P('variant', "'outlined'|'filled'|'standard'", 'Visual variant', "'outlined'"),
      P('size', "'xs'|'sm'|'md'", 'Field height', "'md'"),
      P('error', 'boolean', 'Error state', 'false'),
      P('helperText', 'string', 'Helper or error text'),
      P('required', 'boolean', 'Required asterisk', 'false'),
      P('disabled', 'boolean', 'Disable select', 'false'),
      P('children', 'ReactNode', '<option> elements', undefined, true),
    ],
    cssTokens: [
      { token: '--tos-input-border', defaultValue: '#d1d5db', description: 'Border color' },
      { token: '--tos-primary', defaultValue: '#4f46e5', description: 'Focus color' },
    ],
    events: [
      E('onChange', '(e: ChangeEvent<HTMLSelectElement>) => void', 'Fires on selection change'),
    ],
    codeExamples: [
      C('Basic', '<SelectField label="Country" size="sm">\n  <option value="IN">India</option>\n</SelectField>'),
    ],
    notes: "GOLDEN RULE: Use SelectField for ALL dropdowns. Children are <option> elements.",
  },
  {
    name: 'Input', coreui: 'CFormInput',
    path: 'src/shared/components/forms/Input.tsx', importPath: '@/shared/components',
    category: 'basic-inputs',
    description: 'CoreUI-based input with floatingLabel, clearable, password toggle, prefix/suffix.',
    props: [
      P('label', 'string', 'Label text'),
      P('floatingLabel', 'boolean|string', 'Enable floating label', 'false'),
      P('variant', "'outlined'|'filled'|'underlined'", 'Visual variant', "'outlined'"),
      P('inputSize', "'sm'|'md'|'lg'", 'Field size', "'md'"),
      P('icon', 'IconName', 'Left icon'),
      P('iconRight', 'IconName', 'Right icon'),
      P('prefix', 'string', 'Text prefix (e.g. "$")'),
      P('suffix', 'string', 'Text suffix (e.g. "kg")'),
      P('clearable', 'boolean', 'Show clear button', 'false'),
      P('showPasswordToggle', 'boolean', 'Password eye toggle', 'false'),
      P('showCharCount', 'boolean', 'Character count', 'false'),
      P('errorMessage', 'string', 'Error message'),
      P('helperText', 'string', 'Helper text'),
    ],
    events: [
      E('onChange', '(e: ChangeEvent) => void', 'Fires on value change'),
      E('onClear', '() => void', 'Fires when clear button clicked'),
    ],
    codeExamples: [
      C('Floating', '<Input label="Email" floatingLabel inputSize="sm" icon="Mail" />'),
      C('Clearable', '<Input label="Search" floatingLabel clearable />'),
    ],
    notes: "CoreUI wrapper. For simpler use cases prefer TextField.",
  },
  {
    name: 'Select', coreui: 'CFormSelect',
    path: 'src/shared/components/forms/Select.tsx', importPath: '@/shared/components',
    category: 'basic-inputs',
    description: 'CoreUI-based select with floatingLabel and icon support.',
    props: [
      P('label', 'string', 'Label text'),
      P('floatingLabel', 'boolean|string', 'Enable floating label', 'false'),
      P('variant', "'outlined'|'filled'|'underlined'", 'Visual variant', "'outlined'"),
      P('inputSize', "'sm'|'md'|'lg'", 'Field size', "'md'"),
      P('icon', 'IconName', 'Left icon'),
      P('errorMessage', 'string', 'Error message'),
      P('required', 'boolean', 'Required field', 'false'),
      P('disabled', 'boolean', 'Disable select', 'false'), P('error', 'boolean', 'Error state', 'false'),
      P('errorText', 'string', 'Error message'), P('helperText', 'string', 'Helper text'),
      P('children', 'ReactNode', '<option> elements', undefined, true),
    ],
    cssTokens: [], slots: [],
    events: [E('onChange', '(value: string) => void', 'Fires when selection changes')],
    codeExamples: [C('Basic', '<Select label="Country">\n  <option value="US">United States</option>\n  <option value="IN">India</option>\n</Select>')],
  },
  {
    name: 'Checkbox', coreui: 'AICCheckbox',
    path: 'src/shared/components/forms/Checkbox.tsx', importPath: '@/shared/components',
    category: 'basic-inputs', description: 'Single checkbox with label and indeterminate support.',
    props: [
      P('checked', 'boolean', 'Controlled checked state'), P('defaultChecked', 'boolean', 'Uncontrolled default'),
      P('indeterminate', 'boolean', 'Indeterminate visual state'), P('label', 'string', 'Label text'),
      P('description', 'string', 'Secondary description'), P('error', 'boolean', 'Error state', 'false'),
      P('disabled', 'boolean', 'Disabled', 'false'), P('required', 'boolean', 'Required', 'false'),
    ],
    cssTokens: [], slots: [],
    events: [E('onChange', '(checked: boolean) => void', 'Fires on toggle')],
    codeExamples: [C('Basic', '<Checkbox label="Accept terms" required />')],
  },
  short('CheckboxGroup', 'AICCheckboxGroup', 'src/shared/components/forms/CheckboxGroup.tsx', 'basic-inputs',
    'Group of checkboxes with shared label and direction.',
    [P('label', 'string', 'Group label'), P('options', 'CheckboxGroupOption[]', 'Array of options', undefined, true),
     P('value', 'string[]', 'Selected values'), P('disabled', 'boolean', 'Disable all', 'false'),
     P('direction', 'row|column', 'Layout direction', 'column')]),
  short('Radio', 'AICRadio', 'src/shared/components/forms/Radio.tsx', 'basic-inputs',
    'Single radio button with label.',
    [P('label', 'string', 'Label text'), P('checked', 'boolean', 'Controlled state'), P('disabled', 'boolean', 'Disabled', 'false')]),
  short('RadioGroup', 'AICRadioGroup', 'src/shared/components/forms/RadioGroup.tsx', 'basic-inputs',
    'Radio button group with shared name.',
    [P('label', 'string', 'Group label'), P('options', 'RadioGroupOption[]', 'Options array', undefined, true),
     P('value', 'string', 'Selected value'), P('direction', 'row|column', 'Layout direction', 'column')]),
  {
    name: 'Switch', coreui: 'AICSwitch',
    path: 'src/shared/components/forms/Switch.tsx', importPath: '@/shared/components',
    category: 'basic-inputs', description: 'Toggle switch with label and description.',
    props: [
      P('checked', 'boolean', 'Controlled state'), P('label', 'string', 'Label text'),
      P('description', 'string', 'Secondary text'), P('size', 'sm|md|lg', 'Switch size', 'md'),
      P('labelPosition', 'left|right', 'Label placement', 'right'), P('disabled', 'boolean', 'Disabled', 'false'),
    ],
    cssTokens: [], slots: [],
    events: [E('onChange', '(checked: boolean) => void', 'Fires on toggle')],
    codeExamples: [C('Basic', '<Switch label="Enable notifications" />')],
  },
  short('FormRange', 'AICFormRange', 'src/shared/components/forms/FormRange.tsx', 'basic-inputs',
    'Range slider input.',
    [P('min', 'number', 'Minimum value', '0'), P('max', 'number', 'Maximum value', '100'),
     P('step', 'number', 'Step increment', '1'), P('value', 'number', 'Controlled value'), P('label', 'string', 'Label')]),
  short('CheckboxInput', 'AICCheckboxInput', 'src/shared/components/forms/CheckboxInput.tsx', 'basic-inputs',
    'Checkbox that reveals an input field when checked.',
    [P('checked', 'boolean', 'Checked state'), P('label', 'string', 'Checkbox label'), P('inputProps', 'InputProps', 'Props forwarded to the revealed input')]),

  /* ----------  ADVANCED INPUTS (11)  ---------- */
  short('SelectInput', 'AICSelectInput', 'src/shared/components/forms/SelectInput.tsx', 'advanced-inputs',
    'Searchable dropdown select with floating label. Most-used select in CRM forms.',
    [P('label', 'string', 'Floating label'), P('options', 'SelectOption[]', 'Options', undefined, true),
     P('value', 'string', 'Selected value'), P('searchable', 'boolean', 'Enable search', 'true'),
     P('clearable', 'boolean', 'Show clear button', 'false'), P('disabled', 'boolean', 'Disabled', 'false')]),

  short('MultiSelectInput', 'AICMultiSelectInput', 'src/shared/components/forms/MultiSelectInput.tsx', 'advanced-inputs',
    'Multi-select dropdown with chips for selected values.',
    [P('label', 'string', 'Label'), P('options', 'SelectOption[]', 'Options', undefined, true),
     P('value', 'string[]', 'Selected values'), P('maxItems', 'number', 'Max selectable items')]),

  short('DatePicker', 'AICDatePicker', 'src/shared/components/forms/DatePicker.tsx', 'advanced-inputs',
    'Date picker with calendar popup, range support, and format options.',
    [P('label', 'string', 'Label'), P('value', 'Date|null', 'Selected date'),
     P('minDate', 'Date', 'Earliest selectable date'), P('maxDate', 'Date', 'Latest selectable date'),
     P('format', 'string', 'Display format', 'yyyy-MM-dd'), P('range', 'boolean', 'Range mode', 'false')]),

  short('CurrencyInput', 'AICCurrencyInput', 'src/shared/components/forms/CurrencyInput.tsx', 'advanced-inputs',
    'Currency-formatted number input with locale support.',
    [P('label', 'string', 'Label'), P('value', 'number', 'Amount'), P('currency', 'string', 'ISO currency code', 'USD'),
     P('locale', 'string', 'Number locale', 'en-US'), P('min', 'number', 'Minimum value'), P('max', 'number', 'Maximum value')]),

  short('NumberInput', 'AICNumber', 'src/shared/components/forms/NumberInput.tsx', 'advanced-inputs',
    'Numeric input with stepper buttons, min/max, step.',
    [P('label', 'string', 'Label'), P('value', 'number', 'Controlled value'),
     P('min', 'number', 'Minimum'), P('max', 'number', 'Maximum'), P('step', 'number', 'Increment step', '1')]),

  short('Textarea', 'AICTextarea', 'src/shared/components/forms/Textarea.tsx', 'advanced-inputs',
    'Multi-line text area with auto-resize and character count.',
    [P('label', 'string', 'Label'), P('minRows', 'number', 'Min rows', '3'), P('maxRows', 'number', 'Max rows'),
     P('maxLength', 'number', 'Character limit'), P('showCount', 'boolean', 'Show char count', 'false')]),

  short('TagsInput', 'AICTagsInput', 'src/shared/components/forms/TagsInput.tsx', 'advanced-inputs',
    'Tag/chip input for adding multiple string values.',
    [P('label', 'string', 'Label'), P('value', 'string[]', 'Tags'), P('maxTags', 'number', 'Max allowed tags'),
     P('placeholder', 'string', 'Input placeholder')]),

  short('PhoneInput', 'AICPhoneInput', 'src/shared/components/forms/PhoneInput.tsx', 'advanced-inputs',
    'International phone input with country code selector.',
    [P('label', 'string', 'Label'), P('value', 'string', 'Phone value'), P('defaultCountry', 'string', 'ISO country code', 'US')]),

  short('ColorPicker', 'AICColorPicker', 'src/shared/components/forms/ColorPicker.tsx', 'advanced-inputs',
    'Color swatch picker with hex input.',
    [P('label', 'string', 'Label'), P('value', 'string', 'Hex color'), P('swatches', 'string[]', 'Preset swatches')]),

  short('Slider', 'AICSlider', 'src/shared/components/forms/Slider.tsx', 'advanced-inputs',
    'Range slider with dual thumbs and step marks.',
    [P('min', 'number', 'Min', '0'), P('max', 'number', 'Max', '100'), P('value', '[number,number]', 'Range value'),
     P('step', 'number', 'Step', '1'), P('marks', 'boolean', 'Show step marks', 'false')]),

  short('PasswordInput', 'AICPasswordInput', 'src/shared/components/forms/PasswordInput.tsx', 'advanced-inputs',
    'Password field with show/hide toggle and strength meter.',
    [P('label', 'string', 'Label'), P('showStrength', 'boolean', 'Show strength bar', 'false')]),

  /* ----------  SPECIAL INPUTS (6)  ---------- */
  short('FileUpload', 'AICFileUpload', 'src/shared/components/forms/FileUpload.tsx', 'special-inputs',
    'Drag-and-drop file upload with preview.', [P('accept', 'string', 'MIME types'), P('maxSize', 'number', 'Max bytes'), P('multiple', 'boolean', 'Allow multiple', 'false')]),
  short('ImageUpload', 'AICImageUpload', 'src/shared/components/forms/ImageUpload.tsx', 'special-inputs',
    'Image upload with crop and preview.', [P('aspectRatio', 'number', 'Crop ratio'), P('maxSize', 'number', 'Max bytes')]),
  short('RichTextEditor', 'AICRichText', 'src/shared/components/forms/RichTextEditor.tsx', 'special-inputs',
    'WYSIWYG rich text editor.', [P('value', 'string', 'HTML content'), P('toolbar', 'string[]', 'Toolbar buttons')]),
  short('CodeEditor', 'AICCodeEditor', 'src/shared/components/forms/CodeEditor.tsx', 'special-inputs',
    'Syntax-highlighted code editor.', [P('language', 'string', 'Language mode'), P('value', 'string', 'Code content')]),
  short('SignaturePad', 'AICSignaturePad', 'src/shared/components/forms/SignaturePad.tsx', 'special-inputs',
    'Signature capture canvas.', [P('width', 'number', 'Canvas width'), P('height', 'number', 'Canvas height')]),
  short('StarRating', 'AICStarRating', 'src/shared/components/forms/StarRating.tsx', 'special-inputs',
    'Star rating input.', [P('value', 'number', 'Rating 1-5'), P('max', 'number', 'Max stars', '5'), P('readOnly', 'boolean', 'Read-only', 'false')]),

  /* ----------  SELECTION CONTROLS (3)  ---------- */
  short('SegmentedControl', 'AICSegmentedControl', 'src/shared/components/SegmentedControl.tsx', 'selection-controls',
    'Segmented toggle buttons for switching views.', [P('options', 'SegmentOption[]', 'Segments', undefined, true), P('value', 'string', 'Active key')]),
  short('ToggleButtonGroup', 'AICToggleGroup', 'src/shared/components/forms/ToggleButtonGroup.tsx', 'selection-controls',
    'Group of toggle buttons with single/multi select.', [P('options', 'ToggleOption[]', 'Options', undefined, true), P('multiple', 'boolean', 'Multi-select', 'false')]),
  short('ChipSelect', 'AICChipSelect', 'src/shared/components/forms/ChipSelect.tsx', 'selection-controls',
    'Chip-based selection for tags or categories.', [P('options', 'ChipOption[]', 'Options', undefined, true), P('value', 'string[]', 'Selected')]),

  /* ----------  BUTTONS (4)  ---------- */
  {
    name: 'Button', coreui: 'CButton',
    path: 'src/shared/components/Button.tsx', importPath: '@/shared/components',
    category: 'buttons', description: 'Primary action button with icon and loading support.',
    props: [
      P('color', 'primary|secondary|success|danger|warning|info', 'Button color', 'primary'),
      P('variant', 'ghost|outline', 'Visual variant'), P('size', 'sm|md|lg', 'Button size', 'md'),
      P('loading', 'boolean', 'Show spinner', 'false'), P('leftIcon', 'IconName', 'Left icon name'),
      P('rightIcon', 'IconName', 'Right icon name'), P('disabled', 'boolean', 'Disabled', 'false'),
    ],
    cssTokens: [], events: [E('onClick', '(e: MouseEvent) => void', 'Click handler')], slots: [],
    codeExamples: [
      C('Variants', '<Button color="primary">Save</Button>\n<Button color="danger" variant="outline">Delete</Button>'),
      C('Loading', '<Button loading>Submitting...</Button>'),
    ],
  },
  short('SmartButton', 'SmartButton', 'src/shared/components/SmartButton.tsx', 'buttons',
    'Button with built-in loading, confirmation, and success states.',
    [P('confirmMessage', 'string', 'Confirmation prompt'), P('successMessage', 'string', 'Toast on success'), P('loading', 'boolean', 'Loading state')]),
  short('LoadingButton', 'LoadingButton', 'src/shared/components/LoadingButton.tsx', 'buttons',
    'Button variant that shows spinner while async action runs.',
    [P('loading', 'boolean', 'Show spinner'), P('loadingText', 'string', 'Text while loading')]),
  short('ButtonGroup', 'CButtonGroup', 'src/shared/components/ButtonGroup.tsx', 'buttons',
    'Groups multiple buttons with shared styling.',
    [P('size', 'sm|md|lg', 'Group size'), P('vertical', 'boolean', 'Stack vertically', 'false')]),

  /* ----------  OVERLAYS (10)  ---------- */
  short('Modal', 'CModal', 'src/shared/components/Modal.tsx', 'overlays', 'Standard modal dialog.', [P('visible', 'boolean', 'Open state'), P('size', 'sm|md|lg|xl', 'Modal width', 'md')]),
  short('SmartDialog', 'SmartDialog', 'src/shared/components/SmartDialog.tsx', 'overlays', 'Modal with form integration, validation, and async submit.', [P('visible', 'boolean', 'Open state'), P('title', 'string', 'Dialog title')]),
  short('ConfirmDialog', 'ConfirmDialog', 'src/shared/components/ConfirmDialog.tsx', 'overlays', 'Yes/No confirmation dialog.', [P('message', 'string', 'Confirmation text'), P('onConfirm', '() => void', 'Confirm callback')]),
  short('Offcanvas', 'COffcanvas', 'src/shared/components/Offcanvas.tsx', 'overlays', 'Slide-in side panel.', [P('visible', 'boolean', 'Open state'), P('placement', 'start|end|top|bottom', 'Slide direction', 'end')]),
  short('SmartDrawer', 'SmartDrawer', 'src/shared/components/SmartDrawer.tsx', 'overlays', 'Offcanvas with form integration and dirty-check close guard.', [P('visible', 'boolean', 'Open state'), P('title', 'string', 'Drawer title'), P('width', 'string', 'Drawer width', '480px')]),
  short('Toast', 'CToast', 'src/shared/components/Toast.tsx', 'overlays', 'Notification toast.', [P('color', 'string', 'Toast color'), P('autohide', 'boolean', 'Auto dismiss', 'true')]),
  short('SmartToast', 'SmartToastRenderer', 'src/shared/components/SmartToast.tsx', 'overlays', 'Imperative toast via useToast() hook.', [P('position', 'string', 'Screen position', 'top-right')]),
  short('Popover', 'CPopover', 'src/shared/components/Popover.tsx', 'overlays', 'Content popover on hover/click.', [P('content', 'ReactNode', 'Popover body'), P('trigger', 'hover|click|focus', 'Trigger mode', 'click')]),
  short('Tooltip', 'CTooltip', 'src/shared/components/Tooltip.tsx', 'overlays', 'Simple text tooltip.', [P('content', 'string', 'Tooltip text'), P('placement', 'top|bottom|left|right', 'Position', 'top')]),
  short('SmartError', 'SmartError', 'src/shared/components/SmartError.tsx', 'overlays', 'Error boundary fallback with retry and report actions.', [P('error', 'Error', 'Error object'), P('onRetry', '() => void', 'Retry callback')]),

  /* ----------  DISPLAY (5)  ---------- */
  short('Badge', 'CBadge', 'src/shared/components/Badge.tsx', 'display', 'Small count or label badge.', [P('color', 'string', 'Badge color'), P('shape', 'rounded-pill|rounded', 'Shape', 'rounded-pill')]),
  short('StatusBadge', 'StatusBadge', 'src/shared/components/StatusBadge.tsx', 'display', 'Semantic status indicator with icon.', [P('status', 'active|inactive|pending|error', 'Status key'), P('label', 'string', 'Display text')]),
  short('Avatar', 'CAvatar', 'src/shared/components/Avatar.tsx', 'display', 'User avatar with fallback initials.', [P('src', 'string', 'Image URL'), P('name', 'string', 'Fallback name'), P('size', 'sm|md|lg|xl', 'Avatar size', 'md')]),
  short('Alert', 'CAlert', 'src/shared/components/Alert.tsx', 'display', 'Inline alert message.', [P('color', 'primary|success|danger|warning|info', 'Alert type'), P('dismissible', 'boolean', 'Show close', 'false')]),
  short('EmptyState', 'EmptyState', 'src/shared/components/EmptyState.tsx', 'display', 'Placeholder for empty data views.', [P('icon', 'IconName', 'Illustration icon'), P('title', 'string', 'Heading'), P('description', 'string', 'Body text')]),

  /* ----------  TABLE (2)  ---------- */
  short('SmartTable', 'SmartTable', 'src/shared/components/SmartTable.tsx', 'table', 'Full-featured data table with sort, filter, pagination, and row actions.',
    [P('columns', 'ColumnDef[]', 'Column definitions', undefined, true), P('data', 'T[]', 'Row data', undefined, true),
     P('loading', 'boolean', 'Loading state', 'false'), P('pagination', 'PaginationConfig', 'Pagination settings')]),
  short('DataTable', 'CSmartTable', 'src/shared/components/DataTable.tsx', 'table', 'CoreUI SmartTable wrapper with TravelOS defaults.',
    [P('columns', 'Column[]', 'Columns', undefined, true), P('items', 'T[]', 'Data items', undefined, true)]),

  /* ----------  FORMS & SCHEMA (4)  ---------- */
  short('FormField', 'FormField', 'src/shared/components/forms/FormField.tsx', 'forms-schema', 'Wraps any input with label, error, and helper text.', [P('label', 'string', 'Field label'), P('error', 'string', 'Error message'), P('required', 'boolean', 'Show asterisk', 'false')]),
  short('Fieldset', 'Fieldset', 'src/shared/components/forms/Fieldset.tsx', 'forms-schema', 'Grouped form section with legend.', [P('legend', 'string', 'Section heading'), P('collapsible', 'boolean', 'Allow collapse', 'false')]),
  short('FilterPanel', 'FilterPanel', 'src/shared/components/forms/FilterPanel.tsx', 'forms-schema', 'Sidebar filter panel with apply/reset.', [P('filters', 'FilterDef[]', 'Filter definitions', undefined, true)]),
  short('BulkActionsBar', 'BulkActionsBar', 'src/shared/components/forms/BulkActionsBar.tsx', 'forms-schema', 'Toolbar shown when table rows are selected.', [P('selectedCount', 'number', 'Number selected'), P('actions', 'BulkAction[]', 'Available actions', undefined, true)]),

  /* ----------  TOOLBAR (3)  ---------- */
  short('PageHeader', 'PageHeader', 'src/shared/components/PageHeader.tsx', 'toolbar', 'Page title bar with breadcrumb and action buttons.', [P('title', 'string', 'Page title', undefined, true), P('actions', 'ReactNode', 'Right-side actions')]),
  short('Breadcrumb', 'CBreadcrumb', 'src/shared/components/Breadcrumb.tsx', 'toolbar', 'Navigation breadcrumb trail.', [P('items', 'BreadcrumbItem[]', 'Path items', undefined, true)]),
  short('Tabs', 'CNav', 'src/shared/components/Tabs.tsx', 'toolbar', 'Tab navigation bar.', [P('tabs', 'TabDef[]', 'Tab definitions', undefined, true), P('activeKey', 'string', 'Active tab key')]),

  /* Import Patterns — handled specially in UI, no ComponentEntry items */
];
