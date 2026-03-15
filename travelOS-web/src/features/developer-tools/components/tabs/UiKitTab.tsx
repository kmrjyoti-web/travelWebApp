'use client';
import React, { useState, useRef, useMemo } from 'react';
import { icons } from 'lucide-react';
import { CATEGORIES, COMPONENTS, type ComponentEntry, type CategoryKey } from './ui-kit-data';
import { PreviewRenderer, PropsTable, CSSTokensTable, PlaygroundPanel, CodePanel, APIPanel } from './UiKitSubTabs';

type SubTab = 'preview' | 'props' | 'css' | 'playground' | 'code' | 'api';

const SUB_TABS: Array<{ key: SubTab; label: string; icon: string }> = [
  { key: 'preview', label: 'Preview', icon: '◉' },
  { key: 'props', label: 'Props', icon: '≡' },
  { key: 'css', label: 'CSS', icon: '◎' },
  { key: 'playground', label: 'Playground', icon: '◈' },
  { key: 'code', label: 'Code', icon: '<>' },
  { key: 'api', label: 'API', icon: '⊞' },
];

function getCategoryCount(key: CategoryKey): number {
  if (key === 'icon-gallery' || key === 'import-patterns') return 0;
  return COMPONENTS.filter((c) => c.category === key).length;
}

function renderSubTabContent(comp: ComponentEntry, tab: SubTab) {
  switch (tab) {
    case 'preview': return <PreviewRenderer entry={comp} />;
    case 'props': return <PropsTable entry={comp} />;
    case 'css': return <CSSTokensTable entry={comp} />;
    case 'playground': return <PlaygroundPanel entry={comp} />;
    case 'code': return <CodePanel entry={comp} />;
    case 'api': return <APIPanel entry={comp} />;
  }
}

