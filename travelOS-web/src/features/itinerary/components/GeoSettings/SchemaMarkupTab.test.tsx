import { describe, test } from 'vitest';
import { render } from '@testing-library/react';
import { SchemaMarkupTab } from './SchemaMarkupTab';
import { GEO_DEFAULTS } from './types';

describe('SchemaMarkupTab', () => {
  test.todo('renders correctly with default values');
  test.todo('renders schemaType SelectField with all 4 options');
  test.todo('renders destinationName TextField');
  test.todo('renders lat and lng fields side by side');
  test.todo('renders priceRange and currency in grid');
  test.todo('renders durationIso TextField with ISO helper text');
  test.todo('renders availability SelectField with 4 options');
  test.todo('renders providerName and providerUrl fields');
  test.todo('calls onChange when schemaType changes');
  test.todo('calls onChange when destinationName changes');
  test.todo('converts currency input to uppercase, max 3 chars');
  test.todo('sets destinationLat to null when input is cleared');
  test.todo('sets destinationLng to null when input is cleared');
});
