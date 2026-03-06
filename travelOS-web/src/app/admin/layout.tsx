'use client';
/**
 * Admin layout — minimal shell for the /admin/* route group.
 * Admin pages handle their own auth checks and rendering independently.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
