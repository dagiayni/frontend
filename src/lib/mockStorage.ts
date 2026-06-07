"use client";

import { KitchenTicket } from '@/components/kitchen/TicketCard';

export interface OrderItem {
  id: number;
  name: string;
  category: string;
  type: 'food' | 'drink';
  price: string;
  quantity: number;
  notes?: string;
}

export interface Table {
  id: string;
  name: string;
  status: 'Available' | 'Occupied';
  currentBill: {
    items: OrderItem[];
    tax: number;
    subtotal: number;
    total: number;
  };
}

export interface Transaction {
  id: string;
  tableId: string;
  tableName: string;
  items: OrderItem[];
  amount: number;
  paymentChannel: 'Cash' | 'Telebirr' | 'CBE' | 'BOA';
  timestamp: string; // ISO date string
}

export interface Expense {
  id: string;
  name: string;
  channel: 'Telebirr' | 'CBE' | 'BOA';
  amount: number;
  attachmentUrl: string; // temporary local object URL
  timestamp: string; // ISO date string
}

export interface Bill {
  id: string;
  name: string;
  recurrence: 'One-time' | 'Weekly' | 'Monthly' | 'Yearly';
  dueDate: string; // YYYY-MM-DD
  amountPaid: number;
  totalAmount: number;
  status: 'Current' | 'Unpaid' | 'Paid';
}

export interface ButcheryOrder {
  id: string;
  items: OrderItem[];
  amount: number;
  status: 'Unpaid' | 'Paid';
  timestamp: string;
}

export const MOCK_MENU = [
  { id: 1, name: 'Special Kitfo', category: 'Food', type: 'food' as const, price: '450.00', is_available: true },
  { id: 2, name: 'Beyaynetu (Veggie Combo)', category: 'Food', type: 'food' as const, price: '280.00', is_available: true },
  { id: 3, name: 'Shekla Tibs', category: 'Food', type: 'food' as const, price: '380.00', is_available: true },
  { id: 4, name: 'Shiro Wot', category: 'Food', type: 'food' as const, price: '200.00', is_available: true },
  { id: 5, name: 'Doro Wot', category: 'Food', type: 'food' as const, price: '500.00', is_available: true },
  { id: 6, name: 'Traditional Coffee', category: 'Drinks', type: 'drink' as const, price: '40.00', is_available: true },
  { id: 7, name: 'Tej (Honey Wine)', category: 'Drinks', type: 'drink' as const, price: '120.00', is_available: true },
  { id: 8, name: 'Habesha Beer', category: 'Drinks', type: 'drink' as const, price: '90.00', is_available: true },
  { id: 9, name: 'Soft Drink', category: 'Drinks', type: 'drink' as const, price: '50.00', is_available: true },
  { id: 10, name: 'Injera (Extra)', category: 'Food', type: 'food' as const, price: '25.00', is_available: true }
];

export const BUTCHERY_MENU = [
  { id: 101, name: 'Prime Ribs', category: 'Raw Meat', type: 'food' as const, price: '600.00', is_available: true },
  { id: 102, name: 'T-Bone Steak', category: 'Raw Meat', type: 'food' as const, price: '850.00', is_available: true },
  { id: 103, name: 'Brisket', category: 'Raw Meat', type: 'food' as const, price: '550.00', is_available: true },
  { id: 104, name: 'Minced Meat', category: 'Raw Meat', type: 'food' as const, price: '450.00', is_available: true },
  { id: 105, name: 'Sirloin', category: 'Raw Meat', type: 'food' as const, price: '700.00', is_available: true }
];

