// src/components/ui/Card.jsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Card = forwardRef(({
  children,
  className,
  hover = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'bg-white dark:bg-slate-800',
        'border border-gray-200 dark:border-slate-700',
        'rounded-xl shadow-sm',
        'transition-all duration-200',
        hover && 'hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('px-6 py-4 border-b border-gray-200 dark:border-slate-700', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('px-6 py-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('px-6 py-4 border-t border-gray-200 dark:border-slate-700', className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
export default Card;
