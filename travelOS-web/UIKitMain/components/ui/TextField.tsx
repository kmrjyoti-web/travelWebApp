import React, { forwardRef, useId } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  label?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  error?: boolean;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  containerClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      label,
      variant = 'outlined',
      size = 'medium',
      error = false,
      helperText,
      startAdornment,
      endAdornment,
      multiline = false,
      rows = 4,
      fullWidth = false,
      className,
      disabled,
      required,
      id: providedId,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const isSmall = size === 'small';

    // Base container classes
    const containerClasses = cn(
      'relative inline-flex flex-col',
      fullWidth ? 'w-full' : 'w-64',
      containerClassName
    );

    // Input classes
    const baseInputClasses = 'w-full peer transition-colors duration-200 outline-none bg-transparent';
    
    // Variant specific input classes
    const outlinedInputClasses = cn(
      'border rounded-md',
      isSmall ? 'px-3 py-2 text-sm' : 'px-3 py-3.5 text-base',
      error 
        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
        : 'border-gray-300 focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] hover:border-gray-400',
      disabled ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-white',
      startAdornment ? 'pl-10' : '',
      endAdornment ? 'pr-10' : ''
    );

    const filledInputClasses = cn(
      'border-b-2 rounded-t-md',
      isSmall ? 'px-3 pt-5 pb-1 text-sm' : 'px-3 pt-6 pb-2 text-base',
      error
        ? 'border-red-500 focus:border-red-500 bg-red-50'
        : 'border-gray-400 focus:border-[var(--accent-color)] bg-gray-100 hover:bg-gray-200',
      disabled ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed' : '',
      startAdornment ? 'pl-10' : '',
      endAdornment ? 'pr-10' : ''
    );

    const standardInputClasses = cn(
      'border-b-2 border-x-0 border-t-0 rounded-none px-0',
      isSmall ? 'py-1 text-sm' : 'py-2 text-base',
      error
        ? 'border-red-500 focus:border-red-500'
        : 'border-gray-300 focus:border-[var(--accent-color)] hover:border-gray-400',
      disabled ? 'text-gray-500 border-gray-200 cursor-not-allowed' : '',
      startAdornment ? 'pl-8' : '',
      endAdornment ? 'pr-8' : ''
    );

    const inputClasses = cn(
      baseInputClasses,
      variant === 'outlined' && outlinedInputClasses,
      variant === 'filled' && filledInputClasses,
      variant === 'standard' && standardInputClasses,
      className
    );

    // Label classes
    const baseLabelClasses = 'absolute transition-all duration-200 pointer-events-none z-10';
    
    const outlinedLabel = cn(
      baseLabelClasses,
      'text-gray-500 transform -translate-y-1/2 scale-75 top-0 origin-[0] bg-white px-1',
      isSmall ? 'left-2' : 'left-2',
      error ? 'text-red-500' : 'peer-focus:text-[var(--accent-color)]',
      disabled ? 'text-gray-400' : '',
      'peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0',
      isSmall ? 'peer-placeholder-shown:top-1/2' : 'peer-placeholder-shown:top-1/2',
      startAdornment ? 'peer-placeholder-shown:left-10 peer-focus:left-2' : '',
      'peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:px-1'
    );

    const filledLabel = cn(
      baseLabelClasses,
      'text-gray-500 transform -translate-y-3 scale-75 top-4 origin-[0]',
      isSmall ? 'left-3' : 'left-3',
      error ? 'text-red-500' : 'peer-focus:text-[var(--accent-color)]',
      disabled ? 'text-gray-400' : '',
      'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0',
      isSmall ? 'peer-placeholder-shown:top-3' : 'peer-placeholder-shown:top-4',
      startAdornment ? 'peer-placeholder-shown:left-10 peer-focus:left-3' : '',
      'peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-3'
    );

    const standardLabel = cn(
      baseLabelClasses,
      'text-gray-500 transform -translate-y-6 scale-75 top-3 origin-[0]',
      'left-0',
      error ? 'text-red-500' : 'peer-focus:text-[var(--accent-color)]',
      disabled ? 'text-gray-400' : '',
      'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0',
      isSmall ? 'peer-placeholder-shown:top-2' : 'peer-placeholder-shown:top-3',
      startAdornment ? 'peer-placeholder-shown:left-8 peer-focus:left-0' : '',
      'peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-6'
    );

    const labelClasses = cn(
      variant === 'outlined' && outlinedLabel,
      variant === 'filled' && filledLabel,
      variant === 'standard' && standardLabel
    );

    const InputComponent = multiline ? 'textarea' : 'input';

    return (
      <div className={containerClasses}>
        <div className="relative w-full">
          {startAdornment && (
            <div className={cn(
              "absolute left-0 flex items-center justify-center text-gray-500 z-20",
              variant === 'standard' ? 'top-1/2 -translate-y-1/2' : 'inset-y-0 pl-3',
              disabled && 'text-gray-400'
            )}>
              {startAdornment}
            </div>
          )}
          
          <InputComponent
            ref={ref as any}
            id={id}
            disabled={disabled}
            required={required}
            className={inputClasses}
            placeholder=" " // Required for the floating label trick
            rows={multiline ? rows : undefined}
            {...props}
          />
          
          {label && (
            <label htmlFor={id} className={labelClasses}>
              {label} {required && '*'}
            </label>
          )}

          {endAdornment && (
            <div className={cn(
              "absolute right-0 flex items-center justify-center text-gray-500 z-20",
              variant === 'standard' ? 'top-1/2 -translate-y-1/2' : 'inset-y-0 pr-3',
              disabled && 'text-gray-400'
            )}>
              {endAdornment}
            </div>
          )}
        </div>
        
        {helperText && (
          <p className={cn(
            "mt-1 text-xs",
            error ? "text-red-500" : "text-gray-500",
            variant === 'standard' ? '' : 'px-3'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
TextField.displayName = 'TextField';
