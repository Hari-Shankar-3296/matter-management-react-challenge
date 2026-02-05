import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

const LoginPage = () => {
  const { login, users, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedEmail) {
      setError('Please select a user to continue.');
      return;
    }

    const success = await login(selectedEmail);
    if (success) {
      navigate('/');
    } else {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">✅</span>
          <h1>Matter Management</h1>
          <p>Sign in to manage your tickets</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="user-select">Select User</label>
            <select
              id="user-select"
              value={selectedEmail}
              onChange={(e) => {
                setSelectedEmail(e.target.value);
                if (error) setError('');
              }}
              disabled={isLoading}
              style={error ? { borderColor: 'var(--danger)' } : {}}
            >
              <option value="">-- Select a user --</option>
              {users.map((user) => (
                <option key={user.id} value={user.email}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Select any user to log in (demo mode)</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
