import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import BoardPage from '../pages/BoardPage';
import ActivityDetailPage from '../pages/ActivityDetailPage';
import UsersPage from '../pages/UsersPage';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../components/MainLayout';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Protected Routes wrapped in PrivateRoute and MainLayout */}
      <Route path="/dashboard" element={<PrivateRoute><MainLayout><DashboardPage /></MainLayout></PrivateRoute>} />
      <Route path="/board" element={<PrivateRoute><MainLayout><BoardPage /></MainLayout></PrivateRoute>} />
      <Route path="/activity/:id" element={<PrivateRoute><MainLayout><ActivityDetailPage /></MainLayout></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><MainLayout><UsersPage /></MainLayout></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
