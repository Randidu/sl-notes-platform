import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Shield, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { adminService } from '../../services/adminService';

interface UserItem {
    id: number;
    email: string;
    full_name: string;
    is_verified: boolean;
    is_admin: boolean;
    created_at: string;
}

const UsersManagement: React.FC = () => {
    const [users, setUsers] = useState<UserItem[]>([]);
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
        loadUsers();
    }, [isAuthenticated, user, navigate]);

    const loadUsers = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerified = async (userId: number, currentStatus: boolean) => {
        try {
            await adminService.updateUser(userId, { is_verified: !currentStatus });
            setUsers(users.map(u => u.id === userId ? { ...u, is_verified: !currentStatus } : u));
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const toggleAdmin = async (userId: number, currentStatus: boolean) => {
        try {
            await adminService.updateUser(userId, { is_admin: !currentStatus });
            setUsers(users.map(u => u.id === userId ? { ...u, is_admin: !currentStatus } : u));
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const deleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminService.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        overflow: 'hidden',
    };

    if (!user?.is_admin) return null;

    return (
        <div style={{ padding: '32px 0', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                {/* Header */}
                <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
                    <ArrowLeft size={20} /> Back to Admin Dashboard
                </Link>

                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                    Users Management
                </h1>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '32px' }}>
                    Manage user accounts, verification status, and admin access.
                </p>

                {/* Users Table */}
                <div style={cardStyle}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#d1d5db' : '#374151', fontWeight: 600 }}>User</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#d1d5db' : '#374151', fontWeight: 600 }}>Email</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: isDark ? '#d1d5db' : '#374151', fontWeight: 600 }}>Verified</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: isDark ? '#d1d5db' : '#374151', fontWeight: 600 }}>Admin</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: isDark ? '#d1d5db' : '#374151', fontWeight: 600 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                            Loading...
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((u) => (
                                        <tr key={u.id} style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                                            <td style={{ padding: '16px', color: isDark ? '#f9fafb' : '#111827' }}>
                                                <div style={{ fontWeight: 500 }}>{u.full_name}</div>
                                                <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                                    Joined {new Date(u.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', color: isDark ? '#d1d5db' : '#4b5563' }}>{u.email}</td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => toggleVerified(u.id, u.is_verified)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        backgroundColor: u.is_verified ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#7f1d1d' : '#fee2e2'),
                                                        color: u.is_verified ? '#10b981' : '#ef4444',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                    }}
                                                >
                                                    {u.is_verified ? <Check size={14} /> : <X size={14} />}
                                                    {u.is_verified ? 'Yes' : 'No'}
                                                </button>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => toggleAdmin(u.id, u.is_admin)}
                                                    disabled={u.id === user.id}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        cursor: u.id === user.id ? 'not-allowed' : 'pointer',
                                                        backgroundColor: u.is_admin ? (isDark ? '#4c1d95' : '#ede9fe') : (isDark ? '#374151' : '#f3f4f6'),
                                                        color: u.is_admin ? '#8b5cf6' : (isDark ? '#9ca3af' : '#6b7280'),
                                                        opacity: u.id === user.id ? 0.5 : 1,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                    }}
                                                >
                                                    <Shield size={14} />
                                                    {u.is_admin ? 'Admin' : 'User'}
                                                </button>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => deleteUser(u.id)}
                                                    disabled={u.id === user.id}
                                                    style={{
                                                        padding: '8px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        cursor: u.id === user.id ? 'not-allowed' : 'pointer',
                                                        backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                                        color: '#ef4444',
                                                        opacity: u.id === user.id ? 0.5 : 1,
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;
