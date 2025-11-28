/**
 * ChessFlip Contract Interactions
 * Provides utilities for calling smart contract functions
 */

import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { PACKAGE_ID } from './sui';

// Game constants matching the Move contract
export const GAME_CONSTANTS = {
  GAME_COST: BigInt(1_000_000), // 0.001 SUI in MIST
  POINTS_WIN: BigInt(10),
  POINTS_LOSS: BigInt(2),
  MAX_LIVES: 5,
  TOTAL_PAIRS: 6,
};

// Contract module paths
export const CONTRACT_PATHS = {
  GAME_MODULE: `${PACKAGE_ID}::game`,
  REGISTER_PLAYER: `${PACKAGE_ID}::game::register_player`,
  START_GAME: `${PACKAGE_ID}::game::start_game`,
  SUBMIT_GAME_RESULT: `${PACKAGE_ID}::game::submit_game_result`,
  CLAIM_POINTS: `${PACKAGE_ID}::game::claim_points`,
  GET_PLAYER: `${PACKAGE_ID}::game::get_player`,
  GET_GAME: `${PACKAGE_ID}::game::get_game`,
};

/**
 * Register a new player
 * @param username - Username (3-20 chars, alphanumeric + underscore)
 * @returns Transaction block
 */
export const createRegisterPlayerTx = (username: string): Transaction => {
  const tx = new Transaction();

  tx.moveCall({
    target: CONTRACT_PATHS.REGISTER_PLAYER,
    arguments: [tx.pure.string(username)],
  });

  return tx;
};

/**
 * Start a new game (with payment)
 * @param coinId - Coin ID for payment (0.001 SUI)
 * @returns Transaction block
 */
export const createStartGameTx = (coinId: string): Transaction => {
  const tx = new Transaction();

  tx.moveCall({
    target: CONTRACT_PATHS.START_GAME,
    arguments: [tx.object(coinId)],
  });

  return tx;
};

/**
 * Submit game result
 * @param gameId - Game object ID
 * @param result - Game result ("Win" or "Loss")
 * @returns Transaction block
 */
export const createSubmitGameResultTx = (gameId: string, result: 'Win' | 'Loss'): Transaction => {
  const tx = new Transaction();

  tx.moveCall({
    target: CONTRACT_PATHS.SUBMIT_GAME_RESULT,
    arguments: [tx.object(gameId), tx.pure.string(result)],
  });

  return tx;
};

/**
 * Claim points from a completed game
 * @param profileId - Player profile object ID
 * @param gameId - Completed game object ID
 * @returns Transaction block
 */
export const createClaimPointsTx = (profileId: string, gameId: string): Transaction => {
  const tx = new Transaction();

  tx.moveCall({
    target: CONTRACT_PATHS.CLAIM_POINTS,
    arguments: [tx.object(profileId), tx.object(gameId)],
  });

  return tx;
};

/**
 * Query player profile data
 * @param client - Sui client instance
 * @param profileId - Profile object ID
 * @returns Player profile data
 */
export const getPlayerProfile = async (
  client: SuiClient,
  profileId: string
): Promise<{
  username: string;
  totalPoints: string;
  totalGames: string;
  wins: string;
  losses: string;
} | null> => {
  try {
    const object = await client.getObject({
      id: profileId,
      options: { showContent: true },
    });

    if (!object.data || object.data.content?.dataType !== 'moveObject') {
      return null;
    }

    const fields = object.data.content.fields as Record<string, any>;

    return {
      username: fields.username?.value || '',
      totalPoints: fields.total_points || '0',
      totalGames: fields.total_games || '0',
      wins: fields.wins || '0',
      losses: fields.losses || '0',
    };
  } catch (error) {
    console.error('Error fetching player profile:', error);
    return null;
  }
};

/**
 * Query game state
 * @param client - Sui client instance
 * @param gameId - Game object ID
 * @returns Game data
 */
export const getGameState = async (
  client: SuiClient,
  gameId: string
): Promise<{
  status: string;
  result: string;
  claimed: boolean;
  pointsEarned: string;
  matchedPairs: string;
  livesRemaining: string;
} | null> => {
  try {
    const object = await client.getObject({
      id: gameId,
      options: { showContent: true },
    });

    if (!object.data || object.data.content?.dataType !== 'moveObject') {
      return null;
    }

    const fields = object.data.content.fields as Record<string, any>;

    return {
      status: fields.status?.value || 'Unknown',
      result: fields.result?.value || 'Pending',
      claimed: fields.claimed || false,
      pointsEarned: fields.points_earned || '0',
      matchedPairs: fields.matched_pairs || '0',
      livesRemaining: fields.lives_remaining || '0',
    };
  } catch (error) {
    console.error('Error fetching game state:', error);
    return null;
  }
};

/**
 * Hook for signing and executing transactions
 * Use in React components
 */
export const useContractCall = () => {
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const executeTransaction = async (tx: Transaction): Promise<string | null> => {
    return new Promise((resolve) => {
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Transaction successful:', result.digest);
            resolve(result.digest);
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            resolve(null);
          },
        }
      );
    });
  };

  return { executeTransaction, isLoading: isPending };
};
