/**
 * Login Page
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Left: Form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="backdrop-blur bg-white/80 rounded-2xl shadow-xl border border-white/60 p-8">
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">Welcome back</div>
              <div className="text-gray-600">Login to access your AI interview platform</div>
            </div>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button type="button" className="text-sm text-blue-600 hover:underline">Forgot password?</button>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full rounded-lg border border-gray-300 pl-9 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 disabled:opacity-50 transition-transform duration-200 hover:scale-105"
              >
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </form>
            {typeof loginWithGoogle === 'function' && (
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError('');
                    await loginWithGoogle();
                    navigate('/dashboard');
                  } catch (err) {
                    setError(err.message || 'Failed to sign in with Google');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mt-4 w-full rounded-lg border border-gray-300 bg-white font-semibold py-2.5"
              >
                Continue with Google
              </button>
            )}
            <div className="mt-4 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Benefits */}
      <div className="hidden md:flex items-center p-12">
        <div className="w-full max-w-xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 shadow-xl">
            <div className="text-2xl font-bold">Why AI Recruiter Pro?</div>
            <ul className="mt-4 space-y-2 text-white/90">
              <li>✓ Secure & Encrypted</li>
              <li>✓ AI-Powered Analysis</li>
              <li>✓ Instant Reports</li>
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xl font-extrabold">95%</div>
                <div className="text-xs">Accuracy</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xl font-extrabold">80%</div>
                <div className="text-xs">Time Saved</div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <div className="text-xl font-extrabold">24/7</div>
                <div className="text-xs">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
