import type { Metadata } from 'next';
import ItineraryDashboard from '@/features/dashboard/components/ItineraryDashboard';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return <ItineraryDashboard />;
}
