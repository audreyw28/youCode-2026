'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const demoCredentials = {
  email: 'user@free-me.org',
  password: 'welcome123',
};

const quickNotes = [
  'Look up shelter, childcare, and career support in one place.',
  'Open directions quickly when you are ready to travel.',
  'Print a visit sheet to keep the route details with you.',
];

export default function UserLoginPage() {
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
        setError('Use the demo user login shown below to continue.');
        return;
      }

      router.push('/');
    }, 450);
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-login-card__intro">
            <p className="admin-login-card__eyebrow">User access</p>
            <h1>Sign in to view resources</h1>
            <p className="admin-login-card__copy">
              Open the resource finder, save time at check-in, and keep transit-ready support details close by.
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
                placeholder="user@free-me.org"
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
              <Link href="/" className="admin-login-form__link">
                Open resource finder
              </Link>
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
