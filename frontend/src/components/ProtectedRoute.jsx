import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, hrOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (hrOnly && user.role !== 'hr') return <Navigate to="/dashboard" replace />;
  return children;
}
