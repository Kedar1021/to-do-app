import { redirect } from 'next/navigation';

// Redirect to login page

export default function Home() {
  redirect('/login');
}
