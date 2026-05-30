import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 mb-4">
        <label className="text-sm font-semibold text-brand-dark/80 font-body">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full rounded-md border px-3 py-2 text-sm font-body text-gray-900 outline-none transition-all
            focus:border-brand focus:ring-1 focus:ring-brand
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
