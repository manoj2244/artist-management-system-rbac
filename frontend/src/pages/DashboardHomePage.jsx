import { Link } from 'react-router-dom';
import useAuthStore from '../store/auth.store';

function DashboardHomePage() {
  const { user, role } = useAuthStore();

  return (
    <div className="page">
      <h2>Welcome, {user?.first_name} {user?.last_name}</h2>
      <p className="role-badge">Role: {role}</p>
      <div className="dashboard-cards">
        {role === 'super_admin' && (
          <Link to="/users" className="dashboard-card">
            <h3>Users</h3>
            <p>Manage all system users</p>
          </Link>
        )}
        {(role === 'super_admin' || role === 'artist_manager') && (
          <Link to="/artists" className="dashboard-card">
            <h3>Artists</h3>
            <p>Manage artists and their songs</p>
          </Link>
        )}
        {role === 'artist' && (
          <Link to="/artists" className="dashboard-card">
            <h3>My Songs</h3>
            <p>Manage your song collection</p>
          </Link>
        )}
      </div>
    </div>
  );
}

export default DashboardHomePage;
