import type { Metadata } from 'next';
import BookingPageContent from './BookingPageContent';

export const metadata: Metadata = { title: 'Bookings' };

export default function BookingPage() {
  return <BookingPageContent />;
}
