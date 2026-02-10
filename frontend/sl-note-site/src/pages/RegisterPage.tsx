import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === 'dark';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const message = await register(fullName, email, password);
            setSuccess(message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to register. Please try again.');
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
                        Create Account
                    </h1>
                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Join SL Notes today</p>
                </div>

                {/* Form */}
                <div style={{ padding: '32px' }}>
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                backgroundColor: isDark ? '#064e3b' : '#d1fae5',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                            }}>
                                <CheckCircle style={{ width: '32px', height: '32px', color: '#10b981' }} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                                Registration Successful!
                            </h2>
                            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '16px' }}>{success}</p>
                            <p style={{ fontSize: '14px', color: isDark ? '#6b7280' : '#9ca3af' }}>Redirecting to login...</p>
                        </div>
                    ) : (
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

                            {/* Full Name */}
                            <div style={{ position: 'relative', marginBottom: '16px' }}>
                                <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>

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
                            <div style={{ position: 'relative', marginBottom: '16px' }}>
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

                            {/* Confirm Password */}
                            <div style={{ position: 'relative', marginBottom: '24px' }}>
                                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <button type="submit" style={buttonStyle} disabled={loading}>
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    {!success && (
                        <p style={{ textAlign: 'center', marginTop: '24px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