const INITIAL_TABLES: Table[] = [
  { id: '1', name: 'Table 1', status: 'Available', currentBill: { items: [], tax: 0, subtotal: 0, total: 0 } },
  { 
    id: '2', 
    name: 'Table 2', 
    status: 'Occupied', 
    currentBill: { 
      items: [
        { id: 1, name: 'Special Kitfo', category: 'Food', type: 'food', price: '450.00', quantity: 1 },
        { id: 8, name: 'Habesha Beer', category: 'Drinks', type: 'drink', price: '90.00', quantity: 2 }
      ],
      tax: 94.50,
      subtotal: 630.00,
      total: 724.50
    } 
  },
  { id: '3', name: 'Table 3', status: 'Available', currentBill: { items: [], tax: 0, subtotal: 0, total: 0 } },
  { 
    id: '4', 
    name: 'Table 4', 
    status: 'Occupied', 
    currentBill: { 
      items: [
        { id: 2, name: 'Beyaynetu (Veggie Combo)', category: 'Food', type: 'food', price: '280.00', quantity: 2 },
        { id: 9, name: 'Soft Drink', category: 'Drinks', type: 'drink', price: '50.00', quantity: 3 }
      ],
      tax: 106.50,
      subtotal: 710.00,
      total: 816.50
    } 
  },
  { id: '5', name: 'Table 5', status: 'Available', currentBill: { items: [], tax: 0, subtotal: 0, total: 0 } },
  { id: '6', name: 'Table 6', status: 'Available', currentBill: { items: [], tax: 0, subtotal: 0, total: 0 } },
  { id: '7', name: 'Table 7', status: 'Available', currentBill: { items: [], tax: 0, subtotal: 0, total: 0 } },
  { id: '8', name: 'Table 8', status: 'Available', currentBill: { items: [], tax: 0, subtotal: 0, total: 0 } },
];

const STORAGE_KEYS = {
  TABLES: 'mh_tables',
  TRANSACTIONS: 'mh_transactions',
  EXPENSES: 'mh_expenses',
  BILLS: 'mh_bills',
  KITCHEN_TICKETS: 'mh_kitchen_tickets',
  BAR_TICKETS: 'mh_bar_tickets',
  BUTCHERY_ORDERS: 'mh_butchery_orders',
  INITIALIZED: 'mh_initialized'
};

