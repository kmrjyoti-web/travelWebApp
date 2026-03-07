'use client';
import React from 'react';
import { Button, TextField, SelectField, TextareaField, Checkbox } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { usePublishStore } from '../stores/publishStore';
import type { PriceTier, PriceType, PriceChannel, ChannelPrice } from '../types/publish.types';

const CHANNELS: { id: PriceChannel; label: string; icon: string; color: string }[] = [
  { id: 'web',         label: 'Web',         icon: 'Globe',        color: '#3b82f6' },
  { id: 'mobile',      label: 'Mobile',      icon: 'Smartphone',   color: '#8b5cf6' },
  { id: 'api',         label: 'API',         icon: 'Code2',        color: '#6b7280' },
  { id: 'b2b',         label: 'B2B Portal',  icon: 'Building2',    color: '#059669' },
  { id: 'b2c',         label: 'B2C',         icon: 'Users',        color: '#f59e0b' },
  { id: 'marketplace', label: 'Marketplace', icon: 'ShoppingBag',  color: '#ec4899' },
  { id: 'custom',      label: 'Custom',      icon: 'Settings2',    color: '#64748b' },
];

const PRICE_TYPES: { value: PriceType; label: string }[] = [
  { value: 'per_person', label: 'Per Person' },
  { value: 'per_couple', label: 'Per Couple' },
  { value: 'per_group', label: 'Per Group' },
  { value: 'per_night', label: 'Per Night' },
  { value: 'total', label: 'Total Package' },
];
const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AED', 'SGD', 'THB', 'JPY'];

const newTier = (): PriceTier => ({
  id: `tier_${Date.now()}`, label: 'Standard', priceType: 'per_person',
  sellingPrice: 0, wasPrice: 0, currency: 'USD', minPax: 1, maxPax: 20, description: '',
});

