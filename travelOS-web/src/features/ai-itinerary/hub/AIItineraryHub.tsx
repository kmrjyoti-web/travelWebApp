'use client';
import React, { useState } from 'react';
import { PageHeader, Alert } from '@/shared/components';
import { GenerateForm, StatusPoller, DraftViewer } from '../components';

type HubState =
  | { stage: 'form' }
  | { stage: 'polling'; requestId: string }
  | { stage: 'draft'; draftId: string }
  | { stage: 'done'; itineraryId: string };

const CARD: React.CSSProperties = {
  background: 'var(--cui-card-bg, #fff)',
  border: '1px solid var(--cui-border-color, #e5e7eb)',
  borderRadius: '0.75rem',
  padding: '1.5rem',
};

export function AIItineraryHub() {
  const [state, setState] = useState<HubState>({ stage: 'form' });

  const reset = () => setState({ stage: 'form' });

  return (
    <main style={{ padding: '1.5rem' }}>
      <PageHeader
        title="AI Itinerary Generator"
        subtitle="Let our AI craft a personalised travel itinerary based on your preferences"
        className="mb-4"
      />

      <div style={CARD}>
        {state.stage === 'form' && (
          <GenerateForm
            onStarted={(requestId) => setState({ stage: 'polling', requestId })}
          />
        )}

        {state.stage === 'polling' && (
          <StatusPoller
            requestId={state.requestId}
            onCompleted={(draftId) => setState({ stage: 'draft', draftId })}
            onReset={reset}
          />
        )}

        {state.stage === 'draft' && (
          <DraftViewer
            draftId={state.draftId}
            onConverted={(itineraryId) => setState({ stage: 'done', itineraryId })}
            onReset={reset}
          />
        )}

        {state.stage === 'done' && (
          <div style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--cui-success-bg-subtle, #d1fae5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '1.75rem' }}>✓</span>
            </div>
            <div>
              <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cui-body-color)', margin: 0 }}>
                Itinerary Created Successfully!
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--cui-secondary-color, #6b7280)', marginTop: '0.375rem' }}>
                Your AI-generated itinerary has been saved. You can find it in the Itinerary section.
              </p>
            </div>
            <Alert color="success">
              Itinerary ID: <strong>{state.itineraryId}</strong>
            </Alert>
            <button
              onClick={reset}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.375rem', border: '1px solid var(--cui-primary, #1B4F72)',
                background: 'transparent', color: 'var(--cui-primary, #1B4F72)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
              }}
            >
              Generate Another
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
