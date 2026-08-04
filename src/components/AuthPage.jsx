import React, { useState } from 'react';

export default function AuthPage({ onLogin, onSignup }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

            <label className="password-field">
              Password
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className={`password-toggle ${showPassword ? 'active' : ''}`}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M12 4.5c-5.3 0-9.7 3.2-11.5 7.5 1.8 4.3 6.2 7.5 11.5 7.5s9.7-3.2 11.5-7.5C21.7 7.7 17.3 4.5 12 4.5zm0 12c-2.5 0-4.5-2-4.5-4.5S9.5 7.5 12 7.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5zm0-7.5a3 3 0 100 6 3 3 0 000-6z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M12 5c-5.3 0-9.7 3.2-11.5 7.5.2.5.5 1 1 1.4L.1 15.8l1.4 1.4 1.5-1.5C4.8 17.7 8.3 19.5 12 19.5c5.3 0 9.7-3.2 11.5-7.5-.2-.5-.5-1-1-1.4l1.5-1.5-1.4-1.4-1.5 1.5C19.2 7.3 15.7 5 12 5zm0 11c-2.5 0-4.5-2-4.5-4.5S9.5 7 12 7s4.5 2 4.5 4.5S14.5 16 12 16z"/>
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {mode === 'signup' && (
              <label className="password-field">
                Confirm Password
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={`password-toggle ${showConfirmPassword ? 'active' : ''}`}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M12 4.5c-5.3 0-9.7 3.2-11.5 7.5 1.8 4.3 6.2 7.5 11.5 7.5s9.7-3.2 11.5-7.5C21.7 7.7 17.3 4.5 12 4.5zm0 12c-2.5 0-4.5-2-4.5-4.5S9.5 7.5 12 7.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5zm0-7.5a3 3 0 100 6 3 3 0 000-6z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M12 5c-5.3 0-9.7 3.2-11.5 7.5.2.5.5 1 1 1.4L.1 15.8l1.4 1.4 1.5-1.5C4.8 17.7 8.3 19.5 12 19.5c5.3 0 9.7-3.2 11.5-7.5-.2-.5-.5-1-1-1.4l1.5-1.5-1.4-1.4-1.5 1.5C19.2 7.3 15.7 5 12 5zm0 11c-2.5 0-4.5-2-4.5-4.5S9.5 7 12 7s4.5 2 4.5 4.5S14.5 16 12 16z"/>
                      </svg>
                    )}
                  </button>
                </div>
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
