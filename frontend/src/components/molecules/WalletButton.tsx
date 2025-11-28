import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';

interface WalletButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  isConnected?: boolean;
  isLoading?: boolean;
  address?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const WalletButton = forwardRef<HTMLButtonElement, WalletButtonProps>(
  ({ isConnected = false, isLoading = false, address, onConnect, onDisconnect, className, ...props }, ref) => {
    const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet';

    const handleClick = () => {
      if (isConnected) {
        onDisconnect?.();
      } else {
        onConnect?.();
      }
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        disabled={isLoading}
        variant={isConnected ? 'secondary' : 'primary'}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        <span>{displayAddress}</span>
      </Button>
    );
  }
);

WalletButton.displayName = 'WalletButton';
