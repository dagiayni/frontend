"use client";

import { Card } from '@/components/ui/Card';

export default function EmployeesPage() {
  return (
    <div className="p-8 page-enter max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Employees</h1>
        <p className="text-gray-600 font-body mt-1">Manage staff, roles, and access.</p>
      </div>

      <Card className="p-12 text-center text-gray-500 font-body">
        <p>Employee management interface placeholder.</p>
      </Card>
    </div>
  );
}
