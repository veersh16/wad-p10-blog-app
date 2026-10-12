import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please login to continue.' }} />;
  }
  return children;
}

export default ProtectedRoute;
