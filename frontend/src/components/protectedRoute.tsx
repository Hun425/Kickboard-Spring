import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/collector-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
