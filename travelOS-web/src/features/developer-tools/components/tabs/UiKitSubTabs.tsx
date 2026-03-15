'use client';
import React, { useState } from 'react';
import type { ComponentEntry } from './ui-kit-data';
import { CATEGORIES } from './ui-kit-data';
import { TextField, SelectField, Checkbox, Switch, Button, Badge, Alert, Spinner, Avatar } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';

/* OVERLAYS list removed — each overlay now has its own preview case */
const pathFor = (e: ComponentEntry) => `src/shared/components/${e.name}`;
const catLabel = (e: ComponentEntry) => CATEGORIES.find((c) => c.key === e.category)?.label ?? e.category;
const TH: React.CSSProperties = { padding: '4px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontSize: 11 };
const TD: React.CSSProperties = { padding: '3px 8px', fontSize: 12 };
const copyBtn: React.CSSProperties = { position: 'absolute', top: 4, right: 4, padding: '2px 8px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 10 };
const codeBg: React.CSSProperties = { background: '#f8f9fa', padding: 10, borderRadius: 6, fontSize: 11, fontFamily: 'monospace', overflow: 'auto' };
const sectionLabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 };
const row: React.CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' };
const cell = (w: number): React.CSSProperties => ({ width: w, flexShrink: 0 });

/* ── 1. PreviewRenderer ───────────────────────────────────────────────────── */
export function PreviewRenderer({ entry }: { entry: ComponentEntry }) {
  switch (entry.name) {
    case 'TextField':
    case 'Input':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Outlined · xs</div>
          <div style={row}>
            <div style={cell(150)}><TextField label="Full Name" size="xs" /></div>
            <div style={cell(150)}><TextField label="Email" size="xs" startIcon="Mail" /></div>
            <div style={cell(150)}><TextField label="Disabled" size="xs" disabled /></div>
            <div style={cell(150)}><TextField label="Error" size="xs" error helperText="Required" /></div>
          </div>
          <div style={{ ...sectionLabel, marginTop: 4 }}>With Icons · xs</div>
          <div style={row}>
            <div style={cell(150)}><TextField label="Search" size="xs" startIcon="Search" /></div>
            <div style={cell(150)}><TextField label="Phone" size="xs" startIcon="Phone" /></div>
            <div style={cell(150)}><TextField label="Date" size="xs" type="date" /></div>
            <div style={cell(150)}><TextField label="Password" size="xs" type="password" /></div>
          </div>
          <div style={{ ...sectionLabel, marginTop: 4 }}>States · xs</div>
          <div style={row}>
            <div style={cell(150)}><TextField label="Read Only" size="xs" readOnly defaultValue="Locked" /></div>
            <div style={cell(150)}><TextField label="Required" size="xs" required /></div>
            <div style={cell(150)}><TextField label="With Value" size="xs" defaultValue="Hello" /></div>
            <div style={cell(150)}><TextField label="Placeholder" size="xs" placeholder="Type here..." /></div>
          </div>
        </div>
      );
    case 'SelectField':
    case 'Select':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Outlined · xs</div>
          <div style={row}>
            <div style={cell(150)}>
              <SelectField label="Country" size="xs" defaultValue="IN">
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
              </SelectField>
            </div>
            <div style={cell(150)}>
              <SelectField label="Status" size="xs">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </SelectField>
            </div>
            <div style={cell(150)}>
              <SelectField label="Disabled" size="xs" disabled defaultValue="x">
                <option value="x">Locked</option>
              </SelectField>
            </div>
            <div style={cell(150)}>
              <SelectField label="Error" size="xs" error helperText="Pick one">
                <option value="">—</option>
              </SelectField>
            </div>
          </div>
        </div>
      );
    case 'Checkbox':
      return (
        <div style={row}>
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Unchecked" />
          <Checkbox label="Disabled" disabled defaultChecked />
        </div>
      );
    case 'CheckboxGroup':
      return (
        <div style={row}>
          <Checkbox label="Option A" defaultChecked />
          <Checkbox label="Option B" />
          <Checkbox label="Option C" />
        </div>
      );
    case 'Radio':
      return (
        <div style={row}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><input type="radio" name="demo-radio" defaultChecked /> Selected</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><input type="radio" name="demo-radio" /> Unselected</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, opacity: 0.5 }}><input type="radio" disabled defaultChecked /> Disabled</label>
        </div>
      );
    case 'RadioGroup':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={sectionLabel}>Vertical Group</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><input type="radio" name="demo-rg" defaultChecked /> Option A</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><input type="radio" name="demo-rg" /> Option B</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><input type="radio" name="demo-rg" /> Option C</label>
        </div>
      );
    case 'Switch':
      return (
        <div style={row}>
          <Switch label="On" defaultChecked />
          <Switch label="Off" />
          <Switch label="Disabled" disabled defaultChecked />
        </div>
      );
    case 'FormRange':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 300 }}>
          <div style={sectionLabel}>Range Slider</div>
          <input type="range" min={0} max={100} defaultValue={40} style={{ width: '100%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888' }}><span>0</span><span>50</span><span>100</span></div>
        </div>
      );
    case 'CheckboxInput':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={sectionLabel}>Checkbox + Revealed Input</div>
          <div style={row}>
            <Checkbox label="Enable custom value" defaultChecked />
            <div style={cell(150)}><TextField label="Custom Value" size="xs" defaultValue="42" /></div>
          </div>
        </div>
      );
    /* ── Advanced Inputs ─────────────────────────────────── */
    case 'SelectInput':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Searchable Select · xs</div>
          <div style={row}>
            <div style={cell(150)}><SelectField label="Country" size="xs" defaultValue="IN"><option value="IN">India</option><option value="US">USA</option><option value="UK">UK</option></SelectField></div>
            <div style={cell(150)}><SelectField label="City" size="xs"><option value="">Select...</option><option value="del">Delhi</option><option value="mum">Mumbai</option></SelectField></div>
            <div style={cell(150)}><SelectField label="Disabled" size="xs" disabled defaultValue="x"><option value="x">Locked</option></SelectField></div>
          </div>
        </div>
      );
    case 'MultiSelectInput':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Multi Select · xs</div>
          <div style={row}>
            <div style={cell(200)}><TextField label="Tags (comma sep)" size="xs" defaultValue="React, TypeScript" /></div>
            <div style={cell(150)}><TextField label="Add more..." size="xs" /></div>
          </div>
        </div>
      );
    case 'DatePicker':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Date Picker · xs</div>
          <div style={row}>
            <div style={cell(150)}><TextField label="Start Date" size="xs" type="date" startIcon="Calendar" /></div>
            <div style={cell(150)}><TextField label="End Date" size="xs" type="date" startIcon="Calendar" /></div>
            <div style={cell(150)}><TextField label="Disabled" size="xs" type="date" disabled /></div>
          </div>
        </div>
      );
    case 'CurrencyInput':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Currency Input · xs</div>
          <div style={row}>
            <div style={cell(150)}><TextField label="Amount (USD)" size="xs" defaultValue="1,250.00" startIcon="DollarSign" /></div>
            <div style={cell(150)}><TextField label="Amount (INR)" size="xs" defaultValue="₹85,000" startIcon="IndianRupee" /></div>
            <div style={cell(150)}><TextField label="Disabled" size="xs" disabled defaultValue="$0.00" /></div>
          </div>
        </div>
      );
    case 'NumberInput':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Number Input · xs</div>
          <div style={row}>
            <div style={cell(120)}><TextField label="Quantity" size="xs" type="number" defaultValue="5" /></div>
            <div style={cell(120)}><TextField label="Min 0" size="xs" type="number" defaultValue="0" /></div>
            <div style={cell(120)}><TextField label="Step 10" size="xs" type="number" defaultValue="50" /></div>
            <div style={cell(120)}><TextField label="Disabled" size="xs" type="number" disabled defaultValue="0" /></div>
          </div>
        </div>
      );
    case 'Textarea':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Textarea · outlined</div>
          <div style={row}>
            <div style={cell(200)}><TextField label="Description" size="xs" defaultValue="Multi-line text area..." /></div>
            <div style={cell(200)}><TextField label="Notes" size="xs" placeholder="Type notes..." /></div>
          </div>
        </div>
      );
    case 'TagsInput':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Tags Input · xs</div>
          <div style={row}>
            <div style={cell(200)}><TextField label="Tags" size="xs" defaultValue="travel, luxury, beach" startIcon="Tag" /></div>
            <div style={cell(150)}><TextField label="Add Tag" size="xs" placeholder="Press Enter..." startIcon="Plus" /></div>
          </div>
        </div>
      );
    case 'PhoneInput':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Phone Input · xs</div>
          <div style={row}>
            <div style={cell(150)}><TextField label="Phone" size="xs" defaultValue="+91 98765 43210" startIcon="Phone" /></div>
            <div style={cell(150)}><TextField label="Mobile" size="xs" placeholder="+1 ..." startIcon="Smartphone" /></div>
            <div style={cell(150)}><TextField label="Disabled" size="xs" disabled defaultValue="+44 ..." startIcon="Phone" /></div>
          </div>
        </div>
      );
    case 'ColorPicker':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Color Picker · xs</div>
          <div style={row}>
            <div style={cell(120)}><TextField label="Primary" size="xs" defaultValue="#4f46e5" /></div>
            <div style={cell(120)}><TextField label="Accent" size="xs" defaultValue="#16a34a" /></div>
            <div style={cell(120)}><TextField label="Danger" size="xs" defaultValue="#dc2626" /></div>
          </div>
        </div>
      );
    case 'Slider':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 300 }}>
          <div style={sectionLabel}>Dual Range Slider</div>
          <input type="range" min={0} max={100} defaultValue={30} style={{ width: '100%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888' }}><span>$0</span><span>$500</span><span>$1000</span></div>
        </div>
      );
    case 'PasswordInput':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>Password Input · xs</div>
          <div style={row}>
            <div style={cell(150)}><TextField label="Password" size="xs" type="password" defaultValue="secret123" startIcon="Lock" /></div>
            <div style={cell(150)}><TextField label="Confirm" size="xs" type="password" startIcon="Lock" /></div>
            <div style={cell(150)}><TextField label="Disabled" size="xs" type="password" disabled defaultValue="****" startIcon="Lock" /></div>
          </div>
        </div>
      );
    /* ── Special Inputs ──────────────────────────────────── */
    case 'FileUpload':
      return (
        <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 6, border: '2px dashed #d1d5db', textAlign: 'center', fontSize: 12, color: '#666' }}>
          <Icon name="Upload" size={20} /><br />
          <strong>Drop files here</strong> or click to browse<br />
          <span style={{ fontSize: 10, color: '#999' }}>PNG, JPG, PDF up to 10MB</span>
        </div>
      );
    case 'ImageUpload':
      return (
        <div style={{ padding: 12, background: '#f8f9fa', borderRadius: 6, border: '2px dashed #d1d5db', textAlign: 'center', fontSize: 12, color: '#666' }}>
          <Icon name="Image" size={20} /><br />
          <strong>Upload Image</strong><br />
          <span style={{ fontSize: 10, color: '#999' }}>Drag & drop or click · crop supported</span>
        </div>
      );
    case 'RichTextEditor':
      return (
        <div style={{ border: '1px solid #d1d5db', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 4, padding: '4px 8px', background: '#f8f9fa', borderBottom: '1px solid #d1d5db' }}>
            {['Bold', 'Italic', 'Underline', 'List', 'Link'].map(b => <button key={b} style={{ padding: '1px 6px', fontSize: 10, border: '1px solid #ccc', borderRadius: 3, background: '#fff', cursor: 'pointer' }}>{b}</button>)}
          </div>
          <div style={{ padding: 8, fontSize: 12, minHeight: 40, color: '#666' }}>Rich text content area...</div>
        </div>
      );
    case 'CodeEditor':
      return (
        <div style={{ background: '#1e1e1e', borderRadius: 6, padding: 8, fontFamily: 'monospace', fontSize: 11, color: '#d4d4d4' }}>
          <span style={{ color: '#569cd6' }}>const</span> <span style={{ color: '#4fc1ff' }}>greeting</span> = <span style={{ color: '#ce9178' }}>&apos;Hello&apos;</span>;<br />
          <span style={{ color: '#569cd6' }}>console</span>.<span style={{ color: '#dcdcaa' }}>log</span>(greeting);
        </div>
      );
    case 'SignaturePad':
      return (
        <div style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: 8, textAlign: 'center', background: '#fafafa', minHeight: 60 }}>
          <Icon name="PenTool" size={16} /><div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Sign here — draw with mouse or touch</div>
        </div>
      );
    case 'StarRating':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={sectionLabel}>Star Rating</div>
          <div style={{ display: 'flex', gap: 2, fontSize: 18 }}>{'★★★★☆'}</div>
          <div style={{ fontSize: 10, color: '#888' }}>4 / 5 stars</div>
        </div>
      );
    /* ── Selection Controls ──────────────────────────────── */
    case 'SegmentedControl':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={sectionLabel}>Segmented Control</div>
          <div style={{ display: 'inline-flex', border: '1px solid #d1d5db', borderRadius: 6, overflow: 'hidden', fontSize: 11 }}>
            <span style={{ padding: '4px 12px', background: 'var(--tos-primary, #4f46e5)', color: '#fff' }}>Day</span>
            <span style={{ padding: '4px 12px', background: '#fff', borderLeft: '1px solid #d1d5db' }}>Week</span>
            <span style={{ padding: '4px 12px', background: '#fff', borderLeft: '1px solid #d1d5db' }}>Month</span>
          </div>
        </div>
      );
    case 'ToggleButtonGroup':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={sectionLabel}>Toggle Button Group</div>
          <div style={{ display: 'inline-flex', gap: 4 }}>
            <button style={{ padding: '3px 10px', fontSize: 11, borderRadius: 4, border: '1px solid var(--tos-primary, #4f46e5)', background: 'var(--tos-primary, #4f46e5)', color: '#fff', cursor: 'pointer' }}>Grid</button>
            <button style={{ padding: '3px 10px', fontSize: 11, borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>List</button>
            <button style={{ padding: '3px 10px', fontSize: 11, borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Map</button>
          </div>
        </div>
      );
    case 'ChipSelect':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={sectionLabel}>Chip Select</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['Beach', 'Mountain', 'City', 'Desert', 'Island'].map((c, i) => (
              <span key={c} style={{ padding: '2px 10px', fontSize: 11, borderRadius: 12, border: '1px solid', borderColor: i < 2 ? 'var(--tos-primary, #4f46e5)' : '#ccc', background: i < 2 ? '#eef2ff' : '#fff', color: i < 2 ? 'var(--tos-primary, #4f46e5)' : '#333', cursor: 'pointer' }}>{c}</span>
            ))}
          </div>
        </div>
      );
    /* ── Buttons ──────────────────────────────────────────── */
    case 'Button':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={sectionLabel}>Solid · sm</div>
          <div style={{ ...row, gap: 4 }}>
            <Button color="primary" size="sm">Primary</Button>
            <Button color="secondary" size="sm">Secondary</Button>
            <Button color="success" size="sm">Success</Button>
            <Button color="danger" size="sm">Danger</Button>
            <Button color="warning" size="sm">Warning</Button>
          </div>
          <div style={{ ...sectionLabel, marginTop: 2 }}>Outline · sm</div>
          <div style={{ ...row, gap: 4 }}>
            <Button color="primary" variant="outline" size="sm">Primary</Button>
            <Button color="secondary" variant="outline" size="sm">Secondary</Button>
            <Button color="danger" variant="outline" size="sm">Danger</Button>
          </div>
          <div style={{ ...sectionLabel, marginTop: 2 }}>States</div>
          <div style={{ ...row, gap: 4 }}>
            <Button color="primary" size="sm" disabled>Disabled</Button>
            <Button color="primary" size="sm"><Spinner size="sm" /> Loading</Button>
          </div>
        </div>
      );
    case 'SmartButton':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={sectionLabel}>Smart Button</div>
          <div style={{ ...row, gap: 4 }}>
            <Button color="primary" size="sm">Save & Continue</Button>
            <Button color="danger" size="sm" variant="outline">Delete (confirm)</Button>
          </div>
          <div style={{ fontSize: 10, color: '#888' }}>Built-in loading, confirmation, and success toast</div>
        </div>
      );
    case 'LoadingButton':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={sectionLabel}>Loading Button</div>
          <div style={{ ...row, gap: 4 }}>
            <Button color="primary" size="sm">Submit</Button>
            <Button color="primary" size="sm"><Spinner size="sm" /> Submitting...</Button>
          </div>
        </div>
      );
    case 'ButtonGroup':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={sectionLabel}>Button Group</div>
          <div style={{ display: 'inline-flex' }}>
            <Button color="primary" size="sm" style={{ borderRadius: '4px 0 0 4px' }}>Left</Button>
            <Button color="primary" size="sm" style={{ borderRadius: 0, borderLeft: '1px solid rgba(255,255,255,0.3)' }}>Center</Button>
            <Button color="primary" size="sm" style={{ borderRadius: '0 4px 4px 0', borderLeft: '1px solid rgba(255,255,255,0.3)' }}>Right</Button>
          </div>
        </div>
      );
    /* ── Display ──────────────────────────────────────────── */
    case 'Badge':
      return (
        <div style={{ ...row, gap: 4 }}>
          <Badge color="primary">Primary</Badge>
          <Badge color="success">Active</Badge>
          <Badge color="danger">Error</Badge>
          <Badge color="warning">Pending</Badge>
          <Badge color="info">Info</Badge>
          <Badge color="dark">Dark</Badge>
          <Badge color="primary" shape="rounded-pill">Pill</Badge>
        </div>
      );
    case 'StatusBadge':
      return (
        <div style={{ ...row, gap: 6 }}>
          <Badge color="success">● Active</Badge>
          <Badge color="warning">● Pending</Badge>
          <Badge color="danger">● Error</Badge>
          <Badge color="secondary">● Inactive</Badge>
        </div>
      );
    case 'Avatar':
      return (
        <div style={{ ...row, gap: 8, alignItems: 'center' }}>
          <Avatar name="John Doe" />
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>AB</div>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600 }}>SM</div>
        </div>
      );
    case 'Alert':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Alert color="success" style={{ padding: '4px 10px', fontSize: 12, margin: 0 }}>Success alert</Alert>
          <Alert color="danger" style={{ padding: '4px 10px', fontSize: 12, margin: 0 }}>Error alert</Alert>
          <Alert color="warning" style={{ padding: '4px 10px', fontSize: 12, margin: 0 }}>Warning alert</Alert>
          <Alert color="info" style={{ padding: '4px 10px', fontSize: 12, margin: 0 }}>Info alert</Alert>
        </div>
      );
    case 'EmptyState':
      return (
        <div style={{ textAlign: 'center', padding: 16, color: '#888' }}>
          <Icon name="Inbox" size={28} /><div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>No data found</div>
          <div style={{ fontSize: 11 }}>Try adjusting your filters or add a new record.</div>
        </div>
      );
    case 'Spinner':
      return (
        <div style={{ ...row, gap: 10 }}>
          <Spinner size="sm" />
          <Spinner size="sm" color="success" />
          <Spinner size="sm" color="danger" />
          <Spinner />
        </div>
      );
    /* ── Table ────────────────────────────────────────────── */
    case 'SmartTable':
    case 'DataTable':
      return (
        <div style={{ border: '1px solid #dee2e6', borderRadius: 6, overflow: 'hidden', fontSize: 11 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f8f9fa' }}>
              {['Name', 'Email', 'Status', 'Actions'].map(h => <th key={h} style={{ padding: '4px 8px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[{ n: 'John Doe', e: 'john@example.com', s: 'Active' }, { n: 'Jane Smith', e: 'jane@example.com', s: 'Pending' }].map(r => (
                <tr key={r.n}><td style={{ padding: '3px 8px' }}>{r.n}</td><td style={{ padding: '3px 8px' }}>{r.e}</td>
                  <td style={{ padding: '3px 8px' }}><Badge color={r.s === 'Active' ? 'success' : 'warning'} style={{ fontSize: 9 }}>{r.s}</Badge></td>
                  <td style={{ padding: '3px 8px' }}><button style={{ fontSize: 10, border: '1px solid #ccc', borderRadius: 3, padding: '1px 6px', background: '#fff', cursor: 'pointer' }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    /* ── Forms & Schema ───────────────────────────────────── */
    case 'FormField':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={sectionLabel}>FormField Wrapper · xs</div>
          <div style={row}>
            <div style={cell(150)}><TextField label="With Label" size="xs" helperText="Helper text" /></div>
            <div style={cell(150)}><TextField label="Required" size="xs" required /></div>
            <div style={cell(150)}><TextField label="With Error" size="xs" error helperText="This field is required" /></div>
          </div>
        </div>
      );
    case 'Fieldset':
      return (
        <div style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: 10 }}>
          <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, color: '#333' }}>Personal Information</div>
          <div style={row}>
            <div style={cell(140)}><TextField label="First Name" size="xs" /></div>
            <div style={cell(140)}><TextField label="Last Name" size="xs" /></div>
            <div style={cell(140)}><TextField label="Email" size="xs" startIcon="Mail" /></div>
          </div>
        </div>
      );
    case 'FilterPanel':
      return (
        <div style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: 10, maxWidth: 200 }}>
          <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Filters</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <TextField label="Search" size="xs" startIcon="Search" />
            <SelectField label="Status" size="xs"><option value="">All</option><option value="active">Active</option></SelectField>
            <div style={{ display: 'flex', gap: 4 }}>
              <Button color="primary" size="sm" style={{ flex: 1, fontSize: 10 }}>Apply</Button>
              <Button color="secondary" size="sm" variant="outline" style={{ fontSize: 10 }}>Reset</Button>
            </div>
          </div>
        </div>
      );
    case 'BulkActionsBar':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#eef2ff', borderRadius: 6, fontSize: 11 }}>
          <strong>3 selected</strong>
          <Button color="primary" size="sm" style={{ fontSize: 10 }}>Export</Button>
          <Button color="danger" size="sm" variant="outline" style={{ fontSize: 10 }}>Delete</Button>
          <button style={{ marginLeft: 'auto', fontSize: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: '#666' }}>Clear selection</button>
        </div>
      );
    /* ── Toolbar ──────────────────────────────────────────── */
    case 'PageHeader':
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #dee2e6' }}>
          <div><div style={{ fontSize: 14, fontWeight: 700 }}>Bookings</div><div style={{ fontSize: 10, color: '#888' }}>Manage all bookings</div></div>
          <div style={{ display: 'flex', gap: 4 }}><Button color="primary" size="sm">+ New</Button><Button color="secondary" size="sm" variant="outline">Export</Button></div>
        </div>
      );
    case 'Breadcrumb':
      return (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 11, color: '#888' }}>
          <span style={{ color: 'var(--tos-primary, #4f46e5)', cursor: 'pointer' }}>Home</span>
          <span>/</span><span style={{ color: 'var(--tos-primary, #4f46e5)', cursor: 'pointer' }}>Bookings</span>
          <span>/</span><span style={{ color: '#333' }}>BK-2024-001</span>
        </div>
      );
    case 'Tabs':
      return (
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #dee2e6' }}>
          {['Overview', 'Details', 'History', 'Settings'].map((t, i) => (
            <span key={t} style={{ padding: '4px 12px', fontSize: 11, cursor: 'pointer', borderBottom: i === 0 ? '2px solid var(--tos-primary, #4f46e5)' : '2px solid transparent', marginBottom: -2, color: i === 0 ? 'var(--tos-primary, #4f46e5)' : '#666', fontWeight: i === 0 ? 600 : 400 }}>{t}</span>
          ))}
        </div>
      );
    /* ── Overlays ─────────────────────────────────────────── */
    case 'Modal':
      return (
        <div style={{ border: '1px solid #dee2e6', borderRadius: 8, overflow: 'hidden', maxWidth: 320, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #dee2e6' }}>
            <strong style={{ fontSize: 12 }}>Confirm Action</strong>
            <span style={{ cursor: 'pointer', color: '#999', fontSize: 14 }}>✕</span>
          </div>
          <div style={{ padding: '12px', fontSize: 12, color: '#555' }}>Are you sure you want to proceed with this action?</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '8px 12px', borderTop: '1px solid #dee2e6', background: '#fafafa' }}>
            <Button color="secondary" size="sm" variant="outline">Cancel</Button>
            <Button color="primary" size="sm">Confirm</Button>
          </div>
        </div>
      );
    case 'SmartDialog':
      return (
        <div style={{ border: '1px solid #dee2e6', borderRadius: 8, overflow: 'hidden', maxWidth: 320, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #dee2e6', background: 'var(--tos-primary, #4f46e5)' }}>
            <strong style={{ fontSize: 12, color: '#fff' }}>Create Booking</strong>
            <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>✕</span>
          </div>
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TextField label="Guest Name" size="xs" />
            <SelectField label="Room Type" size="xs"><option value="std">Standard</option><option value="dlx">Deluxe</option></SelectField>
            <TextField label="Check-in" size="xs" type="date" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '8px 12px', borderTop: '1px solid #dee2e6' }}>
            <Button color="secondary" size="sm" variant="outline">Cancel</Button>
            <Button color="primary" size="sm">Save</Button>
          </div>
        </div>
      );
    case 'ConfirmDialog':
      return (
        <div style={{ border: '1px solid #fee2e2', borderRadius: 8, overflow: 'hidden', maxWidth: 300, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '12px', textAlign: 'center' }}>
            <div style={{ color: 'var(--tos-danger, #dc2626)', fontSize: 24, marginBottom: 4 }}>⚠</div>
            <strong style={{ fontSize: 12 }}>Delete Record?</strong>
            <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>This action cannot be undone.</div>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '8px 12px', borderTop: '1px solid #dee2e6', justifyContent: 'center' }}>
            <Button color="secondary" size="sm" variant="outline">Cancel</Button>
            <Button color="danger" size="sm">Delete</Button>
          </div>
        </div>
      );
    case 'Offcanvas':
      return (
        <div style={{ display: 'flex', maxWidth: 400, height: 120, border: '1px solid #dee2e6', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ flex: 1, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#999' }}>Main Content</div>
          <div style={{ width: 160, borderLeft: '1px solid #dee2e6', background: '#fff', padding: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <strong style={{ fontSize: 11 }}>Details</strong><span style={{ fontSize: 12, color: '#999', cursor: 'pointer' }}>✕</span>
            </div>
            <TextField label="Name" size="xs" />
            <div style={{ marginTop: 6 }}><TextField label="Email" size="xs" /></div>
          </div>
        </div>
      );
    case 'SmartDrawer':
      return (
        <div style={{ display: 'flex', maxWidth: 400, height: 140, border: '1px solid #dee2e6', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ flex: 1, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#999' }}>Page Content</div>
          <div style={{ width: 180, borderLeft: '1px solid #dee2e6', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '6px 8px', borderBottom: '1px solid #dee2e6', background: 'var(--tos-primary, #4f46e5)' }}>
              <strong style={{ fontSize: 11, color: '#fff' }}>Edit Record</strong>
            </div>
            <div style={{ padding: 8, flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <TextField label="Title" size="xs" defaultValue="My Item" />
              <SelectField label="Status" size="xs"><option value="active">Active</option><option value="draft">Draft</option></SelectField>
            </div>
            <div style={{ display: 'flex', gap: 4, padding: '4px 8px', borderTop: '1px solid #dee2e6' }}>
              <Button color="primary" size="sm" style={{ flex: 1, fontSize: 10 }}>Save</Button>
              <Button color="secondary" size="sm" variant="outline" style={{ fontSize: 10 }}>Cancel</Button>
            </div>
          </div>
        </div>
      );
    case 'Toast':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[{ color: '#16a34a', bg: '#f0fdf4', icon: '✓', msg: 'Record saved successfully' },
            { color: '#dc2626', bg: '#fef2f2', icon: '✕', msg: 'Failed to save record' },
            { color: '#d97706', bg: '#fffbeb', icon: '⚠', msg: 'Session expires in 5 minutes' },
            { color: '#2563eb', bg: '#eff6ff', icon: 'ℹ', msg: '3 new notifications' },
          ].map(t => (
            <div key={t.msg} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: t.bg, borderRadius: 6, border: `1px solid ${t.color}22`, fontSize: 11 }}>
              <span style={{ color: t.color, fontWeight: 700, fontSize: 13 }}>{t.icon}</span>
              <span style={{ flex: 1 }}>{t.msg}</span>
              <span style={{ color: '#999', cursor: 'pointer', fontSize: 12 }}>✕</span>
            </div>
          ))}
        </div>
      );
    case 'SmartToast':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={sectionLabel}>useToast() Hook</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <Button color="success" size="sm" style={{ fontSize: 10 }}>toast.success()</Button>
            <Button color="danger" size="sm" style={{ fontSize: 10 }}>toast.error()</Button>
            <Button color="warning" size="sm" style={{ fontSize: 10 }}>toast.warning()</Button>
            <Button color="info" size="sm" style={{ fontSize: 10 }}>toast.info()</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#f0fdf4', borderRadius: 6, border: '1px solid #16a34a22', fontSize: 11 }}>
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13 }}>✓</span>
            <span>Booking created successfully!</span>
            <span style={{ color: '#999', cursor: 'pointer', fontSize: 12, marginLeft: 'auto' }}>✕</span>
          </div>
        </div>
      );
    case 'Popover':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ padding: '6px 12px', background: '#1f2937', color: '#fff', borderRadius: 6, fontSize: 11, maxWidth: 180 }}>
              Popover content with rich HTML, links, and actions.
              <div style={{ position: 'absolute', bottom: -6, left: 20, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #1f2937' }} />
            </div>
          </div>
          <Button color="secondary" size="sm" variant="outline" style={{ fontSize: 10 }}>Hover / Click me</Button>
        </div>
      );
    case 'Tooltip':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
          <div style={{ padding: '3px 8px', background: '#1f2937', color: '#fff', borderRadius: 4, fontSize: 10 }}>
            This is a tooltip
            <div style={{ position: 'absolute', bottom: -4, left: 30, width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #1f2937' }} />
          </div>
          <div style={{ ...row, gap: 8 }}>
            <Button color="primary" size="sm" style={{ fontSize: 10 }}>Top</Button>
            <Button color="secondary" size="sm" style={{ fontSize: 10 }}>Bottom</Button>
            <Button color="secondary" size="sm" style={{ fontSize: 10 }}>Left</Button>
            <Button color="secondary" size="sm" style={{ fontSize: 10 }}>Right</Button>
          </div>
        </div>
      );
    case 'SmartError':
      return (
        <div style={{ border: '1px solid #fee2e2', borderRadius: 8, padding: 12, background: '#fef2f2', textAlign: 'center' }}>
          <div style={{ color: '#dc2626', fontSize: 24, marginBottom: 4 }}>⚠</div>
          <strong style={{ fontSize: 12, color: '#dc2626' }}>Something went wrong</strong>
          <div style={{ fontSize: 11, color: '#666', margin: '4px 0 8px' }}>An unexpected error occurred. Please try again.</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            <Button color="primary" size="sm" style={{ fontSize: 10 }}>Retry</Button>
            <Button color="secondary" size="sm" variant="outline" style={{ fontSize: 10 }}>Report</Button>
          </div>
        </div>
      );
    default:
      return (
        <div style={{ padding: 10, background: '#f8f9fa', borderRadius: 6, fontSize: 12 }}>
          <strong>{entry.name}</strong>: Wraps <code>{entry.coreui}</code>
        </div>
      );
  }
}

