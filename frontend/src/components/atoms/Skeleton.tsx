import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect';
  count?: number;
  width?: string;
  height?: string;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', count = 1, width, height, className, ...props }, ref) => {
    const variantClasses = {
      text: 'rounded-sm h-4',
      circle: 'rounded-full',
      rect: 'rounded-brutalist',
    };

    const skeletons = Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'bg-gray-300 animate-pulse',
          variantClasses[variant],
          variant === 'circle' && (width || 'w-12'),
          variant === 'circle' && (height || 'h-12'),
          width && !variant.includes('circle') && `w-[${width}]`,
          className
        )}
        {...(i === 0 ? { ref } : {})}
        {...props}
      />
    ));

    return count === 1 ? skeletons[0] : <div className="space-y-2">{skeletons}</div>;
  }
);

Skeleton.displayName = 'Skeleton';