export function SectionPriceReference() {
  const pr     = usePublishStore((s) => s.data.priceReference);
  const update = usePublishStore((s) => s.updateSection);

  const addTier    = () => update('priceReference', { ...pr, tiers: [...pr.tiers, newTier()] });
  const updateTier = (i: number, t: PriceTier) => update('priceReference', { ...pr, tiers: pr.tiers.map((x, j) => j === i ? t : x) });
  const removeTier = (i: number) => update('priceReference', { ...pr, tiers: pr.tiers.filter((_, j) => j !== i) });

  const fmt = (n: number, cur: string) => n > 0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n) : '—';

  return (
    <div>
      {/* Price Tiers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Price Tiers ({pr.tiers.length})</span>
        <Button color="primary" size="sm" onClick={addTier}><Icon name="Plus" size={14} /> Add Tier</Button>
      </div>

      {pr.tiers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--cui-secondary-color)', border: '2px dashed var(--cui-border-color)', borderRadius: 8, marginBottom: '1rem' }}>
          Add pricing tiers (e.g. Standard, Deluxe, Group rate, Peak/Off-Peak)
        </div>
      )}

      {pr.tiers.map((tier, i) => (
        <div key={tier.id} style={{ border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '0.875rem', marginBottom: '0.5rem', background: 'var(--cui-card-bg, #fff)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
              <div style={{ flex: '0 0 150px' }}>
                <TextField label="Tier Name" variant="outlined" size="sm" startIcon="Tag" value={tier.label} onChange={(e) => updateTier(i, { ...tier, label: e.target.value })} />
              </div>
              <div style={{ flex: '0 0 150px' }}>
                <SelectField label="Price Type" variant="outlined" size="sm" value={tier.priceType} onChange={(e) => updateTier(i, { ...tier, priceType: e.target.value as PriceType })}>
                  {PRICE_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </SelectField>
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cui-primary)', flex: 1, textAlign: 'right' }}>
                {fmt(tier.sellingPrice, tier.currency)}
                {tier.wasPrice > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 400, textDecoration: 'line-through', color: 'var(--cui-secondary-color)', marginLeft: 8 }}>{fmt(tier.wasPrice, tier.currency)}</span>}
              </span>
            </div>
            <button type="button" onClick={() => removeTier(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', marginLeft: 8 }}><Icon name="Trash2" size={16} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 8 }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <TextField label="Selling Price" variant="outlined" size="sm" type="number" startIcon="DollarSign" min={0} value={tier.sellingPrice || ''} onChange={(e) => updateTier(i, { ...tier, sellingPrice: +e.target.value })} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <TextField label="Was Price" variant="outlined" size="sm" type="number" startIcon="DollarSign" min={0} value={tier.wasPrice || ''} onChange={(e) => updateTier(i, { ...tier, wasPrice: +e.target.value })} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <SelectField label="Currency" variant="outlined" size="sm" value={tier.currency} onChange={(e) => updateTier(i, { ...tier, currency: e.target.value })}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </SelectField>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <TextField label="Min Pax" variant="outlined" size="sm" type="number" min={1} value={tier.minPax} onChange={(e) => updateTier(i, { ...tier, minPax: +e.target.value })} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <TextField label="Max Pax" variant="outlined" size="sm" type="number" min={1} value={tier.maxPax} onChange={(e) => updateTier(i, { ...tier, maxPax: +e.target.value })} />
            </div>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Description" variant="outlined" size="sm" startIcon="FileText" value={tier.description} onChange={(e) => updateTier(i, { ...tier, description: e.target.value })} />
          </div>
        </div>
      ))}

      {/* ── Channel Pricing Table ── */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: '1rem', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="LayoutGrid" size={15} style={{ color: '#4f46e5' }} />
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>Price by Distribution Channel</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '0.6rem 0.875rem', textAlign: 'left', fontWeight: 700, color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb', width: 150 }}>Channel</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: 700, color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb', width: 60 }}>Active</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb' }}>Sale Price</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb' }}>Discount Price</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb' }}>Budget Min</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb' }}>Budget Max</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb', width: 90 }}>Currency</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb' }}>Tax %</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', fontWeight: 700, color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb' }}>Max Discount %</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((ch, idx) => {
                const row: ChannelPrice = pr.channelPricing[ch.id];
                const setRow = (p: Partial<ChannelPrice>) =>
                  update('priceReference', { ...pr, channelPricing: { ...pr.channelPricing, [ch.id]: { ...row, ...p } } });
                return (
                  <tr key={ch.id} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa', opacity: row.enabled ? 1 : 0.45 }}>
                    {/* Channel label */}
                    <td style={{ padding: '0.5rem 0.875rem', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 28, height: 28, borderRadius: 6, background: ch.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon name={ch.icon as 'Globe'} size={13} style={{ color: ch.color }} />
                        </span>
                        <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.82rem' }}>{ch.label}</span>
                      </div>
                    </td>
                    {/* Toggle */}
                    <td style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                      <div onClick={() => setRow({ enabled: !row.enabled })} style={{
                        width: 36, height: 20, borderRadius: 10, cursor: 'pointer', margin: '0 auto',
                        background: row.enabled ? '#4f46e5' : '#d1d5db', position: 'relative', transition: 'background 0.2s',
                      }}>
                        <div style={{ position: 'absolute', top: 2, left: row.enabled ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </div>
                    </td>
                    {/* Sale Price */}
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                      <TextField type="number" size="sm" variant="outlined" placeholder="0.00" min={0} value={row.salePrice || ''} disabled={!row.enabled} onChange={(e) => setRow({ salePrice: +e.target.value })} />
                    </td>
                    {/* Discount Price */}
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                      <TextField type="number" size="sm" variant="outlined" placeholder="0.00" min={0} value={row.discountPrice || ''} disabled={!row.enabled} onChange={(e) => setRow({ discountPrice: +e.target.value })} />
                    </td>
                    {/* Budget Min */}
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                      <TextField type="number" size="sm" variant="outlined" placeholder="0" min={0} value={row.budgetMin || ''} disabled={!row.enabled} onChange={(e) => setRow({ budgetMin: +e.target.value })} />
                    </td>
                    {/* Budget Max */}
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                      <TextField type="number" size="sm" variant="outlined" placeholder="0" min={0} value={row.budgetMax || ''} disabled={!row.enabled} onChange={(e) => setRow({ budgetMax: +e.target.value })} />
                    </td>
                    {/* Base Currency */}
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                      <SelectField size="sm" variant="outlined" value={row.baseCurrency} disabled={!row.enabled} onChange={(e) => setRow({ baseCurrency: e.target.value })}>
                        {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </SelectField>
                    </td>
                    {/* Tax */}
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                      <TextField type="number" size="sm" variant="outlined" placeholder="0" min={0} max={100} endIcon="Percent" value={row.tax || ''} disabled={!row.enabled} onChange={(e) => setRow({ tax: +e.target.value })} />
                    </td>
                    {/* Max Discount */}
                    <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #f0f0f0' }}>
                      <TextField type="number" size="sm" variant="outlined" placeholder="0" min={0} max={100} endIcon="Percent" value={row.maxDiscount || ''} disabled={!row.enabled} onChange={(e) => setRow({ maxDiscount: +e.target.value })} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Price Settings */}
      <div style={{ background: 'var(--cui-card-bg, #fff)', border: '1px solid var(--cui-border-color)', borderRadius: 8, padding: '1rem', marginTop: '1rem' }}>
        <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Pricing Rules</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Markup %" variant="outlined" size="sm" type="number" min={0} max={100} value={pr.markup} onChange={(e) => update('priceReference', { ...pr, markup: +e.target.value })} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <TextField label="Tax %" variant="outlined" size="sm" type="number" min={0} max={100} value={pr.taxPercentage} onChange={(e) => update('priceReference', { ...pr, taxPercentage: +e.target.value })} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'flex-end' }}>
            <Checkbox label="Show Markup to Customer" checked={pr.showMarkup} onChange={(e) => update('priceReference', { ...pr, showMarkup: e.target.checked })} />
            <Checkbox label="Tax Inclusive" checked={pr.taxInclusive} onChange={(e) => update('priceReference', { ...pr, taxInclusive: e.target.checked })} />
          </div>
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextareaField label="Cancellation Policy" variant="outlined" size="sm" minRows={3} value={pr.cancellationPolicy}
            onChange={(e) => update('priceReference', { ...pr, cancellationPolicy: e.target.value })} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <TextareaField label="Payment Terms" variant="outlined" size="sm" minRows={3} value={pr.paymentTerms}
            onChange={(e) => update('priceReference', { ...pr, paymentTerms: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
