// src/components/ui/Button.jsx
import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Button = forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  as: Component = 'button',
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
    dark:focus-visible:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98]
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 
      hover:from-blue-700 hover:to-purple-700 
      text-white shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-slate-100 dark:bg-slate-700 
      hover:bg-slate-200 dark:hover:bg-slate-600 
      text-slate-900 dark:text-slate-100
    `,
    outline: `
      border border-gray-300 dark:border-slate-600 
      bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800
      text-gray-700 dark:text-gray-300
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800
      text-gray-700 dark:text-gray-300
    `,
    danger: `
      bg-red-600 hover:bg-red-700 
      text-white shadow-md hover:shadow-lg
    `,
    success: `
      bg-green-600 hover:bg-green-700 
      text-white shadow-md hover:shadow-lg
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  return (
    <Component
      ref={ref}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;
