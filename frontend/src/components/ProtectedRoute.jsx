/**
 * Protected Route Component - Requires authentication
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // TODO: Add role checking when user role is available
  // if (requiredRole && user.role !== requiredRole) {
  //   return <Navigate to="/" />;
  // }

  return children;
};

export default ProtectedRoute;
