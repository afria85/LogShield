// src/components/ui/Badge.jsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Badge = forwardRef(({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200',
    primary: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
    secondary: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
    success: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
    warning: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300',
    danger: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
    info: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      ref={ref}
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        'transition-colors duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
