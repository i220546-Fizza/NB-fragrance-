import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/api';
import { usePageMeta } from '../utils/usePageMeta';

export default function ForgotPassword() {
  usePageMeta('Forgot Password', 'Reset your NB Classic Scents account password.');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string; resetToken?: string; resetUrl?: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setResult(res);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to process your request.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20 min-h-[80vh] flex items-center bg-offwhite">
      <div className="max-w-md w-full mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <img src="/images/logo-mark.svg" alt="NB Classic Scents" className="h-10 mx-auto mb-6" />
          <h1 className="font-display text-3xl text-cocoa">Reset Password</h1>
          <p className="text-sm text-cocoa/60 mt-2">Enter your email and we&rsquo;ll help you reset your password.</p>
        </div>

        {!result ? (
          <form onSubmit={submit} className="bg-white border border-cocoa/10 rounded-sm p-7 space-y-4">
            <div>
              <label className="label-field">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            </div>
            {error && <p className="text-sm text-rose-champagne">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="bg-white border border-cocoa/10 rounded-sm p-7 space-y-4">
            <p className="text-sm text-cocoa/70">{result.message}</p>
            {result.resetUrl && (
              <div className="bg-offwhite border border-cocoa/10 rounded-sm p-4">
                <p className="text-[11px] uppercase tracking-wide text-champagne mb-2">Development Mode &mdash; No Email Server</p>
                <p className="text-xs text-cocoa/60 mb-2">Use this link to reset your password:</p>
                <Link to={result.resetUrl.replace(/^.*\/reset-password/, '/reset-password')} className="text-sm text-champagne break-all hover:underline">
                  {result.resetUrl}
                </Link>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-sm text-cocoa/60 mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-champagne hover:text-soft-gold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
