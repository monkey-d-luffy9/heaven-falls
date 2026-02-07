import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';

// Public Pages
import Home from './pages/public/Home';
import GamesPublic from './pages/public/GamesPublic';
import HowItWorks from './pages/public/HowItWorks';
import Support from './pages/public/Support';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import GamesPage from './pages/dashboard/GamesPage';
import BonusesPage from './pages/dashboard/BonusesPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import RewardsPage from './pages/dashboard/RewardsPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGames from './pages/admin/AdminGames';
import AdminBonuses from './pages/admin/AdminBonuses';

import './index.css';

// Protected Route for Admin
function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

// Public Layout
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}


// Guest Route - redirects logged-in users to dashboard
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/games" element={<PublicLayout><GamesPublic /></PublicLayout>} />
      <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
      <Route path="/support" element={<PublicLayout><Support /></PublicLayout>} />

      {/* Auth Routes - redirect to dashboard if already logged in */}
      <Route path="/login" element={<GuestRoute><PublicLayout><Login /></PublicLayout></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><PublicLayout><Register /></PublicLayout></GuestRoute>} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="bonuses" element={<BonusesPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="games" element={<AdminGames />} />
        <Route path="bonuses" element={<AdminBonuses />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
