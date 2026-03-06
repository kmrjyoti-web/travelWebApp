'use client';
import React, { useState, useCallback } from 'react';
import {
  DataTable,
  SearchInput,
  ColorBadge,
  Button,
  useConfirmDialog,
  Alert,
} from '@/shared/components';
import type { DataTableColumn } from '@/shared/components';
import { useItineraries, useDeleteItinerary } from '../hooks/useItineraries';
import type { ItineraryRecord } from '@/shared/services/itinerary.service';

type ItineraryRow = ItineraryRecord & Record<string, unknown>;

const STATUS_FILTERS = [
  { label: 'All',       value: '' },
  { label: 'Draft',     value: 'draft' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const PAGE_SIZE = 20;

function fmtDate(d: string) {
  try { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(d)); }
  catch { return d; }
}

interface ItineraryListPanelProps {
  /** Open editor in edit mode for a given ID */
  onEdit: (id: string) => void;
  /** Open editor to create a new manual itinerary */
  onCreate: () => void;
}

export function ItineraryListPanel({ onEdit, onCreate }: ItineraryListPanelProps) {
  const { confirm, ConfirmDialogPortal } = useConfirmDialog();
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError]   = useState<string | null>(null);

  const { data: resp, isLoading } = useItineraries({
    page,
    limit: PAGE_SIZE,
    search:  search  || undefined,
    status:  status  || undefined,
  });

  const deleteMutation = useDeleteItinerary();

  const handleDelete = useCallback(async (row: ItineraryRow) => {
    const label = (row.title as string | null) ?? `${row.from as string} → ${row.to as string}`;
    const ok = await confirm({
      type: 'danger',
      title: 'Delete Itinerary',
      message: `Are you sure you want to delete "${label}"? This cannot be undone.`,
      confirmText: 'Delete',
    });
    if (ok) {
      try {
        await deleteMutation.mutateAsync(row.id as string);
        setError(null);
      } catch {
        setError('Failed to delete itinerary.');
      }
    }
  }, [confirm, deleteMutation]);

  const rows = (resp ?? []) as ItineraryRow[];

  const columns: DataTableColumn<ItineraryRow>[] = [
    {
      key: 'title',
      label: 'Destination',
      render: (_, row) => (
        <span>
          <div style={{ fontWeight: 600 }}>
            {(row.title as string | null) ?? `${row.from as string} → ${row.to as string}`}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--tos-secondary, #6b7280)' }}>
            {row.from as string} → {row.to as string}
          </div>
        </span>
      ),
    },
    {
      key: 'startDate',
      label: 'Dates',
      render: (_, row) => (
        <span style={{ fontSize: '0.8125rem' }}>
          {fmtDate(row.startDate as string)} – {fmtDate(row.endDate as string)}
          <span style={{ marginLeft: '0.4rem', color: 'var(--tos-secondary, #6b7280)' }}>
            ({row.days as number}d)
          </span>
        </span>
      ),
    },
    { key: 'budget', label: 'Budget' },
    {
      key: 'source',
      label: 'Type',
      render: (val) => <ColorBadge value={String(val)} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <ColorBadge value={String(val)} />,
    },
  ];

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', maxWidth: 320 }}>
          <SearchInput
            placeholder="Search itineraries…"
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatus(f.value); setPage(1); }}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                background:   status === f.value ? 'var(--cui-primary, #1B4F72)' : 'transparent',
                color:        status === f.value ? '#fff' : 'var(--cui-body-color, #374151)',
                borderColor:  status === f.value ? 'var(--cui-primary, #1B4F72)' : 'var(--cui-border-color, #d1d5db)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Button color="primary" leftIcon="Plus" onClick={onCreate} style={{ marginLeft: 'auto' }}>
          New Itinerary
        </Button>
      </div>

      {error && <Alert color="danger" className="mb-3">{error}</Alert>}

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        emptyTitle="No itineraries yet"
        emptyDescription="Create your first itinerary or adjust your filters."
        rowActions={(row) => [
          { label: 'Edit',   icon: 'Pencil' as const, onClick: () => onEdit(row.id as string) },
          { label: 'Delete', icon: 'Trash2' as const, onClick: () => void handleDelete(row), variant: 'danger' as const },
        ]}
      />

      <ConfirmDialogPortal />
    </div>
  );
}
