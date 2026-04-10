import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api';
import useAuthStore from '../store/auth.store';

const TEST_CREDENTIALS = [
  { label: 'Super Admin', email: 'suresh.adhikari@gmail.com', password: 'Suresh@123' },
  { label: 'Artist Manager', email: 'pramila.shrestha@gmail.com', password: 'Pramila@123' },
  { label: 'Artist', email: 'nabin.karki@gmail.com', password: 'Nabin@123' }
];

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  function fillCredentials(cred) {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuth(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Artist Management</h1>
        <h2>Login</h2>

        <div className="test-credentials">
          <p className="test-credentials-label">Quick fill (test accounts)</p>
          <div className="test-credentials-buttons">
            {TEST_CREDENTIALS.map((cred) => (
              <button
                key={cred.email}
                type="button"
                className="secondary"
                onClick={() => fillCredentials(cred)}
              >
                {cred.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
