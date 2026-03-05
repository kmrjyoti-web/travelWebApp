'use client';
import React from 'react';
import { useUIStore } from '@/shared/stores/ui.store';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '@/shared/components/Modal';
import { Icon } from '@/shared/components/Icon';
import { SHORTCUTS } from './shortcuts.config';

function KeyBadge({ keys }: { keys: string[] }) {
  return (
    <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {keys.map((k, i) => (
        <React.Fragment key={k}>
          {i > 0 && <span style={{ color: 'var(--tos-text-muted)', fontSize: 10 }}>+</span>}
          <kbd className="tos-kbd">{k}</kbd>
        </React.Fragment>
      ))}
    </span>
  );
}

function formatKeys(shortcut: (typeof SHORTCUTS)[number]) {
  const keys: string[] = [];
  if (shortcut.ctrl) keys.push('Ctrl');
  if (shortcut.shift) keys.push('Shift');
  if (shortcut.alt) keys.push('Alt');
  keys.push(shortcut.key === 'Escape' ? 'Esc' : shortcut.key.toUpperCase());
  return keys;
}

export function KeyboardShortcuts() {
  const { isShortcutsModalOpen, toggleShortcutsModal } = useUIStore();

  return (
    <Modal visible={isShortcutsModalOpen} onClose={toggleShortcutsModal} size="lg">
      <ModalHeader closeButton>
        <ModalTitle>
          <Icon name="Keyboard" size={16} style={{ marginRight: 8 }} />
          Keyboard Shortcuts
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <table className="tos-shortcuts-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Shortcut</th>
              <th>Layouts</th>
            </tr>
          </thead>
          <tbody>
            {SHORTCUTS.map((s) => (
              <tr key={s.action}>
                <td>{s.description}</td>
                <td>
                  <KeyBadge keys={formatKeys(s)} />
                </td>
                <td style={{ color: 'var(--tos-text-muted)', fontSize: 12 }}>
                  {s.layouts ? s.layouts.join(', ') : 'All'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModalBody>
    </Modal>
  );
}
