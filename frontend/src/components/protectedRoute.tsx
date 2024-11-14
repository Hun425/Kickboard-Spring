import { Navigate } from 'react-router-dom';
import { useCollectorAuthStore } from '../store/CollectorAuthStore';

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useCollectorAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/collector-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
