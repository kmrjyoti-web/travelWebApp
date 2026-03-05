import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ─── jsdom shims ──────────────────────────────────────────────────────────────

// jsdom does not implement window.matchMedia — provide a minimal stub.
// Individual tests that need specific match results can vi.spyOn(window, 'matchMedia').
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},   // deprecated but some libs call it
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// ─── Next.js module mocks ─────────────────────────────────────────────────────
// next/navigation: replace router hooks with stable test stubs.
// next/image and next/link: mock at test level if needed (avoid JSX in .ts setup).

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));