// Safe localStorage access helper
function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : fallback;
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Generate realistic mock historical data over the last 30 days
export function initializeMockStorage() {
  if (typeof window === 'undefined') return;
  
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (isInitialized) return;

  // Initialize Tables
  setStorageItem(STORAGE_KEYS.TABLES, INITIAL_TABLES);

  // Generate 45 transactions spread across the last 30 days
  const transactions: Transaction[] = [];
  const expenses: Expense[] = [];
  const channels: ('Cash' | 'Telebirr' | 'CBE' | 'BOA')[] = ['Cash', 'Telebirr', 'CBE', 'BOA'];
  
  const now = new Date();
  
  for (let i = 0; i < 45; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(now.getDate() - randomDaysAgo);
    // Add random hour
    date.setHours(12 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60));

    // Choose 1-3 random items
    const txItems: OrderItem[] = [];
    const itemCount = 1 + Math.floor(Math.random() * 3);
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const menuIdx = Math.floor(Math.random() * MOCK_MENU.length);
      const menuItem = MOCK_MENU[menuIdx];
      const quantity = 1 + Math.floor(Math.random() * 2);
      subtotal += parseFloat(menuItem.price) * quantity;
      
      txItems.push({
        id: menuItem.id,
        name: menuItem.name,
        category: menuItem.category,
        price: menuItem.price,
        quantity
      });
    }

    const total = subtotal * 1.15; // 15% tax
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const tableNum = 1 + Math.floor(Math.random() * 8);

    transactions.push({
      id: `tx_${Date.now() - i * 100000}`,
      tableId: tableNum.toString(),
      tableName: `Table ${tableNum}`,
      items: txItems,
      amount: Math.round(total * 100) / 100,
      paymentChannel: channel,
      timestamp: date.toISOString()
    });
  }

  // Generate 18 expenses spread across the last 30 days
  const expenseNames = [
    'Teff Flour Bulk Order',
    'Electricity Utility Bill',
    'Water Utility Bill',
    'Internet Subscription',
    'Vegetable Market Supply',
    'Meat Butcher Order',
    'Staff Uniform Cleaning',
    'Restaurant Licenses Renewal',
    'Coffee Bean Restock',
    'Cooking Gas Refills'
  ];

  const expenseChannels: ('Telebirr' | 'CBE' | 'BOA')[] = ['Telebirr', 'CBE', 'BOA'];

  for (let i = 0; i < 18; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(now.getDate() - randomDaysAgo);
    
    const name = expenseNames[Math.floor(Math.random() * expenseNames.length)];
    const amount = 300 + Math.floor(Math.random() * 6000);
    const channel = expenseChannels[Math.floor(Math.random() * expenseChannels.length)];

    expenses.push({
      id: `exp_${Date.now() - i * 100000}`,
      name,
      channel,
      amount,
      attachmentUrl: '', // empty by default
      timestamp: date.toISOString()
    });
  }

  // Generate some standard bills
  const bills: Bill[] = [
    {
      id: 'bill_1',
      name: 'Restaurant Monthly Rent',
      recurrence: 'Monthly',
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5).toISOString().split('T')[0],
      amountPaid: 0,
      totalAmount: 35000,
      status: 'Current'
    },
    {
      id: 'bill_2',
      name: 'Internet Fibernet Fiber Provider',
      recurrence: 'Monthly',
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString().split('T')[0],
      amountPaid: 1500,
      totalAmount: 3200,
      status: 'Unpaid' // Overdue and partially unpaid
    },
    {
      id: 'bill_3',
      name: 'Commercial Trash Disposal Fee',
      recurrence: 'Monthly',
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10).toISOString().split('T')[0],
      amountPaid: 1200,
      totalAmount: 1200,
      status: 'Paid'
    },
    {
      id: 'bill_4',
      name: 'Electric Power Grid Bill',
      recurrence: 'Monthly',
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15).toISOString().split('T')[0],
      amountPaid: 0,
      totalAmount: 5800,
      status: 'Current'
    },
    {
      id: 'bill_5',
      name: 'Weekly Organic Veggies Contract',
      recurrence: 'Weekly',
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4).toISOString().split('T')[0],
      amountPaid: 8000,
      totalAmount: 8000,
      status: 'Paid'
    },
    {
      id: 'bill_6',
      name: 'Fire Extinguisher Annual Maintenance',
      recurrence: 'Yearly',
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 8).toISOString().split('T')[0],
      amountPaid: 0,
      totalAmount: 2400,
      status: 'Unpaid'
    }
  ];

  setStorageItem(STORAGE_KEYS.TRANSACTIONS, transactions);
  setStorageItem(STORAGE_KEYS.EXPENSES, expenses);
  setStorageItem(STORAGE_KEYS.BILLS, bills);

  // Initial Kitchen Tickets
  const initialTickets = [
    {
      id: 1,
      order_id: 101,
      table_number: "2",
      items: [
        { id: 1, menu_item_name: "Special Kitfo", quantity: 1, notes: "Extra spicy", type: "food" as const }
      ],
      status: "preparing" as const,
      created_at: new Date(now.getTime() - 5 * 60000).toISOString()
    },
    {
      id: 2,
      order_id: 102,
      table_number: "4",
      items: [
        { id: 2, menu_item_name: "Beyaynetu (Veggie Combo)", quantity: 2, notes: "", type: "food" as const }
      ],
      status: "pending" as const,
      created_at: new Date(now.getTime() - 1 * 60000).toISOString()
    }
  ];
  setStorageItem(STORAGE_KEYS.KITCHEN_TICKETS, initialTickets);

  // Initial Bar Tickets
  const initialBarTickets = [
    {
      id: 1,
      order_id: 101,
      table_number: "2",
      items: [
        { id: 8, menu_item_name: "Habesha Beer", quantity: 2, notes: "", type: "drink" as const }
      ],
      status: "ready" as const,
      created_at: new Date(now.getTime() - 5 * 60000).toISOString()
    },
    {
      id: 2,
      order_id: 102,
      table_number: "4",
      items: [
        { id: 9, menu_item_name: "Soft Drink", quantity: 3, notes: "No ice", type: "drink" as const }
      ],
      status: "pending" as const,
      created_at: new Date(now.getTime() - 1 * 60000).toISOString()
    }
  ];
  setStorageItem(STORAGE_KEYS.BAR_TICKETS, initialBarTickets);

  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

