"use client";

import { Card } from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="p-8 page-enter max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Settings</h1>
        <p className="text-gray-600 font-body mt-1">Configure ERP preferences and integrations.</p>
      </div>

      <Card className="p-12 text-center text-gray-500 font-body">
        <p>Settings form placeholder.</p>
      </Card>
    </div>
  );
}
