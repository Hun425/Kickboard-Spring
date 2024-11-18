//
import { Navigate } from 'react-router-dom';
import { useCollectorAuthStore } from '../store/CollectorAuthStore';
import { useEffect } from 'react';

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useCollectorAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    console.log('isLoggedIn state: ', isLoggedIn);
  });

  if (!isLoggedIn) {
    return <Navigate to="/collector-login" replace />;
  }
  // else if (isLoggedIn) {
  //   return <Navigate to="/collectlist" replace />;
  // }

  return children;
};

export default ProtectedRoute;
