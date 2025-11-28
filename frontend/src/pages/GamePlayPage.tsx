import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import {
  createSubmitGameResultTx,
  createClaimPointsTx,
} from '@/config/contracts';

interface GameCard {
  id: number;
  type: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GamePlayPageProps {
  username?: string;
  points?: number;
  gameId?: string;
  profileId?: string;
  onBack?: () => void;
}

// Chess piece icons/types for the 6 pairs
const PIECE_TYPES = ['♔', '♕', '♖', '♗', '♘', '♙'];

// Fisher-Yates shuffle algorithm
const shuffleCards = (cards: GameCard[]): GameCard[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const GamePlayPage = (props: GamePlayPageProps = {}) => {
  const navigate = useNavigate();
  const { username = 'Player', points = 0, gameId, profileId, onBack } = props;
  const [cards, setCards] = useState<GameCard[]>([]);
  const [livesRemaining, setLivesRemaining] = useState(5);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmittingResult, setIsSubmittingResult] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Mark cards as matched
  const markCardsAsMatched = useCallback((newFlipped: number[]) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        newFlipped.includes(card.id) ? { ...card, isMatched: true } : card
      )
    );
  }, []);

  // Get card button styling based on state
  const getCardButtonClassName = (card: GameCard): string => {
    const baseClasses =
      'aspect-square border-3 rounded-brutalist font-bold text-xl transition-all duration-150 flex items-center justify-center';

    if (card.isMatched) {
      return `${baseClasses} bg-brand/20 border-brand/40 text-brand/40 cursor-default`;
    }

    if (flippedCards.includes(card.id)) {
      return `${baseClasses} bg-secondary border-brand text-primary shadow-brutalist`;
    }

    return `${baseClasses} bg-primary border-primary text-secondary hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] cursor-pointer`;
  };

  // Initialize game
  useEffect(() => {
    const initialCards: GameCard[] = [];
    // Create pairs: 2 of each piece type
    for (const type of PIECE_TYPES) {
      initialCards.push(
        { id: initialCards.length, type, isFlipped: false, isMatched: false },
        { id: initialCards.length + 1, type, isFlipped: false, isMatched: false }
      );
    }

    setCards(shuffleCards(initialCards));
  }, []);

  // Handle card flip
  const handleCardFlip = useCallback(
    (cardId: number) => {
      if (isProcessing || gameOver) return;
      if (cards[cardId]?.isMatched) return;
      if (flippedCards.includes(cardId)) return;

      const newFlipped = [...flippedCards, cardId];
      setFlippedCards(newFlipped);

      // Check for match when 2 cards are flipped
      if (newFlipped.length === 2) {
        setIsProcessing(true);

        const card1 = cards[newFlipped[0]];
        const card2 = cards[newFlipped[1]];

        if (card1.type === card2.type) {
          // Match found
          setTimeout(() => {
            markCardsAsMatched(newFlipped);
            setMatchedPairs((prev) => prev + 1);
            setFlippedCards([]);
            setIsProcessing(false);

            // Check win condition
            if (matchedPairs + 1 === PIECE_TYPES.length) {
              setGameOver(true);
              setGameResult('win');
            }
          }, 500);
        } else {
          // No match - lose a life
          setTimeout(() => {
            setFlippedCards([]);
            setLivesRemaining((prev) => {
              const newLives = prev - 1;

              // Check lose condition
              if (newLives === 0) {
                setGameOver(true);
                setGameResult('loss');
              }

              return newLives;
            });
            setIsProcessing(false);
          }, 1000);
        }
      }
    },
    [cards, flippedCards, isProcessing, gameOver, matchedPairs]
  );

  const handleSurrender = () => {
    setGameOver(true);
    setGameResult('loss');
  };

  const handleQuit = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  const handleClaimWin = async () => {
    if (!gameId || !profileId) {
      console.warn('Game ID or Profile ID missing');
      if (onBack) {
        onBack();
      } else {
        navigate('/dashboard');
      }
      return;
    }

    setIsSubmittingResult(true);

    try {
      // First, submit the game result
      const submitTx = createSubmitGameResultTx(gameId, gameResult === 'win' ? 'Win' : 'Loss');

      signAndExecute(
        { transaction: submitTx },
        {
          onSuccess: () => {
            // After result submitted, claim points
            const claimTx = createClaimPointsTx(profileId, gameId);

            signAndExecute(
              { transaction: claimTx },
              {
                onSuccess: () => {
                  // Both transactions successful
                  if (onBack) {
                    onBack();
                  } else {
                    navigate('/dashboard');
                  }
                },
                onError: (error) => {
                  console.error('Failed to claim points:', error);
                  setIsSubmittingResult(false);
                },
              }
            );
          },
          onError: (error) => {
            console.error('Failed to submit game result:', error);
            setIsSubmittingResult(false);
          },
        }
      );
    } catch (error) {
      console.error('Error in claim win:', error);
      setIsSubmittingResult(false);
    }
  };

  // Game Over Screen
  if (gameOver && gameResult) {
    const isWin = gameResult === 'win';
    const pointsEarned = isWin ? 10 : 2;

    return (
      <div className="min-h-screen bg-secondary p-lg flex items-center justify-center">
        <Card variant="elevated" padding="lg" className="max-w-md w-full space-y-lg text-center">
          {/* Result Header */}
          <div className="space-y-sm">
            <h1 className={`text-4xl font-bold ${isWin ? 'text-brand' : 'text-primary'}`}>
              {isWin ? '🎉 YOU WON!' : '💔 GAME OVER'}
            </h1>
            <p className="text-lg text-primary/70">
              {isWin ? 'Great job matching all the pairs!' : 'You ran out of lives!'}
            </p>
          </div>

          {/* Stats */}
          <div className="bg-primary/10 rounded-brutalist p-md space-y-sm border-2 border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-primary/70">Pairs Matched</span>
              <span className="font-bold text-primary">{matchedPairs}/6</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary/70">Lives Used</span>
              <span className="font-bold text-primary">{5 - livesRemaining}</span>
            </div>
            <div className="border-t-2 border-primary/20 pt-sm flex items-center justify-between">
              <span className="text-primary font-bold">Points Earned</span>
              <Badge variant="brand" size="md">
                +{pointsEarned}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-sm">
            {isWin && (
              <Button
                variant="brand"
                size="lg"
                onClick={handleClaimWin}
                disabled={isSubmittingResult}
                className="w-full"
              >
                {isSubmittingResult ? 'Claiming Points...' : 'Claim Points & Continue'}
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              onClick={handleQuit}
              disabled={isSubmittingResult}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Active Game Screen
  return (
    <div className="min-h-screen bg-secondary p-md md:p-lg">
      <div className="max-w-2xl mx-auto space-y-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-xs">
            <p className="text-xs uppercase font-bold text-primary/60">Player</p>
            <h1 className="text-xl font-bold text-primary">{username}</h1>
          </div>
          <div className="space-y-xs text-center">
            <p className="text-xs uppercase font-bold text-primary/60">Total Points</p>
            <p className="text-2xl font-bold text-brand">{points}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleQuit}>
            ← Back
          </Button>
        </div>

        {/* Game Grid */}
        <Card variant="elevated" padding="lg" className="space-y-md">
          {/* Status Bar */}
          <div className="flex items-center justify-between pb-md border-b-3 border-primary/20">
            {/* Lives */}
            <div className="space-y-xs">
              <p className="text-xs uppercase font-bold text-primary/60">Lives</p>
              <div className="flex items-center gap-xs">
                {Array.from({ length: 5 }).map((_, i) => {
                  const lifeIndex = i;
                  return (
                    <span
                      key={`life-${lifeIndex}`}
                      className={`text-lg transition-opacity ${
                        lifeIndex < livesRemaining ? 'text-brand' : 'text-primary/30'
                      }`}
                    >
                      ♥
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Matched Pairs */}
            <div className="space-y-xs text-center">
              <p className="text-xs uppercase font-bold text-primary/60">Matched</p>
              <Badge variant="primary" size="md">
                {matchedPairs}/6
              </Badge>
            </div>
          </div>

          {/* Card Grid 3x4 */}
          <div className="grid grid-cols-3 gap-sm md:gap-md">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardFlip(card.id)}
                disabled={isProcessing || gameOver || card.isMatched}
                className={getCardButtonClassName(card)}
              >
                {flippedCards.includes(card.id) || card.isMatched ? card.type : '?'}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-md border-t-3 border-primary/20 flex gap-sm">
            {matchedPairs === PIECE_TYPES.length && (
              <Button variant="brand" size="md" onClick={handleClaimWin} className="flex-1">
                Claim Win
              </Button>
            )}
            <Button variant="secondary" size="md" onClick={handleSurrender} className="flex-1">
              Surrender
            </Button>
            <Button variant="ghost" size="md" onClick={handleQuit} className="flex-1">
              Quit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
