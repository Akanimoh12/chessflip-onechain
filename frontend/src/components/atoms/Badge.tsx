import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-secondary border-2 border-primary',
      success: 'bg-green-100 text-green-900 border-2 border-green-600',
      warning: 'bg-yellow-100 text-yellow-900 border-2 border-yellow-600',
      error: 'bg-red-100 text-red-900 border-2 border-red-600',
      info: 'bg-blue-100 text-blue-900 border-2 border-blue-600',
    };

    const sizes = {
      sm: 'px-xs py-xs text-body-sm',
      md: 'px-sm py-xs text-body',
    };

    return (
      <span
        ref={ref}
        className={cn('inline-block rounded-brutalist font-medium', variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
