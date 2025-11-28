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
        <section className="px-4 py-20 max-w-6xl mx-auto">
          <div className="space-y-8 text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-primary">
              ChessFlip
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-primary/70">
              Play chess on the blockchain. Every move secured by Sui network.
            </p>
            <Button variant="brand" size="lg" className="mx-auto flex items-center gap-2">
              Start Playing <Icon icon={ArrowRight} size="md" />
            </Button>
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
          <h2 className="text-4xl font-bold text-gray-900">Ready to play?</h2>
          <p className="text-lg text-gray-600">
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
      </main>
    </>
  );
};
