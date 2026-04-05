'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const iconOptions = [
  { id: 'Turtle', emoji: '🐢' },
  { id: 'Dolphin', emoji: '🐬' },
  { id: 'Elephant', emoji: '🐘' },
  { id: 'Lion', emoji: '🦁' },
];

const quickNotes = [
  'Pick an animal icon and enter your number to sign in anonymously.',
  'Your nickname is saved locally so staff can recognize you without showing your real name.',
  'This keeps your identity private from people waiting behind you.',
];

type CurrentUser = {
  nickname: string;
  icon: string;
  emoji: string;
  createdAt: number;
};

type BookingRecord = {
  id: string;
  resource: string;
  address: string;
  category: string;
  timestamp: number;
};

export default function UserLoginPage() {
  const router = useRouter();
  const [selectedIconId, setSelectedIconId] = useState(iconOptions[0].id);
  const [userNumber, setUserNumber] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([]);
  const [showBookingHistory, setShowBookingHistory] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('current_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('current_user');
      }
    }

    const storedBookings = localStorage.getItem('incomingResidents');
    if (storedBookings) {
      try {
        setBookingHistory(JSON.parse(storedBookings));
      } catch {
        localStorage.removeItem('incomingResidents');
      }
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedNumber = userNumber.trim();
    if (!trimmedNumber || !/^[0-9]{1,3}$/.test(trimmedNumber)) {
      setError('Please enter a simple number like 11 or 95 so we can use your anonymous nickname.');
      return;
    }

    const icon = iconOptions.find((option) => option.id === selectedIconId) ?? iconOptions[0];
    const nickname = `${icon.id}${trimmedNumber}`;
    const user: CurrentUser = {
      nickname,
      icon: icon.id,
      emoji: icon.emoji,
      createdAt: Date.now(),
    };

    localStorage.setItem('current_user', JSON.stringify(user));
    setCurrentUser(user);
    setShowBookingHistory(true);
  };

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-login-card__intro">
            <p className="admin-login-card__eyebrow">User access</p>
            <h1>Use your anonymous nickname</h1>
            <p className="admin-login-card__copy">
              Choose an animal, enter a number, and staff will recognize your anonymous nickname without showing your real name.
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
            <div className="icon-picker-label">Choose your animal</div>
            <div className="icon-picker-grid">
              {iconOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`icon-picker-button ${selectedIconId === option.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedIconId(option.id)}
                  aria-pressed={selectedIconId === option.id}
                >
                  <span className="icon-picker-button__emoji">{option.emoji}</span>
                  <span>{option.id}</span>
                </button>
              ))}
            </div>

            <label className="admin-login-form__field">
              <span>Your number</span>
              <input
                type="text"
                name="number"
                inputMode="numeric"
                placeholder="11"
                value={userNumber}
                onChange={(event) => setUserNumber(event.target.value)}
                required
              />
              <small>Use a simple number so your nickname stays anonymous.</small>
            </label>

            {error ? <p className="admin-login-form__error">{error}</p> : null}

            <button type="submit" className="admin-login-form__submit">
              Use my nickname
            </button>

            {currentUser ? (
              <div className="current-user-card">
                <button type="button" className="admin-login-form__submit" onClick={handleContinue}>
                  Continue to Free me
                </button>
              </div>
            ) : null}

            {showBookingHistory && bookingHistory.length > 0 ? (
              <div className="booking-history-card">
                <p className="admin-login-card__eyebrow">Previous bookings</p>
                <div className="booking-history-list">
                  {bookingHistory.slice(-5).reverse().map((record) => (
                    <div key={record.id} className="booking-history-item">
                      <div>
                        <strong>{record.resource}</strong>
                        <p>{record.address}</p>
                      </div>
                      <button
                        type="button"
                        className="booking-history-button"
                        onClick={() => {
                          localStorage.setItem('lastBooking', JSON.stringify(record));
                          router.push('/');
                        }}
                      >
                        Review again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  );
}
