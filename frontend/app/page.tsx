'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ResidentQR } from './components/ResidentQR';
import { communityCentres } from '../lib/data/communityData';
import { childcarePrograms } from '../lib/data/childcareData';
import { shelters } from '../lib/data/shelterData';

type ResourceType = 'all' | 'shelter' | 'food' | 'community';

type ResourceItem = {
  id: string;
  name: string;
  address: string;
  printAddress: string;
  phone: string | null;
  category: Exclude<ResourceType, 'all'>;
  hasChild: boolean;
  hasWheelchair: boolean;
  lat?: number | null;
  lng?: number | null;
  extra?: string | null;
  transitSteps: string[];
  transitRoute: string;
  estimatedTime: string;
  stopName: string;
  appointmentLabel: string;
};

const categoryMeta: Record<Exclude<ResourceType, 'all'>, { label: string; eyebrow: string }> = {
  shelter: { label: 'Shelter', eyebrow: 'Dignity' },
  food: { label: 'Emergency Childcare', eyebrow: 'Childcare' },
  community: { label: 'Career', eyebrow: 'Career Transition' },
};

const featureCards = [
  {
    title: 'Verified Trust',
    copy: 'Every place on this list is screened so families can start from safer, trusted options.',
    icon: 'Shield',
  },
  {
    title: 'Instant Matches',
    copy: 'Move through nearby support quickly with clear categories, directions, and printable notes.',
    icon: 'Spark',
  },
  {
    title: 'Language Support',
    copy: 'Simple labels and guided next steps help people navigate services with more confidence.',
    icon: 'Translate',
  },
];

function PencilCaseArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 210" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 80C16 98 13 124 24 145L47 186C55 200 72 205 90 198L314 122C331 116 340 98 336 78L328 41C325 24 308 11 288 15L63 47C48 49 36 58 28 80Z" fill="#ffbe74" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M58 42L316 113" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M42 100L276 151" stroke="#adc7ff" strokeWidth="12" />
        <path d="M44 103L274 154" stroke="#2f64d3" strokeWidth="3" />
        <path d="M84 61C98 49 121 54 133 66C150 83 144 112 126 124C101 141 68 123 67 96" fill="#fff0a6" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M97 85C104 80 114 81 120 88" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M98 102C108 108 121 107 130 99" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M97 77L98 77" stroke="#2f64d3" strokeWidth="5" />
        <path d="M121 79L122 79" stroke="#2f64d3" strokeWidth="5" />
        <path d="M185 114L203 120" stroke="#2f64d3" strokeWidth="4" />
        <path d="M209 120L245 128" stroke="#2f64d3" strokeWidth="4" />
        <path d="M73 157L154 175" stroke="#fff7d4" strokeWidth="10" />
        <path d="M232 54L290 67" stroke="#fff7d4" strokeWidth="10" />
      </g>
    </svg>
  );
}

function PencilArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 420" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M80 38L118 74L48 366L30 392L25 356L80 38Z" fill="#ffbb79" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M80 38C91 13 116 9 131 25C143 38 145 63 132 76L118 74L80 38Z" fill="#adc7ff" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M83 40C96 31 109 33 119 42" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M57 327L96 99" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M69 336L108 108" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M33 355L47 359L26 390" fill="#fff6be" stroke="#2f64d3" strokeWidth="3.5" />
      </g>
    </svg>
  );
}

function RulerArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 360" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M45 18L150 80L121 336L19 276L45 18Z" fill="#ffcb86" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M108 52L139 70L108 323L78 305L108 52Z" fill="#adc7ff" stroke="#adc7ff" strokeWidth="10" />
        <path d="M38 56L82 82" stroke="#fff" strokeWidth="6" />
        <path d="M53 48L41 245" stroke="#fff5ca" strokeWidth="10" />
        <path d="M54 42L57 52M60 46L63 56M66 49L69 59M72 53L75 63M78 56L81 66M84 60L87 70M90 63L93 73" stroke="#fff2bd" strokeWidth="2.8" />
        <path d="M90 118L103 126M83 171L96 179M75 224L88 232M67 277L80 285" stroke="#2f64d3" strokeWidth="4" />
        <path d="M97 255L103 260L97 266L90 260L97 255Z" fill="#fff0a6" stroke="#2f64d3" strokeWidth="3" />
      </g>
    </svg>
  );
}

function BackpackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M39 29C39 18 48 10 60 10C72 10 81 18 81 29"
          stroke="#2f64d3"
          strokeWidth="5"
        />
        <path
          d="M26 36C26 28 32 22 40 22H80C88 22 94 28 94 36V91C94 100 87 108 78 108H42C33 108 26 100 26 91V36Z"
          fill="#ffbe74"
          stroke="#2f64d3"
          strokeWidth="5"
        />
        <path d="M37 36H83V48C83 54 78 59 72 59H48C42 59 37 54 37 48V36Z" fill="#adc7ff" stroke="#2f64d3" strokeWidth="4" />
        <path d="M45 59H75C81 59 86 64 86 70V91C86 96 82 100 77 100H43C38 100 34 96 34 91V70C34 64 39 59 45 59Z" fill="#fffaf4" stroke="#2f64d3" strokeWidth="4" />
        <path d="M48 59V47" stroke="#2f64d3" strokeWidth="4" />
        <path d="M72 59V47" stroke="#2f64d3" strokeWidth="4" />
        <path d="M50 76C53 71 59 68 65 69C71 70 75 75 76 81" stroke="#2f64d3" strokeWidth="4" />
        <path d="M56 82L57 82" stroke="#2f64d3" strokeWidth="5" />
        <path d="M69 82L70 82" stroke="#2f64d3" strokeWidth="5" />
        <path d="M46 39L35 50" stroke="#fff0a6" strokeWidth="6" />
        <path d="M74 39L86 51" stroke="#fff0a6" strokeWidth="6" />
      </g>
    </svg>
  );
}

