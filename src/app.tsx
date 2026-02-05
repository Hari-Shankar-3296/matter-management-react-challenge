import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import TicketsPage from './pages/TicketsPage/TicketsPage';
import KanbanPage from './pages/KanbanPage/KanbanPage';
import MyTicketsPage from './pages/MyTicketsPage/MyTicketsPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import { useAuth } from './contexts/AuthContext/AuthContext';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
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
  );
}

export default App;
