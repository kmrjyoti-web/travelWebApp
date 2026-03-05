import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { Tabs } from './Tabs';
import type { TabItem } from './types';

const ITEMS: TabItem[] = [
  { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
  { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
  { id: 'tab3', label: 'Tab 3', content: <div>Content 3</div> },
];

const WITH_DISABLED: TabItem[] = [
  { id: 'a', label: 'A', content: 'A content' },
  { id: 'b', label: 'B', content: 'B content', disabled: true },
  { id: 'c', label: 'C', content: 'C content' },
];

// ─── Structure ────────────────────────────────────────────────────────────────

describe('Tabs — structure', () => {
  it('renders a tablist', () => {
    render(<Tabs items={ITEMS} />);
    expect(screen.getByRole('tablist')).toBeDefined();
  });

  it('renders a tab button for each item', () => {
    render(<Tabs items={ITEMS} />);
    expect(screen.getAllByRole('tab').length).toBe(3);
  });

  it('renders a tabpanel for each item', () => {
    render(<Tabs items={ITEMS} />);
    expect(screen.getAllByRole('tabpanel').length).toBe(3);
  });

  it('has tos-tabs class on root', () => {
    render(<Tabs items={ITEMS} />);
    expect(document.querySelector('.tos-tabs')).not.toBeNull();
  });

  it('has tos-tabs--horizontal class by default', () => {
    render(<Tabs items={ITEMS} />);
    expect(document.querySelector('.tos-tabs--horizontal')).not.toBeNull();
  });

  it('has tos-tabs--vertical class when orientation=vertical', () => {
    render(<Tabs items={ITEMS} orientation="vertical" />);
    expect(document.querySelector('.tos-tabs--vertical')).not.toBeNull();
  });

  it('tablist has aria-orientation=horizontal by default', () => {
    render(<Tabs items={ITEMS} />);
    expect(screen.getByRole('tablist').getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('tablist has aria-orientation=vertical when set', () => {
    render(<Tabs items={ITEMS} orientation="vertical" />);
    expect(screen.getByRole('tablist').getAttribute('aria-orientation')).toBe('vertical');
  });

  it('forwards data-testid', () => {
    render(<Tabs items={ITEMS} data-testid="my-tabs" />);
    expect(screen.getByTestId('my-tabs')).toBeDefined();
  });
});

// ─── ARIA attributes ──────────────────────────────────────────────────────────

describe('Tabs — ARIA', () => {
  it('active tab has aria-selected=true', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" />);
    expect(screen.getByRole('tab', { name: 'Tab 1' }).getAttribute('aria-selected')).toBe('true');
  });

  it('inactive tabs have aria-selected=false', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" />);
    expect(screen.getByRole('tab', { name: 'Tab 2' }).getAttribute('aria-selected')).toBe('false');
  });

  it('active tab has tabIndex=0, inactive tabs have tabIndex=-1', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" />);
    expect(screen.getByRole('tab', { name: 'Tab 1' }).getAttribute('tabindex')).toBe('0');
    expect(screen.getByRole('tab', { name: 'Tab 2' }).getAttribute('tabindex')).toBe('-1');
  });

  it('tab aria-controls matches panel id', () => {
    render(<Tabs items={ITEMS} data-testid="t" />);
    const tab = screen.getByTestId('t-tab-tab1');
    const panel = screen.getByTestId('t-panel-tab1');
    expect(tab.getAttribute('aria-controls')).toBe(panel.id);
  });

  it('panel aria-labelledby matches tab id', () => {
    render(<Tabs items={ITEMS} data-testid="t" />);
    const tab = screen.getByTestId('t-tab-tab1');
    const panel = screen.getByTestId('t-panel-tab1');
    expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
  });

  it('inactive panel has hidden attribute', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" data-testid="t" />);
    expect(screen.getByTestId('t-panel-tab2').hasAttribute('hidden')).toBe(true);
  });

  it('active panel does not have hidden attribute', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" data-testid="t" />);
    expect(screen.getByTestId('t-panel-tab1').hasAttribute('hidden')).toBe(false);
  });
});

// ─── Tab switching ────────────────────────────────────────────────────────────

