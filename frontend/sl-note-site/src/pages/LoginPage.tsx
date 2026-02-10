import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === 'dark';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '20px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '420px',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 16px 14px 48px',
        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
        borderRadius: '12px',
        backgroundColor: isDark ? '#374151' : '#f9fafb',
        color: isDark ? '#f9fafb' : '#111827',
        fontSize: '16px',
        outline: 'none',
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 200px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 16px',
        }}>
            <div style={cardStyle}>
                {/* Header */}
                <div style={{
                    padding: '32px 32px 24px',
                    textAlign: 'center',
                    borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <BookOpen style={{ width: '28px', height: '28px', color: 'white' }} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Sign in to your account</p>
                </div>

                {/* Form */}
                <div style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{
                                padding: '12px 16px',
                                backgroundColor: isDark ? '#7f1d1d' : '#fef2f2',
                                border: `1px solid ${isDark ? '#991b1b' : '#fecaca'}`,
                                borderRadius: '12px',
                                color: isDark ? '#fca5a5' : '#dc2626',
                                marginBottom: '20px',
                                fontSize: '14px',
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div style={{ position: 'relative', marginBottom: '24px' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ ...inputStyle, paddingRight: '48px' }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '24px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
