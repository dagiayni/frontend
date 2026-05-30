import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface EmployeeFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function EmployeeForm({ initialData, onSave, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    role: initialData?.role || '',
    pin: initialData?.pin || '',
    email: initialData?.email || '',
  });

  const roles = [
    { label: 'Owner', value: 'owner' },
    { label: 'Manager', value: 'manager' },
    { label: 'Cashier', value: 'cashier' },
    { label: 'Waiter', value: 'waiter' },
    { label: 'Kitchen Staff', value: 'kitchen' },
    { label: 'Bar Staff', value: 'bar' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1">
        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Abebe Kebede" required />
        <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 0911223344" required />
        <Input label="Email (Optional)" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g. abebe@mandela.com" />
        <Select label="Role" name="role" value={formData.role} onChange={handleChange} options={roles} required />
        <Input label="Login PIN (4 digits)" name="pin" type="password" maxLength={4} value={formData.pin} onChange={handleChange} placeholder="••••" required />

        <div className="mt-4 p-3 bg-brand-light/20 rounded-md border border-brand-light">
          <p className="text-xs text-brand-dark/60 font-body">
            <strong className="text-brand-dark/80">Note:</strong> The PIN is the staff member&apos;s login credential for the POS terminal and Telegram Mini App.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-brand-light flex justify-end gap-3 shrink-0">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Employee</Button>
      </div>
    </form>
  );
}
