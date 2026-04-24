import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, hrOnly = false, userOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (hrOnly && user.role !== 'hr') return <Navigate to="/dashboard" replace />;
  if (userOnly && user.role === 'hr') return <Navigate to="/hr/dashboard" replace />;
  return children;
}
