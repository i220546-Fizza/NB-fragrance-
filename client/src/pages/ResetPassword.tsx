import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/api';
import { usePageMeta } from '../utils/usePageMeta';

export default function ResetPassword() {
  usePageMeta('Reset Password', 'Set a new password for your NB Classic Scents account.');
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to reset your password. The link may have expired.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20 min-h-[80vh] flex items-center bg-warm-cream">
      <div className="max-w-md w-full mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <img src="/images/logo-mark.svg" alt="NB Classic Scents" className="h-10 mx-auto mb-6" />
          <h1 className="font-display text-3xl text-cocoa">Set New Password</h1>
        </div>

        {done ? (
          <div className="bg-white border border-cocoa/10 rounded-sm p-7 text-center">
            <p className="text-cocoa">Your password has been reset. Redirecting to sign in...</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white border border-cocoa/10 rounded-sm p-7 space-y-4">
            <div>
              <label className="label-field">New Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">Confirm Password</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" />
            </div>
            {error && <p className="text-sm text-rose-champagne">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-cocoa/60 mt-6">
          <Link to="/login" className="text-champagne hover:text-soft-gold">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
