import { redirect } from 'next/navigation';

/**
 * Root route — redirects to /login.
 * Authenticated users are redirected to /dashboard by the login page itself.
 */
export default function RootPage() {
  redirect('/login');
}
