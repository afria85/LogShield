// src/components/ui/Card.jsx
// Card component with variants and dark mode support

import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Card = forwardRef(({
  children,
  className,
  variant = 'default',
  hover = false,
  padding = true,
  ...props
}, ref) => {
  const baseStyles = `
    rounded-xl
    transition-all duration-300 ease-out
  `;

  const variants = {
    default: `
      bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700
      shadow-sm
    `,
    elevated: `
      bg-white dark:bg-slate-800
      border border-slate-200 dark:border-slate-700
      shadow-lg
    `,
    outline: `
      bg-transparent
      border border-slate-200 dark:border-slate-700
    `,
    ghost: `
      bg-slate-50 dark:bg-slate-800/50
      border-0
    `,
    gradient: `
      bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900
      border border-slate-200 dark:border-slate-700
      shadow-sm
    `
  };

  const hoverStyles = hover ? `
    hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800
    hover:-translate-y-0.5 hover:scale-[1.01]
    cursor-pointer
  ` : '';

  const paddingStyles = padding ? 'p-6' : '';

  return (
    <div
      ref={ref}
      className={clsx(
        baseStyles,
        variants[variant],
        hoverStyles,
        paddingStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header
const CardHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('mb-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

// Card Title
const CardTitle = forwardRef(({ children, className, ...props }, ref) => (
  <h3
    ref={ref}
    className={clsx(
      'text-lg font-semibold text-slate-900 dark:text-white',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

// Card Description
const CardDescription = forwardRef(({ children, className, ...props }, ref) => (
  <p
    ref={ref}
    className={clsx(
      'text-sm text-slate-600 dark:text-slate-400',
      className
    )}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

// Card Content
const CardContent = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('', className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

// Card Footer
const CardFooter = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx('mt-4 pt-4 border-t border-slate-200 dark:border-slate-700', className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
