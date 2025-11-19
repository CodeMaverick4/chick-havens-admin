import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from './routes';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, requiredPermission, adminOnly = false }) => {
    const token = useSelector(state => state.auth.token);
    const user = useSelector(state => state.auth.user);

    // Check if user is authenticated
    if (!token) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // Check admin-only routes
    if (adminOnly && user?.isStaff) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <h4>Access Denied</h4>
                    <p>You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    // Check permission (admin always passes)
    if (requiredPermission && user?.isStaff) {
        if (!user?.permissions?.includes(requiredPermission)) {
            return (
                <div className="container mt-5">
                    <div className="alert alert-warning">
                        <h4>Access Denied</h4>
                        <p>You don't have permission to access this page.</p>
                    </div>
                </div>
            );
        }
    }

    return children;
};




const PublicRoute = ({ children }) => {
  const tokenFromRedux = useSelector(state => state.auth?.token)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const localToken = localStorage.getItem('token')
    if (localToken) setToken(localToken)
    setLoading(false)
  }, [])

  if (loading) return null

  return !tokenFromRedux && !token ? children : <Navigate to={ROUTES.DASHBOARD} />
}

export default ProtectedRoute
export { PublicRoute }
