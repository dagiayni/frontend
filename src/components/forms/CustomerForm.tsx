import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CustomerData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

interface CustomerFormProps {
  initialData?: Partial<CustomerData>;
  onSave: (data: CustomerData) => void;
  onCancel: () => void;
}

export function CustomerForm({ initialData, onSave, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="e.g. Abebe" required />
          </div>
          <div className="flex-1">
            <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="e.g. Bikila" required />
          </div>
        </div>
        <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 0911223344" required />
        <Input label="Email (Optional)" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g. abebe@example.com" />
      </div>

      <div className="pt-6 border-t border-brand-light flex justify-end gap-3 shrink-0">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Customer</Button>
      </div>
    </form>
  );
}
