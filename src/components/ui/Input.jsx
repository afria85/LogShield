// src/components/ui/Input.jsx
// Input component with variants and validation states

import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { AlertCircle, Check, Info } from 'lucide-react';

const Input = forwardRef(({
  className,
  type = 'text',
  variant = 'default',
  size = 'md',
  error,
  success,
  hint,
  label,
  required,
  disabled,
  icon: Icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseStyles = `
    w-full rounded-lg border
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-slate-400 dark:placeholder:text-slate-500
  `;

  const variants = {
    default: `
      bg-white dark:bg-slate-800
      border-slate-300 dark:border-slate-600
      text-slate-900 dark:text-slate-100
      focus:border-blue-500 focus:ring-blue-500/20
    `,
    filled: `
      bg-slate-100 dark:bg-slate-700
      border-transparent
      text-slate-900 dark:text-slate-100
      focus:bg-white dark:focus:bg-slate-800
      focus:border-blue-500 focus:ring-blue-500/20
    `,
    outline: `
      bg-transparent
      border-slate-300 dark:border-slate-600
      text-slate-900 dark:text-slate-100
      focus:border-blue-500 focus:ring-blue-500/20
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const stateStyles = error 
    ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : success
      ? 'border-emerald-500 dark:border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20'
      : '';

  const iconPadding = Icon 
    ? iconPosition === 'left' ? 'pl-10' : 'pr-10'
    : '';

  const inputElement = (
    <div className="relative">
      {Icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <Icon className="w-5 h-5" />
        </div>
      )}
      
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          stateStyles,
          iconPadding,
          className
        )}
        {...props}
      />
      
      {Icon && iconPosition === 'right' && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <Icon className="w-5 h-5" />
        </div>
      )}
      
      {/* Status icons */}
      {(error || success) && !Icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {error && <AlertCircle className="w-5 h-5 text-red-500" />}
          {success && <Check className="w-5 h-5 text-emerald-500" />}
        </div>
      )}
    </div>
  );

  // Return just input if no label/hint
  if (!label && !hint && !error) {
    return inputElement;
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {inputElement}
      
      {(hint || error) && (
        <p className={clsx(
          'text-sm flex items-center gap-1',
          error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'
        )}>
          {error ? (
            <>
              <AlertCircle className="w-3 h-3" />
              {error}
            </>
          ) : hint ? (
            <>
              <Info className="w-3 h-3" />
              {hint}
            </>
          ) : null}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea component
const Textarea = forwardRef(({
  className,
  variant = 'default',
  error,
  label,
  hint,
  required,
  rows = 4,
  ...props
}, ref) => {
  const baseStyles = `
    w-full rounded-lg border resize-none
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    font-mono text-sm
  `;

  const variants = {
    default: `
      bg-white dark:bg-slate-800
      border-slate-300 dark:border-slate-600
      text-slate-900 dark:text-slate-100
      focus:border-blue-500 focus:ring-blue-500/20
    `
  };

  const stateStyles = error 
    ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : '';

  const textareaElement = (
    <textarea
      ref={ref}
      rows={rows}
      className={clsx(baseStyles, variants[variant], stateStyles, 'p-4', className)}
      {...props}
    />
  );

  if (!label && !hint && !error) {
    return textareaElement;
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {textareaElement}
      
      {(hint || error) && (
        <p className={clsx(
          'text-sm flex items-center gap-1',
          error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'
        )}>
          {error ? (
            <>
              <AlertCircle className="w-3 h-3" />
              {error}
            </>
          ) : hint}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Input, Textarea };
export default Input;
