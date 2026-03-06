'use client';
import React from 'react';
import { Alert } from '@/shared/components';
import { useB2CHomepage, useAddToWishlist } from '../hooks/useB2C';
import type { B2CListing, HomepageSections } from '@/shared/services/b2c.service';

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

const CARD: React.CSSProperties = {
  background: 'var(--cui-card-bg, #fff)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s',
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--cui-body-color)',
  marginBottom: '1rem',
};

interface ListingCardProps {
  listing: B2CListing;
  onWishlist: (id: string) => void;
  wishlisting: boolean;
}

function ListingCard({ listing, onWishlist, wishlisting }: ListingCardProps) {
  return (
    <div style={CARD}>
      {listing.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={listing.coverImageUrl} alt={listing.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: 140, background: 'var(--cui-light, #f3f4f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2rem' }}>✈</span>
        </div>
      )}
      <div style={{ padding: '0.875rem' }}>
        {listing.isFeatured && (
          <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', marginBottom: '0.375rem', display: 'inline-block' }}>
            FEATURED
          </span>
        )}
        <p style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--cui-body-color)', lineHeight: 1.3 }}>{listing.title}</p>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--cui-secondary-color)', lineHeight: 1.3 }}>
          {listing.destinationCountry}{listing.destinationCity ? `, ${listing.destinationCity}` : ''}
          {listing.theme ? ` · ${listing.theme}` : ''}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--cui-primary, #1B4F72)' }}>
              {fmt(listing.sellingPrice, listing.currency)}
            </span>
            {listing.wasPrice && (
              <span style={{ fontSize: '0.75rem', color: 'var(--cui-secondary-color)', textDecoration: 'line-through', marginLeft: '0.375rem' }}>
                {fmt(listing.wasPrice, listing.currency)}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#f59e0b' }}>
            ★ {listing.avgRating.toFixed(1)}
            <span style={{ color: 'var(--cui-secondary-color)' }}>({listing.reviewCount})</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.625rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--cui-secondary-color)' }}>
            {listing.durationDays}D / {listing.durationNights}N · {listing.minPax}–{listing.maxPax} pax
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onWishlist(listing.id); }}
            disabled={wishlisting}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.125rem', padding: '0.125rem', color: '#ef4444' }}
            aria-label="Add to wishlist"
          >
            ♡
          </button>
        </div>
      </div>
    </div>
  );
}

function ListingGrid({ listings, onWishlist, wishlisting }: { listings: B2CListing[]; onWishlist: (id: string) => void; wishlisting: boolean }) {
  if (!listings.length) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
      {listings.map((l) => <ListingCard key={l.id} listing={l} onWishlist={onWishlist} wishlisting={wishlisting} />)}
    </div>
  );
}

export function HomepagePanel() {
  const { data, isLoading, error } = useB2CHomepage();
  const { mutate: addToWishlist, isPending: wishlisting } = useAddToWishlist();

  const handleWishlist = (listingId: string) => addToWishlist({ listingId });

  if (error) return <Alert color="danger">Failed to load homepage.</Alert>;
  if (isLoading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ height: 280, background: 'var(--cui-light, #f3f4f6)', borderRadius: '0.75rem', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  );

  const sections: Array<{ key: keyof HomepageSections; label: string }> = [
    { key: 'featuredDeals',  label: '🔥 Featured Deals' },
    { key: 'recommended',    label: '✨ Recommended for You' },
    { key: 'trending',       label: '📈 Trending Now' },
    { key: 'topRated',       label: '⭐ Top Rated' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {sections.map(({ key, label }) => {
        const listings = data?.[key] as B2CListing[] | undefined;
        if (!listings?.length) return null;
        return (
          <div key={key}>
            <p style={SECTION_TITLE}>{label}</p>
            <ListingGrid listings={listings} onWishlist={handleWishlist} wishlisting={wishlisting} />
          </div>
        );
      })}

      {data?.byTheme && Object.entries(data.byTheme).map(([theme, listings]) => (
        listings.length > 0 && (
          <div key={theme}>
            <p style={SECTION_TITLE}>🏷 {theme}</p>
            <ListingGrid listings={listings as B2CListing[]} onWishlist={handleWishlist} wishlisting={wishlisting} />
          </div>
        )
      ))}
    </div>
  );
}
