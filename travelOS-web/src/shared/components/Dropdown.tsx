'use client';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CDropdownHeader } from '@coreui/react';
import type { ComponentProps } from 'react';

export type DropdownProps = ComponentProps<typeof CDropdown>;

// Re-export CoreUI components directly — polymorphic Props<"el"> types are not compatible with ComponentProps wrappers
export const Dropdown = CDropdown;
export const DropdownToggle = CDropdownToggle;
export const DropdownMenu = CDropdownMenu;
export const DropdownItem = CDropdownItem;
export const DropdownDivider = CDropdownDivider;
export const DropdownHeader = CDropdownHeader;
