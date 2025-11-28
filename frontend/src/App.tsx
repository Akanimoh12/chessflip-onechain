import { useCurrentAccount } from '@mysten/dapp-kit';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/organisms/Navbar';
import { WalletConnectButton } from '@/components/molecules/WalletConnect';

function App() {
  const account = useCurrentAccount();

  return (
    <>
      {account && (
        <Navbar>
          <WalletConnectButton />
        </Navbar>
      )}
      <main className="min-h-screen bg-white">
        <Outlet />
      </main>
    </>
  );
}

export default App;

