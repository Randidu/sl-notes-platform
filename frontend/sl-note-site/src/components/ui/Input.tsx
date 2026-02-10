import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-300
          bg-white dark:bg-slate-800 
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 animate-fade-in">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    );
};

export default Input;
