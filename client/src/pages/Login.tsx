import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePageMeta } from '../utils/usePageMeta';

export default function Login() {
  usePageMeta('Sign In', 'Sign in to your NB Classic Scents account.');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname ?? '/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20 min-h-[80vh] flex items-center bg-warm-cream">
      <div className="max-w-md w-full mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <img src="/images/logo-mark.svg" alt="NB Classic Scents" className="h-10 mx-auto mb-6" />
          <h1 className="font-display text-3xl text-cocoa">Welcome Back</h1>
          <p className="text-sm text-cocoa/60 mt-2">Sign in to continue your journey with NB Classic Scents.</p>
        </div>
        <form onSubmit={submit} className="bg-white border border-cocoa/10 rounded-sm p-7 space-y-4">
          <div>
            <label className="label-field">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label-field">Password</label>
              <Link to="/forgot-password" className="text-xs text-champagne hover:text-soft-gold mb-1.5">
                Forgot password?
              </Link>
            </div>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </div>
          {error && <p className="text-sm text-rose-champagne">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-cocoa/60 mt-6">
          Don&rsquo;t have an account?{' '}
          <Link to="/register" className="text-champagne hover:text-soft-gold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
