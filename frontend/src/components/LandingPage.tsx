import { useCurrentAccount } from '@mysten/dapp-kit';

export function LandingPage() {
  const account = useCurrentAccount();

  if (account) return null; // Don't show landing if wallet is connected

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center max-w-2xl">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="text-8xl mb-6 animate-bounce">♟️</div>
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              Welcome to ChessFlip
            </h2>
            <p className="text-xl text-gray-300 font-mono mb-8">
              Experience on-chain chess powered by <span className="text-blue-400 font-bold">Sui Move</span>
            </p>
          </div>

          {/* Features Section */}
          <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-blue-400 mb-6">Features</h3>
            <div className="text-left space-y-4 font-mono text-sm">
              <div className="flex items-start gap-3">
                <span className="text-purple-400">✓</span>
                <span>Play chess on the blockchain with Sui Move</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400">✓</span>
                <span>Connect your Sui wallet in one click</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400">✓</span>
                <span>Secure, immutable game records</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400">✓</span>
                <span>Real-time multiplayer gameplay</span>
              </div>
            </div>
          </div>

          {/* How to Play Section */}
          <div className="bg-gray-800 border border-purple-500/30 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-purple-400 mb-6">Getting Started</h3>
            <div className="text-left space-y-4 font-mono text-sm">
              <div className="flex items-start gap-3">
                <span className="text-blue-400">1.</span>
                <span>Connect your Sui wallet using the button in the top right</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">2.</span>
                <span>Create your player profile (one-time setup)</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">3.</span>
                <span>Start playing chess against other players</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">4.</span>
                <span>Earn rewards and climb the leaderboard</span>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 border border-blue-500 rounded-lg p-4 text-center">
              <div className="text-blue-400 font-bold text-lg">⚡</div>
              <div className="text-xs text-gray-400 font-mono mt-2">Speed</div>
              <div className="text-xs text-gray-500">~100ms latency</div>
            </div>
            <div className="bg-gray-800 border border-purple-500 rounded-lg p-4 text-center">
              <div className="text-purple-400 font-bold text-lg">🔒</div>
              <div className="text-xs text-gray-400 font-mono mt-2">Security</div>
              <div className="text-xs text-gray-500">Move resources</div>
            </div>
            <div className="bg-gray-800 border border-green-500 rounded-lg p-4 text-center">
              <div className="text-green-400 font-bold text-lg">📊</div>
              <div className="text-xs text-gray-400 font-mono mt-2">Scalable</div>
              <div className="text-xs text-gray-500">Parallel execution</div>
            </div>
            <div className="bg-gray-800 border border-pink-500 rounded-lg p-4 text-center">
              <div className="text-pink-400 font-bold text-lg">💰</div>
              <div className="text-xs text-gray-400 font-mono mt-2">Rewards</div>
              <div className="text-xs text-gray-500">Earn SUI</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-gray-400 font-mono mb-6">
              👆 Connect your Sui wallet above to get started
            </p>
            <div className="text-sm text-gray-500 font-mono">
              <p>Need a wallet? <a href="https://suiet.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Install Suiet</a></p>
              <p>Don't have testnet tokens? <a href="https://discord.gg/sui" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Get them from Discord</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-500/30 bg-gray-900/50 backdrop-blur mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-400 font-mono">
            <div>
              Built with <span className="text-pink-400">♥</span> using{' '}
              <span className="text-blue-400">Sui Move</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://sui.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                Sui
              </a>
              <a
                href="https://suiet.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                Suiet Wallet
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
