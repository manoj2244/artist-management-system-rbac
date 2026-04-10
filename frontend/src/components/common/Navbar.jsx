import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import { logout } from '../../api/auth.api';

function Navbar() {
  const { user, role, artistId, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearAuth();
      navigate('/login');
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Artist Management</div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        {(role === 'super_admin' || role === 'artist_manager') && (
          <Link to="/artists">Artists</Link>
        )}
        {role === 'artist' && (
          <Link to={`/artists/${artistId}/songs`}>My Songs</Link>
        )}
        {role === 'super_admin' && (
          <Link to="/users">Users</Link>
        )}
      </div>
      <div className="navbar-user">
        <span>{user?.first_name} ({role})</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