/* ── 2. PropsTable ────────────────────────────────────────────────────────── */
export function PropsTable({ entry }: { entry: ComponentEntry }) {
  const props = entry.props;
  if (!props || props.length === 0) {
    return (
      <div style={{ padding: 12, color: '#888', fontSize: 12 }}>
        No props documented yet. All <code>{entry.coreui}</code> props forwarded via spread.
      </div>
    );
  }
  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', fontWeight: 700 }}>
            {['Prop', 'Type', 'Default', 'Req', 'Description'].map((h) => <th key={h} style={TH}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {props.map((p, i) => (
            <tr key={p.name} style={{ background: i % 2 === 1 ? '#fafafa' : 'transparent' }}>
              <td style={{ ...TD, fontFamily: 'monospace', fontWeight: 600 }}>{p.name}</td>
              <td style={{ ...TD, fontFamily: 'monospace', color: '#7c3aed' }}>{p.type}</td>
              <td style={{ ...TD, fontFamily: 'monospace', color: '#16a34a' }}>{p.default ?? '—'}</td>
              <td style={TD}>
                {p.required ? <span style={{ color: '#dc2626', fontWeight: 600 }}>*</span> : <span style={{ color: '#ccc' }}>—</span>}
              </td>
              <td style={TD}>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 6, fontSize: 11, color: '#aaa' }}>
        + all <code>{entry.coreui}</code> props via spread
      </div>
    </div>
  );
}

/* ── 3. CSSTokensTable ───────────────────────────────────────────────────── */
export function CSSTokensTable({ entry }: { entry: ComponentEntry }) {
  const tokens = entry.cssTokens;
  if (!tokens || tokens.length === 0) {
    return <div style={{ padding: 12, color: '#888', fontSize: 12 }}>No CSS tokens documented yet.</div>;
  }
  const isColor = (v: string) => v.startsWith('#') || v.startsWith('rgb');
  const Dot = ({ color }: { color: string }) => (
    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, marginRight: 4 }} />
  );
  return (
    <div>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>
        Override in <code>src/styles/crm-theme.css</code>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', fontWeight: 700 }}>
            {['Token', 'Default', 'Override', 'Description'].map((h) => <th key={h} style={TH}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {tokens.map((tk, i) => (
            <tr key={tk.token} style={{ background: i % 2 === 1 ? '#fafafa' : 'transparent' }}>
              <td style={{ ...TD, fontFamily: 'monospace', color: '#0891b2' }}>{tk.token}</td>
              <td style={TD}>{isColor(tk.defaultValue) ? <><Dot color={tk.defaultValue} />{tk.defaultValue}</> : tk.defaultValue}</td>
              <td style={{ ...TD, color: '#999' }}>{tk.override ? <>{isColor(tk.override) && <Dot color={tk.override} />}{tk.override}</> : '—'}</td>
              <td style={TD}>{tk.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── 4. PlaygroundPanel ───────────────────────────────────────────────────── */
export function PlaygroundPanel({ entry }: { entry: ComponentEntry }) {
  const defaults: Record<string, string | boolean> = {};
  (entry.props ?? []).forEach((p) => {
    defaults[p.name] = p.default ?? (p.type === 'boolean' ? false : '');
  });
  const [values, setValues] = useState<Record<string, string | boolean>>(defaults);
  const set = (k: string, v: string | boolean) => setValues((prev) => ({ ...prev, [k]: v }));

  const code = `<${entry.name}${Object.entries(values)
    .filter(([, v]) => v !== '' && v !== false)
    .map(([k, v]) => (typeof v === 'boolean' ? ` ${k}` : ` ${k}="${v}"`))
    .join('')} />`;

  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Adjust Props</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        {(entry.props ?? []).map((p) => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <label style={{ width: 90, fontWeight: 500, fontFamily: 'monospace', fontSize: 11 }}>{p.name}</label>
            {p.type === 'boolean' ? (
              <input type="checkbox" checked={!!values[p.name]} onChange={(e) => set(p.name, e.target.checked)} />
            ) : p.type.includes('|') ? (
              <select
                value={String(values[p.name] ?? '')}
                onChange={(e) => set(p.name, e.target.value)}
                style={{ padding: '1px 4px', borderRadius: 3, border: '1px solid #ccc', fontSize: 11 }}
              >
                {p.type.split('|').map((o) => o.trim().replace(/'/g, '')).map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={String(values[p.name] ?? '')}
                onChange={(e) => set(p.name, e.target.value)}
                style={{ padding: '1px 4px', borderRadius: 3, border: '1px solid #ccc', fontSize: 11, flex: 1 }}
              />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => setValues(defaults)}
        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 3, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 11, marginBottom: 8 }}
      >
        <Icon name="RotateCcw" size={10} /> Reset
      </button>
      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Generated Code</div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => navigator.clipboard.writeText(code)} style={copyBtn}>Copy</button>
        <pre style={codeBg}>{code}</pre>
      </div>
    </div>
  );
}

/* ── 5. CodePanel ─────────────────────────────────────────────────────────── */
export function CodePanel({ entry }: { entry: ComponentEntry }) {
  const examples = [
    { label: 'Basic', code: `import { ${entry.name} } from '@/shared/components';\n\n<${entry.name} />` },
    { label: 'With Props', code: `<${entry.name} className="custom" />` },
  ];
  const [active, setActive] = useState(0);
  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {examples.map((ex, i) => (
          <button key={ex.label} onClick={() => setActive(i)} style={{
            padding: '2px 10px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 11,
            background: i === active ? '#16a34a' : '#e5e7eb', color: i === active ? '#fff' : '#333',
          }}>{ex.label}</button>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => navigator.clipboard.writeText(examples[active].code)} style={copyBtn}>Copy</button>
        <pre style={codeBg}>{examples[active].code}</pre>
      </div>
      <div style={{ marginTop: 8, padding: '6px 10px', background: '#eff6ff', borderRadius: 4, fontSize: 11 }}>
        <code>{`import { ${entry.name} } from "@/shared/components";`}</code>
        <br />File: <span style={{ color: '#0891b2' }}>{pathFor(entry)}</span> — wraps <strong>{entry.coreui}</strong>
      </div>
    </div>
  );
}

/* ── 6. APIPanel ──────────────────────────────────────────────────────────── */
export function APIPanel({ entry }: { entry: ComponentEntry }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8, background: '#f8f9fa', borderRadius: 4, marginBottom: 8, fontSize: 12 }}>
        <div>
          <div><strong>Wrapper:</strong> {entry.name}</div>
          <div><strong>File:</strong> <span style={{ color: '#0891b2' }}>{pathFor(entry)}</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div><strong>CoreUI:</strong> {entry.coreui}</div>
          <div><strong>Category:</strong> {catLabel(entry)}</div>
        </div>
      </div>
      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Events / Callbacks</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
        <thead>
          <tr style={{ background: '#f8f9fa', fontWeight: 700 }}>
            {['Event', 'Signature', 'Description'].map((h) => <th key={h} style={TH}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...TD, fontFamily: 'monospace', color: '#0891b2' }}>onChange</td>
            <td style={{ ...TD, fontFamily: 'monospace' }}>{'(e: ChangeEvent) => void'}</td>
            <td style={TD}>Fires on value change</td>
          </tr>
        </tbody>
      </table>
      <div style={{ padding: '6px 10px', background: '#fef9c3', borderRadius: 4, fontSize: 11 }}>
        <strong>Note:</strong> {entry.name} forwards ref + spreads all props to {entry.coreui}.
      </div>
    </div>
  );
}