// --- API Functions for UI Components ---

// Tables CRUD
export function getTables(): Table[] {
  initializeMockStorage();
  return getStorageItem<Table[]>(STORAGE_KEYS.TABLES, INITIAL_TABLES);
}

export function saveTables(tables: Table[]): void {
  setStorageItem(STORAGE_KEYS.TABLES, tables);
}

export function addTable(name: string): Table {
  const tables = getTables();
  const newId = (tables.length > 0 ? Math.max(...tables.map(t => parseInt(t.id) || 0)) + 1 : 1).toString();
  const newTable: Table = {
    id: newId,
    name,
    status: 'Available',
    currentBill: { items: [], tax: 0, subtotal: 0, total: 0 }
  };
  tables.push(newTable);
  saveTables(tables);
  return newTable;
}

export function updateTable(id: string, name: string): Table | null {
  const tables = getTables();
  const idx = tables.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tables[idx].name = name;
  saveTables(tables);
  return tables[idx];
}

export function deleteTable(id: string): boolean {
  const tables = getTables();
  const filtered = tables.filter(t => t.id !== id);
  if (filtered.length === tables.length) return false;
  saveTables(filtered);
  return true;
}

// POS order submission
export function submitPOSOrder(tableId: string, cartItems: OrderItem[]): boolean {
  const tables = getTables();
  const tableIdx = tables.findIndex(t => t.id === tableId);
  if (tableIdx === -1) return false;

  const table = tables[tableIdx];
  
  // Merge items into current bill
  const currentItems = [...table.currentBill.items];
  
  cartItems.forEach(item => {
    const existing = currentItems.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
      if (item.notes) existing.notes = (existing.notes ? existing.notes + '; ' : '') + item.notes;
    } else {
      currentItems.push({ ...item });
    }
  });

  const subtotal = currentItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  table.status = 'Occupied';
  table.currentBill = {
    items: currentItems,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };

  saveTables(tables);

  // Generate Ticket for Kitchen/Bar
  const newOrderId = Math.floor(100 + Math.random() * 900);
  const foodItems = cartItems.filter(item => item.type === 'food');
  const drinkItems = cartItems.filter(item => item.type === 'drink');

  if (foodItems.length > 0) {
    const tickets = getKitchenTickets();
    const newTicketId = tickets.length > 0 ? Math.max(...tickets.map((t: KitchenTicket) => t.id)) + 1 : 1;
    tickets.push({
      id: newTicketId,
      order_id: newOrderId,
      table_number: table.name.replace('Table ', ''),
      items: foodItems.map((ci, idx) => ({
        id: idx + 1,
        menu_item_name: ci.name,
        quantity: ci.quantity,
        notes: ci.notes || "",
        type: 'food'
      })),
      status: 'pending',
      created_at: new Date().toISOString()
    });
    setStorageItem(STORAGE_KEYS.KITCHEN_TICKETS, tickets);
  }

  if (drinkItems.length > 0) {
    const barTickets = getBarTickets();
    const newTicketId = barTickets.length > 0 ? Math.max(...barTickets.map((t: KitchenTicket) => t.id)) + 1 : 1;
    barTickets.push({
      id: newTicketId,
      order_id: newOrderId,
      table_number: table.name.replace('Table ', ''),
      items: drinkItems.map((ci, idx) => ({
        id: idx + 1,
        menu_item_name: ci.name,
        quantity: ci.quantity,
        notes: ci.notes || "",
        type: 'drink'
      })),
      status: 'pending',
      created_at: new Date().toISOString()
    });
    setStorageItem(STORAGE_KEYS.BAR_TICKETS, barTickets);
  }

  return true;
}

