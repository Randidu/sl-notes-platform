import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, BookOpen, Eye, TrendingUp, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { adminService } from '../../services/adminService';

interface Stats {
    total_users: number;
    total_notes: number;
    total_subjects: number;
    verified_users: number;
    published_notes: number;
    total_views: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === 'dark';

    useEffect(() => {
        if (!isAuthenticated || !user?.is_admin) {
            navigate('/');
            return;
        }

        const loadStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to load stats:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [isAuthenticated, user, navigate]);

    const statCards = stats ? [
        { label: 'Total Users', value: stats.total_users, icon: Users, color: '#3b82f6' },
        { label: 'Verified Users', value: stats.verified_users, icon: Users, color: '#10b981' },
        { label: 'Total Notes', value: stats.total_notes, icon: FileText, color: '#8b5cf6' },
        { label: 'Published Notes', value: stats.published_notes, icon: FileText, color: '#f59e0b' },
        { label: 'Total Subjects', value: stats.total_subjects, icon: BookOpen, color: '#ec4899' },
        { label: 'Total Views', value: stats.total_views, icon: Eye, color: '#06b6d4' },
    ] : [];

    const menuItems = [
        { label: 'Manage Users', path: '/admin/users', icon: Users, desc: 'View and manage user accounts' },
        { label: 'Manage Notes', path: '/admin/notes', icon: FileText, desc: 'Review and edit notes' },
        { label: 'Manage Subjects', path: '/admin/subjects', icon: BookOpen, desc: 'Add and edit subjects' },
        { label: 'Create Note', path: '/admin/notes/create', icon: TrendingUp, desc: 'Create a new note' },
    ];

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '24px',
    };

    if (!user?.is_admin) return null;

    return (
        <div style={{ padding: '32px 0', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                        Admin Dashboard
                    </h1>
                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Welcome back, {user.full_name}. Manage your platform from here.
                    </p>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ ...cardStyle, height: '120px', backgroundColor: isDark ? '#374151' : '#e5e7eb' }} />
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        {statCards.map((stat, i) => (
                            <div key={i} style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        backgroundColor: `${stat.color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <stat.icon style={{ width: '20px', height: '20px', color: stat.color }} />
                                    </div>
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827' }}>
                                    {stat.value}
                                </p>
                                <p style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '16px' }}>
                    Quick Actions
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                    {menuItems.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(item.path)}
                            style={{
                                ...cardStyle,
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <item.icon style={{ width: '24px', height: '24px', color: 'white' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '4px' }}>
                                        {item.label}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
