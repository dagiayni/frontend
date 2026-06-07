"use client";

import { useEffect, useState, useMemo } from 'react';
import { getExpenses, addExpense, Expense, initializeMockStorage } from '@/lib/mockStorage';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type TimeFilter = 'Day' | 'Week' | 'Month' | 'Year' | 'Custom';
type ChannelFilter = 'All' | 'Telebirr' | 'CBE' | 'BOA';

export default function ExpensesPage() {
  const [mounted, setMounted] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // Date Filters
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Table Filters & Pagination
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add Expense Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseChannel, setNewExpenseChannel] = useState<'Telebirr' | 'CBE' | 'BOA'>('Telebirr');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseFile, setNewExpenseFile] = useState<File | null>(null);

  // Selected receipt image to preview
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    initializeMockStorage();
    setExpenses(getExpenses());

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);

    setMounted(true);
  }, []);

  const refreshExpenses = () => {
    setExpenses(getExpenses());
  };

  // Filter expenses by selected date range
  const dateFilteredExpenses = useMemo(() => {
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

    return expenses.filter(exp => {
      const expMs = new Date(exp.timestamp).getTime();
      return expMs >= startMs && expMs <= endMs;
    });
  }, [timeFilter, startDate, endDate, expenses, mounted]);

  // Aggregate Metrics based on Date Filter
  const metrics = useMemo(() => {
    let total = 0;
    let telebirr = 0;
    let cbe = 0;
    let boa = 0;

    dateFilteredExpenses.forEach(exp => {
      total += exp.amount;
      if (exp.channel === 'Telebirr') telebirr += exp.amount;
      else if (exp.channel === 'CBE') cbe += exp.amount;
      else if (exp.channel === 'BOA') boa += exp.amount;
    });

    return { total, telebirr, cbe, boa };
  }, [dateFilteredExpenses]);

  // Filter list by selected payment channel
  const finalFilteredExpenses = useMemo(() => {
    if (channelFilter === 'All') return dateFilteredExpenses;
    return dateFilteredExpenses.filter(exp => exp.channel === channelFilter);
  }, [channelFilter, dateFilteredExpenses]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [channelFilter, timeFilter, startDate, endDate]);

  // Paginate records
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return finalFilteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, finalFilteredExpenses]);

  const totalPages = Math.max(1, Math.ceil(finalFilteredExpenses.length / itemsPerPage));

  // Form Submission
  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim() || !newExpenseAmount) return;

    let attachmentUrl = '';
    if (newExpenseFile) {
      // Create local temporary URL representing the uploaded file
      attachmentUrl = URL.createObjectURL(newExpenseFile);
    }

    addExpense(
      newExpenseName.trim(),
      newExpenseChannel,
      parseFloat(newExpenseAmount),
      attachmentUrl
    );

    // Reset Form & Close Modal
    setNewExpenseName('');
    setNewExpenseChannel('Telebirr');
    setNewExpenseAmount('');
    setNewExpenseFile(null);
    setIsAddModalOpen(false);
    
    // Refresh
    refreshExpenses();
  };

  if (!mounted) {
    return <div className="p-8 text-brand font-semibold animate-pulse text-center">Loading Expenses...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto page-enter">
      {/* Header & Date Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 border-b border-brand-light pb-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-brand-dark">Expenses Management</h1>
          <p className="text-gray-600 font-body mt-1">Track business outflows, manage bills settlement logs, and record purchases.</p>
        </div>

        {/* Date Filter & Add Expense Row */}
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

          <Button 
            variant="primary" 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 shadow-md shrink-0 py-2 text-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Button>
        </div>
      </div>

      {/* Hero Stat Panel */}
      <div className="bg-gradient-to-r from-red-950 to-brand hover:from-red-950/95 hover:to-brand/95 rounded-[12px] p-6 text-white mb-8 shadow-lg transition-all border-l-[6px] border-danger">
        <p className="font-body text-xs font-semibold text-brand-light/80 uppercase tracking-widest">Total Outflows/Expenses</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold mt-2 font-mono">
          {metrics.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xl sm:text-2xl font-light text-brand-light/70">ETB</span>
        </h2>
        <p className="text-[11px] font-body text-brand-light/60 mt-2">
          Aggregated record of {dateFilteredExpenses.length} business expenses in active period.
        </p>
      </div>

      {/* Payment Channel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Telebirr Card */}
        <Card className="hover:border-blue-400/40 border-l-[6px] border-l-blue-500 transition-all shadow-xs">
          <p className="text-xs text-gray-500 font-semibold font-body uppercase">Telebirr Wallet Paid</p>
          <p className="font-mono text-2xl font-bold text-gray-900 mt-2">
            {metrics.telebirr.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-gray-400">ETB</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-body mt-2">
            <span>Mobile Money Accounts</span>
            <span>{Math.round((metrics.telebirr / (metrics.total || 1)) * 100)}% of total</span>
          </div>
        </Card>

        {/* CBE Card */}
        <Card className="hover:border-emerald-400/40 border-l-[6px] border-l-emerald-600 transition-all shadow-xs">
          <p className="text-xs text-gray-500 font-semibold font-body uppercase">CBE Account Paid</p>
          <p className="font-mono text-2xl font-bold text-gray-900 mt-2">
            {metrics.cbe.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-gray-400">ETB</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-body mt-2">
            <span>Commercial Bank transfers</span>
            <span>{Math.round((metrics.cbe / (metrics.total || 1)) * 100)}% of total</span>
          </div>
        </Card>

        {/* BOA Card */}
        <Card className="hover:border-violet-400/40 border-l-[6px] border-l-violet-600 transition-all shadow-xs">
          <p className="text-xs text-gray-500 font-semibold font-body uppercase">BOA Account Paid</p>
          <p className="font-mono text-2xl font-bold text-gray-900 mt-2">
            {metrics.boa.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-gray-400">ETB</span>
          </p>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-body mt-2">
            <span>Bank of Abyssinia transfers</span>
            <span>{Math.round((metrics.boa / (metrics.total || 1)) * 100)}% of total</span>
          </div>
        </Card>
      </div>

      {/* Expenses List Table Card */}
      <Card className="p-0 overflow-hidden shadow-sm">
        {/* Table Filters Header */}
        <div className="p-5 border-b border-brand-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-off-white">
          <h3 className="font-display text-xl font-bold text-brand-dark">Expenses Ledger</h3>
          
          {/* Channel selector tabs */}
          <div className="flex bg-white rounded-lg border border-brand-light p-1 shadow-sm overflow-x-auto w-full sm:w-auto pb-1.5 sm:pb-1">
            {(['All', 'Telebirr', 'CBE', 'BOA'] as ChannelFilter[]).map((channel) => (
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
                <th className="px-6 py-4">Expense ID</th>
                <th className="px-6 py-4">Name / Description</th>
                <th className="px-6 py-4">Payment Channel</th>
                <th className="px-6 py-4">Date Recorded</th>
                <th className="px-6 py-4 text-center">Receipt</th>
                <th className="px-6 py-4 text-right">Outflow Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light font-body text-sm text-gray-700">
              {paginatedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No expense entries match parameters.
                  </td>
                </tr>
              ) : (
                paginatedExpenses.map((exp) => {
                  const channelColors = {
                    Telebirr: 'bg-blue-100 text-blue-800',
                    CBE: 'bg-emerald-100 text-emerald-800',
                    BOA: 'bg-violet-100 text-violet-800'
                  };
                  return (
                    <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-brand-dark/70">{exp.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{exp.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${channelColors[exp.channel]}`}>
                          {exp.channel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">
                        {new Date(exp.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                        {new Date(exp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {exp.attachmentUrl ? (
                          <button
                            onClick={() => setPreviewReceiptUrl(exp.attachmentUrl)}
                            className="text-brand text-xs font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs font-light">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-danger">
                        - {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-brand-light flex flex-col sm:flex-row justify-between items-center gap-4 bg-off-white">
          <p className="text-xs text-gray-500 font-body">
            Showing{' '}
            <span className="font-bold text-gray-900">
              {finalFilteredExpenses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-gray-900">
              {Math.min(currentPage * itemsPerPage, finalFilteredExpenses.length)}
            </span>{' '}
            of <span className="font-bold text-gray-900">{finalFilteredExpenses.length}</span> records
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

      {/* Add Expense Dialog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-brand-light rounded-[12px] p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-brand-light pb-3">
              <h3 className="font-display text-2xl font-bold text-brand-dark">Record New Expense</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitExpense} className="space-y-4">
              <Input 
                label="Expense Name / Description" 
                placeholder="e.g. Teff Flour 3 Bags restock" 
                value={newExpenseName}
                onChange={e => setNewExpenseName(e.target.value)}
                required
              />

              <Select 
                label="Payment Account/Channel" 
                value={newExpenseChannel}
                onChange={e => setNewExpenseChannel(e.target.value as 'Telebirr' | 'CBE' | 'BOA')}
                options={[
                  { label: 'Telebirr (Mobile Money)', value: 'Telebirr' },
                  { label: 'CBE (Commercial Bank of Ethiopia)', value: 'CBE' },
                  { label: 'BOA (Bank of Abyssinia)', value: 'BOA' }
                ]}
              />

              <Input 
                label="Outflow Amount (ETB)" 
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 4500" 
                value={newExpenseAmount}
                onChange={e => setNewExpenseAmount(e.target.value)}
                required
              />

              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-semibold text-brand-dark/80 font-body">
                  Attach Receipt / Screenshot
                </label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setNewExpenseFile(files[0]);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs font-body text-gray-700 bg-transparent file:mr-4 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-light file:text-brand hover:file:bg-brand-light/75 cursor-pointer"
                />
              </div>

              <div className="flex gap-2.5 mt-6 border-t border-brand-light pt-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1 py-2 text-xs" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 py-2 text-xs"
                >
                  Submit Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Receipt Viewer Modal */}
      {previewReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white p-2 border border-brand-light rounded-[12px] max-w-lg w-full mx-4 shadow-2xl">
            {/* Close buttons */}
            <button 
              onClick={() => setPreviewReceiptUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-brand-light transition-colors font-body text-sm font-semibold flex items-center gap-1"
            >
              Close
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Image render */}
            <div className="overflow-hidden rounded-[8px] bg-gray-100 flex items-center justify-center max-h-[75vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={previewReceiptUrl} 
                alt="Uploaded Receipt" 
                className="object-contain max-h-[70vh] w-full"
              />
            </div>
            <div className="p-3 text-center text-xs text-gray-500 font-body">
              Simulated File Upload (Local Blob URL representation)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
