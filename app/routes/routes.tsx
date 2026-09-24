import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../../src/components/layout/AppLayout';
import ProtectedRoute from '../../src/components/common/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import BranchesPage from './pages/BranchesPage';
import OrdersPage from './pages/OrdersPage';
import EmployeesPage from './pages/EmployeesPage';
import InventoryPage from './pages/InventoryPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'menu',
            element: <MenuPage />,
          },
          {
            path: 'reviews',
            element: <Navigate to="/menu?tab=reviews" replace />,
          },
          {
            path: 'qr-control',
            element: <Navigate to="/menu?tab=qr" replace />,
          },
          {
            path: 'branches',
            element: <BranchesPage />,
          },
          {
            path: 'orders',
            element: <OrdersPage />,
          },
          {
            path: 'employees',
            element: <EmployeesPage />,
          },
          {
            path: 'inventory',
            element: <InventoryPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
