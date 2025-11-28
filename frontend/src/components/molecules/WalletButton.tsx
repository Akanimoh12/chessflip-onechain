import { useCurrentAccount } from '@mysten/dapp-kit';
import { cn } from '@/utils/cn';
import { Button } from '@/components/atoms/Button';

interface WalletButtonProps {
  className?: string;
}

export const WalletButton = ({ className }: WalletButtonProps) => {
  const account = useCurrentAccount();

  const displayAddress = account?.address 
    ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` 
    : 'Connect Wallet';

  return (
    <Button
      variant={account ? 'secondary' : 'primary'}
      className={cn('flex items-center gap-2', className)}
    >
      <span>{displayAddress}</span>
    </Button>
  );
};

WalletButton.displayName = 'WalletButton';
