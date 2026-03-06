'use client';
import React, { useState } from 'react';
import { Alert, Button } from '@/shared/components';
import { useB2CListings, useAddToWishlist } from '../hooks/useB2C';
import type { B2CListingSortBy, SearchListingsParams } from '@/shared/services/b2c.service';

const SORT_OPTIONS: { label: string; value: B2CListingSortBy }[] = [
  { label: 'AI Recommended', value: 'ai_recommended' },
  { label: 'Price: Low → High', value: 'price_low' },
  { label: 'Price: High → Low', value: 'price_high' },
  { label: 'Most Reviewed',     value: 'most_reviewed' },
  { label: 'Highest Rated',     value: 'highest_rated' },
  { label: 'Newest',            value: 'newest' },
];

const FIELD: React.CSSProperties = {
  padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
  border: '1px solid var(--cui-border-color, #d1d5db)',
  fontSize: '0.875rem', color: 'var(--cui-body-color)',
  background: 'var(--cui-body-bg, #fff)',
};

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

export function SearchPanel() {
  const [filters, setFilters] = useState<SearchListingsParams>({ sortBy: 'ai_recommended', page: 1 });
  const [draft,   setDraft]   = useState<SearchListingsParams>({});

  const { data, isLoading, error } = useB2CListings(filters);
  const { mutate: addToWishlist, isPending: wishlisting } = useAddToWishlist();

  const setDraftField = <K extends keyof SearchListingsParams>(k: K, v: SearchListingsParams[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const applySearch = () => setFilters({ ...draft, sortBy: filters.sortBy, page: 1 });
  const clearSearch = () => { setDraft({}); setFilters({ sortBy: 'ai_recommended', page: 1 }); };

  if (error) return <Alert color="danger">Failed to search listings.</Alert>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search form */}
      <div style={{
        background: 'var(--cui-card-bg, #fff)',
        border: '1px solid var(--cui-border-color)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end',
      }}>
        <div style={{ flex: '1 1 160px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cui-secondary-color)', marginBottom: '0.25rem' }}>Country</label>
          <input style={{ ...FIELD, width: '100%', boxSizing: 'border-box' }} placeholder="India, Thailand…" value={draft.destinationCountry ?? ''} onChange={(e) => setDraftField('destinationCountry', e.target.value || undefined)} />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cui-secondary-color)', marginBottom: '0.25rem' }}>City</label>
          <input style={{ ...FIELD, width: '100%', boxSizing: 'border-box' }} placeholder="Goa, Bali…" value={draft.destinationCity ?? ''} onChange={(e) => setDraftField('destinationCity', e.target.value || undefined)} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cui-secondary-color)', marginBottom: '0.25rem' }}>Theme</label>
          <input style={{ ...FIELD, width: '100%', boxSizing: 'border-box' }} placeholder="Adventure…" value={draft.theme ?? ''} onChange={(e) => setDraftField('theme', e.target.value || undefined)} />
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cui-secondary-color)', marginBottom: '0.25rem' }}>Budget Min</label>
          <input type="number" style={{ ...FIELD, width: '100%', boxSizing: 'border-box' }} value={draft.budgetMin ?? ''} onChange={(e) => setDraftField('budgetMin', e.target.value ? Number(e.target.value) : undefined)} />
        </div>
        <div style={{ flex: '1 1 100px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cui-secondary-color)', marginBottom: '0.25rem' }}>Budget Max</label>
          <input type="number" style={{ ...FIELD, width: '100%', boxSizing: 'border-box' }} value={draft.budgetMax ?? ''} onChange={(e) => setDraftField('budgetMax', e.target.value ? Number(e.target.value) : undefined)} />
        </div>
        <div style={{ flex: '1 1 80px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cui-secondary-color)', marginBottom: '0.25rem' }}>Pax</label>
          <input type="number" min={1} style={{ ...FIELD, width: '100%', boxSizing: 'border-box' }} value={draft.paxCount ?? ''} onChange={(e) => setDraftField('paxCount', e.target.value ? Number(e.target.value) : undefined)} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button color="primary" onClick={applySearch}>Search</Button>
          <Button color="secondary" onClick={clearSearch}>Clear</Button>
        </div>
      </div>

      {/* Sort + results count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--cui-secondary-color)', flex: 1 }}>
          {isLoading ? 'Searching…' : `${data?.total ?? 0} packages found`}
        </span>
        <select
          style={{ ...FIELD, minWidth: 160 }}
          value={filters.sortBy ?? 'ai_recommended'}
          onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as B2CListingSortBy, page: 1 }))}
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Results grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 260, background: 'var(--cui-light, #f3f4f6)', borderRadius: '0.75rem' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {(data?.items ?? []).map((listing) => (
            <div key={listing.id} style={{
              background: 'var(--cui-card-bg, #fff)',
              border: '1px solid var(--cui-border-color)',
              borderRadius: '0.75rem',
              overflow: 'hidden',
            }}>
              <div style={{ height: 120, background: 'var(--cui-light, #f3f4f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {listing.coverImageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={listing.coverImageUrl} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '2rem' }}>✈</span>}
              </div>
              <div style={{ padding: '0.875rem' }}>
                <p style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--cui-body-color)', lineHeight: 1.3 }}>{listing.title}</p>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--cui-secondary-color)' }}>
                  {listing.destinationCountry}{listing.destinationCity ? `, ${listing.destinationCity}` : ''}
                  · {listing.durationDays}D/{listing.durationNights}N
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--cui-primary, #1B4F72)' }}>
                    {fmt(listing.sellingPrice, listing.currency)}
                  </span>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>★ {listing.avgRating.toFixed(1)}</span>
                    <button
                      onClick={() => addToWishlist({ listingId: listing.id })}
                      disabled={wishlisting}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1rem', padding: 0 }}
                      aria-label="Wishlist"
                    >♡</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {(data?.total ?? 0) > (data?.limit ?? 20) && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))}
            disabled={(filters.page ?? 1) <= 1}
            style={{ padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--cui-border-color)', cursor: 'pointer', background: 'transparent' }}
          >‹ Prev</button>
          <span style={{ alignSelf: 'center', fontSize: '0.875rem', color: 'var(--cui-secondary-color)' }}>
            Page {data?.page} / {Math.ceil((data?.total ?? 0) / (data?.limit ?? 20))}
          </span>
          <button
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            disabled={(data?.page ?? 1) * (data?.limit ?? 20) >= (data?.total ?? 0)}
            style={{ padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--cui-border-color)', cursor: 'pointer', background: 'transparent' }}
          >Next ›</button>
        </div>
      )}
    </div>
  );
}
