import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

export function WalletConnect() {
  const account = useCurrentAccount();

  return (
    <div className="flex items-center gap-4">
      <ConnectButton className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all" />

      {account && (
        <div className="bg-gray-800 px-4 py-2 rounded-lg border border-blue-500">
          <div className="text-blue-400 text-sm font-mono">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </div>
        </div>
      )}
    </div>
  );
}
