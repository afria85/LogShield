// src/components/ui/Input.jsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({
  className,
  type = 'text',
  error,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <input
        type={type}
        ref={ref}
        className={clsx(
          'w-full px-4 py-2',
          'bg-white dark:bg-slate-800',
          'border rounded-lg',
          'text-slate-900 dark:text-slate-100',
          'placeholder-slate-400 dark:placeholder-slate-500',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-slate-600',
          Icon && 'pl-10',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

const Textarea = forwardRef(({
  className,
  error,
  ...props
}, ref) => {
  return (
    <div>
      <textarea
        ref={ref}
        className={clsx(
          'w-full p-4',
          'font-mono text-sm',
          'bg-white dark:bg-slate-800',
          'border rounded-lg',
          'text-slate-900 dark:text-slate-100',
          'placeholder-slate-400 dark:placeholder-slate-500',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'resize-none',
          error 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-slate-600',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Input, Textarea };
export default Input;
