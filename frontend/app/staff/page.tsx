'use client';

import { ResidentQR } from '../components/ResidentQR';
import { useState, useEffect } from 'react';

const urgentRequests = [
  {
    name: 'Maya R.',
    purpose: 'Job interview at Waterfront',
    time: '10:30 AM',
    status: 'Matching now',
  },
  {
    name: 'Jordan L.',
    purpose: 'Housing intake appointment',
    time: '11:15 AM',
    status: 'Volunteer assigned',
  },
  {
    name: 'Tiana S.',
    purpose: 'Medical follow-up',
    time: '1:00 PM',
    status: 'Escalated',
  },
  {
    name: 'Andre P.',
    purpose: 'Career fair check-in',
    time: '2:45 PM',
    status: 'Waiting for confirmation',
  },
];

const analyticsCards = [
  {
    label: 'Total interviews secured',
    value: '18',
    note: '6 more than last week',
  },
  {
    label: 'Childcare hours matched',
    value: '42',
    note: 'Across same-day and scheduled care',
  },
];

const verifiedVolunteers = [
  {
    name: 'Nina Alvarez',
    role: 'Early years specialist',
    availability: 'Available until 3:00 PM',
  },
  {
    name: 'Chris Park',
    role: 'Transit escort volunteer',
    availability: 'Covering Downtown Eastside',
  },
  {
    name: 'Asha Morgan',
    role: 'Emergency childcare lead',
    availability: 'On-call for urgent interviews',
  },
  {
    name: 'Luis Bennett',
    role: 'Career transition coach',
    availability: 'Helping with intake follow-ups',
  },
];

const issuedResidentId = 'RES-24018-LINH';

function statusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes('escalated')) return 'is-alert';
  if (normalized.includes('assigned')) return 'is-good';
  return 'is-waiting';
}

export default function StaffDashboardPage() {
  const [incomingResidents, setIncomingResidents] = useState([]);

  useEffect(() => {
    const loadResidents = () => {
      const residents = JSON.parse(localStorage.getItem('incomingResidents') || '[]');
      setIncomingResidents(residents.slice(-10)); // last 10
    };

    loadResidents();

    const handleStorageChange = () => loadResidents();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <main className="staff-page">
      <section className="staff-hero">
        <div className="staff-note">
          <p className="staff-note__eyebrow">Staff Dashboard</p>
          <h1>Coordination board</h1>
          <p className="staff-note__copy">
            Track urgent childcare demand, measure placement outcomes, and keep the verified network ready for quick response.
          </p>
        </div>
      </section>

      <section className="staff-shell">
        <div className="staff-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Urgent queue</p>
              <h2>Status table</h2>
            </div>
            <div className="count-pill">{urgentRequests.length} active</div>
          </div>

          <div className="staff-table-wrap">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Purpose</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {urgentRequests.map((request) => (
                  <tr key={`${request.name}-${request.time}`}>
                    <td>{request.name}</td>
                    <td>{request.purpose}</td>
                    <td>{request.time}</td>
                    <td>
                      <span className={`staff-status ${statusClass(request.status)}`}>{request.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="staff-analytics">
          {analyticsCards.map((card) => (
            <article key={card.label} className="staff-metric">
              <p className="staff-metric__label">{card.label}</p>
              <h2>{card.value}</h2>
              <p className="staff-metric__note">{card.note}</p>
            </article>
          ))}
        </div>

        <div className="staff-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Real-time updates</p>
              <h2>Incoming Residents</h2>
            </div>
            <div className="count-pill">{incomingResidents.length} recent</div>
          </div>

          <div className="incoming-list">
            {incomingResidents.length === 0 ? (
              <p>No recent residents.</p>
            ) : (
              incomingResidents.map((resident: any) => (
                <article key={resident.id} className="incoming-card">
                  <div>
                    <h3>{resident.resource}</h3>
                    <p>{resident.address}</p>
                    <p className="incoming-time">{new Date(resident.timestamp).toLocaleString()}</p>
                  </div>
                  <ResidentQR residentId={resident.id} size={80} />
                </article>
              ))
            )}
          </div>
        </div>

        <div className="staff-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">ID issuance</p>
              <h2>Resident QR card</h2>
            </div>
            <div className="count-pill">Ready to print</div>
          </div>

          <div className="staff-issue-card">
            <div>
              <h3>Linh Tran</h3>
              <p>Emergency childcare and interview transit pass attached to resident record.</p>
            </div>
            <ResidentQR residentId={issuedResidentId} size={144} />
          </div>
        </div>

        <div className="staff-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Verified network</p>
              <h2>Volunteer roster</h2>
            </div>
            <div className="count-pill">{verifiedVolunteers.length} ready</div>
          </div>

          <div className="volunteer-list">
            {verifiedVolunteers.map((volunteer) => (
              <article key={volunteer.name} className="volunteer-card">
                <div>
                  <h3>{volunteer.name}</h3>
                  <p>{volunteer.role}</p>
                </div>
                <span className="mini-chip mini-chip--blue">{volunteer.availability}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
