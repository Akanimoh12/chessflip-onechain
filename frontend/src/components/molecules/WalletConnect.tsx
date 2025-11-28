import { ConnectButton } from '@mysten/dapp-kit';

export const WalletConnectButton = () => {
  return (
    <div className="[&_button]:border-3 [&_button]:border-brand [&_button]:bg-brand [&_button]:text-secondary [&_button]:rounded-brutalist [&_button]:font-medium [&_button]:shadow-brutalist [&_button]:transition-all [&_button]:duration-150 hover:[&_button]:translate-x-[2px] hover:[&_button]:translate-y-[2px] hover:[&_button]:shadow-none active:[&_button]:translate-x-[4px] active:[&_button]:translate-y-[4px]">
      <ConnectButton />
    </div>
  );
};

WalletConnectButton.displayName = 'WalletConnectButton';
