import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, icon, rightIcon, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{icon}</span>
            </div>
          )}
          
          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="w-full"
          >
            <input
              ref={ref}
              type={type}
              id={inputId}
              className={clsx(
                'block w-full rounded-xl border-2 transition-all duration-200',
                'focus:ring-2 focus:ring-orange-400 focus:border-orange-400',
                'placeholder:text-gray-400',
                icon ? 'pl-10' : 'pl-4',
                rightIcon ? 'pr-10' : 'pr-4',
                'py-3',
                error
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                  : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500',
                'dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400',
                className
              )}
              {...props}
            />
          </motion.div>
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;