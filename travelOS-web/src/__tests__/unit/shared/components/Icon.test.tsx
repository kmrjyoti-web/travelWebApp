import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock lucide-react icons map before importing Icon
vi.mock('lucide-react', () => {
  const MockSvg = ({ size, ...props }: { size?: number; [key: string]: unknown }) => (
    <svg width={size} height={size} {...props} />
  );
  MockSvg.displayName = 'MockSvg';
  return { icons: { Home: MockSvg, Star: MockSvg } };
});

import { Icon } from '@/shared/components/Icon';

describe('Icon', () => {
  it('renders a valid icon by name', () => {
    const { container } = render(<Icon name={'Home' as Parameters<typeof Icon>[0]['name']} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('warns and renders nothing for invalid icon name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <Icon name={'NonExistentIcon' as Parameters<typeof Icon>[0]['name']} />
    );
    expect(container.firstChild).toBeNull();
    warn.mockRestore();
  });

  it('passes size prop to svg', () => {
    const { container } = render(<Icon name={'Star' as Parameters<typeof Icon>[0]['name']} size={32} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
  });
});
