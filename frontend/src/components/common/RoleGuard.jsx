import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';

function RoleGuard({ allowedRoles, children }) {
  const role = useAuthStore((s) => s.role);

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleGuard;
