import { describe, test } from 'vitest';
import { render } from '@testing-library/react';
import { GeoSettingsDrawer } from './GeoSettingsDrawer';

describe('GeoSettingsDrawer', () => {
  test.todo('renders correctly when visible');
  test.todo('does not render content when not visible');
  test.todo('renders all 5 tabs');
  test.todo('switches tab content when tab is clicked');
  test.todo('renders GeoScoreRing with loaded score');
  test.todo('populates form fields from server data on mount');
  test.todo('calls onClose when Cancel is clicked');
  test.todo('calls updateSettings with form values on Save');
  test.todo('shows saving spinner while isUpdating is true');
  test.todo('shows saved confirmation after successful save');
  test.todo('shows error message after failed save');
  test.todo('calls autoFill and merges data on AI Auto-Fill click');
  test.todo('renders JSON-LD preview section');
  test.todo('is 600px wide');
  test.todo('drawer is accessible — has aria-labelledby');
});
