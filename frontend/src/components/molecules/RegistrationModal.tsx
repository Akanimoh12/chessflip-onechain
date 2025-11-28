import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { createRegisterPlayerTx } from '@/config/contracts';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string, profileId?: string) => void;
}

export const RegistrationModal = ({ isOpen, onClose, onSuccess }: RegistrationModalProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const validateUsername = (value: string): boolean => {
    // Check length: 3-20 chars
    if (value.length < 3 || value.length > 20) {
      setError('Username must be 3-20 characters long');
      return false;
    }

    // Check format: alphanumeric + underscore only
    const validFormat = /^\w+$/.test(value);
    if (!validFormat) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }

    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    // Real-time validation feedback
    if (value.length > 0) {
      validateUsername(value);
    } else {
      setError('');
    }
  };

  const handleRegister = async () => {
    if (!validateUsername(username)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create and sign the registration transaction
      const tx = createRegisterPlayerTx(username);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            // Transaction successful, notify parent
            onSuccess(username);
            setUsername('');
          },
          onError: (error) => {
            setError(error.message || 'Failed to register. Please try again.');
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to register. Please try again.');
      }
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/40 flex items-center justify-center p-md z-50 backdrop-blur-sm">
      <Card variant="elevated" padding="lg" className="max-w-md w-full space-y-md">
        {/* Header */}
        <div className="space-y-sm">
          <h2 className="text-2xl font-bold text-primary">Create Your Profile</h2>
          <p className="text-sm text-primary/70">Choose a unique username to start playing ChessFlip.</p>
        </div>

        {/* Form */}
        <div className="space-y-sm">
          <label htmlFor="username" className="block text-sm font-bold text-primary">
            Username
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              placeholder="e.g., chess_master_42"
              value={username}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-md py-sm border-3 border-primary rounded-brutalist bg-secondary text-primary placeholder-primary/40 focus:outline-none focus:border-brand transition-colors"
            />
            {username.length > 0 && (
              <div className="absolute right-md top-1/2 -translate-y-1/2">
                <Badge variant={error ? 'secondary' : 'brand'} size="sm">
                  {username.length}/20
                </Badge>
              </div>
            )}
          </div>

          {/* Validation Feedback */}
          {error && <p className="text-xs font-medium text-brand">{error}</p>}

          {/* Rules Info */}
          {!error && username.length === 0 && (
            <p className="text-xs text-primary/60">
              • 3-20 characters • Letters, numbers, underscore only
            </p>
          )}

          {!error && username.length > 0 && (
            <p className="text-xs text-primary/60 font-medium">
              ✓ Username looks good!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-md pt-md border-t-3 border-primary/20">
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="brand"
            size="md"
            onClick={handleRegister}
            isLoading={isLoading}
            disabled={!username || !!error || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Registering...' : 'Register & Play'}
          </Button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-primary/60 text-center">
          This will create your profile on-chain and cost a small gas fee.
        </p>
      </Card>
    </div>
  );
};
