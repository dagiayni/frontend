import React from 'react';

type BadgeStatus = 'pending' | 'preparing' | 'ready' | 'done' | 'cancelled' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  status?: BadgeStatus;
  variant?: BadgeStatus; // alias for status
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ status, variant, label, children, className = '' }: BadgeProps) {
  const activeStatus = status || variant || 'pending';

  const styles = {
    pending: 'bg-[#FEF3C7] text-[#92400E]',
    preparing: 'bg-[#DBEAFE] text-[#1E40AF]',
    ready: 'bg-[#D1FAE5] text-[#065F46]',
    done: 'bg-brand-light text-brand',
    cancelled: 'bg-[#FEE2E2] text-[#991B1B]',
    success: 'bg-[#D1FAE5] text-[#065F46]',
    warning: 'bg-[#FEF3C7] text-[#92400E]',
    danger: 'bg-[#FEE2E2] text-[#991B1B]',
  };

  const text = label || children || activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1);

  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${styles[activeStatus]} ${className}`}>
      {text}
    </span>
  );
}