describe('Tabs — switching (uncontrolled)', () => {
  it('shows first enabled tab by default', () => {
    render(<Tabs items={ITEMS} />);
    expect(screen.getByText('Content 1')).toBeDefined();
  });

  it('clicking a tab makes it active', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" data-testid="t" />);
    fireEvent.click(screen.getByTestId('t-tab-tab2'));
    expect(
      screen.getByRole('tab', { name: 'Tab 2' }).getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('clicking a tab shows its panel content', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" data-testid="t" />);
    fireEvent.click(screen.getByTestId('t-tab-tab2'));
    expect(screen.getByTestId('t-panel-tab2').hasAttribute('hidden')).toBe(false);
  });

  it('calls onChange when tab is switched', () => {
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} defaultTab="tab1" onChange={onChange} data-testid="t" />);
    fireEvent.click(screen.getByTestId('t-tab-tab2'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });
});

describe('Tabs — controlled mode', () => {
  it('renders the controlled active tab', () => {
    render(<Tabs items={ITEMS} activeTab="tab2" onChange={vi.fn()} />);
    expect(
      screen.getByRole('tab', { name: 'Tab 2' }).getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('calls onChange but does not change active tab internally (caller controls state)', () => {
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} activeTab="tab1" onChange={onChange} data-testid="t" />);
    fireEvent.click(screen.getByTestId('t-tab-tab3'));
    expect(onChange).toHaveBeenCalledWith('tab3');
    // Still showing tab1 (controlled)
    expect(
      screen.getByRole('tab', { name: 'Tab 1' }).getAttribute('aria-selected'),
    ).toBe('true');
  });
});

// ─── Disabled tabs ────────────────────────────────────────────────────────────

describe('Tabs — disabled', () => {
  it('disabled tab has disabled attribute', () => {
    render(<Tabs items={WITH_DISABLED} />);
    expect((screen.getByRole('tab', { name: 'B' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('disabled tab has tos-tabs__tab--disabled class', () => {
    render(<Tabs items={WITH_DISABLED} data-testid="t" />);
    expect(
      screen.getByTestId('t-tab-b').classList.contains('tos-tabs__tab--disabled'),
    ).toBe(true);
  });

  it('clicking a disabled tab does not activate it', () => {
    render(<Tabs items={WITH_DISABLED} defaultTab="a" data-testid="t" />);
    fireEvent.click(screen.getByTestId('t-tab-b'));
    expect(
      screen.getByRole('tab', { name: 'A' }).getAttribute('aria-selected'),
    ).toBe('true');
  });
});

// ─── Keyboard navigation ──────────────────────────────────────────────────────

describe('Tabs — keyboard (horizontal)', () => {
  it('ArrowRight moves focus to next tab', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" data-testid="t" />);
    const tab1 = screen.getByTestId('t-tab-tab1');
    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'ArrowRight' });
    expect(document.activeElement?.textContent).toContain('Tab 2');
  });

  it('ArrowLeft moves focus to previous tab', () => {
    render(<Tabs items={ITEMS} defaultTab="tab2" data-testid="t" />);
    const tab2 = screen.getByTestId('t-tab-tab2');
    tab2.focus();
    fireEvent.keyDown(tab2, { key: 'ArrowLeft' });
    expect(document.activeElement?.textContent).toContain('Tab 1');
  });

  it('ArrowRight wraps around from last to first', () => {
    render(<Tabs items={ITEMS} defaultTab="tab3" data-testid="t" />);
    const tab3 = screen.getByTestId('t-tab-tab3');
    tab3.focus();
    fireEvent.keyDown(tab3, { key: 'ArrowRight' });
    expect(document.activeElement?.textContent).toContain('Tab 1');
  });

  it('Home focuses first tab', () => {
    render(<Tabs items={ITEMS} defaultTab="tab3" data-testid="t" />);
    const tab3 = screen.getByTestId('t-tab-tab3');
    tab3.focus();
    fireEvent.keyDown(tab3, { key: 'Home' });
    expect(document.activeElement?.textContent).toContain('Tab 1');
  });

  it('End focuses last tab', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" data-testid="t" />);
    const tab1 = screen.getByTestId('t-tab-tab1');
    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'End' });
    expect(document.activeElement?.textContent).toContain('Tab 3');
  });

  it('ArrowRight skips disabled tabs', () => {
    render(<Tabs items={WITH_DISABLED} defaultTab="a" data-testid="t" />);
    const tabA = screen.getByTestId('t-tab-a');
    tabA.focus();
    fireEvent.keyDown(tabA, { key: 'ArrowRight' });
    // Should skip disabled 'b' and focus 'c'
    expect(document.activeElement?.textContent).toContain('C');
  });
});

describe('Tabs — keyboard (vertical)', () => {
  it('ArrowDown moves focus to next tab', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" orientation="vertical" data-testid="t" />);
    const tab1 = screen.getByTestId('t-tab-tab1');
    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toContain('Tab 2');
  });

  it('ArrowUp moves focus to previous tab', () => {
    render(<Tabs items={ITEMS} defaultTab="tab2" orientation="vertical" data-testid="t" />);
    const tab2 = screen.getByTestId('t-tab-tab2');
    tab2.focus();
    fireEvent.keyDown(tab2, { key: 'ArrowUp' });
    expect(document.activeElement?.textContent).toContain('Tab 1');
  });
});

// ─── Icon + lazy ──────────────────────────────────────────────────────────────

describe('Tabs — icon and lazy', () => {
  it('renders icon in tos-tabs__tab-icon span', () => {
    render(
      <Tabs
        items={[{ id: 'x', label: 'X', icon: <svg data-testid="icon" />, content: 'xc' }]}
      />,
    );
    expect(document.querySelector('.tos-tabs__tab-icon')).not.toBeNull();
    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('icon span is aria-hidden', () => {
    render(
      <Tabs
        items={[{ id: 'x', label: 'X', icon: <svg />, content: 'xc' }]}
      />,
    );
    expect(
      document.querySelector('.tos-tabs__tab-icon')?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('lazy=false renders all panel contents immediately', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" lazy={false} data-testid="t" />);
    expect(screen.getByText('Content 2')).toBeDefined();
    expect(screen.getByText('Content 3')).toBeDefined();
  });

  it('lazy=true does not render inactive panel content until activated', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" lazy={true} data-testid="t" />);
    expect(screen.queryByText('Content 2')).toBeNull();
  });

  it('lazy=true renders content once the tab is activated', () => {
    render(<Tabs items={ITEMS} defaultTab="tab1" lazy={true} data-testid="t" />);
    fireEvent.click(screen.getByTestId('t-tab-tab2'));
    expect(screen.getByText('Content 2')).toBeDefined();
  });
});
