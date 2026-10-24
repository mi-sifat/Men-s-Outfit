import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  UserPlus, 
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

export const AdminLoginPage: React.FC = () => {
  const { login, setupAdmin, isAuthenticated, hasAdminConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  // Toggle between Login & First-time setup (only available if hasAdminConfigured is false or explicitly toggled)
  const [isSetupMode, setIsSetupMode] = useState(!hasAdminConfigured);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to admin
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success(res.message);
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message);
        toast.error(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password || password.length < 8) {
      setErrorMessage('Valid email and password of at least 8 characters are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await setupAdmin({
        name: name.trim() || 'Store Administrator',
        email: email.trim(),
        password,
        phone: phone.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message);
        toast.error(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Setup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-3 group">
            <img
              src="/logo.png"
              alt="Men's Outfit"
              className="h-12 w-auto object-contain rounded-lg shadow-sm border border-slate-200 bg-white p-1"
            />
          </Link>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white tracking-wider uppercase text-[10px]">
              <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
              Admin Portal
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {isSetupMode ? 'Create Initial Administrator' : "Men's Outfit Management"}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {isSetupMode
              ? 'Configure the primary store owner credentials to secure your panel.'
              : 'Sign in with your authorized administrator credentials.'}
          </p>
        </div>

        {/* Card Box */}
        <div className="mt-6 bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-slate-200">
          {/* Security status */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-3 mb-5 font-medium">
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SSL Protected</span>
            </span>
            <span className="text-slate-400">Rate-Limited Access</span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isSetupMode ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mensoutfit.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full font-semibold gap-2 mt-2 bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg shadow-sm cursor-pointer"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {!hasAdminConfigured && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setIsSetupMode(true)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Setup Initial Admin Account</span>
                  </button>
                </div>
              )}
            </form>
          ) : (
            /* First Admin Setup Form */
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed">
                <strong>One-Time Secure Initialization:</strong> Fill out this form to create the primary store owner. Once created, public admin initialization will be permanently locked on the server.
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sifat Islam"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Admin Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mensoutfit.com"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Master Password (Min. 8 characters) *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="w-full font-semibold gap-2 mt-2 bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg shadow-sm cursor-pointer"
              >
                <span>{isSubmitting ? 'Configuring Account...' : 'Initialize Administrator Account'}</span>
                <KeyRound className="w-4 h-4" />
              </Button>

              <button
                type="button"
                onClick={() => setIsSetupMode(false)}
                className="text-xs text-slate-500 hover:text-slate-800 block text-center w-full pt-1"
              >
                Return to Login
              </button>
            </form>
          )}

          {/* Return to storefront */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
            <span className="text-[11px] font-mono text-slate-400">Men's Outfit v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
