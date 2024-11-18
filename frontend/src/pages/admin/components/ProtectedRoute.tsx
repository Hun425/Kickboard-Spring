import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  if (!accessToken || !role) {
    return <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  if (role !== 'ADMIN' && role !== 'COLLECTOR') {
    return <Navigate to="/adminMainPage" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
