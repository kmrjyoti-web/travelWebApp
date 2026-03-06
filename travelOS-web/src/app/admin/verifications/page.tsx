'use client';
/**
 * /admin/verifications — Admin verification dashboard.
 *
 * Lists all pending/under-review/approved user registrations.
 * Admins can Approve, Reject, or request More Info for each entry.
 *
 * Fetches: GET /api/v1/admin/verifications[?status=<status>]
 * Actions:
 *   - Approve:   POST /api/v1/admin/verifications/{id}/approve
 *   - Reject:    POST /api/v1/admin/verifications/{id}/reject
 *   - More Info: POST /api/v1/admin/verifications/{id}/request-info
 *
 * Styling: inline styles + --tos-* CSS tokens. No Tailwind. No @coreui imports.
 * Accessibility: WCAG AA — ARIA roles, labels, keyboard nav.
 * Dark mode: all colours via CSS variables.
 */
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/auth.store';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Verification {
  id: string;
  userId: string;
  userTypeCode: string;
  countryIso2: string;
  taxIdValue?: string;
  status: string;
  submittedAt: string;
  slaDeadline?: string;
  isSlaBreached: boolean;
  assignedTo?: string;
  userName?: string;
  userEmail?: string;
}

type StatusFilter = 'all' | 'pending' | 'under_review' | 'approved' | 'rejected';

