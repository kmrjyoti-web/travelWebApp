import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--tos-body-bg)',
        color: 'var(--tos-text-primary)',
      }}
    >
      <h1 style={{ fontSize: 72, fontWeight: 800, color: 'var(--tos-accent)', lineHeight: 1 }}>
        404
      </h1>
      <p style={{ fontSize: 18, color: 'var(--tos-text-secondary)' }}>Page not found</p>
      <Link
        href="/dashboard"
        style={{
          padding: '10px 24px',
          background: 'var(--tos-accent)',
          color: '#fff',
          borderRadius: 'var(--tos-border-radius)',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
