"use client";

import { useState, useEffect } from 'react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Badge } from '@/components/ui/Badge';

// --- Mock Data Types ---
type TimeFilter = 'Day' | 'Week' | 'Month' | 'Year';

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Day');
  const [isLoading, setIsLoading] = useState(true);

  // Mock State
  const [metrics, setMetrics] = useState({ revenue: 0, expenses: 0, stockValue: 0, trend: 0 });
  const [recentActions, setRecentActions] = useState<{id: number, text: string, time: string}[]>([]);
  const [unpaidBills, setUnpaidBills] = useState<{id: string, table: string, amount: number}[]>([]);
  const [stockAlerts, setStockAlerts] = useState<{item: string, qty: number, unit: string}[]>([]);
  const [wantedProducts, setWantedProducts] = useState<{item: string, demand: string}[]>([]);

  // Mock Fetching Logic
  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      // Generate varying data based on time filter
      const multiplier = timeFilter === 'Day' ? 1 : timeFilter === 'Week' ? 7 : timeFilter === 'Month' ? 30 : 365;
      
      setMetrics({
        revenue: 12500 * multiplier,
        expenses: 4200 * multiplier,
        stockValue: 45000, // Stock value is a snapshot, not multiplied
        trend: timeFilter === 'Day' ? 4.2 : timeFilter === 'Week' ? 12.5 : timeFilter === 'Month' ? -2.1 : 18.4,
      });

      setRecentActions([
        { id: 1, text: "Waiter Abebe created Order #142", time: "2 mins ago" },
        { id: 2, text: "Manager updated inventory for Teff", time: "15 mins ago" },
        { id: 3, text: "Table 4 payment completed (Cash)", time: "1 hour ago" },
        { id: 4, text: "System generated daily report", time: "3 hours ago" },
      ]);

      setUnpaidBills([
        { id: "#142", table: "T-4", amount: 1250.00 },
        { id: "#145", table: "T-7", amount: 840.50 },
        { id: "#146", table: "Bar", amount: 320.00 },
      ]);

      setStockAlerts([
        { item: "Teff Flour", qty: 4, unit: "kg" },
        { item: "Coffee Beans", qty: 1.5, unit: "kg" },
        { item: "Cooking Oil", qty: 2, unit: "L" },
      ]);

      setWantedProducts([
        { item: "Shiro Powder", demand: "High Priority" },
        { item: "Berbere", demand: "High Priority" },
        { item: "Injera (Ready)", demand: "Medium Priority" },
      ]);

      setIsLoading(false);
    }, 600); // 600ms fake network delay

    return () => clearTimeout(timer);
  }, [timeFilter]);

  const profit = metrics.revenue - metrics.expenses;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto page-enter">
      {/* Header & Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Dashboard Overview</h1>
          <p className="text-gray-600 font-body mt-1">Real-time business insights and operational alerts.</p>
        </div>
        
        {/* Time Filter Button Group */}
        <div className="flex bg-white rounded-lg border border-brand-light p-1 shadow-sm w-full sm:w-auto">
          {(['Day', 'Week', 'Month', 'Year'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-center text-sm font-body font-semibold rounded-md transition-colors ${
                timeFilter === filter 
                  ? 'bg-brand text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-brand-light/50 hover:text-brand-dark'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Overlay State */}
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Top Row: KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          
          {/* Revenue */}
          <AnimatedCard delay={0.05} className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-body text-sm text-gray-500 font-semibold">Total Revenue</h3>
              <div className="p-2 bg-brand-light rounded-md text-brand">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="font-display text-3xl text-brand-dark font-bold mb-2">
              {metrics.revenue.toLocaleString()} <span className="text-lg text-gray-400">ETB</span>
            </div>
            <div className={`text-xs font-body font-semibold ${metrics.trend > 0 ? 'text-success' : 'text-danger'}`}>
              {metrics.trend > 0 ? '+' : ''}{metrics.trend}% vs last period
            </div>
          </AnimatedCard>

          {/* Expenses */}
          <AnimatedCard delay={0.1} className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-body text-sm text-gray-500 font-semibold">Total Expenses</h3>
              <div className="p-2 bg-red-50 rounded-md text-danger">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
            <div className="font-display text-3xl text-brand-dark font-bold mb-2">
              {metrics.expenses.toLocaleString()} <span className="text-lg text-gray-400">ETB</span>
            </div>
            <div className="text-xs font-body font-semibold text-gray-500">
              Operational costs
            </div>
          </AnimatedCard>

          {/* Profit */}
          <AnimatedCard delay={0.15} className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-body text-sm text-gray-500 font-semibold">Net Profit</h3>
              <div className="p-2 bg-green-50 rounded-md text-success">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="font-display text-3xl text-success font-bold mb-2">
              {profit.toLocaleString()} <span className="text-lg text-gray-400">ETB</span>
            </div>
            <div className="text-xs font-body font-semibold text-gray-500">
              Revenue - Expenses
            </div>
          </AnimatedCard>

          {/* Stock Value */}
          <AnimatedCard delay={0.2} className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-body text-sm text-gray-500 font-semibold">Stock Valuation</h3>
              <div className="p-2 bg-brand-light rounded-md text-brand">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="font-display text-3xl text-brand-dark font-bold mb-2">
              {metrics.stockValue.toLocaleString()} <span className="text-lg text-gray-400">ETB</span>
            </div>
            <div className="text-xs font-body font-semibold text-gray-500">
              Current inventory worth
            </div>
          </AnimatedCard>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Unpaid Bills */}
            <AnimatedCard delay={0.25} className="p-0 overflow-hidden">
              <div className="p-5 border-b border-brand-light bg-off-white">
                <h2 className="font-display text-xl font-bold text-brand-dark">Unpaid Bills</h2>
              </div>
              <div className="divide-y divide-brand-light">
                {unpaidBills.map(bill => (
                  <div key={bill.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-body font-semibold text-gray-900">Order {bill.id}</div>
                      <div className="text-sm text-gray-500 font-body">Table: {bill.table}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-mono font-bold text-brand-dark">{bill.amount.toFixed(2)} ETB</div>
                      <Badge status="pending" label="Pending" />
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>

            {/* Recent Actions Log */}
            <AnimatedCard delay={0.3} className="p-0 overflow-hidden">
              <div className="p-5 border-b border-brand-light bg-off-white">
                <h2 className="font-display text-xl font-bold text-brand-dark">Recent Actions Log</h2>
              </div>
              <div className="p-5 space-y-4">
                {recentActions.map(action => (
                  <div key={action.id} className="flex gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-brand shrink-0"></div>
                    <div>
                      <p className="font-body text-sm font-semibold text-gray-800">{action.text}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{action.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* Stock Notifications */}
            <AnimatedCard delay={0.35} className="p-0 overflow-hidden border-warning">
              <div className="p-5 border-b border-warning/20 bg-orange-50 flex justify-between items-center">
                <h2 className="font-display text-xl font-bold text-warning">Low Stock Alerts</h2>
                <Badge status="pending" label={`${stockAlerts.length} Alerts`} />
              </div>
              <div className="divide-y divide-brand-light">
                {stockAlerts.map((alert, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="font-body font-semibold text-gray-900">{alert.item}</div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-danger font-bold">{alert.qty} {alert.unit} left</span>
                      <button className="text-xs font-bold text-brand border border-brand rounded px-2 py-1 hover:bg-brand hover:text-white transition-colors">
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>

            {/* Wanted Products */}
            <AnimatedCard delay={0.4} className="p-0 overflow-hidden">
              <div className="p-5 border-b border-brand-light bg-off-white">
                <h2 className="font-display text-xl font-bold text-brand-dark">Reorder Priority</h2>
              </div>
              <div className="divide-y divide-brand-light">
                {wantedProducts.map((product, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="font-body font-semibold text-gray-900">{product.item}</div>
                    <Badge status={product.demand === 'High Priority' ? 'cancelled' : 'pending'} label={product.demand} />
                  </div>
                ))}
              </div>
            </AnimatedCard>
            
          </div>
        </div>
      </div>
    </div>
  );
}