interface StatsData {
  pending: number;
  slaBreached: number;
  today: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function getSlaColor(slaDeadline?: string, isSlaBreached?: boolean): string {
  if (isSlaBreached) return '#ef4444'; // red
  if (!slaDeadline) return 'rgba(255,255,255,0.4)';
  const hoursLeft = (new Date(slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursLeft < 6) return '#f59e0b'; // amber
  return '#22c55e'; // green
}

function getStatusBadgeStyle(status: string): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };
  switch (status.toLowerCase()) {
    case 'pending':
      return { ...base, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' };
    case 'under_review':
      return { ...base, background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' };
    case 'approved':
      return { ...base, background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' };
    case 'rejected':
      return { ...base, background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' };
    default:
      return { ...base, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' };
  }
}

// ── Status filter tabs ────────────────────────────────────────────────────────
const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function VerificationsPage() {
  const router = useRouter();
  const authStore = useAuthStore();

  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>({ pending: 0, slaBreached: 0, today: 0 });
  const [confirmDialog, setConfirmDialog] = useState<{
    id: string;
    action: 'approve' | 'reject' | 'request-info';
    userName?: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchVerifications = useCallback(async (filter: StatusFilter) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tos-access-token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const qs = filter !== 'all' ? `?status=${filter}` : '';
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? ''}/admin/verifications${qs}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-product-id': 'travel-os',
          },
        },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as {
        data?: {
          items?: Verification[];
          stats?: StatsData;
        };
      };
      setVerifications(json.data?.items ?? []);
      if (json.data?.stats) {
        setStats(json.data.stats);
      } else {
        // Derive stats from the returned list
        const items = json.data?.items ?? [];
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        setStats({
          pending: items.filter((v) => v.status === 'pending').length,
          slaBreached: items.filter((v) => v.isSlaBreached).length,
          today: items.filter((v) => new Date(v.submittedAt) >= todayStart).length,
        });
      }
    } catch {
      setError('Failed to load verifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchVerifications(statusFilter);
  }, [statusFilter, fetchVerifications]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'request-info') => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tos-access-token') : null;
    if (!token) { router.push('/login'); return; }
    setActionLoading(id);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? ''}/admin/verifications/${id}/${action}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-product-id': 'travel-os',
          },
        },
      );
      // Refresh the list after action
      await fetchVerifications(statusFilter);
    } catch {
      setError(`Action '${action}' failed. Please try again.`);
    } finally {
      setActionLoading(null);
      setConfirmDialog(null);
    }
  };

  const openConfirm = (v: Verification, action: 'approve' | 'reject' | 'request-info') => {
    setConfirmDialog({ id: v.id, action, userName: v.userName ?? v.userEmail ?? v.userId });
  };

  // ── Styles (reusable) ──────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: 'var(--tos-surface, var(--cui-body-bg))',
    border: '1px solid var(--tos-border, var(--cui-border-color))',
    borderRadius: 'var(--tos-radius-md, 8px)',
    padding: '1rem 1.25rem',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '0.625rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
    borderBottom: '1px solid var(--tos-border, var(--cui-border-color))',
    whiteSpace: 'nowrap',
  };

  const tdStyle: React.CSSProperties = {
    padding: '0.75rem',
    fontSize: '0.8125rem',
    color: 'var(--tos-text-primary, var(--cui-body-color))',
    borderBottom: '1px solid var(--tos-border, var(--cui-border-color))',
    verticalAlign: 'middle',
  };

  const actionBtnBase: React.CSSProperties = {
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 4,
    cursor: 'pointer',
    border: '1px solid',
    transition: 'opacity 0.15s',
  };

  return (
    <main
      role="main"
      aria-label="Verifications dashboard"
      style={{
        minHeight: '100vh',
        background: 'var(--tos-bg, var(--cui-body-bg))',
        color: 'var(--tos-text-primary, var(--cui-body-color))',
        padding: '1.5rem',
      }}
    >
      {/* ── Page header ────────────────────────────────────────────────── */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--tos-primary, #1B4F72)',
              margin: 0,
            }}
          >
            Verifications Dashboard
          </h1>
          {authStore.user && (
            <p
              style={{
                margin: '0.25rem 0 0',
                fontSize: '0.8125rem',
                color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
              }}
            >
              Logged in as {authStore.user.name} ({authStore.user.email})
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          aria-label="Back to dashboard"
          style={{
            padding: '0.5rem 1rem',
            background: 'var(--tos-surface, var(--cui-body-bg))',
            border: '1px solid var(--tos-border, var(--cui-border-color))',
            borderRadius: 'var(--tos-radius-sm, 4px)',
            color: 'var(--tos-text-primary, var(--cui-body-color))',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <section
        aria-label="Verification statistics"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          { label: 'Pending', value: stats.pending, color: '#fbbf24' },
          { label: 'SLA Breached', value: stats.slaBreached, color: '#ef4444' },
          { label: 'Today', value: stats.today, color: '#4ade80' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              ...cardStyle,
              textAlign: 'center',
            }}
            aria-label={`${label}: ${value}`}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color }}>{value}</div>
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
                marginTop: 4,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* ── Status filter tabs ──────────────────────────────────────────── */}
      <nav
        aria-label="Filter verifications by status"
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {STATUS_TABS.map(({ value, label }) => {
          const isActive = statusFilter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              aria-pressed={isActive}
              aria-label={`Show ${label} verifications`}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: 20,
                border: '1px solid',
                borderColor: isActive
                  ? 'var(--tos-primary, #1B4F72)'
                  : 'var(--tos-border, var(--cui-border-color))',
                background: isActive ? 'var(--tos-primary, #1B4F72)' : 'transparent',
                color: isActive
                  ? '#ffffff'
                  : 'var(--tos-text-secondary, var(--cui-secondary-color))',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          style={{
            padding: '0.75rem 1rem',
            background: 'var(--tos-danger-subtle, rgba(220,53,69,0.08))',
            border: '1px solid var(--tos-danger, var(--cui-danger))',
            borderRadius: 'var(--tos-radius-md, 8px)',
            color: 'var(--tos-danger, var(--cui-danger))',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div
        style={{
          ...cardStyle,
          padding: 0,
          overflowX: 'auto',
        }}
      >
        {loading ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
            }}
          >
            Loading verifications…
          </div>
        ) : verifications.length === 0 ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
            }}
          >
            No verifications found for the selected filter.
          </div>
        ) : (
          <table
            aria-label="Verifications list"
            style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}
          >
            <thead>
              <tr>
                <th scope="col" style={thStyle}>Name / Email</th>
                <th scope="col" style={thStyle}>Type</th>
                <th scope="col" style={thStyle}>Country</th>
                <th scope="col" style={thStyle}>Tax ID</th>
                <th scope="col" style={thStyle}>Submitted</th>
                <th scope="col" style={thStyle}>SLA</th>
                <th scope="col" style={thStyle}>Status</th>
                <th scope="col" style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((v) => (
                <tr
                  key={v.id}
                  style={{
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                      'var(--tos-surface-alt, var(--cui-tertiary-bg))';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {v.userName ?? '—'}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
                      }}
                    >
                      {v.userEmail ?? v.userId}
                    </div>
                  </td>
                  <td style={tdStyle}>{v.userTypeCode}</td>
                  <td style={tdStyle}>{v.countryIso2}</td>
                  <td style={tdStyle}>
                    {v.taxIdValue ? (
                      <code
                        style={{
                          fontSize: '0.75rem',
                          padding: '1px 6px',
                          background: 'var(--tos-surface-alt, var(--cui-tertiary-bg))',
                          borderRadius: 4,
                        }}
                      >
                        {v.taxIdValue}
                      </code>
                    ) : (
                      <span style={{ color: 'var(--tos-text-secondary, var(--cui-secondary-color))' }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>{formatDate(v.submittedAt)}</td>
                  <td style={{ ...tdStyle }}>
                    <span
                      aria-label={
                        v.isSlaBreached
                          ? 'SLA breached'
                          : v.slaDeadline
                          ? `SLA deadline: ${formatDate(v.slaDeadline)}`
                          : 'No SLA set'
                      }
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: getSlaColor(v.slaDeadline, v.isSlaBreached),
                        marginRight: 6,
                        verticalAlign: 'middle',
                      }}
                    />
                    {v.slaDeadline ? formatDate(v.slaDeadline) : '—'}
                  </td>
                  <td style={tdStyle}>
                    <span style={getStatusBadgeStyle(v.status)}>{v.status.replace('_', ' ')}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {v.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => openConfirm(v, 'approve')}
                          disabled={actionLoading === v.id}
                          aria-label={`Approve ${v.userName ?? v.userId}`}
                          style={{
                            ...actionBtnBase,
                            background: 'rgba(34,197,94,0.1)',
                            borderColor: 'rgba(34,197,94,0.4)',
                            color: '#4ade80',
                            opacity: actionLoading === v.id ? 0.5 : 1,
                          }}
                        >
                          Approve
                        </button>
                      )}
                      {v.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => openConfirm(v, 'reject')}
                          disabled={actionLoading === v.id}
                          aria-label={`Reject ${v.userName ?? v.userId}`}
                          style={{
                            ...actionBtnBase,
                            background: 'rgba(239,68,68,0.1)',
                            borderColor: 'rgba(239,68,68,0.4)',
                            color: '#fca5a5',
                            opacity: actionLoading === v.id ? 0.5 : 1,
                          }}
                        >
                          Reject
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openConfirm(v, 'request-info')}
                        disabled={actionLoading === v.id}
                        aria-label={`Request more info from ${v.userName ?? v.userId}`}
                        style={{
                          ...actionBtnBase,
                          background: 'rgba(59,130,246,0.1)',
                          borderColor: 'rgba(59,130,246,0.4)',
                          color: '#93c5fd',
                          opacity: actionLoading === v.id ? 0.5 : 1,
                        }}
                      >
                        More Info
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Confirm dialog ─────────────────────────────────────────────── */}
      {confirmDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDialog(null);
          }}
        >
          <div
            style={{
              background: 'var(--tos-surface, var(--cui-body-bg))',
              border: '1px solid var(--tos-border, var(--cui-border-color))',
              borderRadius: 'var(--tos-radius-md, 8px)',
              padding: '1.5rem',
              maxWidth: 420,
              width: '100%',
            }}
          >
            <h2
              id="confirm-dialog-title"
              style={{
                margin: '0 0 0.75rem',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--tos-text-primary, var(--cui-body-color))',
                textTransform: 'capitalize',
              }}
            >
              Confirm: {confirmDialog.action.replace('-', ' ')}
            </h2>
            <p
              style={{
                margin: '0 0 1.25rem',
                fontSize: '0.9375rem',
                color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to{' '}
              <strong style={{ color: 'var(--tos-text-primary, var(--cui-body-color))' }}>
                {confirmDialog.action.replace('-', ' ')}
              </strong>{' '}
              the verification for{' '}
              <strong style={{ color: 'var(--tos-text-primary, var(--cui-body-color))' }}>
                {confirmDialog.userName}
              </strong>
              ?
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  border: '1px solid var(--tos-border, var(--cui-border-color))',
                  borderRadius: 4,
                  color: 'var(--tos-text-secondary, var(--cui-secondary-color))',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleAction(confirmDialog.id, confirmDialog.action)}
                aria-busy={actionLoading === confirmDialog.id}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--tos-primary, #1B4F72)',
                  border: 'none',
                  borderRadius: 4,
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {actionLoading === confirmDialog.id
                  ? 'Processing…'
                  : `Confirm ${confirmDialog.action.replace('-', ' ')}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
