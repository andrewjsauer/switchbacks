'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '@/context/AuthContext';
import Dashboard from '@/components/Dashboard';

export default function HomePage() {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    } else {
      router.push('/');
    }
  }, [user, router]);

  return user ? <Dashboard /> : null;
}
