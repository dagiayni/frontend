"use client";

import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SlideOver } from '@/components/ui/SlideOver';
import { EmployeeForm } from '@/components/forms/EmployeeForm';

interface Employee {
  id: number;
  name: string;
  phone: string;
  role: string;
  email: string;
  pin: string;
}

interface EmployeeSaveData {
  name: string;
  phone: string;
  role: string;
  email: string;
  pin: string;
}

const initialEmployees: Employee[] = [
  { id: 1, name: 'Owner Admin', phone: '0900000001', role: 'owner', email: 'owner@mandela.com', pin: '1111' },
  { id: 2, name: 'Manager Tesfaye', phone: '0900000002', role: 'manager', email: 'manager@mandela.com', pin: '2222' },
  { id: 3, name: 'Cashier Meron', phone: '0900000003', role: 'cashier', email: 'cashier@mandela.com', pin: '3333' },
  { id: 4, name: 'Waiter Daniel', phone: '0900000004', role: 'waiter', email: 'waiter@mandela.com', pin: '4444' },
  { id: 5, name: 'Kitchen Almaz', phone: '0900000005', role: 'kitchen', email: 'kitchen@mandela.com', pin: '5555' },
];

type BadgeStatus = 'pending' | 'preparing' | 'ready' | 'done' | 'cancelled' | 'success' | 'warning' | 'danger';

const roleColors: Record<string, BadgeStatus> = {
  owner: 'success',
  manager: 'warning',
  cashier: 'success',
  waiter: 'pending',
  kitchen: 'preparing',
  bar: 'ready',
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Employee | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsFormOpen(true); };
  const handleEdit = (emp: Employee) => { setEditingItem(emp); setIsFormOpen(true); };

  const handleSave = (data: EmployeeSaveData) => {
    if (editingItem) {
      setEmployees(prev => prev.map(e => e.id === editingItem.id ? { ...e, ...data } : e));
    } else {
      setEmployees(prev => [...prev, { id: Date.now(), ...data }]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-8 page-enter max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Employees</h1>
          <p className="text-gray-600 font-body mt-1">Manage staff, roles, and access.</p>
        </div>
        <Button variant="primary" onClick={handleAdd}>+ Add Employee</Button>
      </div>

      <AnimatedCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-light text-sm text-brand-dark/60 font-semibold uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-body divide-y divide-brand-light">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-brand-light/10 transition-colors">
                  <td className="p-4 font-semibold text-brand-dark">{emp.name}</td>
                  <td className="p-4 text-brand-dark/70 font-mono text-xs">{emp.phone}</td>
                  <td className="p-4 text-brand-dark/70">{emp.email}</td>
                  <td className="p-4">
                    <Badge status={(roleColors[emp.role] as BadgeStatus) || 'pending'}>
                      {emp.role}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(emp)} className="text-brand hover:text-brand-dark font-semibold text-xs uppercase tracking-wide">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>

      <SlideOver isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingItem(null); }} title={editingItem ? 'Edit Employee' : 'Add Employee'}>
        <EmployeeForm initialData={editingItem ?? undefined} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingItem(null); }} />
      </SlideOver>
    </div>
  );
}
