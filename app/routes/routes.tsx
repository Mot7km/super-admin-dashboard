import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../../src/components/layout/AppLayout';
import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import GenericModulePage from '../../src/components/common/GenericModulePage';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BusinessesPage from './pages/BusinessesPage';
import MenuPage from './pages/MenuPage';
import BranchesPage from './pages/BranchesPage';
import OrdersPage from './pages/OrdersPage';
import EmployeesPage from './pages/EmployeesPage';
import InventoryPage from './pages/InventoryPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import UsersPage from './pages/UsersPage';
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
          // Overview
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'overview',
            element: <Navigate to="/" replace />,
          },

          // Core Management
          {
            path: 'businesses',
            element: <BusinessesPage />,
          },
          {
            path: 'businesses/:id',
            element: <BusinessesPage />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'subscriptions',
            element: <SubscriptionsPage />,
          },
          {
            path: 'payments',
            element: <GenericModulePage titleKey="nav.payments" category="Financial Transactions" />,
          },

          // Insights
          {
            path: 'analytics',
            element: <GenericModulePage titleKey="nav.analytics" category="Intelligence" />,
          },

          // Support & Ops
          {
            path: 'support',
            element: <GenericModulePage titleKey="nav.support" category="Customer Success" />,
          },
          {
            path: 'notifications',
            element: <GenericModulePage titleKey="nav.notifications" category="Communication" />,
          },

          // Audit
          {
            path: 'audit-logs',
            element: <GenericModulePage titleKey="nav.auditLogs" category="Security & Compliance" />,
          },

          // System Submenu
          {
            path: 'system',
            children: [
              {
                index: true,
                element: <Navigate to="/system/settings" replace />,
              },
              {
                path: 'feature-flags',
                element: <GenericModulePage titleKey="nav.featureFlags" category="System Core" />,
              },
              {
                path: 'settings',
                element: <SettingsPage />,
              },
              {
                path: 'integrations',
                element: <GenericModulePage titleKey="nav.integrations" category="System Core" />,
              },
              {
                path: 'health',
                element: <GenericModulePage titleKey="nav.systemHealth" category="Infrastructure" />,
              },
            ],
          },

          // Platform Governance
          {
            path: 'admin-management',
            element: <GenericModulePage titleKey="nav.adminManagement" category="Governance" />,
          },

          // Legacy routes for backwards compatibility
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
