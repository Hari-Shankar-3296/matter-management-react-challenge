import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAuth } from './contexts/AuthContext/AuthContext';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage/DashboardPage'));
const TicketsPage = lazy(() => import('./pages/TicketsPage/TicketsPage'));
const KanbanPage = lazy(() => import('./pages/KanbanPage/KanbanPage'));
const MyTicketsPage = lazy(() => import('./pages/MyTicketsPage/MyTicketsPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage/UserProfilePage'));

// Shared loading fallback
const PageLoader = () => (
  <div className="loading-screen">
    <div className="loader"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />

        {/* Protected routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/:ticketId" element={<TicketsPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
