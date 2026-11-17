import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'owner' | 'admin' | 'order_manager' | 'inventory_manager' | 'customer';
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  setupAdmin: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  hasAdminConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'mens_outfit_admin_user';
const AUTH_TOKEN_KEY = 'mens_outfit_admin_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasAdminConfigured, setHasAdminConfigured] = useState<boolean>(true);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Remove credentials left by the previous browser-only admin fallback.
        localStorage.removeItem('mens_outfit_local_admin_cred');
        // Try backend verification first
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        if (storedToken) {
          // Attempt verify against backend
          try {
            const res = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            if (res.ok) {
              const data = await res.json();
              if (data?.data?.user) {
                setUser(data.data.user);
                setToken(storedToken);
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
              }
            } else {
              localStorage.removeItem(AUTH_USER_KEY);
              localStorage.removeItem(AUTH_TOKEN_KEY);
            }
          } catch {
            // Fail closed: cached browser identity is not a valid session.
            localStorage.removeItem(AUTH_USER_KEY);
            localStorage.removeItem(AUTH_TOKEN_KEY);
          }
        }

        // Check if admin is configured on server or locally
        try {
          const res = await fetch('/api/auth/admin-status');
          if (res.ok) {
            const data = await res.json();
            setHasAdminConfigured(Boolean(data?.data?.hasAdmin));
          } else setHasAdminConfigured(true);
        } catch {
          // Keep setup disabled if server status is unavailable.
          setHasAdminConfigured(true);
        }
      } catch (e) {
        console.warn('Auth initialization error', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result?.message || 'ভুল ইমেইল বা পাসওয়ার্ড।' };
      }
      if (!result?.data?.user || !result?.data?.token) {
        return { success: false, message: 'সার্ভারের উত্তর সঠিক নয়।' };
      }
      const u = result.data.user;
      if (u.role === 'customer') {
        return { success: false, message: 'আপনার একাউন্টে অ্যাডমিন ড্যাশবোর্ড ব্যবহারের অনুমতি নেই।' };
      }
      setUser(u);
      setToken(result.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
      localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
      return { success: true, message: 'লগইন সফল হয়েছে!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'লগইন প্রক্রিয়া ব্যর্থ হয়েছে।' };
    } finally {
      setIsLoading(false);
    }
  };

  const setupAdmin = async (data: { name: string; email: string; password: string; phone?: string }): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/setup-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result?.message || 'সেটআপ ব্যর্থ হয়েছে।' };
      }
      if (!result?.data?.user || !result?.data?.token) {
        return { success: false, message: 'অ্যাডমিন সেটআপের উত্তর সার্ভার থেকে পাওয়া যায়নি।' };
      }
      setUser(result.data.user);
      setToken(result.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.data.user));
      localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
      setHasAdminConfigured(true);
      return { success: true, message: 'অ্যাডমিন একাউন্ট সফলভাবে সক্রিয় হয়েছে!' };
    } catch (e: any) {
      return { success: false, message: e.message || 'অ্যাডমিন তৈরি ব্যর্থ হয়েছে।' };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (token) {
        const res = await fetch('/api/auth/change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result?.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
        }
        return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' };
      }

      return { success: false, message: 'পাসওয়ার্ড পরিবর্তনের জন্য সার্ভারে লগইন করুন।' };
    } catch (e: any) {
      return { success: false, message: e.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && user.role !== 'customer',
        isLoading,
        login,
        logout,
        setupAdmin,
        changePassword,
        hasAdminConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