// Table payment checkout
export function checkoutTable(tableId: string, channel: 'Cash' | 'Telebirr' | 'CBE' | 'BOA'): Transaction | null {
  const tables = getTables();
  const tableIdx = tables.findIndex(t => t.id === tableId);
  if (tableIdx === -1) return null;

  const table = tables[tableIdx];
  if (table.currentBill.items.length === 0) return null;

  // Save transaction
  const tx: Transaction = {
    id: `tx_${Date.now()}`,
    tableId: table.id,
    tableName: table.name,
    items: table.currentBill.items,
    amount: table.currentBill.total,
    paymentChannel: channel,
    timestamp: new Date().toISOString()
  };

  const transactions = getTransactions();
  transactions.unshift(tx); // place at very top
  setStorageItem(STORAGE_KEYS.TRANSACTIONS, transactions);

  // Reset table
  table.status = 'Available';
  table.currentBill = { items: [], tax: 0, subtotal: 0, total: 0 };
  
  saveTables(tables);
  return tx;
}

// Revenue Transactions
export function getTransactions(): Transaction[] {
  initializeMockStorage();
  return getStorageItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

// Expenses
export function getExpenses(): Expense[] {
  initializeMockStorage();
  return getStorageItem<Expense[]>(STORAGE_KEYS.EXPENSES, []);
}

export function addExpense(name: string, channel: 'Telebirr' | 'CBE' | 'BOA', amount: number, attachmentUrl: string): Expense {
  const expenses = getExpenses();
  const newExpense: Expense = {
    id: `exp_${Date.now()}`,
    name,
    channel,
    amount,
    attachmentUrl,
    timestamp: new Date().toISOString()
  };
  expenses.unshift(newExpense);
  setStorageItem(STORAGE_KEYS.EXPENSES, expenses);
  return newExpense;
}

// Bills
export function getBills(): Bill[] {
  initializeMockStorage();
  return getStorageItem<Bill[]>(STORAGE_KEYS.BILLS, []);
}

export function addBill(name: string, recurrence: 'One-time' | 'Weekly' | 'Monthly' | 'Yearly', dueDate: string, totalAmount: number): Bill {
  const bills = getBills();
  const newBill: Bill = {
    id: `bill_${Date.now()}`,
    name,
    recurrence,
    dueDate,
    amountPaid: 0,
    totalAmount,
    status: 'Current'
  };
  bills.unshift(newBill);
  setStorageItem(STORAGE_KEYS.BILLS, bills);
  return newBill;
}

export function payBill(id: string, amount: number, _attachmentUrl: string): Bill | null {
  const bills = getBills();
  const idx = bills.findIndex(b => b.id === id);
  if (idx === -1) return null;

  const bill = bills[idx];
  bill.amountPaid = Math.min(bill.totalAmount, bill.amountPaid + amount);
  
  if (bill.amountPaid >= bill.totalAmount) {
    bill.status = 'Paid';
  } else {
    // If overdue, remain unpaid; if not overdue, remains current
    const todayStr = new Date().toISOString().split('T')[0];
    if (bill.dueDate < todayStr) {
      bill.status = 'Unpaid';
    } else {
      bill.status = 'Current';
    }
  }

  // Record this payment as an Expense!
  addExpense(`Payment for ${bill.name}`, 'Telebirr', amount, _attachmentUrl);

  setStorageItem(STORAGE_KEYS.BILLS, bills);
  return bill;
}

// Kitchen Tickets
export function getKitchenTickets(): KitchenTicket[] {
  initializeMockStorage();
  return getStorageItem<KitchenTicket[]>(STORAGE_KEYS.KITCHEN_TICKETS, []);
}

export function updateKitchenTicketStatus(id: number, action: string): boolean {
  const tickets = getKitchenTickets();
  const idx = tickets.findIndex((t: KitchenTicket) => t.id === id);
  if (idx === -1) return false;

  if (action === 'start') {
    tickets[idx].status = 'preparing';
  } else if (action === 'ready') {
    tickets[idx].status = 'ready';
  } else if (action === 'serve') {
    tickets[idx].status = 'served';
  } else if (action === 'archive') {
    tickets.splice(idx, 1);
  }
  
  setStorageItem(STORAGE_KEYS.KITCHEN_TICKETS, tickets);
  return true;
}

// Bar Tickets
export function getBarTickets(): KitchenTicket[] {
  initializeMockStorage();
  return getStorageItem<KitchenTicket[]>(STORAGE_KEYS.BAR_TICKETS, []);
}

export function updateBarTicketStatus(id: number, action: string): boolean {
  const tickets = getBarTickets();
  const idx = tickets.findIndex((t: KitchenTicket) => t.id === id);
  if (idx === -1) return false;

  if (action === 'start') {
    tickets[idx].status = 'preparing';
  } else if (action === 'ready') {
    tickets[idx].status = 'ready';
  } else if (action === 'serve') {
    tickets[idx].status = 'served';
  } else if (action === 'archive') {
    tickets.splice(idx, 1);
  }
  
  setStorageItem(STORAGE_KEYS.BAR_TICKETS, tickets);
  return true;
}

// Butchery Orders
export function getButcheryOrders(): ButcheryOrder[] {
  initializeMockStorage();
  return getStorageItem<ButcheryOrder[]>(STORAGE_KEYS.BUTCHERY_ORDERS, []);
}

export function submitButcheryOrder(cartItems: OrderItem[]): boolean {
  const orders = getButcheryOrders();
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const newOrderId = `BO-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: ButcheryOrder = {
    id: newOrderId,
    items: cartItems,
    amount: Math.round(total * 100) / 100,
    status: 'Unpaid',
    timestamp: new Date().toISOString()
  };

  orders.unshift(newOrder);
  setStorageItem(STORAGE_KEYS.BUTCHERY_ORDERS, orders);

  // Send to Kitchen Display
  const tickets = getKitchenTickets();
  const newTicketId = tickets.length > 0 ? Math.max(...tickets.map((t: KitchenTicket) => t.id)) + 1 : 1;
  tickets.push({
    id: newTicketId,
    order_id: parseInt(newOrderId.replace('BO-', '')),
    table_number: 'Butchery',
    items: cartItems.map((ci, idx) => ({
      id: idx + 1,
      menu_item_name: ci.name,
      quantity: ci.quantity,
      notes: ci.notes || "",
      type: 'food'
    })),
    status: 'pending',
    created_at: new Date().toISOString()
  });
  setStorageItem(STORAGE_KEYS.KITCHEN_TICKETS, tickets);

  return true;
}

export function payButcheryOrder(orderId: string, channel: 'Cash' | 'Telebirr' | 'CBE' | 'BOA'): boolean {
  const orders = getButcheryOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return false;

  if (orders[idx].status === 'Paid') return false; // Already paid

  orders[idx].status = 'Paid';
  setStorageItem(STORAGE_KEYS.BUTCHERY_ORDERS, orders);

  // Add to master Revenue stream
  const transactions = getTransactions();
  transactions.unshift({
    id: `tx_${Date.now()}`,
    tableId: 'butchery',
    tableName: 'Butchery Order',
    items: orders[idx].items,
    amount: orders[idx].amount,
    paymentChannel: channel,
    timestamp: new Date().toISOString()
  });
  setStorageItem(STORAGE_KEYS.TRANSACTIONS, transactions);

  return true;
}
