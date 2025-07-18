import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // List of admin emails (you can expand this for multiple admins)
  const ADMIN_EMAILS = [
    'thompsonmoses02@gmail.com',
    // Add more admin emails here if needed
  ];

  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Checking admin access..." />
      </div>
    );
  }

  // Redirect to admin login if not authenticated or not admin
  if (!currentUser || !isAdmin) {
    console.log('Admin access denied. Redirecting to admin-login...');
    return <Navigate to="/admin-login" replace />;
  }

  // Render admin content if authenticated and authorized
  console.log('Admin access granted. Rendering admin panel.');
  return children;
};

export default AdminRoute;
