import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  variant = 'default',
  onClick
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg',
    outlined: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600',
    glass: 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/20 dark:border-gray-700/20'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : '';

  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { y: -4 },
    whileTap: { scale: 0.98 },
    onClick
  } : {};

  return (
    <Component
      className={clsx(baseClasses, variants[variant], paddings[padding], hoverClasses, className)}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card;