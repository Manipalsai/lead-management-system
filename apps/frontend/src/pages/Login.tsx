import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';

import logo from '../assets/tensorgo-logo.png';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-0">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col sm:flex-row h-[600px] sm:h-[800px]">
        {/* Left Side - Hero / Branding */}
        <div className="w-full sm:w-1/2 bg-indigo-900 relative hidden sm:flex flex-col justify-center items-center p-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 opacity-90 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            {/* Abstract blobs or pattern could go here */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-500 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-32 h-32 mb-8 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-xl flex items-center justify-center">
              <img src={logo} alt="TensorGo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">TensorGo</h1>
            <p className="text-lg text-indigo-100 max-w-sm leading-relaxed">
              The ultimate Lead Management System to streamline your workflow and boost conversion.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full sm:w-1/2 p-8 sm:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md mx-auto w-full">
            <div className="sm:hidden flex justify-center mb-8">
              <img src={logo} alt="TensorGo" className="w-16 h-16 object-contain" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500 mb-10">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account? <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">Contact Admin</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
