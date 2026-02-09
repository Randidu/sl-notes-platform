import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transform active:scale-95
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 text-white 
      hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500
      shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
      dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700
    `,
        secondary: `
      bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white 
      hover:bg-gray-200 dark:hover:bg-slate-600 focus:ring-gray-500
    `,
        outline: `
      border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 
      hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:ring-blue-500
    `,
        ghost: `
      text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 
      hover:text-gray-900 dark:hover:text-white focus:ring-gray-500
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
