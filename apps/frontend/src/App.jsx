import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import MeetingDetailPage from './pages/MeetingDetailPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
        <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
      
      <Route
        path="/"
        element={
        <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
      
      <Route
        path="/upload"
        element={
        <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        } />
      
      <Route
        path="/meetings/:id"
        element={
        <ProtectedRoute>
            <MeetingDetailPage />
          </ProtectedRoute>
        } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>);

}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e2535',
              color: '#e2e8f0',
              border: '1px solid #2a3348',
              borderRadius: '12px',
              fontSize: '14px'
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#1e2535' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#1e2535' } }
          }} />
        
      </AuthProvider>
    </BrowserRouter>);

}