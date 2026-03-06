'use client';
/**
 * /admin/verifications — Admin verification dashboard.
 * Fetches GET /api/v1/admin/verifications[?status=<status>]
 * Actions: approve | reject | request-info per verification.
 */
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/shared/services/api';
import {
  PageHeader,
  StatCard,
  DataTable,
  ColorBadge,
  Alert,
  Button,
  useConfirmDialog,
} from '@/shared/components';
import type { DataTableColumn } from '@/shared/components';
import { Tabs, TabItem, TabLink, TabContent, TabPane } from '@/shared/components';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Verification extends Record<string, unknown> {
  id: string;
  userId: string;
  userTypeCode: string;
  countryIso2: string;
  taxIdValue?: string;
  status: string;
  submittedAt: string;
  slaDeadline?: string;
  isSlaBreached: boolean;
  userName?: string;
  userEmail?: string;
}

type StatusFilter = 'all' | 'pending' | 'under_review' | 'approved' | 'rejected';

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all',          label: 'All'          },
  { value: 'pending',      label: 'Pending'      },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved',     label: 'Approved'     },
  { value: 'rejected',     label: 'Rejected'     },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(d: string) {
  try { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d)); }
  catch { return d; }
}

function SlaCell({ slaDeadline, isSlaBreached }: { slaDeadline?: string; isSlaBreached: boolean }) {
  const color = isSlaBreached ? '#ef4444'
    : !slaDeadline ? '#9ca3af'
    : (new Date(slaDeadline).getTime() - Date.now()) / 3_600_000 < 6 ? '#f59e0b'
    : '#22c55e';
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
      {slaDeadline ? fmtDate(slaDeadline) : '—'}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function VerificationsPage() {
  const router = useRouter();
  const { confirm, ConfirmDialogPortal } = useConfirmDialog();

  const [rows, setRows]               = useState<Verification[]>([]);
  const [statusFilter, setFilter]     = useState<StatusFilter>('all');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [actionLoading, setActLoading]= useState<string | null>(null);
  const [stats, setStats]             = useState({ pending: 0, slaBreached: 0, today: 0 });

  const fetchVerifications = useCallback(async (filter: StatusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const qs = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await api.get<{ data: { items: Verification[]; stats?: typeof stats } }>(
        `/admin/verifications${qs}`,
      );
      const items = data.data?.items ?? [];
      setRows(items);
      if (data.data?.stats) {
        setStats(data.data.stats);
      } else {
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        setStats({
          pending:    items.filter((v: Verification) => v.status === 'pending').length,
          slaBreached:items.filter((v: Verification) => v.isSlaBreached).length,
          today:      items.filter((v: Verification) => new Date(v.submittedAt) >= todayStart).length,
        });
      }
    } catch {
      setError('Failed to load verifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchVerifications(statusFilter); }, [statusFilter, fetchVerifications]);

  const doAction = async (id: string, action: 'approve' | 'reject' | 'request-info') => {
    setActLoading(id);
    try {
      await api.post(`/admin/verifications/${id}/${action}`);
      await fetchVerifications(statusFilter);
    } catch {
      setError(`Action '${action}' failed.`);
    } finally {
      setActLoading(null);
    }
  };

  const handleAction = async (v: Verification, action: 'approve' | 'reject' | 'request-info') => {
    const label = v.userName ?? v.userEmail ?? v.userId;
    const type  = action === 'approve' ? 'success' : action === 'reject' ? 'danger' : 'info';
    const ok = await confirm({
      type,
      title: `Confirm: ${action.replace('-', ' ')}`,
      message: `Are you sure you want to ${action.replace('-', ' ')} the verification for ${label}?`,
      confirmText: action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Send Request',
    });
    if (ok) await doAction(v.id, action);
  };

  const columns: DataTableColumn<Verification>[] = [
    {
      key: 'userName', label: 'Name / Email',
      render: (_, v) => (
        <span>
          <div style={{ fontWeight: 600 }}>{v.userName ?? '—'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--tos-secondary, #6b7280)' }}>{v.userEmail ?? v.userId}</div>
        </span>
      ),
    },
    { key: 'userTypeCode', label: 'Type' },
    { key: 'countryIso2',  label: 'Country', align: 'center' },
    {
      key: 'taxIdValue', label: 'Tax ID',
      render: (val) => val ? <code style={{ fontSize: '0.75rem', padding: '1px 6px', background: 'var(--tos-secondary-bg)', borderRadius: 4 }}>{String(val)}</code> : <span style={{ color: 'var(--tos-secondary)' }}>—</span>,
    },
    { key: 'submittedAt', label: 'Submitted', render: (val) => fmtDate(String(val)) },
    {
      key: 'slaDeadline', label: 'SLA',
      render: (_, v) => <SlaCell slaDeadline={v.slaDeadline} isSlaBreached={v.isSlaBreached} />,
    },
    {
      key: 'status', label: 'Status',
      render: (val) => <ColorBadge value={String(val)} />,
    },
  ];

  return (
    <main style={{ padding: '1.5rem' }}>
      <PageHeader
        title="Verifications Dashboard"
        actions={<Button color="secondary" variant="outline" leftIcon="ArrowLeft" onClick={() => router.push('/dashboard')}>Dashboard</Button>}
        className="mb-4"
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="Pending"     value={stats.pending}     icon="Clock"         iconColor="#f59e0b" />
        <StatCard title="SLA Breached" value={stats.slaBreached} icon="TriangleAlert" iconColor="#ef4444" />
        <StatCard title="Today"       value={stats.today}       icon="CalendarDays"  iconColor="#22c55e" />
      </div>

      {/* Status tabs */}
      <Tabs className="mb-3">
        {STATUS_TABS.map(tab => (
          <TabItem key={tab.value}>
            <TabLink active={statusFilter === tab.value} onClick={() => setFilter(tab.value)}>
              {tab.label}
            </TabLink>
          </TabItem>
        ))}
      </Tabs>

      {error && <Alert color="danger" className="mb-3">{error}</Alert>}

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        emptyTitle="No verifications found"
        emptyDescription="Try selecting a different status filter."
        rowActions={(v) => [
          ...(v.status !== 'approved' ? [{ label: 'Approve', icon: 'CircleCheck' as const, onClick: () => void handleAction(v, 'approve') }] : []),
          ...(v.status !== 'rejected' ? [{ label: 'Reject',  icon: 'CircleX'    as const, onClick: () => void handleAction(v, 'reject'),  variant: 'danger' as const }] : []),
          { label: 'More Info', icon: 'MessageSquare' as const, onClick: () => void handleAction(v, 'request-info') },
        ]}
      />

      <ConfirmDialogPortal />
    </main>
  );
}
