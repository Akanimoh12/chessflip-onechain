import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: string;
  children?: React.ReactNode;
}

export const Navbar = ({ logo = 'ChessFlip', children, className, ...props }: NavbarProps) => {
  return (
    <nav
      className={cn(
        'border-b-3 border-primary bg-secondary shadow-brutalist sticky top-0 z-50',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-primary">{logo}</h1>
        </div>
        <div className="flex items-center gap-4 [&_button]:px-md [&_button]:py-sm [&_button]:text-sm">
          {children}
        </div>
      </div>
    </nav>
  );
};

Navbar.displayName = 'Navbar';
