import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  KeyRound,
  Sparkles
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
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('ইমেইল এবং পাসওয়ার্ড দুটিই প্রয়োজন।');
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
      setErrorMessage(err.message || 'লগইন প্রক্রিয়া ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password || password.length < 8) {
      setErrorMessage('বৈধ ইমেইল এবং কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড প্রয়োজন।');
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
      setErrorMessage(err.message || 'সেটআপ ব্যর্থ হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@mensoutfit.com');
    setPassword('Admin@12345');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-200">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-slate-800/20 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center mb-4">
          <img
            src="/logo.png"
            alt="Men's Outfit"
            className="h-16 w-auto object-contain rounded-xl shadow-2xl border border-white/10"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#C5A880] text-xs font-semibold tracking-wider uppercase mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>নিরাপদ অ্যাডমিন পোর্টাল</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isSetupMode ? 'প্রথম অ্যাডমিন একাউন্ট তৈরি' : 'অ্যাডমিনিস্ট্রেটর লগইন'}
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          {isSetupMode
            ? 'সিস্টেমের জন্য নতুন মালিক/প্রধান অ্যাডমিন সেটআপ সম্পন্ন করুন'
            : 'Men\'s Outfit ম্যানেজমেন্ট ও সেটিংস কনসোল'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-[#0F172A] py-8 px-6 sm:px-10 rounded-3xl border border-white/10 shadow-2xl relative space-y-6">
          {/* Security Badge */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/10 pb-3 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>256-Bit SSL Protected</span>
            </span>
            <span className="text-slate-500">Rate Limited</span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isSetupMode ? (
            /* Standard Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  অ্যাডমিন ইমেইল *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mensoutfit.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={isSubmitting}
                className="w-full font-bold gap-2 mt-2 cursor-pointer shadow-lg shadow-[#C5A880]/10"
              >
                <span>{isSubmitting ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Demo Fill Helper */}
              <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>ডেমো ক্রেডেনশিয়াল পূরণ করুন</span>
                </button>
              </div>
            </form>
          ) : (
            /* First-Admin Setup Form */
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                ⚠️ সিস্টেমে প্রধান এডমিন তৈরির জন্য তথ্য পূরণ করুন। এটি সম্পন্ন হলে এই ফর্মটি স্থায়ীভাবে বন্ধ হয়ে যাবে।
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  আপনার পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: এস আই সিফাত"
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  ইমেইল ঠিকানা *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mensoutfit.com"
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  মোবাইল নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর) *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৮ অক্ষরের শক্তিশালী পাসওয়ার্ড"
                  required
                  minLength={8}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={isSubmitting}
                className="w-full font-bold gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'তৈরি করা হচ্ছে...' : 'অ্যাডমিন একাউন্ট তৈরি করুন'}</span>
                <KeyRound className="w-4 h-4" />
              </Button>

              <button
                type="button"
                onClick={() => setIsSetupMode(false)}
                className="text-xs text-slate-400 hover:text-white block text-center w-full pt-1"
              >
                লগইন পেইজে ফেরত যান
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] text-slate-500">
              Men's Outfit Enterprise Security Protocol • 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
