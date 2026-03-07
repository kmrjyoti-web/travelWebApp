import { ItineraryPublisherHub } from '@/features/itinerary/publisher';

export const metadata = {
  title: 'Create / Publish Package | TravelOS',
  description: 'Create and publish a complete travel package with all details.',
};

interface Props {
  searchParams: { id?: string };
}

export default function PublishPackagePage({ searchParams }: Props) {
  return <ItineraryPublisherHub editId={searchParams.id} />;
}
