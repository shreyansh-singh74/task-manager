import { useAuthStore } from '../store/store';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to='/sign-in' replace />;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
}
