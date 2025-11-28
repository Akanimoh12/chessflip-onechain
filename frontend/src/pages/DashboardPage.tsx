import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';

interface PlayerProfile {
  username: string;
  total_points: number;
  total_games: number;
  wins: number;
  losses: number;
  profileId?: string;
}

interface PlayerGame {
  id: string;
  status: string;
  lives_remaining: number;
}

export const DashboardPage = () => {
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [games] = useState<PlayerGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Calculate stats
  const winRate = profile && profile.total_games > 0 ? ((profile.wins / profile.total_games) * 100).toFixed(1) : 0;
  const lossRecord = profile ? `${profile.wins}W - ${profile.losses}L` : '0W - 0L';

  useEffect(() => {
    // Load player profile from contract (if exists)
    const loadProfile = async () => {
      if (!account?.address) {
        setLoading(false);
        return;
      }

      try {
        // In production, query the player profile from the blockchain using getPlayerProfile
        // For now, we simulate loading with mock data
        // After deployment, implement:
        // const client = new SuiClient({ url: getFullnodeUrl('testnet') });
        // const profileData = await getPlayerProfile(client, profileId);

        const mockProfile: PlayerProfile = {
          username: 'player_' + account.address.slice(0, 6),
          total_points: 0,
          total_games: 0,
          wins: 0,
          losses: 0,
          profileId: undefined,
        };

        setProfile(mockProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
        // Still show empty state even if loading fails
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => loadProfile(), 500);
    return () => clearTimeout(timer);
  }, [account?.address]);

  if (!account?.address) {
    return (
      <div className="min-h-screen bg-secondary p-lg flex items-center justify-center">
        <Card variant="elevated" padding="lg" className="max-w-md w-full">
          <div className="text-center space-y-md">
            <h2 className="text-xl font-bold text-primary">Connect Your Wallet</h2>
            <p className="text-body text-primary/70">
              You need to connect your wallet to play ChessFlip and manage your profile.
            </p>
            <Button variant="brand" size="lg" className="w-full">
              Connect Wallet
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary p-lg flex items-center justify-center">
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-md">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-primary font-medium">Loading your profile...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-secondary p-lg">
        <div className="max-w-2xl mx-auto space-y-lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">ChessFlip</h1>
            <Badge variant="brand">Connected</Badge>
          </div>

          {/* Empty State */}
          <Card variant="elevated" padding="lg" className="text-center space-y-md py-xl">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-sm">Ready to play?</h2>
              <p className="text-body text-primary/70">
                Create your profile and start earning points by playing chess card matching games.
              </p>
            </div>

            <Button
              variant="brand"
              size="lg"
              onClick={() => setShowRegistrationModal(true)}
              className="w-full"
            >
              Start Your First Game
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-lg">
      <div className="max-w-4xl mx-auto space-y-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">ChessFlip</h1>
          <div className="flex items-center gap-md">
            <Badge variant="accent">
              {profile.total_games} {profile.total_games === 1 ? 'Game' : 'Games'}
            </Badge>
          </div>
        </div>

        {/* Player Stats Card */}
        <Card variant="elevated" padding="lg" className="space-y-md">
          <div className="grid grid-cols-2 gap-lg md:grid-cols-4 md:gap-md">
            {/* Username */}
            <div className="space-y-xs">
              <p className="text-xs uppercase font-bold text-primary/60">Username</p>
              <p className="text-xl font-bold text-primary">{profile.username}</p>
            </div>

            {/* Total Points */}
            <div className="space-y-xs">
              <p className="text-xs uppercase font-bold text-primary/60">Total Points</p>
              <p className="text-2xl font-bold text-brand">{profile.total_points}</p>
            </div>

            {/* Win/Loss Record */}
            <div className="space-y-xs">
              <p className="text-xs uppercase font-bold text-primary/60">Record</p>
              <p className="text-lg font-bold text-primary">{lossRecord}</p>
            </div>

            {/* Win Rate */}
            <div className="space-y-xs">
              <p className="text-xs uppercase font-bold text-primary/60">Win Rate</p>
              <p className="text-lg font-bold text-primary">{winRate}%</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="pt-md border-t-3 border-primary/20 space-y-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary/70">Games Played</span>
              <Badge variant="primary" size="sm">
                {profile.total_games}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary/70">Wins</span>
              <Badge variant="brand" size="sm">
                {profile.wins}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary/70">Losses</span>
              <Badge variant="secondary" size="sm">
                {profile.losses}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <Button 
          variant="brand" 
          size="lg" 
          className="w-full"
          onClick={() => navigate('/game')}
        >
          Start New Game
        </Button>

        {/* Pending Games Section */}
        {games.length > 0 && (
          <Card variant="default" padding="lg" className="space-y-md">
            <h3 className="text-lg font-bold text-primary">Pending Games</h3>
            <div className="space-y-sm">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-md border-2 border-primary/20 rounded-brutalist bg-secondary/50"
                >
                  <div className="space-y-xs">
                    <p className="text-sm font-mono text-primary/70 truncate">Game: {game.id}</p>
                    <div className="flex items-center gap-sm">
                      <Badge variant="secondary" size="sm">
                        Lives: {game.lives_remaining}
                      </Badge>
                      <Badge variant="primary" size="sm">
                        {game.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <Button variant="primary" size="sm">
                      Resume
                    </Button>
                    <Button variant="secondary" size="sm">
                      Claim
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Results Section (Placeholder) */}
        <Card variant="default" padding="lg" className="space-y-md">
          <h3 className="text-lg font-bold text-primary">Recent Results</h3>
          <div className="text-center py-lg">
            <p className="text-sm text-primary/70">No recent games yet. Start playing to see your results!</p>
          </div>
        </Card>
      </div>

      {/* Registration Modal Placeholder */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-primary/50 flex items-center justify-center p-md z-50">
          <Card variant="elevated" padding="lg" className="max-w-md w-full space-y-md">
            <h2 className="text-xl font-bold text-primary">Create Your Profile</h2>
            <p className="text-sm text-primary/70">
              Registration modal will be implemented in Prompt 9
            </p>
            <Button
              variant="brand"
              size="lg"
              onClick={() => setShowRegistrationModal(false)}
              className="w-full"
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
