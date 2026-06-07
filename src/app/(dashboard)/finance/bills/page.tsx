"use client";

import { useEffect, useState, useMemo } from 'react';
import { getBills, addBill, payBill, Bill, initializeMockStorage } from '@/lib/mockStorage';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type TimeFilter = 'Day' | 'Week' | 'Month' | 'Year' | 'Custom';
type BillTab = 'Current' | 'Unpaid' | 'Paid';

export default function BillsPage() {
  const [mounted, setMounted] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);

  // Date Filters (Shared Header)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Table active tab
  const [activeTab, setActiveTab] = useState<BillTab>('Current');

  // Create Bill Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const [newBillRecurrence, setNewBillRecurrence] = useState<'One-time' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [newBillDueDate, setNewBillDueDate] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');

  // Pay Modal State
  const [payingBill, setPayingBill] = useState<Bill | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payFile, setPayFile] = useState<File | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Selected receipt image to preview (removed unused previewReceiptUrl)

  useEffect(() => {
    initializeMockStorage();
    setBills(getBills());

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);

    setMounted(true);
  }, []);

  const refreshBills = () => {
    setBills(getBills());
  };

  // Filter bills by selected date range (due date falls in range)
  const dateFilteredBills = useMemo(() => {
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

    return bills.filter(bill => {
      const billMs = new Date(bill.dueDate).getTime();
      return billMs >= startMs && billMs <= endMs;
    });
  }, [timeFilter, startDate, endDate, bills, mounted]);

  // Split dateFilteredBills into the three tabs
  const tabFilteredBills = useMemo(() => {
    const current = dateFilteredBills.filter(b => b.status === 'Current');
    const unpaid = dateFilteredBills.filter(b => b.status === 'Unpaid');
    const paid = dateFilteredBills.filter(b => b.status === 'Paid');

    return {
      Current: current,
      Unpaid: unpaid,
      Paid: paid
    };
  }, [dateFilteredBills]);

  // Create Bill Form submit
  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillName.trim() || !newBillDueDate || !newBillAmount) return;

    addBill(
      newBillName.trim(),
      newBillRecurrence,
      newBillDueDate,
      parseFloat(newBillAmount)
    );

    // Reset Form
    setNewBillName('');
    setNewBillRecurrence('Monthly');
    setNewBillDueDate('');
    setNewBillAmount('');
    setIsCreateOpen(false);

    refreshBills();
  };

  // Pay Modal Form submit
  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBill || !payAmount) return;

    setIsSubmittingPayment(true);

    let receiptUrl = '';
    if (payFile) {
      receiptUrl = URL.createObjectURL(payFile);
    }

    // Simulate payment process delay
    setTimeout(() => {
      payBill(payingBill.id, parseFloat(payAmount), receiptUrl);
      
      // Reset State
      setPayingBill(null);
      setPayAmount('');
      setPayFile(null);
      setIsSubmittingPayment(false);

      refreshBills();
      alert('Payment submitted successfully! Simulated transaction recorded in expenses ledger.');
    }, 1000);
  };

  // Safe percentage helper
  const getPercentPaid = (bill: Bill) => {
    return Math.round((bill.amountPaid / bill.totalAmount) * 100);
  };

  if (!mounted) {
    return <div className="p-8 text-brand font-semibold animate-pulse text-center">Loading Bills...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto page-enter">
      {/* Header & Date Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 border-b border-brand-light pb-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-brand-dark">Bill Management</h1>
          <p className="text-gray-600 font-body mt-1">Manage vendor commitments, recurring bills, and partial payment progress.</p>
        </div>

        {/* Date Filter & Create Bill Row */}
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
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 shadow-md shrink-0 py-2 text-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Bill
          </Button>
        </div>
      </div>

      {/* Tabulated Bills Lists */}
      <Card className="p-0 overflow-hidden shadow-sm">
        {/* Tabs Headers */}
        <div className="p-5 border-b border-brand-light flex justify-between items-center bg-off-white">
          <div className="flex bg-white border border-brand-light rounded-lg p-1 shadow-xs">
            {(['Current', 'Unpaid', 'Paid'] as BillTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-body font-bold rounded-md transition-colors flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'bg-brand text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-brand-light/50 hover:text-brand-dark'
                }`}
              >
                <span>{tab} Bills</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                  activeTab === tab ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tabFilteredBills[tab].length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-light/35 border-b border-brand-light font-body text-xs text-brand-dark font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Bill Details</th>
                <th className="px-6 py-4">Recurrence</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Payment Progress</th>
                <th className="px-6 py-4 text-right">Remaining Balance</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light font-body text-sm text-gray-700">
              {tabFilteredBills[activeTab].length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No {activeTab.toLowerCase()} bills found in active period range.
                  </td>
                </tr>
              ) : (
                tabFilteredBills[activeTab].map((bill) => {
                  const percent = getPercentPaid(bill);
                  const remaining = bill.totalAmount - bill.amountPaid;
                  
                  return (
                    <tr key={bill.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Name / Desc */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 leading-snug">{bill.name}</div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">ID: {bill.id}</div>
                      </td>

                      {/* Recurrence */}
                      <td className="px-6 py-4">
                        <span className="bg-brand-light text-brand text-xs font-bold px-2 py-0.5 rounded">
                          {bill.recurrence}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="px-6 py-4">
                        <span className={`font-mono text-xs font-semibold ${
                          bill.status === 'Unpaid' ? 'text-danger' : 'text-gray-700'
                        }`}>
                          {bill.dueDate}
                        </span>
                      </td>

                      {/* Progress Bar & percentage */}
                      <td className="px-6 py-4 max-w-[200px]">
                        <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              bill.status === 'Unpaid' ? 'bg-danger' : 'bg-brand'
                            }`} 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mt-1.5">
                          <span>{percent}% Paid</span>
                          <span>{bill.amountPaid.toLocaleString()} / {bill.totalAmount.toLocaleString()} ETB</span>
                        </div>
                      </td>

                      {/* Remaining amount */}
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                        {remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB
                      </td>

                      {/* Action trigger button */}
                      <td className="px-6 py-4 text-center">
                        {bill.status !== 'Paid' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            className="py-1 px-3.5 text-xs shadow-xs"
                            onClick={() => {
                              setPayingBill(bill);
                              setPayAmount(remaining.toString()); // default to full payment
                            }}
                          >
                            Pay Bill
                          </Button>
                        ) : (
                          <span className="text-[#10694F] font-semibold text-xs flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10694F]" />
                            Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Bill Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-brand-light rounded-[12px] p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-brand-light pb-3">
              <h3 className="font-display text-2xl font-bold text-brand-dark">Create Vendor Bill</h3>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-4">
              <Input 
                label="Bill Name / Vendor" 
                placeholder="e.g. Electric utility or Teff wholesale supplier" 
                value={newBillName}
                onChange={e => setNewBillName(e.target.value)}
                required
              />

              <Select 
                label="Recurrence Frequency" 
                value={newBillRecurrence}
                onChange={e => setNewBillRecurrence(e.target.value as 'One-time' | 'Weekly' | 'Monthly' | 'Yearly')}
                options={[
                  { label: 'One-time payment', value: 'One-time' },
                  { label: 'Weekly recurring', value: 'Weekly' },
                  { label: 'Monthly recurring', value: 'Monthly' },
                  { label: 'Yearly recurring', value: 'Yearly' }
                ]}
              />

              <div className="flex flex-col space-y-1.5 mb-4">
                <label className="text-sm font-semibold text-brand-dark/80 font-body">
                  Due Date
                </label>
                <input 
                  type="date"
                  value={newBillDueDate}
                  onChange={e => setNewBillDueDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-body text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  required
                />
              </div>

              <Input 
                label="Total Bill Amount (ETB)" 
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 15000" 
                value={newBillAmount}
                onChange={e => setNewBillAmount(e.target.value)}
                required
              />

              <div className="flex gap-2.5 mt-6 border-t border-brand-light pt-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1 py-2 text-xs" 
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 py-2 text-xs"
                >
                  Create Bill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Bill Modal */}
      {payingBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-brand-light rounded-[12px] p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-brand-light pb-3">
              <div>
                <h3 className="font-display text-2xl font-bold text-brand-dark leading-tight">Settle Bill Payment</h3>
                <p className="text-xs text-gray-500 font-body mt-0.5">Paying for: {payingBill.name}</p>
              </div>
              <button 
                onClick={() => setPayingBill(null)}
                className="text-gray-400 hover:text-brand transition-colors shrink-0"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div className="p-4 bg-brand-light/25 border border-brand-light rounded-lg font-mono text-xs space-y-1 text-gray-700">
                <div className="flex justify-between">
                  <span>Total Bill:</span>
                  <span>{payingBill.totalAmount.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>Already Paid:</span>
                  <span>{payingBill.amountPaid.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-brand-dark font-bold">
                  <span>Remaining Balance:</span>
                  <span>{(payingBill.totalAmount - payingBill.amountPaid).toLocaleString()} ETB</span>
                </div>
              </div>

              <Input 
                label="Amount to Pay (ETB)" 
                type="number"
                min="0.01"
                max={(payingBill.totalAmount - payingBill.amountPaid).toString()}
                step="0.01"
                placeholder="e.g. 5000" 
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                required
              />

              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-semibold text-brand-dark/80 font-body">
                  Attach Payment Receipt Receipt
                </label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setPayFile(files[0]);
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
                  onClick={() => setPayingBill(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 py-2 text-xs"
                  isLoading={isSubmittingPayment}
                >
                  Submit Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
