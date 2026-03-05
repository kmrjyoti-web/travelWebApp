import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { Avatar, AvatarGroup } from './Avatar';

// ─── Avatar — structure ───────────────────────────────────────────────────────

describe('Avatar — structure', () => {
  it('renders a <span> with tos-avatar class', () => {
    render(<Avatar />);
    expect(document.querySelector('span.tos-avatar')).not.toBeNull();
  });

  it('has role="img"', () => {
    render(<Avatar />);
    expect(screen.getByRole('img')).toBeDefined();
  });

  it('uses alt as aria-label when provided', () => {
    render(<Avatar alt="John Doe" src="/img.jpg" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('John Doe');
  });

  it('uses initials as aria-label when no alt', () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('JD');
  });

  it('defaults aria-label to "Avatar" when no alt or initials', () => {
    render(<Avatar />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Avatar');
  });

  it('forwards data-testid', () => {
    render(<Avatar data-testid="av" />);
    expect(screen.getByTestId('av')).toBeDefined();
  });

  it('forwards id', () => {
    render(<Avatar id="av-1" />);
    expect(document.getElementById('av-1')).not.toBeNull();
  });

  it('appends extra className', () => {
    render(<Avatar className="custom" />);
    expect(document.querySelector('.tos-avatar')?.classList.contains('custom')).toBe(true);
  });
});

// ─── Avatar — sizes & shapes ──────────────────────────────────────────────────

describe('Avatar — sizes', () => {
  it('defaults to md size', () => {
    render(<Avatar />);
    expect(document.querySelector('.tos-avatar--md')).not.toBeNull();
  });

  it('applies tos-avatar--sm', () => {
    render(<Avatar size="sm" />);
    expect(document.querySelector('.tos-avatar--sm')).not.toBeNull();
  });

  it('applies tos-avatar--lg', () => {
    render(<Avatar size="lg" />);
    expect(document.querySelector('.tos-avatar--lg')).not.toBeNull();
  });
});

describe('Avatar — shapes', () => {
  it('defaults to circle shape', () => {
    render(<Avatar />);
    expect(document.querySelector('.tos-avatar--circle')).not.toBeNull();
  });

  it('applies tos-avatar--square', () => {
    render(<Avatar shape="square" />);
    expect(document.querySelector('.tos-avatar--square')).not.toBeNull();
  });
});

// ─── Avatar — content fallbacks ───────────────────────────────────────────────

describe('Avatar — image', () => {
  it('renders <img> when src is provided', () => {
    render(<Avatar src="/photo.jpg" alt="Jane" />);
    expect(document.querySelector('.tos-avatar__img')).not.toBeNull();
  });

  it('img has correct src', () => {
    render(<Avatar src="/photo.jpg" alt="Jane" />);
    expect(document.querySelector('.tos-avatar__img')?.getAttribute('src')).toBe('/photo.jpg');
  });

  it('img is aria-hidden (accessible name is on root span)', () => {
    render(<Avatar src="/photo.jpg" alt="Jane" />);
    expect(document.querySelector('.tos-avatar__img')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('falls back to initials on image error', () => {
    render(<Avatar src="/bad.jpg" initials="JD" alt="JD" />);
    fireEvent.error(document.querySelector('.tos-avatar__img')!);
    expect(document.querySelector('.tos-avatar__initials')).not.toBeNull();
    expect(document.querySelector('.tos-avatar__img')).toBeNull();
  });
});

describe('Avatar — initials', () => {
  it('renders tos-avatar__initials span when no src', () => {
    render(<Avatar initials="AB" />);
    expect(document.querySelector('.tos-avatar__initials')).not.toBeNull();
  });

  it('uppercases and truncates to 2 chars', () => {
    render(<Avatar initials="abc" />);
    expect(document.querySelector('.tos-avatar__initials')?.textContent).toBe('AB');
  });

  it('initials span is aria-hidden', () => {
    render(<Avatar initials="AB" />);
    expect(
      document.querySelector('.tos-avatar__initials')?.getAttribute('aria-hidden'),
    ).toBe('true');
  });
});

describe('Avatar — icon', () => {
  it('renders icon when no src and no initials', () => {
    render(<Avatar icon={<svg data-testid="icon" />} />);
    expect(document.querySelector('.tos-avatar__icon-wrap')).not.toBeNull();
  });

  it('icon wrap is aria-hidden', () => {
    render(<Avatar icon={<svg />} />);
    expect(
      document.querySelector('.tos-avatar__icon-wrap')?.getAttribute('aria-hidden'),
    ).toBe('true');
  });
});

describe('Avatar — default silhouette', () => {
  it('renders default silhouette SVG when no src, initials, or icon', () => {
    render(<Avatar />);
    expect(document.querySelector('.tos-avatar__default-icon')).not.toBeNull();
  });

  it('does not render silhouette when initials are provided', () => {
    render(<Avatar initials="JD" />);
    expect(document.querySelector('.tos-avatar__default-icon')).toBeNull();
  });
});

// ─── Avatar — status ──────────────────────────────────────────────────────────

describe('Avatar — status indicator', () => {
  it('renders status span when status is set', () => {
    render(<Avatar status="online" />);
    expect(document.querySelector('.tos-avatar__status')).not.toBeNull();
  });

  it('applies tos-avatar__status--online', () => {
    render(<Avatar status="online" />);
    expect(document.querySelector('.tos-avatar__status--online')).not.toBeNull();
  });

  it('applies tos-avatar__status--away', () => {
    render(<Avatar status="away" />);
    expect(document.querySelector('.tos-avatar__status--away')).not.toBeNull();
  });

  it('applies tos-avatar__status--busy', () => {
    render(<Avatar status="busy" />);
    expect(document.querySelector('.tos-avatar__status--busy')).not.toBeNull();
  });

  it('applies tos-avatar__status--offline', () => {
    render(<Avatar status="offline" />);
    expect(document.querySelector('.tos-avatar__status--offline')).not.toBeNull();
  });

  it('status span has aria-label equal to the status value', () => {
    render(<Avatar status="online" />);
    expect(document.querySelector('.tos-avatar__status')?.getAttribute('aria-label')).toBe(
      'online',
    );
  });

  it('does not render status span when status is not set', () => {
    render(<Avatar />);
    expect(document.querySelector('.tos-avatar__status')).toBeNull();
  });

  it('forwards status data-testid when testId is set', () => {
    render(<Avatar data-testid="av" status="online" />);
    expect(screen.getByTestId('av-status')).toBeDefined();
  });
});

// ─── AvatarGroup ──────────────────────────────────────────────────────────────

describe('AvatarGroup — structure', () => {
  it('renders a <div> with tos-avatar-group class', () => {
    render(
      <AvatarGroup>
        <Avatar initials="A" />
        <Avatar initials="B" />
      </AvatarGroup>,
    );
    expect(document.querySelector('div.tos-avatar-group')).not.toBeNull();
  });

  it('renders all children when no max is set', () => {
    render(
      <AvatarGroup>
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
      </AvatarGroup>,
    );
    expect(document.querySelectorAll('.tos-avatar').length).toBe(3);
    expect(document.querySelector('.tos-avatar-group__overflow')).toBeNull();
  });

  it('shows only `max` avatars and an overflow indicator', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
      </AvatarGroup>,
    );
    expect(document.querySelectorAll('.tos-avatar').length).toBe(2);
    expect(document.querySelector('.tos-avatar-group__overflow')).not.toBeNull();
  });

  it('overflow shows correct excess count', () => {
    render(
      <AvatarGroup max={1}>
        <Avatar initials="A" />
        <Avatar initials="B" />
        <Avatar initials="C" />
      </AvatarGroup>,
    );
    expect(document.querySelector('.tos-avatar-group__overflow')?.textContent).toBe('+2');
  });

  it('overflow has correct aria-label', () => {
    render(
      <AvatarGroup max={1}>
        <Avatar initials="A" />
        <Avatar initials="B" />
      </AvatarGroup>,
    );
    expect(
      document.querySelector('.tos-avatar-group__overflow')?.getAttribute('aria-label'),
    ).toBe('1 more');
  });

  it('group has correct aria-label with count', () => {
    render(
      <AvatarGroup>
        <Avatar initials="A" />
        <Avatar initials="B" />
      </AvatarGroup>,
    );
    expect(document.querySelector('.tos-avatar-group')?.getAttribute('aria-label')).toBe(
      '2 avatars',
    );
  });

  it('does not show overflow when count equals max', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar initials="A" />
        <Avatar initials="B" />
      </AvatarGroup>,
    );
    expect(document.querySelector('.tos-avatar-group__overflow')).toBeNull();
  });

  it('forwards data-testid', () => {
    render(
      <AvatarGroup data-testid="grp" max={1}>
        <Avatar initials="A" />
        <Avatar initials="B" />
      </AvatarGroup>,
    );
    expect(screen.getByTestId('grp')).toBeDefined();
    expect(screen.getByTestId('grp-overflow')).toBeDefined();
  });
});
