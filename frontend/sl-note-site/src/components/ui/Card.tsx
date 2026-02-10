import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    onClick,
}) => {
    return (
        <div
            className={`
        bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 
        shadow-sm dark:shadow-slate-900/20 transition-theme
        ${hover ? 'transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-100 dark:border-slate-700 ${className}`}>{children}</div>
);

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
);

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t border-gray-100 dark:border-slate-700 ${className}`}>{children}</div>
);

export default Card;
