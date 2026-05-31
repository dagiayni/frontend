"use client";

import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/Button';
import { SlideOver } from '@/components/ui/SlideOver';
import { CustomerForm } from '@/components/forms/CustomerForm';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

interface CustomerSaveData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

const initialCustomers: Customer[] = [
  { id: 1, first_name: 'Abebe', last_name: 'Bikila', phone: '0911111111', email: 'abebe@example.com' },
  { id: 2, first_name: 'Tirunesh', last_name: 'Dibaba', phone: '0922222222', email: 'tirunesh@example.com' },
  { id: 3, first_name: 'Haile', last_name: 'Gebrselassie', phone: '0933333333', email: 'haile@example.com' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Customer | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsFormOpen(true); };
  const handleEdit = (c: Customer) => { setEditingItem(c); setIsFormOpen(true); };

  const handleSave = (data: CustomerSaveData) => {
    if (editingItem) {
      setCustomers(prev => prev.map(c => c.id === editingItem.id ? { ...c, ...data } : c));
    } else {
      setCustomers(prev => [...prev, { id: Date.now(), ...data }]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-8 page-enter max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Customers</h1>
          <p className="text-gray-600 font-body mt-1">Manage customer profiles and loyalty.</p>
        </div>
        <Button variant="primary" onClick={handleAdd}>+ Add Customer</Button>
      </div>

      <AnimatedCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-light text-sm text-brand-dark/60 font-semibold uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-body divide-y divide-brand-light">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-brand-light/10 transition-colors">
                  <td className="p-4 font-semibold text-brand-dark">{c.first_name} {c.last_name}</td>
                  <td className="p-4 text-brand-dark/70 font-mono text-xs">{c.phone}</td>
                  <td className="p-4 text-brand-dark/70">{c.email}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(c)} className="text-brand hover:text-brand-dark font-semibold text-xs uppercase tracking-wide">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>

      <SlideOver isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingItem(null); }} title={editingItem ? 'Edit Customer' : 'Add Customer'}>
        <CustomerForm initialData={editingItem ?? undefined} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingItem(null); }} />
      </SlideOver>
    </div>
  );
}
