import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Search, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.png';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { isAuthenticated, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const isDark = theme === 'dark';

    // Helper function to check if a path is active
    const isActivePath = (path: string): boolean => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path) || location.pathname + location.search === path;
    };

    const navStyle: React.CSSProperties = {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderBottom: `1px solid ${isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
    };

    // Function to get nav link style with active state
    const getNavLinkStyle = (path: string): React.CSSProperties => {
        const isActive = isActivePath(path);
        return {
            color: isActive
                ? (isDark ? '#60a5fa' : '#3b82f6')
                : (isDark ? '#d1d5db' : '#4b5563'),
            textDecoration: 'none',
            fontWeight: isActive ? 600 : 500,
            transition: 'all 0.2s',
            position: 'relative',
            paddingBottom: '4px',
            borderBottom: isActive ? `2px solid ${isDark ? '#60a5fa' : '#3b82f6'}` : '2px solid transparent',
        };
    };

    // Function to get mobile link style with active state
    const getMobileLinkStyle = (path: string): React.CSSProperties => {
        const isActive = isActivePath(path);
        return {
            color: isActive
                ? (isDark ? '#60a5fa' : '#3b82f6')
                : (isDark ? '#d1d5db' : '#4b5563'),
            textDecoration: 'none',
            fontWeight: isActive ? 600 : 500,
            padding: '0.75rem 0',
            display: 'block',
            transition: 'all 0.2s',
            borderLeft: isActive ? `3px solid ${isDark ? '#60a5fa' : '#3b82f6'}` : '3px solid transparent',
            paddingLeft: isActive ? '12px' : '0',
        };
    };

    return (
        <nav style={navStyle}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        <img src={logo} alt="SL Notes Logo" style={{ height: '40px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isDark ? '#fff' : '#111827' }}>
                            SL Note Site
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {!isMobile && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <Link to="/" style={getNavLinkStyle('/')}>Home</Link>
                                <Link to="/subjects" style={getNavLinkStyle('/subjects')}>Subjects</Link>
                                <Link to="/subjects?type=OL" style={{ color: isDark ? '#d1d5db' : '#4b5563', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>O/L</Link>
                                <Link to="/subjects?type=AL" style={{ color: isDark ? '#d1d5db' : '#4b5563', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>A/L</Link>
                            </div>

                            {/* Search Bar
                            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                                    <input
                                        type="text"
                                        placeholder="Search notes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            paddingLeft: '40px',
                                            paddingRight: '16px',
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                            width: '240px',
                                            border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                                            borderRadius: '10px',
                                            backgroundColor: isDark ? '#374151' : '#f9fafb',
                                            color: isDark ? '#f9fafb' : '#111827',
                                            outline: 'none',
                                        }}
                                    />
                                </div>
                            </form> */}

                            {/* Right Side Desktop */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button
                                    onClick={toggleTheme}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '10px',
                                        backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: isDark ? '#fbbf24' : '#6b7280',
                                    }}
                                >
                                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                                </button>

                                {isAuthenticated ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {user?.is_admin && (
                                            <Link to="/admin" style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
                                            }}>
                                                🛡️ Admin Panel
                                            </Link>
                                        )}
                                        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: isDark ? '#d1d5db' : '#4b5563' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <User style={{ width: '18px', height: '18px', color: 'white' }} />
                                            </div>
                                            <span style={{ fontWeight: 500 }}>{user?.full_name}</span>
                                        </Link>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Link to="/login" style={{
                                            padding: '8px 16px',
                                            color: isDark ? '#d1d5db' : '#4b5563',
                                            textDecoration: 'none',
                                            fontWeight: 500,
                                        }}>
                                            Sign In
                                        </Link>
                                        <Link to="/register" style={{
                                            padding: '10px 20px',
                                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                            color: 'white',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                        }}>
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    {isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button onClick={toggleTheme} style={{ padding: '8px', background: isDark ? '#374151' : '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                {isDark ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#6b7280" />}
                            </button>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#d1d5db' : '#4b5563' }}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {isMobile && isMenuOpen && (
                    <div style={{ padding: '1rem 0', borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        paddingLeft: '40px',
                                        paddingRight: '16px',
                                        paddingTop: '12px',
                                        paddingBottom: '12px',
                                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                                        borderRadius: '10px',
                                        backgroundColor: isDark ? '#374151' : '#f9fafb',
                                        color: isDark ? '#f9fafb' : '#111827',
                                        outline: 'none',
                                    }}
                                />
                            </div>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link to="/" onClick={() => setIsMenuOpen(false)} style={getMobileLinkStyle('/')}>Home</Link>
                            <Link to="/subjects" onClick={() => setIsMenuOpen(false)} style={getMobileLinkStyle('/subjects')}>All Subjects</Link>
                            <Link to="/subjects?type=OL" onClick={() => setIsMenuOpen(false)} style={{ color: isDark ? '#d1d5db' : '#4b5563', textDecoration: 'none', fontWeight: 500, padding: '0.75rem 0', display: 'block', transition: 'color 0.2s' }}>O/L Subjects</Link>
                            <Link to="/subjects?type=AL" onClick={() => setIsMenuOpen(false)} style={{ color: isDark ? '#d1d5db' : '#4b5563', textDecoration: 'none', fontWeight: 500, padding: '0.75rem 0', display: 'block', transition: 'color 0.2s' }}>A/L Subjects</Link>
                            <div style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, marginTop: '0.5rem', paddingTop: '0.75rem' }}>
                                {isAuthenticated ? (
                                    <>
                                        {user?.is_admin && (
                                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: '#ef4444', textDecoration: 'none', display: 'block', padding: '0.75rem 0', fontWeight: 600 }}>🛡️ Admin Panel</Link>
                                        )}
                                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} style={getMobileLinkStyle('/profile')}>Profile</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)} style={getMobileLinkStyle('/login')}>Sign In</Link>
                                        <Link to="/register" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', marginTop: '0.5rem', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
