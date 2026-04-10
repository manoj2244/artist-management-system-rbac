import { createBrowserRouter, Navigate } from 'react-router-dom';
import useAuthStore from '../store/auth.store';

import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleGuard from '../components/common/RoleGuard';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardHomePage from '../pages/DashboardHomePage';

import UsersListPage from '../pages/users/UsersListPage';
import UserFormPage from '../pages/users/UserFormPage';

import ArtistsListPage from '../pages/artists/ArtistsListPage';
import ArtistFormPage from '../pages/artists/ArtistFormPage';
import ArtistSongsPage from '../pages/artists/ArtistSongsPage';

import SongFormPage from '../pages/songs/SongFormPage';

function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    )
  },
  {
    path: '/register',
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    )
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardHomePage /> },
      {
        path: 'users',
        element: (
          <RoleGuard allowedRoles={['super_admin']}>
            <UsersListPage />
          </RoleGuard>
        )
      },
      {
        path: 'users/new',
        element: (
          <RoleGuard allowedRoles={['super_admin']}>
            <UserFormPage />
          </RoleGuard>
        )
      },
      {
        path: 'users/:id/edit',
        element: (
          <RoleGuard allowedRoles={['super_admin']}>
            <UserFormPage />
          </RoleGuard>
        )
      },
      {
        path: 'artists',
        element: (
          <RoleGuard allowedRoles={['super_admin', 'artist_manager', 'artist']}>
            <ArtistsListPage />
          </RoleGuard>
        )
      },
      {
        path: 'artists/new',
        element: (
          <RoleGuard allowedRoles={['artist_manager']}>
            <ArtistFormPage />
          </RoleGuard>
        )
      },
      {
        path: 'artists/:id/edit',
        element: (
          <RoleGuard allowedRoles={['artist_manager']}>
            <ArtistFormPage />
          </RoleGuard>
        )
      },
      {
        path: 'artists/:id/songs',
        element: (
          <RoleGuard allowedRoles={['super_admin', 'artist_manager', 'artist']}>
            <ArtistSongsPage />
          </RoleGuard>
        )
      },
      {
        path: 'artists/:artistId/songs/new',
        element: (
          <RoleGuard allowedRoles={['artist']}>
            <SongFormPage />
          </RoleGuard>
        )
      },
      {
        path: 'artists/:artistId/songs/:songId/edit',
        element: (
          <RoleGuard allowedRoles={['artist']}>
            <SongFormPage />
          </RoleGuard>
        )
      }
    ]
  },
  { path: '*', element: <Navigate to="/login" replace /> }
]);

export default router;
