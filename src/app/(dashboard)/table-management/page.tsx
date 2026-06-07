"use client";

import { useEffect, useState } from 'react';
import { getTables, addTable, updateTable, deleteTable, checkoutTable, Table } from '@/lib/mockStorage';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SlideOver } from '@/components/ui/SlideOver';

export default function TableManagementPage() {
  const [mounted, setMounted] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  
  // Selection/Detail State
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // CRUD Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [editTableName, setEditTableName] = useState('');

  // Payment Simulation State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutChannel, setCheckoutChannel] = useState<'Cash' | 'Telebirr' | 'CBE' | 'BOA'>('Cash');
  const [isPaying, setIsPaying] = useState(false);

  // Load tables on mount
  useEffect(() => {
    setTables(getTables());
    setMounted(true);
  }, []);

  const refreshTables = () => {
    const updated = getTables();
    setTables(updated);
    if (selectedTable) {
      const updatedSelected = updated.find(t => t.id === selectedTable.id) || null;
      setSelectedTable(updatedSelected);
    }
  };

  // CRUD Handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    addTable(newTableName.trim());
    setNewTableName('');
    setIsCreateOpen(false);
    refreshTables();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable || !editTableName.trim()) return;
    updateTable(editingTable.id, editTableName.trim());
    setEditingTable(null);
    setEditTableName('');
    refreshTables();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteTable(id);
      if (selectedTable?.id === id) {
        setSelectedTable(null);
        setIsDetailOpen(false);
      }
      refreshTables();
    }
  };

  // Checkout Handler
  const handleCheckout = async () => {
    if (!selectedTable) return;
    setIsPaying(true);
    // Simulate brief payment gateway lag
    setTimeout(() => {
      checkoutTable(selectedTable.id, checkoutChannel);
      setIsPaying(false);
      setIsCheckoutOpen(false);
      setIsDetailOpen(false);
      setSelectedTable(null);
      refreshTables();
      alert(`Simulated checkout successful via ${checkoutChannel}! Table is now set to Available.`);
    }, 1200);
  };

  if (!mounted) {
    return <div className="p-8 text-brand font-semibold animate-pulse text-center">Loading Table Management...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto page-enter">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-brand-light pb-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-brand-dark">Table Management</h1>
          <p className="text-gray-600 font-body mt-1">Simulate POS terminal bills, ordering logs, and checkout routing.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 shadow-md shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Table
        </Button>
      </div>

      {/* Grid of dining tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map(table => {
          const isOccupied = table.status === 'Occupied';
          const itemsCount = table.currentBill.items.reduce((acc, item) => acc + item.quantity, 0);

          return (
            <div 
              key={table.id}
              onClick={() => {
                setSelectedTable(table);
                setIsDetailOpen(true);
              }}
              className={`cursor-pointer group relative bg-white border rounded-[12px] p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                isOccupied 
                  ? 'border-brand/30 hover:border-brand bg-brand-light/10' 
                  : 'border-brand-light hover:border-[#10694F]/40'
              }`}
            >
              {/* Header: Table Title & Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-xl font-bold text-brand-dark">{table.name}</h3>
                <Badge status={isOccupied ? 'danger' : 'success'} label={table.status} />
              </div>

              {/* Middle: active bill info if occupied */}
              <div className="min-h-16 flex flex-col justify-end">
                {isOccupied ? (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-body">Active Order Log:</p>
                    <p className="font-mono text-2xl text-brand font-bold">
                      {table.currentBill.total.toLocaleString()} <span className="text-sm font-medium text-gray-400">ETB</span>
                    </p>
                    <p className="text-[11px] text-gray-500 font-body">{itemsCount} items ordered</p>
                  </div>
                ) : (
                  <p className="text-xs text-[#10694F] font-body flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10694F]" />
                    Ready for guests
                  </p>
                )}
              </div>

              {/* CRUD overlay controls */}
              <div 
                className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={e => e.stopPropagation()} // prevent drawer trigger
              >
                <button
                  onClick={() => {
                    setEditingTable(table);
                    setEditTableName(table.name);
                  }}
                  className="p-1.5 bg-gray-100 hover:bg-brand-light text-gray-600 hover:text-brand rounded-md transition-colors"
                  title="Rename Table"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(table.id, table.name)}
                  className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-danger rounded-md transition-colors"
                  title="Delete Table"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SlideOver Drawer for Table details */}
      <SlideOver
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTable(null);
        }}
        title={selectedTable ? `${selectedTable.name} active log` : 'Table active log'}
      >
        {selectedTable && (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-6">
              {/* Table Status Badge Indicator */}
              <div className="flex justify-between items-center border-b border-brand-light pb-4">
                <span className="text-gray-500 font-body text-sm font-semibold">Status:</span>
                <Badge status={selectedTable.status === 'Occupied' ? 'danger' : 'success'} label={selectedTable.status} />
              </div>

              {/* Order Items List */}
              <div className="space-y-4">
                <h4 className="font-display text-lg font-bold text-brand-dark">Ordered Items</h4>
                
                {selectedTable.currentBill.items.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm font-body">
                    <p>No active orders for this table.</p>
                    <a 
                      href="/pos" 
                      className="text-brand text-xs underline mt-2 inline-block font-semibold"
                    >
                      Go to POS / Order page to place orders ↗
                    </a>
                  </div>
                ) : (
                  <div className="divide-y divide-brand-light max-h-[300px] overflow-y-auto pr-1">
                    {selectedTable.currentBill.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          <p className="font-body text-sm font-bold text-gray-900 leading-snug">{item.name}</p>
                          <p className="text-xs text-brand font-mono mt-1">{parseFloat(item.price).toFixed(2)} ETB × {item.quantity}</p>
                          {item.notes && <p className="text-[10px] text-gray-500 font-body italic mt-1">Notes: {item.notes}</p>}
                        </div>
                        <span className="font-mono text-sm font-bold text-gray-900">
                          {(parseFloat(item.price) * item.quantity).toFixed(2)} ETB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Calculations & Action checkout footer */}
            {selectedTable.currentBill.items.length > 0 && (
              <div className="border-t border-brand-light pt-6 mt-8 space-y-4 bg-white sticky bottom-0">
                <div className="space-y-2 font-body text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">{selectedTable.currentBill.subtotal.toFixed(2)} ETB</span>
                  </div>
                  <div className="flex justify-between text-brand-dark">
                    <span>Tax (15%)</span>
                    <span className="font-mono">{selectedTable.currentBill.tax.toFixed(2)} ETB</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-brand mt-2 pt-2 border-t border-brand-light/50">
                    <span>Total Bill</span>
                    <span className="font-mono text-2xl">{selectedTable.currentBill.total.toLocaleString()} ETB</span>
                  </div>
                </div>

                {isCheckoutOpen ? (
                  <div className="bg-brand-light/20 p-4 rounded-lg border border-brand-light animate-fadeIn">
                    <Select 
                      label="Payment Channel" 
                      value={checkoutChannel}
                      onChange={e => setCheckoutChannel(e.target.value as 'Cash' | 'Telebirr' | 'CBE' | 'BOA')}
                      options={[
                        { label: 'Cash', value: 'Cash' },
                        { label: 'Telebirr (Mobile Money)', value: 'Telebirr' },
                        { label: 'CBE (Commercial Bank of Ethiopia)', value: 'CBE' },
                        { label: 'BOA (Bank of Abyssinia)', value: 'BOA' }
                      ]}
                    />
                    <div className="flex gap-2.5 mt-4">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex-1 py-2"
                        onClick={() => setIsCheckoutOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        className="flex-1 py-2"
                        onClick={handleCheckout}
                        isLoading={isPaying}
                      >
                        Complete Check out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="primary"
                    className="w-full shadow-lg"
                    onClick={() => setIsCheckoutOpen(true)}
                  >
                    Initiate Payment
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </SlideOver>

      {/* CRUD modals (Create & Edit) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-brand-light rounded-[12px] p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-brand-dark mb-4">Create New Table</h3>
            <form onSubmit={handleCreate}>
              <Input 
                label="Table Name" 
                placeholder="e.g. Table 9" 
                value={newTableName}
                onChange={e => setNewTableName(e.target.value)}
                required
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setNewTableName('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Table
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-brand-light rounded-[12px] p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-brand-dark mb-4">Rename Table</h3>
            <form onSubmit={handleUpdate}>
              <Input 
                label="New Table Name" 
                placeholder="e.g. Window Side Table" 
                value={editTableName}
                onChange={e => setEditTableName(e.target.value)}
                required
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setEditingTable(null);
                    setEditTableName('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
