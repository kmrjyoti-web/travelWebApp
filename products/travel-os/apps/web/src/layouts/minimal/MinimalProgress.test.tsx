import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MinimalProgress } from './MinimalProgress';

// ─── MinimalProgress — null guard ─────────────────────────────────────────────

describe('MinimalProgress — null guard', () => {
  it('renders nothing when totalSteps < 2', () => {
    const { container } = render(<MinimalProgress step={1} totalSteps={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when totalSteps = 0', () => {
    const { container } = render(<MinimalProgress step={1} totalSteps={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when totalSteps = 2', () => {
    render(<MinimalProgress step={1} totalSteps={2} />);
    expect(screen.getByTestId('minimal-progress')).toBeDefined();
  });
});

// ─── MinimalProgress — ARIA ───────────────────────────────────────────────────

describe('MinimalProgress — ARIA', () => {
  it('has role=progressbar', () => {
    render(<MinimalProgress step={2} totalSteps={4} />);
    expect(screen.getByRole('progressbar')).toBeDefined();
  });

  it('aria-valuenow equals step', () => {
    render(<MinimalProgress step={2} totalSteps={4} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('2');
  });

  it('aria-valuemin is 1', () => {
    render(<MinimalProgress step={2} totalSteps={4} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuemin')).toBe('1');
  });

  it('aria-valuemax equals totalSteps', () => {
    render(<MinimalProgress step={2} totalSteps={4} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuemax')).toBe('4');
  });

  it('aria-label contains "Step N of M"', () => {
    render(<MinimalProgress step={2} totalSteps={4} />);
    const label = screen.getByRole('progressbar').getAttribute('aria-label');
    expect(label).toMatch(/step 2 of 4/i);
  });

  it('aria-label includes label name when provided', () => {
    render(
      <MinimalProgress
        step={2}
        totalSteps={3}
        labels={['Personal', 'Details', 'Confirm']}
      />,
    );
    const label = screen.getByRole('progressbar').getAttribute('aria-label');
    expect(label).toMatch(/details/i);
  });

  it('has a screen-reader text node with step info', () => {
    render(<MinimalProgress step={3} totalSteps={5} />);
    expect(screen.getByText(/step 3 of 5/i)).toBeDefined();
  });
});

// ─── MinimalProgress — segments ───────────────────────────────────────────────

describe('MinimalProgress — segments', () => {
  it('renders the correct number of segments', () => {
    render(<MinimalProgress step={1} totalSteps={4} />);
    const segments = document.querySelectorAll('.tos-min-progress__segment');
    expect(segments.length).toBe(4);
  });

  it('segments before current step have --done class', () => {
    render(<MinimalProgress step={3} totalSteps={5} />);
    // Segments 1 and 2 are done
    const seg1 = screen.getByTestId('progress-segment-1');
    const seg2 = screen.getByTestId('progress-segment-2');
    expect(seg1.className).toMatch(/--done/);
    expect(seg2.className).toMatch(/--done/);
  });

  it('current segment has --current class', () => {
    render(<MinimalProgress step={3} totalSteps={5} />);
    const seg3 = screen.getByTestId('progress-segment-3');
    expect(seg3.className).toMatch(/--current/);
  });

  it('current segment does not have --done class', () => {
    render(<MinimalProgress step={3} totalSteps={5} />);
    const seg3 = screen.getByTestId('progress-segment-3');
    expect(seg3.className).not.toMatch(/--done/);
  });

  it('future segments have neither --done nor --current class', () => {
    render(<MinimalProgress step={2} totalSteps={4} />);
    const seg3 = screen.getByTestId('progress-segment-3');
    const seg4 = screen.getByTestId('progress-segment-4');
    expect(seg3.className).not.toMatch(/--done|--current/);
    expect(seg4.className).not.toMatch(/--done|--current/);
  });

  it('first step: only segment 1 has --current, none have --done', () => {
    render(<MinimalProgress step={1} totalSteps={3} />);
    expect(screen.getByTestId('progress-segment-1').className).toMatch(/--current/);
    expect(document.querySelectorAll('.tos-min-progress__segment--done').length).toBe(0);
  });

  it('last step: all previous segments have --done', () => {
    render(<MinimalProgress step={4} totalSteps={4} />);
    expect(document.querySelectorAll('.tos-min-progress__segment--done').length).toBe(3);
    expect(screen.getByTestId('progress-segment-4').className).toMatch(/--current/);
  });

  it('track container is aria-hidden', () => {
    render(<MinimalProgress step={1} totalSteps={3} />);
    const track = screen.getByTestId('minimal-progress-track');
    expect(track.getAttribute('aria-hidden')).toBe('true');
  });
});

// ─── MinimalProgress — labels ────────────────────────────────────────────────

describe('MinimalProgress — labels', () => {
  const labels = ['Account', 'Preferences', 'Payment', 'Confirm'];

  it('renders labels container when labels provided', () => {
    render(<MinimalProgress step={1} totalSteps={4} labels={labels} />);
    expect(screen.getByTestId('minimal-progress-labels')).toBeDefined();
  });

  it('renders the correct number of label items', () => {
    render(<MinimalProgress step={1} totalSteps={4} labels={labels} />);
    const labelEls = document.querySelectorAll('.tos-min-progress__label');
    expect(labelEls.length).toBe(4);
  });

  it('current label has --current class', () => {
    render(<MinimalProgress step={2} totalSteps={4} labels={labels} />);
    const label = screen.getByTestId('progress-label-2');
    expect(label.className).toMatch(/--current/);
  });

  it('non-current labels do not have --current class', () => {
    render(<MinimalProgress step={2} totalSteps={4} labels={labels} />);
    const label1 = screen.getByTestId('progress-label-1');
    const label3 = screen.getByTestId('progress-label-3');
    expect(label1.className).not.toMatch(/--current/);
    expect(label3.className).not.toMatch(/--current/);
  });

  it('label text matches provided labels array', () => {
    render(<MinimalProgress step={1} totalSteps={4} labels={labels} />);
    for (const label of labels) {
      expect(screen.getByText(label)).toBeDefined();
    }
  });

  it('does not render labels container when labels not provided', () => {
    render(<MinimalProgress step={1} totalSteps={3} />);
    expect(screen.queryByTestId('minimal-progress-labels')).toBeNull();
  });

  it('labels container is aria-hidden', () => {
    render(<MinimalProgress step={1} totalSteps={4} labels={labels} />);
    const container = screen.getByTestId('minimal-progress-labels');
    expect(container.getAttribute('aria-hidden')).toBe('true');
  });
});

// ─── MinimalProgress — data-testid prop ──────────────────────────────────────

describe('MinimalProgress — data-testid', () => {
  it('uses default data-testid=minimal-progress', () => {
    render(<MinimalProgress step={1} totalSteps={3} />);
    expect(screen.getByTestId('minimal-progress')).toBeDefined();
  });

  it('uses custom data-testid when provided', () => {
    render(<MinimalProgress step={1} totalSteps={3} data-testid="checkout-progress" />);
    expect(screen.getByTestId('checkout-progress')).toBeDefined();
  });
});

// ─── MinimalProgress — className prop ────────────────────────────────────────

describe('MinimalProgress — className', () => {
  it('merges custom className with tos-min-progress', () => {
    render(<MinimalProgress step={1} totalSteps={3} className="custom-class" />);
    const el = screen.getByTestId('minimal-progress');
    expect(el.className).toContain('tos-min-progress');
    expect(el.className).toContain('custom-class');
  });
});

// ─── MinimalProgress — step clamping ─────────────────────────────────────────

describe('MinimalProgress — step clamping', () => {
  it('clamps step below 1 to 1', () => {
    render(<MinimalProgress step={0} totalSteps={3} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('1');
  });

  it('clamps step above totalSteps to totalSteps', () => {
    render(<MinimalProgress step={10} totalSteps={3} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('3');
  });
});
