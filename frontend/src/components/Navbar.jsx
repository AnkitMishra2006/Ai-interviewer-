/**
 * Navbar Component
 */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur bg-white/80 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Recruiter Pro
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="/#features" className="text-sm font-medium text-gray-700 hover:text-gray-900">Features</a>
          <a href="/#how-it-works" className="text-sm font-medium text-gray-700 hover:text-gray-900">How It Works</a>
          <a href="/#pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold transition-colors duration-200 hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <div className="hidden lg:block text-sm text-gray-700">{user.email}</div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold inline-flex items-center gap-2 transition-transform duration-200 hover:scale-105"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold transition-colors duration-200 hover:bg-gray-50"
                >
                  Login
                </Link>
              )}
              {location.pathname !== '/signup' && (
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold transition-transform duration-200 hover:scale-105"
                >
                  Sign Up
                </Link>
              )}
            </>
          )}
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 bg-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur">
          <div className="px-4 py-4 space-y-4">
            <a href="/#features" className="block text-sm font-medium text-gray-700">Features</a>
            <a href="/#how-it-works" className="block text-sm font-medium text-gray-700">How It Works</a>
            <a href="/#pricing" className="block text-sm font-medium text-gray-700">Pricing</a>
            <div className="pt-2 border-t flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold"
                  >
                    <span className="inline-flex items-center gap-2 justify-center"><LayoutDashboard className="h-4 w-4" /> Dashboard</span>
                  </Link>
                  <button
                    onClick={async () => { await handleLogout(); setMobileOpen(false); }}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold"
                  >
                    <span className="inline-flex items-center gap-2 justify-center"><LogOut className="h-4 w-4" /> Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
