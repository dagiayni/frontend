import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      className={`bg-white border border-brand-light rounded-[10px] p-5 shadow-[0_1px_4px_rgba(128,0,32,0.06)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      className={`font-display text-xl text-brand-dark font-semibold mb-4 pb-3 border-b border-brand-light ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
