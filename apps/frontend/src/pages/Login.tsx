import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';
import '../styles/login.css';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-header-overlay">
            <h2 className="login-header-title">SIGN IN</h2>
          </div>
        </div>

        {/* Body */}
        <div className="login-body">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label text-sm">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label text-sm">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember / Forgot */}
            <div className="login-actions">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  id="rememberMe"
                />
                <label className="form-check-label text-sm" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>

              <span className="forgot-password">
                Forgot password?
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="text-danger text-sm mb-3">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
