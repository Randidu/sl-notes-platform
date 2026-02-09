import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, User, LogOut, Search, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

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

    const navStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
    };

    const linkStyle: React.CSSProperties = {
        color: isDark ? '#d1d5db' : '#4b5563',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'color 0.2s',
    };

    return (
        <nav style={navStyle}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <BookOpen style={{ width: '20px', height: '20px', color: 'white' }} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isDark ? '#fff' : '#111827' }}>
                            SL Notes
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {!isMobile && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <Link to="/subjects" style={linkStyle}>Subjects</Link>
                                <Link to="/subjects?type=OL" style={linkStyle}>O/L</Link>
                                <Link to="/subjects?type=AL" style={linkStyle}>A/L</Link>
                            </div>

                            {/* Search Bar */}
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
                            </form>

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
                                        <Link to="/dashboard" style={{ ...linkStyle, fontWeight: 600 }}>Dashboard</Link>
                                        {user?.is_admin && (
                                            <Link to="/admin" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>Admin</Link>
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
                                        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#ef4444' }}>
                                            <LogOut size={20} />
                                        </button>
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
                            <Link to="/subjects" onClick={() => setIsMenuOpen(false)} style={{ ...linkStyle, padding: '0.75rem 0' }}>All Subjects</Link>
                            <Link to="/subjects?type=OL" onClick={() => setIsMenuOpen(false)} style={{ ...linkStyle, padding: '0.75rem 0' }}>O/L Subjects</Link>
                            <Link to="/subjects?type=AL" onClick={() => setIsMenuOpen(false)} style={{ ...linkStyle, padding: '0.75rem 0' }}>A/L Subjects</Link>
                            <div style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, marginTop: '0.5rem', paddingTop: '0.75rem' }}>
                                {isAuthenticated ? (
                                    <>
                                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ ...linkStyle, display: 'block', padding: '0.75rem 0' }}>Dashboard</Link>
                                        {user?.is_admin && (
                                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: '#ef4444', textDecoration: 'none', display: 'block', padding: '0.75rem 0', fontWeight: 600 }}>🛡️ Admin Panel</Link>
                                        )}
                                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} style={{ ...linkStyle, display: 'block', padding: '0.75rem 0' }}>Profile</Link>
                                        <button onClick={() => { logout(); setIsMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '0.75rem 0', background: 'none', border: 'none', color: '#ef4444', fontWeight: 500, cursor: 'pointer', fontSize: '16px' }}>Sign Out</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ ...linkStyle, display: 'block', padding: '0.75rem 0' }}>Sign In</Link>
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
