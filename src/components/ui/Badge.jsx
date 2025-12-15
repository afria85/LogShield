// src/components/ui/Badge.jsx
// Badge component with variants for status indicators

import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Badge = forwardRef(({
  children,
  className,
  variant = 'default',
  size = 'sm',
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    rounded-full transition-all duration-200
  `;

  const variants = {
    default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    primary: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
    success: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    danger: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
    info: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300',
    purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
    outline: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-transparent'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm'
  };

  return (
    <span
      ref={ref}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

// Status Badge with dot indicator
const StatusBadge = forwardRef(({ 
  children, 
  status = 'default',
  className,
  ...props 
}, ref) => {
  const statusColors = {
    default: 'bg-slate-400',
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-amber-500',
    error: 'bg-red-500'
  };

  return (
    <span
      ref={ref}
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
        className
      )}
      {...props}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', statusColors[status])} />
      {children}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Counter Badge (for notifications)
const CounterBadge = forwardRef(({ 
  count = 0,
  max = 99,
  className,
  ...props 
}, ref) => {
  const displayCount = count > max ? `${max}+` : count;
  
  if (count === 0) return null;

  return (
    <span
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1',
        'rounded-full text-xs font-bold',
        'bg-red-500 text-white',
        className
      )}
      {...props}
    >
      {displayCount}
    </span>
  );
});

CounterBadge.displayName = 'CounterBadge';

export { Badge, StatusBadge, CounterBadge };
export default Badge;
