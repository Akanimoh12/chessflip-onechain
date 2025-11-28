import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface StatDisplayProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  badge?: {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  };
}

export const StatDisplay = forwardRef<HTMLDivElement, StatDisplayProps>(
  ({ label, value, badge, className, ...props }, ref) => {
    return (
      <Card ref={ref} variant="flat" className={cn('text-center', className)} {...props}>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-3xl font-bold">{value}</div>
          {badge && <Badge variant={badge.variant || 'default'}>{badge.text}</Badge>}
        </CardContent>
      </Card>
    );
  }
);

StatDisplay.displayName = 'StatDisplay';
