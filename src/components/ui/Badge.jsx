// src/components/ui/Badge.jsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Badge = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
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