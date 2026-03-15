/**
 * Settings feature barrel export.
 * Import settings components from '@/features/settings' — never from deep paths.
 */

// Pages
export { ApiConfigPage } from './components/ApiConfigPage';

// Types (re-exported for consumers)
export type {
  ApiConfigProvider,
  ApiConfigSummary,
  UpsertApiConfigPayload,
  CloudinaryCredentials,
  VerifyResult,
} from './types/api-config.types';
