'use client';

import React from 'react';
import { DashboardView } from '@/components/views/DashboardView';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  return <DashboardView onNavigate={(tab) => router.push(`/${tab}`)} />;
}
