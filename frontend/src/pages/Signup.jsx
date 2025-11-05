/**
 * Signup/Registration Page
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate', // candidate or recruiter
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement signup logic
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      setError('');
      await signup(formData.email, formData.password, formData.role, formData.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordCriteria = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const strengthScore = Object.values(passwordCriteria).filter(Boolean).length;
  const strengthLevel = strengthScore <= 2 ? 'weak' : strengthScore <= 4 ? 'medium' : 'strong';
  const strengthWidth = strengthLevel === 'weak' ? 'w-1/3' : strengthLevel === 'medium' ? 'w-2/3' : 'w-full';
  const strengthColor = strengthLevel === 'weak' ? 'bg-red-500' : strengthLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
  const isEmailValid = /.+@.+\..+/.test(formData.email);
  const isNameValid = formData.name.trim().length >= 2;
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Left: Form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-lg">
          <div className="backdrop-blur bg-white/80 rounded-2xl shadow-xl border border-white/60 p-8">
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">Create your account</div>
              <div className="text-gray-600">Join recruiters using AI-powered interviews</div>
            </div>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 pl-9 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {isNameValid && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-gray-300 pl-9 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {isEmailValid && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="w-full rounded-lg border border-gray-300 pl-9 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                  {/* Strength meter */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password strength</span>
                      <span className="text-xs font-medium capitalize text-gray-700">{strengthLevel}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded">
                      <div className={`h-2 ${strengthWidth} ${strengthColor} rounded transition-all duration-300`} />
                    </div>
                    <ul className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-600">
                      <li className="flex items-center gap-1">
                        <Check className={`h-4 w-4 ${passwordCriteria.length ? 'text-green-600' : 'text-gray-400'}`} />
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className={`h-4 w-4 ${passwordCriteria.upper ? 'text-green-600' : 'text-gray-400'}`} />
                        Uppercase letter
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className={`h-4 w-4 ${passwordCriteria.lower ? 'text-green-600' : 'text-gray-400'}`} />
                        Lowercase letter
                      </li>
                      <li className="flex items-center gap-1">
                        <Check className={`h-4 w-4 ${passwordCriteria.number ? 'text-green-600' : 'text-gray-400'}`} />
                        Number
                      </li>
                      <li className="flex items-center gap-1 col-span-2">
                        <Check className={`h-4 w-4 ${passwordCriteria.special ? 'text-green-600' : 'text-gray-400'}`} />
                        Special character
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className="w-full rounded-lg border border-gray-300 pl-9 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                    </button>
                    {passwordsMatch && <Check className="absolute right-9 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am joining as</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'candidate', title: 'Candidate', subtitle: 'Looking for opportunities' },
                    { key: 'recruiter', title: 'Recruiter', subtitle: 'Hiring top talent' },
                  ].map((opt) => {
                    const selected = formData.role === opt.key;
                    return (
                      <button
                        type="button"
                        key={opt.key}
                        onClick={() => setFormData({ ...formData, role: opt.key })}
                        className={
                          'rounded-xl border p-4 text-left transition ' +
                          (selected ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50')
                        }
                      >
                        <div className="font-semibold text-gray-900">{opt.title}</div>
                        <div className="text-sm text-gray-600">{opt.subtitle}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input id="terms" type="checkbox" required className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the <a className="text-blue-600 hover:underline">Terms</a> and <a className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 disabled:opacity-50 transition-transform duration-200 hover:scale-105"
              >
                {loading ? 'Creating your account…' : 'Create Account'}
              </button>
            </form>
            <div className="mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Benefits */}
      <div className="hidden md:flex items-center p-12">
        <div className="w-full max-w-xl mx-auto">
          <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">Why join AI Recruiter Pro?</div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {['Quick setup', 'AI-powered', 'Detailed reports', 'Secure & private'].map((t) => (
                <div key={t} className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900">{t}</div>
                  <div className="text-sm text-gray-600">Start in minutes and scale with confidence.</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="font-semibold">Testimonial</div>
              <p className="text-white/90 mt-1">“This platform transformed our hiring process with accurate, instant insights.”</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
