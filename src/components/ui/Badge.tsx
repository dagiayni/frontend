import React from 'react';

type BadgeStatus = 'pending' | 'preparing' | 'ready' | 'done' | 'cancelled';

interface BadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

export function Badge({ status, label, className = '' }: BadgeProps) {
  const styles = {
    pending: 'bg-[#FEF3C7] text-[#92400E]',
    preparing: 'bg-[#DBEAFE] text-[#1E40AF]',
    ready: 'bg-[#D1FAE5] text-[#065F46]',
    done: 'bg-brand-light text-brand',
    cancelled: 'bg-[#FEE2E2] text-[#991B1B]',
  };

  const text = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]} ${className}`}>
      {text}
    </span>
  );
}