export default function Home() {
  const [withChild, setWithChild] = useState(false);
  const [wheelchair, setWheelchair] = useState(false);
  const [activeType, setActiveType] = useState<ResourceType>('all');
  const [selectedForPrint, setSelectedForPrint] = useState<ResourceItem | null>(null);

  const allResources = useMemo<ResourceItem[]>(() => {
    const shelterItems = shelters.map((s, index) => ({
      id: s.shelter_id ?? `shelter-${index}`,
      name: s.name ?? 'Unknown',
      address: s.city ?? 'Unknown address',
      printAddress: s.city ?? 'Address shared directly by shelter staff',
      phone: s.phone ?? null,
      category: 'shelter' as const,
      hasChild: s.childrens_programming === 'onsite',
      hasWheelchair: s.accessibility === 'fully',
      lat: typeof s.lat === 'number' ? s.lat : typeof s.lat === 'string' ? Number(s.lat) || null : null,
      lng: typeof s.lng === 'number' ? s.lng : typeof s.lng === 'string' ? Number(s.lng) || null : null,
      extra: s.type ?? null,
      transitSteps: [
        'Travel by bus or SkyTrain toward the city listed on this shelter card.',
        'Check in with shelter staff before sharing personal details in public.',
        'Ask the desk team for the safest arrival entrance and intake queue.',
        'Keep this printout available for staff sign-off after your visit.',
      ],
      transitRoute: `Bus 99 (Eastbound) -> Transfer to regional service toward ${s.city ?? 'the shelter city'}.`,
      estimatedTime: 'Approx. 45 mins from Walter Gage Residence.',
      stopName: `${s.city ?? 'Shelter'} main arrival stop`,
      appointmentLabel: 'Shelter intake at 10:00 AM',
    }));

    const foodItems = childcarePrograms.map((f, i) => ({
      id: `food-${i}`,
      name: f.program_name,
      address: f.location_address,
      printAddress: f.location_address,
      phone: f.signup_phone_number,
      category: 'food' as const,
      hasChild: true,
      hasWheelchair: f.wheelchair_accessible,
      lat: f.latitude,
      lng: f.longitude,
      extra: f.population_served,
      transitSteps: f.transit_steps,
      transitRoute: 'Bus 99 (Eastbound) -> Transfer to Expo Line at Commercial-Broadway.',
      estimatedTime: 'Approx. 45 mins from Walter Gage Residence.',
      stopName: `Exit at the stop nearest ${f.location_address.split(',')[0]}.`,
      appointmentLabel: 'Job interview at 10:00 AM',
    }));

    const communityItems = communityCentres.map((c, i) => ({
      id: `cc-${i}`,
      name: c.name ?? 'Unknown',
      address: c.address ?? c.area ?? 'Unknown address',
      printAddress:
        c.address && c.area
          ? `${c.address}, ${c.area}, Vancouver, BC`
          : c.address ?? c.area ?? 'Unknown address',
      phone: null,
      category: 'community' as const,
      hasChild: false,
      hasWheelchair: false,
      lat: c.lat,
      lng: c.lng,
      extra: c.area ? `${c.area} career transition hub` : 'Career transition support',
      transitSteps: [
        `Ride transit toward ${c.area ?? 'the neighbourhood service hub'}.`,
        `Exit near ${c.address ?? c.name ?? 'the centre entrance'}.`,
        'Check the front desk for employment coaching, resume help, and intake hours.',
        'Ask staff to sign the Proof of Visit section before you leave.',
      ],
      transitRoute: `Bus 99 (Eastbound) -> Transfer to local service for ${c.area ?? 'the destination neighbourhood'}.`,
      estimatedTime: 'Approx. 45 mins from Walter Gage Residence.',
      stopName: `Get off at ${c.address ?? c.name ?? 'the closest stop'}.`,
      appointmentLabel: 'Career appointment at 10:00 AM',
    }));

    return [...shelterItems, ...foodItems, ...communityItems];
  }, []);

  const filtered = useMemo(() => {
    return allResources.filter((item) => {
      if (activeType !== 'all' && item.category !== activeType) return false;
      if (withChild && !item.hasChild) return false;
      if (wheelchair && !item.hasWheelchair) return false;
      return true;
    });
  }, [activeType, allResources, wheelchair, withChild]);

  const handlePrint = (item: ResourceItem) => {
    setSelectedForPrint(item);

    requestAnimationFrame(() => {
      window.print();
    });
  };

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-backdrop hero-backdrop-left">
          <PencilCaseArt className="supply-art case-art" />
        </div>
        <div className="hero-backdrop hero-backdrop-right">
          <PencilArt className="supply-art pencil-art" />
          <RulerArt className="supply-art ruler-art" />
        </div>

        <div className="landing-shell">
          <header className="landing-nav">
            <Link href="/" className="landing-brand">
              <span className="landing-brand__badge">
                <BackpackIcon className="landing-brand__icon" />
              </span>
              <span className="landing-brand__label">freeme!</span>
            </Link>

            <nav className="landing-nav__links" aria-label="Primary">
              <a href="#features">Features</a>
              <a href="#resources">Resources</a>
              <a href="#contact">Contact</a>
            </nav>

            <div className="landing-nav__actions">
              <Link href="/login" className="landing-nav__secondary">
                User login
              </Link>
              <Link href="/admin" className="landing-nav__primary">
                Admin login
              </Link>
            </div>
          </header>

          <section className="landing-hero">
            <p className="landing-hero__eyebrow">Welcome home</p>
            <h1>Free me</h1>
            <div className="landing-hero__message">
              <p>
                Find calm, clear next steps with trusted shelter, childcare, and career support gathered in one place.
              </p>
            </div>
          </section>

          <section id="features" className="landing-features">
            {featureCards.map((card) => (
              <article key={card.title} className="landing-feature-card">
                <div className="landing-feature-card__icon" aria-hidden="true">
                  {card.icon}
                </div>
                <h2>{card.title}</h2>
                <p>{card.copy}</p>
              </article>
            ))}
          </section>

          <section className="landing-search-panel">
            <div className="landing-search-panel__head">
              <div>
                <p className="landing-search-panel__kicker">Quick start</p>
                <h2>Find safe support near you</h2>
              </div>
              <div className="landing-search-panel__assist">Translation-friendly guidance</div>
            </div>

            <div className="landing-search-grid">
              <div className="landing-search-field">
                <span>Need</span>
                <div className="landing-search-field__value">Shelter, childcare, or career help</div>
              </div>
              <div className="landing-search-field">
                <span>Children welcome</span>
                <div className="landing-search-field__value">{withChild ? 'Yes, currently filtered' : 'Optional filter available'}</div>
              </div>
              <div className="landing-search-field">
                <span>Stroller access</span>
                <div className="landing-search-field__value">{wheelchair ? 'Yes, currently filtered' : 'Optional filter available'}</div>
              </div>
              <div className="landing-search-field">
                <span>Available places</span>
                <div className="landing-search-field__value">{filtered.length} options showing now</div>
              </div>
              <div className="landing-search-field">
                <span>Total verified spots</span>
                <div className="landing-search-field__value">{allResources.length} places loaded</div>
              </div>
              <div className="landing-search-field">
                <span>Best next step</span>
                <div className="landing-search-field__value">Browse the cards below and print a visit sheet</div>
              </div>
            </div>

            <div className="landing-search-panel__actions">
              <a href="#resources" className="landing-search-panel__primary">
                Find a place now
              </a>
              <Link href="/login" className="landing-search-panel__secondary">
                Browse with user login
              </Link>
            </div>
          </section>
        </div>
      </section>

      <section id="resources" className="content-shell">
        <div className="panel-card panel-card--filters">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Pick a lane</p>
              <h2>Browse by need</h2>
            </div>
            <div className="count-pill">{filtered.length} showing</div>
          </div>

          <div className="pill-row">
            {(['all', 'shelter', 'food', 'community'] as ResourceType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`pill-button ${activeType === type ? 'is-active' : ''}`}
              >
                {type === 'all' ? 'All resources' : categoryMeta[type].label}
              </button>
            ))}
          </div>

          <div className="toggle-row">
            <button
              onClick={() => setWithChild(!withChild)}
              className={`toggle-chip ${withChild ? 'is-on' : ''}`}
            >
              Children welcome
            </button>
            <button
              onClick={() => setWheelchair(!wheelchair)}
              className={`toggle-chip alt ${wheelchair ? 'is-on' : ''}`}
            >
              Stroller access
            </button>
          </div>

          <p className="helper-text">
            Use the filters to narrow the list, then print a transit-ready visit sheet when you need one.
          </p>
        </div>

        <div className="panel-card panel-card--results">
          <div className="panel-heading panel-heading--results">
            <div>
              <p className="panel-kicker">Hand-picked list</p>
              <h2>Places to check next</h2>
            </div>
            <p className="helper-text">Each card keeps the basics visible at a glance.</p>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__badge">No match</div>
              <h3>Nothing fits those filters yet.</h3>
              <p>Try opening up one filter and we&apos;ll refill the page with nearby options.</p>
            </div>
          ) : (
            <div className="resource-grid">
              {filtered.map((item) => {
                const cat = categoryMeta[item.category];
                const mapsTarget =
                  typeof item.lat === 'number' && typeof item.lng === 'number'
                    ? `${item.lat},${item.lng}`
                    : `${item.address}, Vancouver, BC`;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsTarget)}&travelmode=transit`;

                return (
                  <article key={item.id} className={`resource-card resource-card--${item.category}`}>
                    <div className="resource-card__top">
                      <span className="resource-card__eyebrow">{cat.eyebrow}</span>
                      <span className="resource-card__tag">{cat.label}</span>
                    </div>

                    <h3>{item.name}</h3>
                    <p className="resource-card__address">{item.address}</p>

                    {item.extra && <p className="resource-card__detail">{item.extra}</p>}

                    <div className="resource-card__chips">
                      {item.hasChild && <span className="mini-chip">Children&apos;s program</span>}
                      {item.hasWheelchair && <span className="mini-chip mini-chip--blue">Wheelchair access</span>}
                    </div>

                    {item.phone ? (
                      <a href={`tel:${item.phone}`} className="resource-card__phone">
                        Call {item.phone}
                      </a>
                    ) : (
                      <p className="resource-card__phone resource-card__phone--muted">Phone not listed</p>
                    )}

                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="direction-button">
                      Get directions
                    </a>
                    <button type="button" className="print-button" onClick={() => handlePrint(item)}>
                      Print visit sheet
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div id="contact" className="panel-card landing-contact-card">
          <div className="panel-heading panel-heading--results">
            <div>
              <p className="panel-kicker">Stay connected</p>
              <h2>Need help getting started?</h2>
            </div>
            <p className="helper-text">Use the logins above or print a visit sheet once you find a match.</p>
          </div>

          <div className="landing-contact-card__actions">
            <Link href="/login" className="note-sheet__admin-link">
              User login
            </Link>
            <Link href="/admin" className="note-sheet__admin-link">
              Admin login
            </Link>
          </div>
        </div>

        <section
          className={`print-sheet print-only-section ${selectedForPrint ? 'print-sheet--ready' : ''}`}
          aria-hidden={!selectedForPrint}
        >
          {selectedForPrint ? (
            <div className="print-sheet__page">
              <div className="print-sheet__destination-head">
                <p className="print-sheet__eyebrow">{categoryMeta[selectedForPrint.category].eyebrow}</p>
                <h1>
                  <span className="print-sheet__icon" aria-hidden="true">
                    🚶
                  </span>
                  {selectedForPrint.name}
                </h1>
                <p className="print-sheet__category">
                  <span className="print-sheet__icon" aria-hidden="true">
                    📅
                  </span>
                  {selectedForPrint.appointmentLabel}
                </p>
              </div>

              <div className="print-sheet__block">
                <h2>Destination</h2>
                <p className="print-sheet__address">{selectedForPrint.printAddress}</p>
              </div>

              <div className="print-sheet__postit">
                <p className="print-sheet__postit-label">Transit Guide Post-it</p>
                <div className="print-sheet__postit-row">
                  <span>Route</span>
                  <strong>{selectedForPrint.transitRoute}</strong>
                </div>
                <div className="print-sheet__postit-row">
                  <span>Estimated Time</span>
                  <strong>{selectedForPrint.estimatedTime}</strong>
                </div>
                <div className="print-sheet__postit-row">
                  <span>Stop Name</span>
                  <strong>{selectedForPrint.stopName}</strong>
                </div>
                <div className="print-sheet__timeline" aria-label="Transit timeline">
                  <div className="print-sheet__timeline-step">
                    <div className="print-sheet__timeline-icon" aria-hidden="true">
                      🚌
                    </div>
                    <div>
                      <strong>Start</strong>
                      <p>UBC (Walter Gage)</p>
                      <p>#99 B-Line Bus</p>
                    </div>
                  </div>
                  <div className="print-sheet__timeline-arrow" aria-hidden="true">
                    -&gt;
                  </div>
                  <div className="print-sheet__timeline-step">
                    <div className="print-sheet__timeline-icon" aria-hidden="true">
                      🚇
                    </div>
                    <div>
                      <strong>Transfer</strong>
                      <p>Commercial-Broadway Stn</p>
                      <p>Expo Line Train</p>
                    </div>
                  </div>
                  <div className="print-sheet__timeline-arrow" aria-hidden="true">
                    -&gt;
                  </div>
                  <div className="print-sheet__timeline-step">
                    <div className="print-sheet__timeline-icon" aria-hidden="true">
                      🚶
                    </div>
                    <div>
                      <strong>End</strong>
                      <p>{selectedForPrint.stopName}</p>
                      <p>{selectedForPrint.printAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="print-sheet__help-card">
                <h2>Help Me</h2>
                <div className="print-sheet__help-copy">
                  <p>
                    Lost. No Phone. Going to: {selectedForPrint.printAddress}. Please Help.
                  </p>
                </div>
                <div className="print-sheet__line-group">
                  <span>Emergency Shelter Contact</span>
                  <span className="print-sheet__line">{selectedForPrint.phone ?? ''}</span>
                </div>
              </div>

              <div className="print-sheet__qr">
                <ResidentQR residentId={selectedForPrint.id} size={112} />
              </div>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
