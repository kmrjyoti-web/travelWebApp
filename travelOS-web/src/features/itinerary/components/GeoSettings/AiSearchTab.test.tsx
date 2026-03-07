import { describe, test } from 'vitest';
import { render } from '@testing-library/react';
import { AiSearchTab } from './AiSearchTab';
import { GEO_DEFAULTS } from './types';

describe('AiSearchTab', () => {
  test.todo('renders correctly with default values');
  test.todo('renders AI summary textarea');
  test.todo('shows character counter for aiSummary');
  test.todo('shows error styling when aiSummary exceeds 300 chars');
  test.todo('renders keyHighlights TagInput');
  test.todo('renders targetQueries TagInput');
  test.todo('renders competitorKeywords TagInput');
  test.todo('renders FaqEditor component');
  test.todo('renders freshnessEnabled Switch');
  test.todo('shows freshness date input when freshnessEnabled is true');
  test.todo('hides freshness date input when freshnessEnabled is false');
  test.todo('calls onChange when aiSummary changes');
  test.todo('calls onChange when freshnessEnabled is toggled');
});
