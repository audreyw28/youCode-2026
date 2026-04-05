'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const demoCredentials = {
  email: 'admin@free-me.org',
  password: 'letmein123',
};

const quickNotes = [
  'Review active requests before assigning volunteers.',
  'Print resident QR sheets from the dashboard when needed.',
  'Update notes quickly after each childcare or transit match.',
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();
    const isValidLogin =
      normalizedEmail === demoCredentials.email && password === demoCredentials.password;

    window.setTimeout(() => {
      setIsSubmitting(false);

      if (!isValidLogin) {
        setError('Use the demo admin login shown below to continue.');
        return;
      }

      router.push('/staff');
    }, 450);
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-login-card__intro">
            <p className="admin-login-card__eyebrow">Admin access</p>
            <h1>Sign in to the coordination board</h1>
            <p className="admin-login-card__copy">
              Access staff tools, urgent request tracking, and resident ID printing from one secure screen.
            </p>

            <div className="admin-login-card__notes">
              {quickNotes.map((note) => (
                <div key={note} className="admin-login-card__note">
                  {note}
                </div>
              ))}
            </div>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-login-form__demo">
              <strong>Demo login</strong>
              <span>{demoCredentials.email}</span>
              <span>{demoCredentials.password}</span>
            </div>

            <label className="admin-login-form__field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="admin@free-me.org"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="admin-login-form__field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {error ? <p className="admin-login-form__error">{error}</p> : null}

            <div className="admin-login-form__meta">
              <label className="admin-login-form__remember">
                <input type="checkbox" name="remember" />
                <span>Keep me signed in on this device</span>
              </label>
              <a href="/staff" className="admin-login-form__link">
                Open dashboard
              </a>
            </div>

            <button type="submit" className="admin-login-form__submit">
              {isSubmitting ? 'Checking...' : 'Log in'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
