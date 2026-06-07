"use client";

import { useState, useEffect, useMemo } from 'react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Badge } from '@/components/ui/Badge';
import { getTransactions, getExpenses, getTables, getBills, initializeMockStorage, Transaction, Expense, Table, Bill } from '@/lib/mockStorage';

type TimeFilter = 'Day' | 'Week' | 'Month' | 'Year' | 'Custom';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Month');
  
  // Custom Date Range State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Local state copy for dashboard reactivity
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    initializeMockStorage();
    setTransactions(getTransactions());
    setExpenses(getExpenses());
    setTables(getTables());
    setBills(getBills());
    
    // Set default dates for Custom filter (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);

    setMounted(true);
  }, []);

  // Filter lists based on date
  const filteredData = useMemo(() => {
    if (!mounted) return { transactions: [], expenses: [] };

    const start = new Date();
    const end = new Date();

    if (timeFilter === 'Day') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (timeFilter === 'Week') {
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else if (timeFilter === 'Month') {
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    } else if (timeFilter === 'Year') {
      start.setDate(start.getDate() - 365);
      start.setHours(0, 0, 0, 0);
    } else if (timeFilter === 'Custom') {
      if (startDate) {
        const d = new Date(startDate);
        d.setHours(0, 0, 0, 0);
        start.setTime(d.getTime());
      } else {
        start.setTime(0); // far past
      }
      if (endDate) {
        const d = new Date(endDate);
        d.setHours(23, 59, 59, 999);
        end.setTime(d.getTime());
      }
    }

    const startMs = start.getTime();
    const endMs = end.getTime();

    const filteredTx = transactions.filter(tx => {
      const txMs = new Date(tx.timestamp).getTime();
      return txMs >= startMs && txMs <= endMs;
    });

    const filteredExp = expenses.filter(exp => {
      const expMs = new Date(exp.timestamp).getTime();
      return expMs >= startMs && expMs <= endMs;
    });

    return {
      transactions: filteredTx,
      expenses: filteredExp
    };
  }, [timeFilter, startDate, endDate, transactions, expenses, mounted]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalRev = filteredData.transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalExp = filteredData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = totalRev - totalExp;
    
    // Constant inventory valuation
    const stockValue = 48500;

    // Trend calculation vs prior equivalent period
    // Simple mock comparison for UI richness
    let trend = 5.4;
    if (timeFilter === 'Day') trend = 2.1;
    else if (timeFilter === 'Week') trend = -1.8;
    else if (timeFilter === 'Year') trend = 14.2;

    return {
      revenue: totalRev,
      expenses: totalExp,
      profit,
      stockValue,
      trend
    };
  }, [filteredData, timeFilter]);

  // Combine recent checkouts, expenses, and active orders for a live feed
  const recentLogs = useMemo(() => {
    const logs: { id: string; text: string; time: string; type: 'info' | 'success' | 'danger' | 'warning' }[] = [];

    // Add recent checkouts (up to 4)
    transactions.slice(0, 4).forEach((tx, idx) => {
      const timeStr = new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
      logs.push({
        id: `tx-log-${idx}`,
        text: `Table "${tx.tableName}" checkout completed (${tx.paymentChannel}) — ${tx.amount.toLocaleString()} ETB`,
        time: `${dateStr} at ${timeStr}`,
        type: 'success'
      });
    });

    // Add recent expenses (up to 3)
    expenses.slice(0, 3).forEach((exp, idx) => {
      const timeStr = new Date(exp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = new Date(exp.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
      logs.push({
        id: `exp-log-${idx}`,
        text: `Expense added: "${exp.name}" — ${exp.amount.toLocaleString()} ETB paid via ${exp.channel}`,
        time: `${dateStr} at ${timeStr}`,
        type: 'danger'
      });
    });

    // Add active bills / tables (up to 3)
    tables.filter(t => t.status === 'Occupied').slice(0, 3).forEach((t, idx) => {
      logs.push({
        id: `table-log-${idx}`,
        text: `Table "${t.name}" order active — Current bill total: ${t.currentBill.total.toLocaleString()} ETB`,
        time: 'Live Now',
        type: 'info'
      });
    });

    return logs.slice(0, 6); // show latest 6 actions
  }, [transactions, expenses, tables]);

  // Find unpaid bills (status === 'Unpaid' or 'Current')
  const dashboardBills = useMemo(() => {
    return bills
      .filter(b => b.status !== 'Paid')
      .slice(0, 4); // show top 4
  }, [bills]);

  if (!mounted) {
    return (
      <div className="p-8 text-brand font-semibold animate-pulse flex justify-center items-center h-screen bg-off-white">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-brand mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-body text-brand-dark">Loading Dashboard Overview...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto page-enter">
      {/* Header & Filter Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 border-b border-brand-light pb-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-brand-dark">Dashboard Overview</h1>
          <p className="text-gray-600 font-body mt-1">Real-time business insights and operations logs (Frontend Simulation).</p>
        </div>
        
        {/* Date Filter Widget */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
          {timeFilter === 'Custom' && (
            <div className="flex items-center gap-2 bg-white rounded-lg border border-brand-light p-1 shadow-sm">
              <input 
                type="date" 
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="px-2 py-1 text-xs border-none outline-none font-mono text-gray-700 bg-transparent"
              />
              <span className="text-gray-400 text-xs">to</span>
              <input 
                type="date" 
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="px-2 py-1 text-xs border-none outline-none font-mono text-gray-700 bg-transparent"
              />
            </div>
          )}

          <div className="flex bg-white rounded-lg border border-brand-light p-1 shadow-sm overflow-hidden shrink-0">
            {(['Day', 'Week', 'Month', 'Year', 'Custom'] as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 text-center text-xs font-body font-bold rounded-md transition-colors ${
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
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Revenue Card */}
        <AnimatedCard delay={0.05} className="flex flex-col justify-between h-32 hover:border-brand transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="font-body text-sm text-gray-500 font-semibold">Total Revenue</h3>
            <div className="p-2 bg-brand-light rounded-md text-brand">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl text-brand-dark font-bold">
              {stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-gray-400">ETB</span>
            </div>
            <div className={`text-[11px] font-body font-semibold mt-1 ${stats.trend > 0 ? 'text-[#10694F]' : 'text-danger'}`}>
              {stats.trend > 0 ? '▲ +' : '▼ '}{stats.trend}% vs last period
            </div>
          </div>
        </AnimatedCard>

        {/* Expenses Card */}
        <AnimatedCard delay={0.1} className="flex flex-col justify-between h-32 hover:border-brand transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="font-body text-sm text-gray-500 font-semibold">Total Expenses</h3>
            <div className="p-2 bg-red-50 rounded-md text-danger">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl text-brand-dark font-bold">
              {stats.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-gray-400">ETB</span>
            </div>
            <div className="text-[11px] font-body font-semibold text-gray-400 mt-1">
              Operational cash outflows
            </div>
          </div>
        </AnimatedCard>

        {/* Profit Card */}
        <AnimatedCard delay={0.15} className="flex flex-col justify-between h-32 hover:border-brand transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="font-body text-sm text-gray-500 font-semibold">Net Profit</h3>
            <div className={`p-2 rounded-md ${stats.profit >= 0 ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className={`font-display text-2xl font-bold ${stats.profit >= 0 ? 'text-[#10694F]' : 'text-danger'}`}>
              {stats.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-gray-400">ETB</span>
            </div>
            <div className="text-[11px] font-body font-semibold text-gray-400 mt-1">
              Net margin comparison
            </div>
          </div>
        </AnimatedCard>

        {/* Stock Valuation Card */}
        <AnimatedCard delay={0.2} className="flex flex-col justify-between h-32 hover:border-brand transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="font-body text-sm text-gray-500 font-semibold">Stock Valuation</h3>
            <div className="p-2 bg-brand-light rounded-md text-brand">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="font-display text-2xl text-brand-dark font-bold">
              {stats.stockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm text-gray-400">ETB</span>
            </div>
            <div className="text-[11px] font-body font-semibold text-gray-400 mt-1">
              Current store asset valuation
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Left Column: Recent Actions Log */}
        <div className="space-y-6">
          <AnimatedCard delay={0.25} className="p-0 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-brand-light bg-brand-dark text-white flex justify-between items-center">
              <h2 className="font-display text-xl font-bold tracking-wide">Live Simulated Operations Log</h2>
              <span className="inline-flex w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            </div>
            <div className="p-5 divide-y divide-brand-light/30 max-h-[420px] overflow-y-auto">
              {recentLogs.length === 0 ? (
                <div className="py-8 text-center text-gray-400 font-body">No operations logged for the selected period.</div>
              ) : (
                recentLogs.map((log) => {
                  return (
                    <div key={log.id} className="py-3.5 flex items-start gap-3 transition-colors hover:bg-gray-50/50 rounded px-2">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.type === 'success' ? 'bg-[#10694F]' : log.type === 'danger' ? 'bg-danger' : 'bg-brand'
                      }`} />
                      <div className="flex-1">
                        <p className="font-body text-sm font-semibold text-gray-800 leading-snug">{log.text}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{log.time}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Right Column: Unpaid Bills & Alerts */}
        <div className="space-y-6">
          {/* Bills Alerts */}
          <AnimatedCard delay={0.3} className="p-0 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-brand-light bg-off-white flex justify-between items-center">
              <h2 className="font-display text-xl font-bold text-brand-dark">Pending & Unpaid Bills</h2>
              <Badge status="pending" label={`${dashboardBills.length} Pending`} />
            </div>
            <div className="divide-y divide-brand-light">
              {dashboardBills.length === 0 ? (
                <div className="p-6 text-center text-gray-400 font-body">All bills are fully paid! 🎉</div>
              ) : (
                dashboardBills.map((bill) => {
                  const percent = Math.round((bill.amountPaid / bill.totalAmount) * 100);
                  return (
                    <div key={bill.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-body font-semibold text-gray-900 leading-snug">{bill.name}</div>
                          <div className="text-xs text-gray-500 font-body mt-1">Due Date: {bill.dueDate}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-brand-dark">{(bill.totalAmount - bill.amountPaid).toLocaleString()} ETB</div>
                          <span className={`text-[10px] font-bold uppercase ${bill.status === 'Unpaid' ? 'text-danger' : 'text-warning'}`}>
                            {bill.status === 'Unpaid' ? 'Overdue' : 'Due Soon'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Mini progress bar */}
                      <div className="mt-2 w-full bg-brand-light/50 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${bill.status === 'Unpaid' ? 'bg-danger' : 'bg-brand'}`} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mt-1">
                        <span>{percent}% Paid</span>
                        <span>{bill.amountPaid.toLocaleString()} / {bill.totalAmount.toLocaleString()} ETB</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </AnimatedCard>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 border border-brand-light rounded-[10px] shadow-xs">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-body">Occupied Tables</h4>
              <p className="font-display text-4xl text-brand font-bold mt-2">
                {tables.filter(t => t.status === 'Occupied').length} <span className="text-lg text-gray-400">/ {tables.length}</span>
              </p>
              <a href="/table-management" className="text-xs font-semibold text-brand hover:underline mt-2 block">
                Manage tables ↗
              </a>
            </div>
            
            <div className="bg-white p-5 border border-brand-light rounded-[10px] shadow-xs">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-body">Low Stock Items</h4>
              <p className="font-display text-4xl text-warning font-bold mt-2">
                3 <span className="text-lg text-gray-400">Alerts</span>
              </p>
              <a href="/inventory" className="text-xs font-semibold text-warning hover:underline mt-2 block">
                Open inventory ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
