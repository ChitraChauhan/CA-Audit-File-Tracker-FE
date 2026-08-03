import React, { useState } from 'react';

export default function AuthPage({ onLogin, onSignup }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      if (mode === 'login') {
        await onLogin({ email: email.trim(), password });
      } else {
        await onSignup({ name: name.trim(), email: email.trim(), password });
      }
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <div className="auth-brand">
            <div className="brand-mark">CA</div>
            <h2>Smart CA Tracker</h2>
            <p>Secure CA access for tracking audit files, returns, and status updates in one dashboard.</p>
          </div>

          <div className="auth-highlights">
            <div className="auth-highlight">
              <span>✓</span>
              Instant access to your audit dashboard
            </div>
            <div className="auth-highlight">
              <span>✓</span>
              Secure login with CA credentials
            </div>
            <div className="auth-highlight">
              <span>✓</span>
              Manage file movement and returns centrally
            </div>
          </div>
        </div>

        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h3>{mode === 'login' ? 'Welcome back' : 'Create an account'}</h3>
            <p>{mode === 'login' ? 'Login to continue to your CA dashboard.' : 'Sign up and start managing audit files.'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            {mode === 'signup' && (
              <label>
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a secure password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </label>

            {mode === 'signup' && (
              <label>
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </label>
            )}

            <button type="submit" className="btn btn-primary auth-submit">
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                New to Smart CA Tracker?{' '}
                <button type="button" onClick={switchMode}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={switchMode}>
                  Login instead
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
