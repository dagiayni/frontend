"use client";

import { useEffect, useState, useMemo } from 'react';
import { getTransactions, Transaction, initializeMockStorage } from '@/lib/mockStorage';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type TimeFilter = 'Day' | 'Week' | 'Month' | 'Year' | 'Custom';
type ChannelFilter = 'All' | 'Cash' | 'Telebirr' | 'CBE' | 'BOA';

export default function RevenuePage() {
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Date Filters
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Table Filters & Pagination
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected Transaction for detail modal
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    initializeMockStorage();
    setTransactions(getTransactions());

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);

    setMounted(true);
  }, []);

  // Filter transactions by selected date range
  const dateFilteredTransactions = useMemo(() => {
    if (!mounted) return [];

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
        start.setTime(0);
      }
      if (endDate) {
        const d = new Date(endDate);
        d.setHours(23, 59, 59, 999);
        end.setTime(d.getTime());
      }
    }

    const startMs = start.getTime();
    const endMs = end.getTime();

    return transactions.filter(tx => {
      const txMs = new Date(tx.timestamp).getTime();
      return txMs >= startMs && txMs <= endMs;
    });
  }, [timeFilter, startDate, endDate, transactions, mounted]);

  // Aggregate Metrics based on Date Filter
  const metrics = useMemo(() => {
    let total = 0;
    let cash = 0;
    let telebirr = 0;
    let cbe = 0;
    let boa = 0;

    dateFilteredTransactions.forEach(tx => {
      total += tx.amount;
      if (tx.paymentChannel === 'Cash') cash += tx.amount;
      else if (tx.paymentChannel === 'Telebirr') telebirr += tx.amount;
      else if (tx.paymentChannel === 'CBE') cbe += tx.amount;
      else if (tx.paymentChannel === 'BOA') boa += tx.amount;
    });

    return { total, cash, telebirr, cbe, boa };
  }, [dateFilteredTransactions]);

  // Filter list by selected payment channel
  const finalFilteredTransactions = useMemo(() => {
    if (channelFilter === 'All') return dateFilteredTransactions;
    return dateFilteredTransactions.filter(tx => tx.paymentChannel === channelFilter);
  }, [channelFilter, dateFilteredTransactions]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [channelFilter, timeFilter, startDate, endDate]);

  // Paginate records
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return finalFilteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, finalFilteredTransactions]);

  const totalPages = Math.max(1, Math.ceil(finalFilteredTransactions.length / itemsPerPage));

  if (!mounted) {
    return <div className="p-8 text-brand font-semibold animate-pulse text-center">Loading Revenue...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto page-enter">
      {/* Header & Date Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 border-b border-brand-light pb-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-brand-dark">Revenue Management</h1>
          <p className="text-gray-600 font-body mt-1">Track payments intake, transaction histories, and incoming cash flows.</p>
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

      {/* Hero Stat Panel */}
      <div className="bg-gradient-to-r from-brand-dark to-brand hover:from-brand-dark/95 hover:to-brand/95 rounded-[12px] p-6 text-white mb-8 shadow-lg transition-all">
        <p className="font-body text-xs font-semibold text-brand-light/80 uppercase tracking-widest">Total Revenue Generated</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold mt-2 font-mono">
          {metrics.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xl sm:text-2xl font-light text-brand-light/70">ETB</span>
        </h2>
        <p className="text-[11px] font-body text-brand-light/60 mt-2">
          Calculated across {dateFilteredTransactions.length} successful checkouts in active period.
        </p>
      </div>

      {/* Payment Channel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Cash Card */}
        <Card className="hover:border-amber-400/40 border-l-[6px] border-l-amber-500 transition-all shadow-xs">
          <p className="text-xs text-gray-500 font-semibold font-body uppercase">Cash Payments</p>
          <p className="font-mono text-2xl font-bold text-gray-900 mt-2">
            {metrics.cash.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-gray-400">ETB</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-body mt-2">
            <span>Direct Cash Register</span>
            <span>{Math.round((metrics.cash / (metrics.total || 1)) * 100)}% of total</span>
          </div>
        </Card>

        {/* Telebirr Card */}
        <Card className="hover:border-blue-400/40 border-l-[6px] border-l-blue-500 transition-all shadow-xs">
          <p className="text-xs text-gray-500 font-semibold font-body uppercase">Telebirr Intake</p>
          <p className="font-mono text-2xl font-bold text-gray-900 mt-2">
            {metrics.telebirr.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-gray-400">ETB</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-body mt-2">
            <span>Mobile Money API</span>
            <span>{Math.round((metrics.telebirr / (metrics.total || 1)) * 100)}% of total</span>
          </div>
        </Card>

        {/* CBE Card */}
        <Card className="hover:border-emerald-400/40 border-l-[6px] border-l-emerald-600 transition-all shadow-xs">
          <p className="text-xs text-gray-500 font-semibold font-body uppercase">CBE Bank Transfers</p>
          <p className="font-mono text-2xl font-bold text-gray-900 mt-2">
            {metrics.cbe.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-gray-400">ETB</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-body mt-2">
            <span>Commercial Bank of Eth</span>
            <span>{Math.round((metrics.cbe / (metrics.total || 1)) * 100)}% of total</span>
          </div>
        </Card>

        {/* BOA Card */}
        <Card className="hover:border-violet-400/40 border-l-[6px] border-l-violet-600 transition-all shadow-xs">
          <p className="text-xs text-gray-500 font-semibold font-body uppercase">BOA Bank Transfers</p>
          <p className="font-mono text-2xl font-bold text-gray-900 mt-2">
            {metrics.boa.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-gray-400">ETB</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-body mt-2">
            <span>Bank of Abyssinia</span>
            <span>{Math.round((metrics.boa / (metrics.total || 1)) * 100)}% of total</span>
          </div>
        </Card>
      </div>

      {/* Transaction Table Section */}
      <Card className="p-0 overflow-hidden shadow-sm">
        {/* Table Filters Header */}
        <div className="p-5 border-b border-brand-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-off-white">
          <h3 className="font-display text-xl font-bold text-brand-dark">Transaction Log</h3>
          
          {/* Tab buttons */}
          <div className="flex bg-white rounded-lg border border-brand-light p-1 shadow-sm overflow-x-auto w-full sm:w-auto pb-1.5 sm:pb-1">
            {(['All', 'Cash', 'Telebirr', 'CBE', 'BOA'] as ChannelFilter[]).map((channel) => (
              <button
                key={channel}
                onClick={() => setChannelFilter(channel)}
                className={`px-3 py-1.5 text-center text-xs font-body font-bold rounded-md transition-colors whitespace-nowrap ${
                  channelFilter === channel 
                    ? 'bg-brand text-white' 
                    : 'text-gray-600 hover:bg-brand-light/50'
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-light/35 border-b border-brand-light font-body text-xs text-brand-dark font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Channel</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light font-body text-sm text-gray-700">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No transactions match criteria.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const channelColors = {
                    Cash: 'bg-amber-100 text-amber-800',
                    Telebirr: 'bg-blue-100 text-blue-800',
                    CBE: 'bg-emerald-100 text-emerald-800',
                    BOA: 'bg-violet-100 text-violet-800'
                  };
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-brand-dark/70">{tx.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{tx.tableName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${channelColors[tx.paymentChannel]}`}>
                          {tx.paymentChannel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">
                        {new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                        {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="text-xs text-brand hover:underline font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Client-side Pagination Footer */}
        <div className="p-4 border-t border-brand-light flex flex-col sm:flex-row justify-between items-center gap-4 bg-off-white">
          <p className="text-xs text-gray-500 font-body">
            Showing{' '}
            <span className="font-bold text-gray-900">
              {finalFilteredTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-gray-900">
              {Math.min(currentPage * itemsPerPage, finalFilteredTransactions.length)}
            </span>{' '}
            of <span className="font-bold text-gray-900">{finalFilteredTransactions.length}</span> transactions
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="py-1 px-3"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="py-1 px-3"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-brand-light rounded-[12px] p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-brand-light pb-3">
              <h3 className="font-display text-2xl font-bold text-brand-dark">Order Receipt Details</h3>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 font-body text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs border-b border-brand-light/30 pb-3 font-mono text-gray-500">
                <div>Receipt: {selectedTx.id}</div>
                <div className="text-right">Table: {selectedTx.tableName}</div>
                <div>Channel: {selectedTx.paymentChannel}</div>
                <div className="text-right">
                  {new Date(selectedTx.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {selectedTx.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1">
                    <span className="font-semibold text-gray-800">
                      {item.name} <span className="font-normal text-gray-400 font-mono">× {item.quantity}</span>
                    </span>
                    <span className="font-mono">
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} ETB
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="border-t border-brand-light pt-3 space-y-1 font-mono text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{(selectedTx.amount / 1.15).toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB</span>
                </div>
                <div className="flex justify-between text-brand-dark">
                  <span>Tax (15%)</span>
                  <span>{(selectedTx.amount - (selectedTx.amount / 1.15)).toLocaleString(undefined, { maximumFractionDigits: 2 })} ETB</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-brand mt-1 pt-1.5 border-t border-brand-light/50">
                  <span>Total Paid</span>
                  <span>{selectedTx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                size="sm"
                className="w-full py-2"
                onClick={() => setSelectedTx(null)}
              >
                Close Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
