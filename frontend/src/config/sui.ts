import { getFullnodeUrl } from '@mysten/sui/client';
import { createNetworkConfig } from '@mysten/dapp-kit';

// Sui testnet configuration
const SUI_TESTNET_URL = import.meta.env.VITE_SUI_TESTNET_URL || getFullnodeUrl('testnet');

// Debug: Log configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 Sui Configuration:');
  console.log('  RPC URL:', SUI_TESTNET_URL);
  console.log('  Package ID:', import.meta.env.VITE_PACKAGE_ID || 'Not set');
}

export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '';
export const GAME_STATE_ID = import.meta.env.VITE_GAME_STATE_ID || '';

// Network configuration for dApp Kit
const { networkConfig, useNetworkVariable } = createNetworkConfig({
  testnet: {
    url: SUI_TESTNET_URL,
    variables: {
      packageId: PACKAGE_ID,
    },
  },
  mainnet: {
    url: getFullnodeUrl('mainnet'),
    variables: {
      packageId: '',
    },
  },
});

export { networkConfig, useNetworkVariable };

// Game constants
export const GAME_CONFIG = {
  PULSE_VALUE: parseInt(import.meta.env.VITE_PULSE_VALUE || '100'),
  PULSE_COOLDOWN_MS: parseInt(import.meta.env.VITE_PULSE_COOLDOWN_MS || '1000'),
  YIELD_RATE: parseFloat(import.meta.env.VITE_YIELD_RATE || '0.0001'),
};

// Module names for contract interactions
export const MODULES = {
  CHESSFLIP_GAME: `${PACKAGE_ID}::game`,
};
