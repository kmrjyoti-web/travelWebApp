'use client';
import React from 'react';
import { Icon, Alert, Button } from '@/shared/components';
import { useAIRequestStatus } from '../hooks/useAIItinerary';

interface StatusPollerProps {
  requestId: string;
  onCompleted: (draftId: string) => void;
  onReset: () => void;
}

const SPIN: React.CSSProperties = {
  display: 'inline-block',
  animation: 'spin 1s linear infinite',
};

export function StatusPoller({ requestId, onCompleted, onReset }: StatusPollerProps) {
  const { data, isLoading } = useAIRequestStatus(requestId);

  React.useEffect(() => {
    if (data?.status === 'completed' && data.draftId) {
      onCompleted(data.draftId);
    }
  }, [data, onCompleted]);

  const isPending   = !data || isLoading || data.status === 'pending';
  const isGenerating = data?.status === 'generating';
  const isFailed    = data?.status === 'failed';

  return (
    <div style={{ textAlign: 'center', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {isFailed ? (
        <>
          <Icon name="CircleX" size={48} style={{ color: '#ef4444' }} aria-hidden />
          <div>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--cui-danger, #ef4444)', marginBottom: '0.5rem' }}>
              Generation Failed
            </p>
            <Alert color="danger">
              {data?.errorMessage ?? 'An error occurred while generating your itinerary. Please try again.'}
            </Alert>
          </div>
          <Button color="secondary" onClick={onReset}>Try Again</Button>
        </>
      ) : (
        <>
          <div style={SPIN}>
            <Icon name="LoaderCircle" size={48} style={{ color: 'var(--cui-primary, #1B4F72)' }} aria-hidden />
          </div>
          <div>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--cui-body-color)', marginBottom: '0.375rem' }}>
              {isGenerating ? 'Generating your itinerary…' : 'Queued for generation…'}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--cui-secondary-color, #6b7280)' }}>
              {isGenerating
                ? `Our AI is crafting a personalized travel plan. This usually takes 30–60 seconds.${data?.progressPercent != null ? ` (${data.progressPercent}%)` : ''}`
                : 'Your request is in the queue. We\'ll start generating shortly.'}
            </p>
          </div>
          <div style={{
            width: '100%',
            maxWidth: 400,
            height: 6,
            background: 'var(--cui-border-color, #e5e7eb)',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: isPending ? '30%' : `${data?.progressPercent ?? 60}%`,
              background: 'var(--cui-primary, #1B4F72)',
              borderRadius: 3,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <Button color="secondary" variant="ghost" onClick={onReset} style={{ fontSize: '0.8125rem' }}>
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}
