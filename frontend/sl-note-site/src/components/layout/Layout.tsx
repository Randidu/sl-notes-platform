import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
            transition: 'background-color 0.3s',
        }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
