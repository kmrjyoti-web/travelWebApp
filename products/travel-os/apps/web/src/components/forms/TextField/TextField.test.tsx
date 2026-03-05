import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders an input by default', () => {
    render(<TextField />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a textarea when multiline=true', () => {
    render(<TextField multiline />);
    // textarea has implicit role textbox as well
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('shows a floating label', () => {
    render(<TextField label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('marks required with aria and visible asterisk', () => {
    render(<TextField label="Name" required />);
    expect(screen.getByLabelText(/Name/)).toBeRequired();
  });

  it('renders helperText', () => {
    render(<TextField helperText="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('renders helperText as alert when error=true', () => {
    render(<TextField error helperText="Invalid email" />);
    const helper = screen.getByText('Invalid email');
    expect(helper).toHaveAttribute('role', 'alert');
  });

  it('applies tos-text-field--error class on error', () => {
    const { container } = render(<TextField error />);
    expect(container.firstChild).toHaveClass('tos-text-field--error');
  });

  it('applies tos-text-field--full-width when fullWidth=true', () => {
    const { container } = render(<TextField fullWidth />);
    expect(container.firstChild).toHaveClass('tos-text-field--full-width');
  });

  it('applies tos-text-field--small when size=small', () => {
    const { container } = render(<TextField size="small" />);
    expect(container.firstChild).toHaveClass('tos-text-field--small');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<TextField label="Disabled" disabled />);
    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('renders startAdornment', () => {
    render(<TextField startAdornment={<span data-testid="start">$</span>} />);
    expect(screen.getByTestId('start')).toBeInTheDocument();
  });

  it('renders endAdornment', () => {
    render(<TextField endAdornment={<span data-testid="end">✓</span>} />);
    expect(screen.getByTestId('end')).toBeInTheDocument();
  });

  it('uses a provided id', () => {
    render(<TextField label="Email" id="my-email" />);
    expect(document.getElementById('my-email')).toBeInTheDocument();
  });

  it('applies containerClassName', () => {
    const { container } = render(<TextField containerClassName="custom-cls" />);
    expect(container.firstChild).toHaveClass('custom-cls');
  });
});
