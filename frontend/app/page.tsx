'use client';

import { useMemo, useState } from 'react';
import { communityCentres } from '../lib/data/communityData';
import foodData from '../lib/data/free-and-low-cost-food-programs.json';
import { shelters } from '../lib/data/shelterData';

type ResourceType = 'all' | 'shelter' | 'food' | 'community';

type ResourceItem = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  category: Exclude<ResourceType, 'all'>;
  hasChild: boolean;
  hasWheelchair: boolean;
  lat?: number | null;
  lng?: number | null;
  extra?: string | null;
};

const categoryMeta: Record<Exclude<ResourceType, 'all'>, { label: string; eyebrow: string }> = {
  shelter: { label: 'Shelter', eyebrow: 'Rest' },
  food: { label: 'Food', eyebrow: 'Eat' },
  community: { label: 'Community', eyebrow: 'Connect' },
};

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

export default function Home() {
  const [withChild, setWithChild] = useState(false);
  const [wheelchair, setWheelchair] = useState(false);
  const [activeType, setActiveType] = useState<ResourceType>('all');

  const allResources = useMemo<ResourceItem[]>(() => {
    const shelterItems = shelters.map((s) => ({
      id: s.shelter_id,
      name: s.name ?? 'Unknown',
      address: s.city ?? 'Unknown address',
      phone: s.phone ?? null,
      category: 'shelter' as const,
      hasChild: s.childrens_programming === 'onsite',
      hasWheelchair: s.accessibility === 'fully',
      lat: s.lat,
      lng: s.lng,
      extra: s.type ?? null,
    }));

    const foodItems = (foodData as Array<Record<string, string | number | null | undefined>>).map((f, i) => ({
      id: `food-${i}`,
      name: typeof f.program_name === 'string' ? f.program_name : 'Unknown',
      address:
        typeof f.location_address === 'string'
          ? f.location_address
          : typeof f.local_areas === 'string'
            ? f.local_areas
            : 'Unknown address',
      phone: typeof f.signup_phone_number === 'string' ? f.signup_phone_number : null,
      category: 'food' as const,
      hasChild: false,
      hasWheelchair: f.wheelchair_accessible === 'Yes',
      lat: typeof f.latitude === 'number' ? f.latitude : null,
      lng: typeof f.longitude === 'number' ? f.longitude : null,
      extra: typeof f.meal_cost === 'string' ? f.meal_cost : null,
    }));

    const communityItems = communityCentres.map((c, i) => ({
      id: `cc-${i}`,
      name: c.name ?? 'Unknown',
      address: c.address ?? c.area ?? 'Unknown address',
      phone: null,
      category: 'community' as const,
      hasChild: false,
      hasWheelchair: false,
      lat: c.lat,
      lng: c.lng,
      extra: c.area ?? null,
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

        <div className="note-sheet">
          <div className="note-sheet__paper">
            <p className="note-sheet__eyebrow">Resource notebook</p>
            <h1>Safe &amp; Seen</h1>
            <p className="note-sheet__subhead">
              Find shelters, food programs, and community centres in one friendly place.
            </p>
            <div className="note-sheet__stats">
              <span>{allResources.length} total spots</span>
              <span>Vancouver support guide</span>
            </div>
          </div>
          <span className="tape tape-left" aria-hidden="true" />
          <span className="tape tape-right" aria-hidden="true" />
        </div>
      </section>

      <section className="content-shell">
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
              Wheelchair accessible
            </button>
          </div>

          <p className="helper-text">
            Use the filters to narrow the list, then open directions for transit-friendly routing.
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
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
