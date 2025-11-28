import { useCurrentAccount } from '@mysten/dapp-kit';
import { LandingPage } from '@/pages/LandingPage';

function App() {
  const account = useCurrentAccount();

  return (
    <>
      {account ? (
        <main className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center max-w-2xl">
              <div className="text-8xl mb-6">🎮</div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                Game Interface Coming Soon
              </h2>
              <p className="text-xl text-gray-300 font-mono mb-8">
                Wallet connected! ✓
              </p>
              <div className="bg-gray-800 border border-blue-500/30 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-sm text-gray-400 font-mono mb-2">Wallet Address:</p>
                <p className="text-blue-400 font-mono break-all text-xs">
                  {account?.address}
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <LandingPage />
      )}
    </>
  );
}

export default App;

