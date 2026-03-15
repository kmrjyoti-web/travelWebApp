import type { Metadata } from 'next';
import { PageToolbar } from '@/shared/components';

export const metadata: Metadata = { title: 'Archive Itinerary' };

export default function ArchiveItineraryPage() {
  return <PageToolbar title="Archive Itinerary" />;
}
