"use client";

import { useState, useEffect } from 'react';
import { 
  BUTCHERY_MENU, 
  initializeMockStorage, 
  submitButcheryOrder, 
  getButcheryOrders, 
  payButcheryOrder, 
  ButcheryOrder 
} from '@/lib/mockStorage';
import { Button } from '@/components/ui/Button';

interface ButcheryCartItem {
  menuId: number;
  name: string;
  pricePerKg: number;
  weightKg: number;
  prepStyle: string;
  lineTotal: number;
}

const PREP_STYLES = ['Raw', 'Grilled', 'Roasted', 'Smoked', 'Pan-fried'];

export default function ButcheryPage() {
  const [activeTab, setActiveTab] = useState<'new_order' | 'orders_list'>('new_order');
  
  // New Order State
  const [cart, setCart] = useState<ButcheryCartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Orders List State
  const [orders, setOrders] = useState<ButcheryOrder[]>([]);

  // Modifier modal state
  const [selectedMeat, setSelectedMeat] = useState<typeof BUTCHERY_MENU[0] | null>(null);
  const [modWeight, setModWeight] = useState('1.0');
  const [modPrepStyle, setModPrepStyle] = useState('Raw');

  useEffect(() => {
    initializeMockStorage();
    loadOrders();
  }, []);

  function loadOrders() {
    setOrders(getButcheryOrders());
  }

  function handleSelectMeat(item: typeof BUTCHERY_MENU[0]) {
    setSelectedMeat(item);
    setModWeight('1.0');
    setModPrepStyle('Raw');
  }

  function handleAddToCart() {
    if (!selectedMeat) return;
    const weight = parseFloat(modWeight);
    if (isNaN(weight) || weight <= 0) return;

    const pricePerKg = parseFloat(selectedMeat.price);
    const lineTotal = Math.round(pricePerKg * weight * 100) / 100;

    setCart(prev => [
      ...prev,
      {
        menuId: selectedMeat.id,
        name: selectedMeat.name,
        pricePerKg,
        weightKg: weight,
        prepStyle: modPrepStyle,
        lineTotal,
      }
    ]);

    setSelectedMeat(null);
  }

  function handleRemoveFromCart(index: number) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  function handleSendOrder() {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    const orderItems = cart.map(item => ({
      id: item.menuId,
      name: item.name,
      category: 'Food',
      type: 'food' as const,
      price: item.lineTotal.toFixed(2),
      quantity: 1,
      notes: `${item.weightKg}kg – ${item.prepStyle}`,
    }));

    setTimeout(() => {
      const success = submitButcheryOrder(orderItems);
      setIsSubmitting(false);

      if (success) {
        setCart([]);
        loadOrders();
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 3000);
      } else {
        alert('Failed to submit butchery order.');
      }
    }, 600);
  }

  function handlePayOrder(orderId: string) {
    const success = payButcheryOrder(orderId, 'Cash');
    if (success) {
      loadOrders();
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const totalOutstanding = orders
    .filter(o => o.status === 'Unpaid')
    .reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-screen flex flex-col overflow-hidden page-enter bg-off-white">
      {/* Mobile toggle header */}
      <div className="flex md:hidden bg-white border-b border-brand-light p-2 sticky top-0 z-20 justify-around font-body font-semibold">
        <span className="flex-grow py-2 text-center text-brand-dark font-bold">Butchery POS</span>
      </div>

      {/* Top Header Section with Tabs and Outstanding Total */}
      <div className="bg-white border-b border-brand-light px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 shadow-sm z-10">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-brand-deeper font-bold hidden md:block">Butchery Management</h1>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => setActiveTab('new_order')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'new_order' ? 'bg-brand text-white' : 'bg-brand-light/50 text-brand-dark hover:bg-brand-light'
              }`}
            >
              New Order
            </button>
            <button 
              onClick={() => setActiveTab('orders_list')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'orders_list' ? 'bg-brand text-white' : 'bg-brand-light/50 text-brand-dark hover:bg-brand-light'
              }`}
            >
              Orders List
            </button>
          </div>
        </div>

        <div className="bg-danger/10 border border-danger/20 rounded-xl px-5 py-3 text-right shrink-0">
          <p className="text-danger font-bold text-xs uppercase tracking-wider mb-0.5">Total Outstanding Payments</p>
          <div className="text-danger font-mono text-2xl md:text-3xl font-bold leading-none">
            {totalOutstanding.toLocaleString()} <span className="text-sm font-body font-normal text-danger/80">ETB</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'new_order' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left – Meat Menu */}
            <div className="w-full md:w-[60%] lg:w-[65%] h-full p-4 md:p-6 flex flex-col overflow-y-auto">
              <p className="text-gray-500 font-body text-sm mb-6 hidden md:block">Select cuts, specify weight &amp; preparation style</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 md:pb-0">
                {BUTCHERY_MENU.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMeat(item)}
                    className="group bg-white border border-brand-light rounded-xl p-5 text-left hover:border-brand hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center text-brand">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        per kg
                      </span>
                    </div>
                    <div className="font-body font-bold text-gray-900 text-lg leading-tight group-hover:text-brand transition-colors">
                      {item.name}
                    </div>
                    <div className="font-mono text-brand font-bold text-xl mt-2">
                      {parseFloat(item.price).toLocaleString()} <span className="text-sm font-normal text-gray-400">ETB/kg</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right – Cart */}
            <div className="w-full md:w-[40%] lg:w-[35%] h-full bg-white border-l border-brand-light flex flex-col shadow-[-4px_0_15px_rgba(128,0,32,0.03)] z-10 hidden md:flex">
              <div className="bg-brand text-white p-4 flex justify-between items-center shrink-0">
                <h2 className="font-display text-xl font-bold">Meat Order</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 font-body">
                    <svg className="w-14 h-14 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-sm">Select a cut to begin</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="bg-off-white border border-brand-light rounded-lg p-3 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-body font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500 font-body mt-1 flex items-center gap-2">
                          <span className="bg-brand-light text-brand px-1.5 py-0.5 rounded font-bold">{item.weightKg}kg</span>
                          <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">{item.prepStyle}</span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-1">
                          {item.pricePerKg.toLocaleString()} ETB/kg × {item.weightKg}kg
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-3">
                        <div className="font-mono font-bold text-gray-900">{item.lineTotal.toLocaleString()} ETB</div>
                        <button 
                          onClick={() => handleRemoveFromCart(idx)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-off-white p-4 shrink-0 border-t border-brand-light">
                <div className="space-y-2 mb-4 font-body text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">{subtotal.toFixed(2)} ETB</span>
                  </div>
                  <div className="flex justify-between text-brand-dark">
                    <span>Tax (15%)</span>
                    <span className="font-mono">{tax.toFixed(2)} ETB</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-brand mt-2 pt-2 border-t border-brand-light/50">
                    <span>Total</span>
                    <span className="font-mono text-3xl">{total.toFixed(2)}</span>
                  </div>
                </div>

                {orderSuccess && (
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-semibold text-center animate-fadeIn">
                    ✓ Order sent to Kitchen Display!
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full py-3 text-base"
                  disabled={cart.length === 0}
                  isLoading={isSubmitting}
                  onClick={handleSendOrder}
                >
                  Send Order
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-sm border border-brand-light overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body">
                  <thead className="bg-off-white border-b border-brand-light text-brand-dark text-sm">
                    <tr>
                      <th className="px-6 py-4 font-bold">Order ID</th>
                      <th className="px-6 py-4 font-bold">Time</th>
                      <th className="px-6 py-4 font-bold">Items</th>
                      <th className="px-6 py-4 font-bold text-right">Amount</th>
                      <th className="px-6 py-4 font-bold text-center">Status</th>
                      <th className="px-6 py-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-light text-sm">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No butchery orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.id} className="hover:bg-off-white/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-brand-dark whitespace-nowrap">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                            {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {order.items.map((item, i) => (
                              <div key={i} className="mb-1 last:mb-0">
                                <span className="font-semibold text-gray-900">{item.name}</span>
                                <span className="text-xs ml-2 text-gray-500">({item.notes})</span>
                              </div>
                            ))}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-right whitespace-nowrap text-gray-900">
                            {order.amount.toLocaleString()} ETB
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            {order.status === 'Unpaid' ? (
                              <Button
                                variant="primary"
                                className="px-4 py-1.5 text-xs h-auto"
                                onClick={() => handlePayOrder(order.id)}
                              >
                                Mark Paid
                              </Button>
                            ) : (
                              <span className="text-gray-400 text-xs font-semibold">Settled</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modifier Modal */}
      {selectedMeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs animate-fadeIn px-4">
          <div className="bg-white border border-brand-light rounded-[12px] p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-5 border-b border-brand-light pb-3">
              <div>
                <h3 className="font-display text-2xl font-bold text-brand-dark">{selectedMeat.name}</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {parseFloat(selectedMeat.price).toLocaleString()} ETB per kg
                </p>
              </div>
              <button 
                onClick={() => setSelectedMeat(null)}
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Weight Input */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-brand-dark/80 font-body block mb-2">
                Weight (Kilograms)
              </label>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setModWeight(prev => Math.max(0.25, parseFloat(prev) - 0.25).toFixed(2))}
                  className="w-10 h-10 rounded-lg bg-brand-light text-brand font-bold text-lg flex items-center justify-center hover:bg-brand hover:text-white transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={modWeight}
                  onChange={e => setModWeight(e.target.value)}
                  className="flex-1 text-center rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-xl font-bold text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <button 
                  onClick={() => setModWeight(prev => (parseFloat(prev) + 0.25).toFixed(2))}
                  className="w-10 h-10 rounded-lg bg-brand-light text-brand font-bold text-lg flex items-center justify-center hover:bg-brand hover:text-white transition-colors"
                >
                  +
                </button>
                <span className="font-body text-sm text-gray-500 font-semibold">kg</span>
              </div>
              <div className="text-right mt-2 font-mono text-sm text-brand font-bold">
                = {(parseFloat(selectedMeat.price) * (parseFloat(modWeight) || 0)).toFixed(2)} ETB
              </div>
            </div>

            {/* Preparation Style */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-brand-dark/80 font-body block mb-2">
                Preparation Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PREP_STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => setModPrepStyle(style)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-body font-bold transition-all border ${
                      modPrepStyle === style
                        ? 'bg-brand text-white border-brand shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-light hover:text-brand'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 border-t border-brand-light pt-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 py-2 text-xs"
                onClick={() => setSelectedMeat(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                className="flex-1 py-2 text-xs"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
