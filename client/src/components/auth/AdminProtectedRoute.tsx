import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center space-y-4 text-white">
        <div className="w-16 h-16 rounded-2xl bg-[#0F172A] border border-[#C5A880]/30 flex items-center justify-center shadow-xl">
          <ShieldCheck className="w-8 h-8 text-[#C5A880] animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-[#C5A880]" />
          <span>অ্যাডমিন নিরাপত্তা যাচাই করা হচ্ছে...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
