"use client";

import { AnimatedCard } from '@/components/ui/AnimatedCard';

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Analytics</h1>
        <p className="text-gray-600 font-body mt-1">Sales, performance, and insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1,2,3,4].map((i, index) => (
          <AnimatedCard key={i} delay={index * 0.05} className="p-6">
            <h3 className="font-body text-sm text-gray-500 font-semibold mb-2">KPI Metric {i}</h3>
            <div className="font-display text-3xl text-brand font-bold">12,345</div>
          </AnimatedCard>
        ))}
      </div>

      <AnimatedCard delay={0.2} className="p-12 text-center text-gray-500 font-body">
        <p>Charts and graphs placeholder.</p>
      </AnimatedCard>
    </div>
  );
}
