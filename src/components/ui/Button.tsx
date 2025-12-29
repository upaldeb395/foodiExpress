import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

import { MotionProps } from 'framer-motion';

type ButtonProps = (
  MotionProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragTransitionEnd' | 'onHoverEnd' | 'onHoverStart' | 'onPan' | 'onPanEnd' | 'onPanStart' | 'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onTap' | 'onTapCancel' | 'onTapStart' | 'onTapUpdate'>
) & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, icon, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-orange-400',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus:ring-gray-300',
      outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white focus:ring-orange-400',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-gray-300',
      destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400'
    };

    const sizes = {
      sm: 'text-sm px-3 py-2 gap-2',
      md: 'text-base px-4 py-2.5 gap-2',
      lg: 'text-lg px-6 py-3 gap-3',
      xl: 'text-xl px-8 py-4 gap-3'
    };

    return (
      <motion.button
        ref={ref}
        className={clsx(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon && <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;