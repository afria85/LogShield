// src/components/ui/Card.jsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Card = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'rounded-xl border bg-white shadow-sm transition-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export { Card };