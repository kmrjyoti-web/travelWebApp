'use client';

import { LayoutProvider } from '@/layouts/LayoutProvider';
import { AdminLayout } from '@/layouts/admin';

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider initialLayout="admin">
      <AdminLayout>{children}</AdminLayout>
    </LayoutProvider>
  );
}
