import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePageMeta } from '../utils/usePageMeta';

export default function Signup() {
  usePageMeta('Create Account', 'Create your NB Classic Scents account.');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      await register(name, email, password);
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20 min-h-[80vh] flex items-center bg-warm-cream">
      <div className="max-w-md w-full mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <img src="/images/logo-mark.svg" alt="NB Classic Scents" className="h-10 mx-auto mb-6" />
          <h1 className="font-display text-3xl text-cocoa">Create Your Account</h1>
          <p className="text-sm text-cocoa/60 mt-2">Join NB Classic Scents to track orders and save favorites.</p>
        </div>
        <form onSubmit={submit} className="bg-white border border-cocoa/10 rounded-sm p-7 space-y-4">
          <div>
            <label className="label-field">Full Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Confirm Password</label>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" />
          </div>
          {error && <p className="text-sm text-rose-champagne">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-cocoa/60 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-champagne hover:text-soft-gold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
