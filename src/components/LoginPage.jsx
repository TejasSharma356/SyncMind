import React, { useState, useEffect } from 'react';
import { signInWithGoogle, getAuthInstance, logout } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '../contexts/AuthContext';
import { GLSLHills } from './ui/glsl-hills';
import { ArrowLeft, CheckCircle2, LogOut, ArrowRight, UserCheck } from 'lucide-react';

const LoginPage = ({ onSuccess, onBack }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Custom states for the non-abrupt Desktop Auth Sync flow
  const [isDesktopSyncMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('source') === 'desktop';
  });
  const [syncCompleted, setSyncCompleted] = useState(false);

  // Auto-redirect normal web users if already logged in (Desktop users are NOT auto-redirected to keep flow smooth)
  useEffect(() => {
    if (user && !isDesktopSyncMode) {
      onSuccess();
    }
  }, [user, isDesktopSyncMode, onSuccess]);

  const processDesktopDeepLink = async (currentUser) => {
    if (currentUser) {
      const token = await currentUser.getIdToken();
      const auth = getAuthInstance();
      const apiKey = auth?.config?.apiKey || '';
      const refreshToken = currentUser.refreshToken || '';
      
      console.log('[LOGIN] Sending protocol sync token to Electron client...');
      // Send token, refresh token, and API key dynamically to the Electron client
      window.location.href = `syncmind://auth?token=${encodeURIComponent(token)}&refreshToken=${encodeURIComponent(refreshToken)}&apiKey=${encodeURIComponent(apiKey)}`;
      
      // Clean query parameters from the browser URL to avoid re-triggering on reload
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      return true;
    }
    return false;
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await signInWithGoogle();
      if (isDesktopSyncMode) {
        await processDesktopDeepLink(loggedInUser);
        setSyncCompleted(true);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error('Google Login failed:', err);
      setError(err?.message && err.message.includes('popup-closed-by-user') 
        ? 'Sign-in window was closed. Please try again.' 
        : 'Google Sign-In was unsuccessful. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuthInstance();
      if (!auth) throw new Error("Firebase Auth not initialized");

      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      if (isDesktopSyncMode) {
        await processDesktopDeepLink(userCredential.user);
        setSyncCompleted(true);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error('Email Auth failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already registered. Please log in instead.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSync = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await processDesktopDeepLink(user);
      setSyncCompleted(true);
    } catch (err) {
      console.error("Deep link sync failed:", err);
      setError("Failed to link with Desktop client.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    setIsLoading(true);
    try {
      await logout();
      setError(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Post-Sync Redirection Screen
  const renderPostSyncScreen = () => (
    <div className="relative w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/30 via-transparent to-blue-500/20 rounded-2xl" />
      <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={32} />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">
          Desktop Sync Successful!
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed max-w-sm mb-8">
          Your credentials have been securely synced. The Silent Teammate recorder is now active. Where would you like to go next?
        </p>

        {/* Choice buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={onSuccess}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-5 py-3.5 rounded-xl transition-all shadow-lg active:scale-95 shadow-blue-500/20"
          >
            Launch Web Dashboard
            <ArrowRight size={16} />
          </button>
          
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold px-5 py-3.5 rounded-xl transition-all active:scale-95"
          >
            Return to Home Page
          </button>
        </div>
      </div>
    </div>
  );

  // 2. Account Sync Confirmation Screen (for already logged-in users)
  const renderConfirmationScreen = () => (
    <div className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="absolute -inset-px bg-gradient-to-br from-blue-500/30 via-transparent to-purple-500/20 rounded-2xl" />
      <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center">
        
        {/* Link Icon */}
        <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <UserCheck size={28} />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Desktop Connection
        </h1>
        <p className="text-xs text-gray-400 mb-6">
          A desktop request is waiting to link your account.
        </p>

        {/* Identity Banner */}
        <div className="w-full flex items-center gap-3.5 p-4 bg-white/5 border border-white/10 rounded-xl mb-6 text-left">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || user.email} 
              className="w-12 h-12 rounded-full object-cover border border-white/10" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-base font-bold uppercase shrink-0">
              {(user?.displayName || user?.email || 'U').charAt(0)}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-white truncate">{user?.displayName || user?.email?.split('@')[0] || 'Member'}</span>
            <span className="text-xs text-gray-400 truncate">{user?.email || 'Authenticated'}</span>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-8">
          Would you like to sync this account with the Desktop application, or use a different account?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleConfirmSync}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 shadow-blue-500/20 disabled:opacity-60"
          >
            {isLoading ? 'Syncing...' : `Continue as ${user?.displayName || user?.email?.split('@')[0] || 'User'}`}
          </button>
          
          <button
            onClick={handleSwitchAccount}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white text-sm font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60"
          >
            <LogOut size={16} />
            Use a Different Account
          </button>
        </div>
      </div>
    </div>
  );

  // 3. Standard Login/SignUp Form Screen
  const renderLoginForm = () => (
    <div className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="absolute -inset-px bg-gradient-to-br from-blue-500/30 via-transparent to-purple-500/20 rounded-2xl" />

      <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Welcome to SyncMind
          </h1>
          <p className="text-sm text-gray-400">
            {isSignUp ? 'Create an account to get started' : 'Sign in to access your meeting intelligence'}
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-tight">{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
              placeholder="you@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-60 mt-2"
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Log In')}
          </button>
        </form>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-6 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-gray-400">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* High-Fidelity GLSL Hills Background */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <GLSLHills width="100%" height="100%" speed={0.3} />
      </div>

      {/* Dark gradient overlay */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/20 to-black/80 pointer-events-none" />

      {/* Back button */}
      {onBack && !syncCompleted && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
      )}

      {/* Center Layout Container */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {isDesktopSyncMode && syncCompleted ? (
          renderPostSyncScreen()
        ) : (isDesktopSyncMode && user) ? (
          renderConfirmationScreen()
        ) : (
          renderLoginForm()
        )}
      </div>
    </div>
  );
};

export default LoginPage;
