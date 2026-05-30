"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inventory/bar/stock');
  }, [router]);

  return null;
}
