import { describe, test } from 'vitest';
import { render } from '@testing-library/react';
import { FaqEditor } from './FaqEditor';

describe('FaqEditor', () => {
  test.todo('renders correctly with empty FAQ list');
  test.todo('renders empty state message when no FAQs');
  test.todo('renders Add FAQ button');
  test.todo('renders FAQ items when value is provided');
  test.todo('each FAQ item has a question TextField');
  test.todo('each FAQ item has an answer TextareaField');
  test.todo('each FAQ item has a remove button with correct aria-label');
  test.todo('clicking remove button removes that FAQ from the list');
  test.todo('clicking Add FAQ adds an empty FAQ item');
  test.todo('hides Add FAQ button when max 10 FAQs reached');
  test.todo('shows max reached warning at 10 FAQs');
  test.todo('renders AI Generate FAQs button');
  test.todo('AI Generate button is disabled when generating');
  test.todo('merged generated FAQs with existing on successful generation');
  test.todo('calls onChange when question is changed');
  test.todo('calls onChange when answer is changed');
});
