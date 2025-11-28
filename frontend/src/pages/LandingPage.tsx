import { useCurrentAccount } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/organisms/Navbar';
import { WalletConnectButton } from '@/components/molecules/WalletConnect';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';

export const LandingPage = () => {
  const account = useCurrentAccount();
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Move-based smart contracts on Sui network for instant gameplay',
    },
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'All moves recorded on-chain for complete transparency',
    },
    {
      icon: Users,
      title: 'Global Players',
      description: 'Connect with chess players from around the world',
    },
  ];

  return (
    <>
      <Navbar>
        <WalletConnectButton />
      </Navbar>

      <main className="min-h-screen bg-secondary">
        {/* Hero Section */}
        <section className="px-4 py-32 max-w-6xl mx-auto">
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-black text-primary drop-shadow-lg">
                ChessFlip
              </h1>
              <p className="text-sm md:text-base text-accent font-bold tracking-widest">
                BLOCKCHAIN POWERED CHESS
              </p>
            </div>
            <p className="text-xl md:text-3xl max-w-2xl mx-auto text-primary/80 leading-relaxed">
              Play chess on the blockchain. Every move secured by Sui network. Compete globally, win onchain.
            </p>
            <div className="pt-6">
              <Button 
                variant="brand" 
                size="lg" 
                className="mx-auto flex items-center gap-2"
                onClick={() => {
                  if (account) {
                    navigate('/dashboard');
                  }
                }}
              >
                {account ? 'Go to Dashboard' : 'Start Playing'} <Icon icon={ArrowRight} size="md" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 bg-secondary">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-primary">
              Why ChessFlip?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} variant="default" className="border-primary">
                  <CardHeader className="flex items-center gap-4 pb-0 border-0">
                    <div className="p-3 bg-accent border-3 border-primary rounded-brutalist">
                      <Icon icon={feature.icon} size="lg" variant="primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary/70">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 max-w-6xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-primary">Ready to play?</h2>
          <p className="text-lg text-primary/70">
            Connect your wallet and challenge players worldwide.
          </p>
          {!account && <Button variant="primary" size="lg">Connect Wallet</Button>}
          {account && (
            <Button 
              variant="brand" 
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-primary text-secondary border-t-4 border-accent mt-20">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black">ChessFlip</h3>
                <p className="text-sm opacity-80">
                  Chess on the Sui blockchain. Secure, transparent, global.
                </p>
              </div>

              {/* Play */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Play</h4>
                <ul className="space-y-2 text-sm opacity-80">
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">Start Game</button></li>
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">View Games</button></li>
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">Leaderboard</button></li>
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">Tournaments</button></li>
                </ul>
              </div>

              {/* Learn */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Learn</h4>
                <ul className="space-y-2 text-sm opacity-80">
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">How It Works</button></li>
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">Rules</button></li>
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">FAQ</button></li>
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">Docs</button></li>
                </ul>
              </div>

              {/* Community */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Community</h4>
                <ul className="space-y-2 text-sm opacity-80">
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">Discord</button></li>
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">Twitter</button></li>
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">GitHub</button></li>
                  <li><button className="hover:opacity-100 transition bg-none border-none cursor-pointer text-secondary p-0">Contact</button></li>
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-secondary/20 my-8"></div>

            {/* Bottom */}
            <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-70">
              <p>&copy; 2025 ChessFlip. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <button className="hover:opacity-100 transition bg-none border-none cursor-pointer p-0">Privacy</button>
                <button className="hover:opacity-100 transition bg-none border-none cursor-pointer p-0">Terms</button>
                <button className="hover:opacity-100 transition bg-none border-none cursor-pointer p-0">Cookies</button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};
