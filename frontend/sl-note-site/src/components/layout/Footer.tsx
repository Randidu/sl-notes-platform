import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.png';

const Footer: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const linkStyle: React.CSSProperties = {
        color: '#9ca3af',
        textDecoration: 'none',
        transition: 'color 0.2s',
    };

    return (
        <footer style={{ backgroundColor: isDark ? '#0f172a' : '#111827', color: '#d1d5db', padding: '64px 0 32px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <img
                                src={logo}
                                alt="SL Notes Logo"
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                }}
                            />
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Sl Note Site</span>
                        </div>
                        <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>
                            Comprehensive exam preparation platform for O/L and A/L students in Sri Lanka.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '20px' }}>Quick Links</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/subjects" style={linkStyle}>All Subjects</Link>
                            <Link to="/subjects?type=OL" style={linkStyle}>O/L Notes</Link>
                            <Link to="/subjects?type=AL" style={linkStyle}>A/L Notes</Link>
                            <Link to="/about" style={linkStyle}>About Us</Link>
                        </div>
                    </div>

                    {/* Popular */}
                    <div>
                        <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '20px' }}>Popular Subjects</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/subjects" style={linkStyle}>Mathematics</Link>
                            <Link to="/subjects" style={linkStyle}>Science</Link>
                            <Link to="/subjects" style={linkStyle}>English</Link>
                            <Link to="/subjects" style={linkStyle}>Sinhala</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '20px' }}>Contact Us</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Mail style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
                                <span style={{ color: '#9ca3af' }}>info@slnotes.lk</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Phone style={{ width: '18px', height: '18px', color: '#10b981' }} />
                                <span style={{ color: '#9ca3af' }}>+94 77 123 4567</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
                                <span style={{ color: '#9ca3af' }}>Colombo, Sri Lanka</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ borderTop: '1px solid #374151', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <p style={{ color: '#6b7280', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        © {new Date().getFullYear()} SL Notes. Made with <Heart style={{ width: '14px', height: '14px', color: '#ef4444' }} /> in Sri Lanka
                    </p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <Link to="/privacy" style={{ ...linkStyle, fontSize: '14px' }}>Privacy Policy</Link>
                        <Link to="/terms" style={{ ...linkStyle, fontSize: '14px' }}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
