'use client';
import React, { useState } from 'react';
import { Alert } from '@/shared/components';
import { useB2CWishlist, useRemoveFromWishlist, useB2CListing } from '../hooks/useB2C';

function WishlistCard({ id, listingId, onRemove, removing }: { id: string; listingId: string; onRemove: (id: string) => void; removing: boolean }) {
  const { data: listing, isLoading } = useB2CListing(listingId);

  return (
    <div style={{
      display: 'flex', gap: '1rem', alignItems: 'flex-start',
      background: 'var(--cui-card-bg, #fff)',
      border: '1px solid var(--cui-border-color, #e5e7eb)',
      borderRadius: '0.75rem',
      padding: '1rem',
    }}>
      <div style={{
        width: 80, height: 60, borderRadius: '0.5rem',
        background: 'var(--cui-light, #f3f4f6)',
        flexShrink: 0, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {listing?.coverImageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={listing.coverImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '1.5rem' }}>✈</span>}
      </div>
      <div style={{ flex: 1 }}>
        {isLoading ? (
          <div style={{ height: 16, background: 'var(--cui-light)', borderRadius: 4, width: '60%', marginBottom: 8 }} />
        ) : (
          <>
            <p style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--cui-body-color)' }}>
              {listing?.title ?? 'Unknown Listing'}
            </p>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'var(--cui-secondary-color)' }}>
              {listing?.destinationCountry}{listing?.destinationCity ? `, ${listing.destinationCity}` : ''}
              {listing?.durationDays ? ` · ${listing.durationDays}D/${listing.durationNights}N` : ''}
            </p>
            {listing && (
              <p style={{ margin: 0, fontWeight: 800, fontSize: '0.875rem', color: 'var(--cui-primary, #1B4F72)' }}>
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: listing.currency, maximumFractionDigits: 0 }).format(listing.sellingPrice)}
              </p>
            )}
          </>
        )}
      </div>
      <button
        onClick={() => onRemove(id)}
        disabled={removing}
        style={{
          background: 'none', border: '1px solid #fee2e2', borderRadius: '0.375rem',
          color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
          padding: '0.25rem 0.5rem', flexShrink: 0,
        }}
        aria-label="Remove from wishlist"
      >
        {removing ? '…' : '✕'}
      </button>
    </div>
  );
}

export function WishlistPanel() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useB2CWishlist(page);
  const { mutate: remove, isPending: removing } = useRemoveFromWishlist({ onSuccess: () => refetch() });

  if (error) return <Alert color="danger">Failed to load wishlist.</Alert>;

  const items = data?.items ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: 80, background: 'var(--cui-light)', borderRadius: '0.75rem' }} />
        ))
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--cui-secondary-color)' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>♡</p>
          <p style={{ fontWeight: 600 }}>Your wishlist is empty</p>
          <p style={{ fontSize: '0.875rem' }}>Search packages and save your favourites here.</p>
        </div>
      ) : (
        items.map((item) => (
          <WishlistCard
            key={item.id}
            id={item.id}
            listingId={item.listingId}
            onRemove={remove}
            removing={removing}
          />
        ))
      )}

      {(data?.total ?? 0) > (data?.limit ?? 20) && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
            style={{ padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--cui-border-color)', cursor: 'pointer', background: 'transparent' }}>
            ‹ Prev
          </button>
          <span style={{ alignSelf: 'center', fontSize: '0.875rem', color: 'var(--cui-secondary-color)' }}>
            Page {data?.page} / {Math.ceil((data?.total ?? 0) / (data?.limit ?? 20))}
          </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={(data?.page ?? 1) * (data?.limit ?? 20) >= (data?.total ?? 0)}
            style={{ padding: '0.25rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--cui-border-color)', cursor: 'pointer', background: 'transparent' }}>
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
