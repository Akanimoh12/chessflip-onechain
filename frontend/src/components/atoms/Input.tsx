import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-xs">
        {label && <label className="text-body font-medium text-primary">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'px-md py-sm border-3 border-primary bg-secondary text-primary rounded-brutalist',
            'placeholder:text-primary/40 focus:outline-none focus:shadow-brutalist transition-all duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-600 bg-red-50',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? 'error' : undefined}
          {...props}
        />
        {error && (
          <span id="error" className="text-body-sm text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
