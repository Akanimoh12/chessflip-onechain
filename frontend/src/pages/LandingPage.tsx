import { useCurrentAccount } from '@mysten/dapp-kit';
import { Navbar } from '@/components/organisms/Navbar';
import { WalletButton } from '@/components/molecules/WalletButton';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';

export const LandingPage = () => {
  const account = useCurrentAccount();

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
        <WalletButton isConnected={!!account} address={account?.address} />
      </Navbar>

      <main className="min-h-screen bg-secondary">
        {/* Hero Section */}
        <section className="px-4 py-20 max-w-6xl mx-auto">
          <div className="space-y-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold border-b-3 border-primary pb-6 inline-block">
              ChessFlip
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Play chess on the blockchain. Every move secured by Sui network.
            </p>
            <Button variant="primary" size="lg" className="mx-auto flex items-center gap-2">
              Start Playing <Icon icon={ArrowRight} size="md" />
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 bg-primary text-secondary">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center border-b-3 border-secondary pb-6 inline-block w-full">
              Why ChessFlip?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <Card key={idx} variant="flat" className="bg-secondary border-3 border-primary">
                  <CardHeader className="flex items-center gap-4 pb-0">
                    <div className="p-3 bg-primary border-3 border-secondary rounded-brutalist">
                      <Icon icon={feature.icon} size="lg" variant="secondary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 max-w-6xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to play?</h2>
          <p className="text-lg text-gray-600">
            Connect your wallet and challenge players worldwide.
          </p>
          {!account && <Button variant="primary" size="lg">Connect Wallet</Button>}
        </section>
      </main>
    </>
  );
};
