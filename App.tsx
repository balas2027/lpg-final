
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminStatistics from './pages/AdminStatistics';
import Layout from './components/Layout';
import { Role } from './types';

const PrivateRoute: React.FC<{ children: React.ReactNode; role?: Role }> = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { user, isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                       <Layout>
                         {isAuthenticated && user?.role === Role.ADMIN ? <Navigate to="/admin" /> : <UserDashboard />}
                       </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <PrivateRoute role={Role.ADMIN}>
                        <Layout>
                            <AdminDashboard />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/stats"
                element={
                    <PrivateRoute role={Role.ADMIN}>
                        <Layout>
                            <AdminStatistics />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
