"use client";

import { Card } from '@/components/ui/Card';

export default function CustomersPage() {
  return (
    <div className="p-8 page-enter max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Customers</h1>
        <p className="text-gray-600 font-body mt-1">Manage customer profiles and history.</p>
      </div>

      <Card className="p-12 text-center text-gray-500 font-body">
        <p>Customers list placeholder.</p>
      </Card>
    </div>
  );
}
