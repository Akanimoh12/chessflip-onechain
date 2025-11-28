import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { GamePlayPage } from '@/pages/GamePlayPage';
import App from '@/App';

/**
 * Route Configuration for ChessFlip
 * 
 * Public Routes:
 * - / : Landing page (wallet not required)
 * 
 * Protected Routes (require wallet connection):
 * - /dashboard : Player dashboard with stats
 * - /game : Game interface
 */

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'game',
        element: <GamePlayPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
