import { WalletConnect } from './WalletConnect';

export function Navbar() {
  return (
    <header className="border-b border-blue-500/30 bg-gray-900/50 backdrop-blur">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl">♟️</div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                ChessFlip
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-1">
                On-Chain Chess on Sui
              </p>
            </div>
          </div>
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
