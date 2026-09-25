import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../../src/components/layout/AppLayout';
import ProtectedRoute from '../../src/components/common/ProtectedRoute';

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
import PaymentsPage from './pages/PaymentsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import SupportPage from './pages/SupportPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminManagementPage from './pages/AdminManagementPage';
import FeatureFlagsPage from './pages/FeatureFlagsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import StoragePage from './pages/StoragePage';
import IntegrationsPage from './pages/IntegrationsPage';
import SystemHealthPage from './pages/SystemHealthPage';
import AnalyticsPage from './pages/AnalyticsPage';
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
            element: <PaymentsPage />,
          },

          // Insights
          {
            path: 'analytics',
            children: [
              {
                index: true,
                element: <AnalyticsPage />,
              },
              {
                path: ':tab',
                element: <AnalyticsPage />,
              },
            ],
          },

          // Support & Ops
          {
            path: 'support',
            element: <SupportPage />,
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
          },

          // Audit
          {
            path: 'audit-logs',
            element: <AuditLogsPage />,
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
                element: <FeatureFlagsPage />,
              },
              {
                path: 'announcements',
                element: <AnnouncementsPage />,
              },
              {
                path: 'settings',
                element: <SettingsPage />,
              },
              {
                path: 'storage',
                element: <StoragePage />,
              },
              {
                path: 'integrations',
                element: <IntegrationsPage />,
              },
              {
                path: 'health',
                element: <SystemHealthPage />,
              },
            ],
          },

          // Platform Governance
          {
            path: 'admin-management',
            element: <AdminManagementPage />,
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
