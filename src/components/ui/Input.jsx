// src/components/ui/Input.jsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({ 
  className, 
  type = 'text',
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={clsx(
        'w-full px-4 py-2 border rounded-lg transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error ? 'border-red-500' : 'border-gray-300',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };