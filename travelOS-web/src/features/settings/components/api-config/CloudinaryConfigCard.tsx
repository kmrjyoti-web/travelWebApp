'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Icon, Alert } from '@/shared/components';
import { ApiConfigStatusBadge } from './ApiConfigStatusBadge';
import { useUpsertApiConfig } from '../../hooks/useUpsertApiConfig';
import { useVerifyApiConfig } from '../../hooks/useVerifyApiConfig';
import type { ApiConfigSummary, CloudinaryCredentials } from '../../types/api-config.types';
import './api-config-card.css';

interface CloudinaryConfigCardProps {
  /** Existing config from the API, or undefined when not yet configured. */
  existing: ApiConfigSummary | undefined;
}

const PROVIDER = 'cloudinary' as const;

/**
 * Settings card for Cloudinary API integration.
 * Renders credential fields (Cloud Name, API Key, API Secret) with show/hide toggle,
 * Save and Test Connection actions, and a live status badge.
 */
export function CloudinaryConfigCard({ existing }: CloudinaryConfigCardProps) {
  const [cloudName, setCloudName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [verifyMsg, setVerifyMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Reset form when existing config loads so display name is correct
  useEffect(() => {
    setSuccessMsg(null);
    setVerifyMsg(null);
  }, [existing?.id]);

  const upsert = useUpsertApiConfig({
    onSuccess: () => {
      setSuccessMsg('Configuration saved successfully.');
      setCloudName('');
      setApiKey('');
      setApiSecret('');
    },
    onError: () => {
      setSuccessMsg(null);
    },
  });

  const verify = useVerifyApiConfig({
    onSuccess: (result) => {
      setVerifyMsg({ text: result.message, ok: result.success });
    },
    onError: (err) => {
      setVerifyMsg({ text: err.message ?? 'Verification failed.', ok: false });
    },
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!cloudName.trim() || !apiKey.trim() || !apiSecret.trim()) return;

    const credentials: CloudinaryCredentials = {
      cloudName: cloudName.trim(),
      apiKey: apiKey.trim(),
      apiSecret: apiSecret.trim(),
    };

    upsert.mutate({
      provider: PROVIDER,
      displayName: 'Cloudinary',
      credentials: credentials as unknown as Record<string, string>,
    });
  }

  function handleVerify() {
    setVerifyMsg(null);
    verify.mutate(PROVIDER);
  }

  const isConfigured = Boolean(existing);
  const isVerified = existing?.isVerified ?? false;
  const maskedKey = existing?.maskedKey ?? null;

  const isFormFilled = cloudName.trim() !== '' && apiKey.trim() !== '' && apiSecret.trim() !== '';

  return (
    <div className="tos-api-card">
      {/* Card Header */}
      <div className="tos-api-card__header">
        <div className="tos-api-card__header-left">
          <span className="tos-api-card__icon" aria-hidden>
            <Icon name="Cloud" size={20} />
          </span>
          <div>
            <h3 className="tos-api-card__title">Cloudinary</h3>
            <p className="tos-api-card__subtitle">Image and video storage, transformation &amp; delivery CDN</p>
          </div>
        </div>
        <div className="tos-api-card__header-right">
          <ApiConfigStatusBadge isVerified={isVerified} isConfigured={isConfigured} />
          <Button
            color="secondary"
            size="sm"
            variant="outline"
            onClick={handleVerify}
            disabled={!isConfigured || verify.isPending}
            aria-label="Test Cloudinary connection"
          >
            {verify.isPending ? (
              <>
                <Icon name="LoaderCircle" size={14} aria-hidden />
                Testing…
              </>
            ) : (
              <>
                <Icon name="Plug" size={14} aria-hidden />
                Test Connection
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Current config hint */}
      {isConfigured && maskedKey && (
        <p className="tos-api-card__hint">
          <Icon name="KeyRound" size={13} aria-hidden />
          Currently configured · Key ending in <strong>{maskedKey}</strong>
        </p>
      )}

      {/* Feedback banners */}
      {successMsg && (
        <Alert color="success" className="tos-api-card__alert">
          <Icon name="CircleCheck" size={14} aria-hidden /> {successMsg}
        </Alert>
      )}
      {verifyMsg && (
        <Alert color={verifyMsg.ok ? 'success' : 'danger'} className="tos-api-card__alert">
          <Icon name={verifyMsg.ok ? 'CircleCheck' : 'CircleAlert'} size={14} aria-hidden />
          {verifyMsg.text}
        </Alert>
      )}
      {upsert.isError && (
        <Alert color="danger" className="tos-api-card__alert">
          <Icon name="CircleAlert" size={14} aria-hidden />
          {(upsert.error as { message?: string })?.message ?? 'Failed to save. Please try again.'}
        </Alert>
      )}

      {/* Credential form */}
      <form onSubmit={handleSave} noValidate className="tos-api-card__form">
        <div className="tos-api-card__fields">
          <TextField
            label="Cloud Name"
            variant="outlined"
            size="xs"
            value={cloudName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCloudName(e.target.value)}
            placeholder={isConfigured ? '(leave blank to keep existing)' : 'e.g. my-cloud'}
            autoComplete="off"
            startIcon="Cloud"
          />
          <TextField
            label="API Key"
            variant="outlined"
            size="xs"
            value={apiKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
            placeholder={isConfigured ? '(leave blank to keep existing)' : '123456789012345'}
            autoComplete="off"
            startIcon="KeyRound"
          />
          <div className="tos-api-card__secret-row">
            <TextField
              label="API Secret"
              variant="outlined"
              size="xs"
              type={showSecret ? 'text' : 'password'}
              value={apiSecret}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiSecret(e.target.value)}
              placeholder={isConfigured ? '(leave blank to keep existing)' : '••••••••••••••••'}
              autoComplete="new-password"
              startIcon="Lock"
            />
            <button
              type="button"
              className="tos-api-card__toggle-secret"
              onClick={() => setShowSecret((v) => !v)}
              aria-label={showSecret ? 'Hide API Secret' : 'Show API Secret'}
            >
              <Icon name={showSecret ? 'EyeOff' : 'Eye'} size={16} aria-hidden />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="tos-api-card__footer">
          <Button
            type="submit"
            color="primary"
            size="sm"
            disabled={upsert.isPending || (!isFormFilled && isConfigured)}
            aria-label="Save Cloudinary configuration"
          >
            {upsert.isPending ? (
              <>
                <Icon name="LoaderCircle" size={14} aria-hidden />
                Saving…
              </>
            ) : (
              <>
                <Icon name="Save" size={14} aria-hidden />
                {isConfigured ? 'Update Configuration' : 'Save Configuration'}
              </>
            )}
          </Button>
          {isConfigured && !isFormFilled && (
            <p className="tos-api-card__note">
              Enter new credentials above to update the existing configuration.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