/** Icon Gallery — renders all lucide-react icons in a searchable grid */
function IconGallery() {
  const [q, setQ] = useState('');
  const allNames = Object.keys(icons);
  const filtered = q ? allNames.filter((n) => n.toLowerCase().includes(q.toLowerCase())) : allNames;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <input
          type="text" placeholder="Search icons..." value={q} onChange={(e) => setQ(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid var(--tos-border, #dee2e6)', background: 'var(--tos-bg, #fff)', color: 'var(--tos-text)', fontSize: 12, width: 220 }}
        />
        <span style={{ fontSize: 12, color: 'var(--tos-text-muted)' }}>{filtered.length} of {allNames.length} icons</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8, maxHeight: 480, overflow: 'auto' }}>
        {filtered.slice(0, 200).map((name) => {
          const LucideIcon = icons[name as keyof typeof icons];
          return (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 8, borderRadius: 6, border: '1px solid var(--tos-border, #eee)', background: 'var(--tos-bg-subtle, #f8f9fa)', cursor: 'pointer' }}
              title={name}>
              <LucideIcon size={24} />
              <span style={{ fontSize: 9, marginTop: 4, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Import Patterns — shows correct import for every component */
function ImportPatterns() {
  return (
    <div style={{ fontSize: 12, fontFamily: 'monospace' }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, fontFamily: 'sans-serif' }}>
        All {COMPONENTS.length} Component Imports
      </div>
      {COMPONENTS.map((c) => (
        <div key={c.name} style={{ padding: '4px 0', borderBottom: '1px solid var(--tos-border, #eee)' }}>
          <span style={{ color: '#9333ea' }}>import</span>{' { '}
          <span style={{ color: '#0369a1' }}>{c.name}</span>
          {' } '}<span style={{ color: '#9333ea' }}>from</span>{' '}
          <span style={{ color: '#16a34a' }}>{`'@/shared/components'`}</span>;
        </div>
      ))}
    </div>
  );
}

/** Component Card with sub-tabs */
function ComponentCard({ entry, activeTab, onTabChange, categoryLabel }: {
  entry: ComponentEntry; activeTab: SubTab; onTabChange: (t: SubTab) => void; categoryLabel: string;
}) {
  return (
    <div style={{ border: '1px solid var(--tos-border, #dee2e6)', borderRadius: 8, marginBottom: 16, background: 'var(--tos-bg, #fff)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--tos-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{entry.name}</span>
          <span style={{ background: '#1a1a2e', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'monospace' }}>{entry.coreui}</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--tos-text-muted)' }}>{categoryLabel}</span>
      </div>
      {entry.description && (
        <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--tos-text-muted, #666)', borderBottom: '1px solid var(--tos-border)' }}>
          {entry.description}
        </div>
      )}
      <div style={{ display: 'flex', gap: 0, padding: '0 16px', borderBottom: '1px solid var(--tos-border)' }}>
        {SUB_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => onTabChange(tab.key)} style={{
              padding: '8px 12px', border: 'none', fontSize: 12,
              background: isActive ? '#16a34a' : 'transparent',
              color: isActive ? '#fff' : 'var(--tos-text-muted)',
              borderRadius: isActive ? '4px 4px 0 0' : 0,
              cursor: 'pointer', fontWeight: isActive ? 600 : 400,
            }}>
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: 16 }}>
        {renderSubTabContent(entry, activeTab)}
      </div>
    </div>
  );
}

export function UiKitTab() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('icon-gallery');
  const [componentTabs, setComponentTabs] = useState<Record<string, SubTab>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredComponents = useMemo(() => {
    let list = COMPONENTS.filter((c) => c.category === activeCategory);
    if (searchQuery) list = list.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return list;
  }, [activeCategory, searchQuery]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  const catLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label ?? '';
  const isSpecial = activeCategory === 'icon-gallery' || activeCategory === 'import-patterns';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>UI Kit &mdash; {COMPONENTS.length} Wrapper Components</span>
          <span style={{ background: '#16a34a', color: '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>Complete</span>
        </div>
        <code style={{ fontSize: 12, color: 'var(--tos-text-muted)', background: 'var(--tos-bg-subtle, #f1f5f9)', padding: '2px 8px', borderRadius: 4 }}>@/components/ui barrel</code>
      </div>

      {/* Search */}
      {!isSpecial && (
        <input
          type="text" placeholder="Search components..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 12, padding: '6px 10px', borderRadius: 4, border: '1px solid var(--tos-border, #dee2e6)', background: 'var(--tos-bg, #fff)', color: 'var(--tos-text)', fontSize: 12, width: 260 }}
        />
      )}

      {/* Category tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
        <button onClick={() => scroll(-1)} style={{ border: '1px solid var(--tos-border, #dee2e6)', background: 'var(--tos-bg, #fff)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 14 }}>&lt;</button>
        <div ref={scrollRef} style={{ display: 'flex', gap: 6, overflow: 'hidden', flex: 1, scrollBehavior: 'smooth' }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count = getCategoryCount(cat.key);
            return (
              <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setSearchQuery(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 20,
                  border: isActive ? '2px solid #2563eb' : '1px solid var(--tos-border, #dee2e6)',
                  background: isActive ? '#eff6ff' : 'var(--tos-bg, #fff)',
                  color: isActive ? '#2563eb' : 'var(--tos-text, #333)',
                  cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap', fontWeight: isActive ? 600 : 400,
                }}>
                <span>{cat.icon}</span> {cat.label}
                {count > 0 && <span style={{ background: isActive ? '#2563eb' : '#e5e7eb', color: isActive ? '#fff' : '#666', padding: '0 6px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>{count}</span>}
              </button>
            );
          })}
        </div>
        <button onClick={() => scroll(1)} style={{ border: '1px solid var(--tos-border, #dee2e6)', background: 'var(--tos-bg, #fff)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 14 }}>&gt;</button>
      </div>

      {/* Content area */}
      {activeCategory === 'icon-gallery' && <IconGallery />}
      {activeCategory === 'import-patterns' && <ImportPatterns />}
      {!isSpecial && filteredComponents.map((comp) => (
        <ComponentCard
          key={comp.name} entry={comp}
          activeTab={componentTabs[comp.name] ?? 'preview'}
          onTabChange={(t) => setComponentTabs((prev) => ({ ...prev, [comp.name]: t }))}
          categoryLabel={catLabel}
        />
      ))}
      {!isSpecial && filteredComponents.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--tos-text-muted)', fontSize: 13 }}>
          No components match &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
