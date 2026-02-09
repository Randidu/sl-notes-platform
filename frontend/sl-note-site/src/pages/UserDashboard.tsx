import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, FileText, Clock, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { noteService } from '../services/noteService';
import type { Note } from '../types';

const UserDashboard: React.FC = () => {
    const [userNotes, setUserNotes] = useState<Note[]>([]);
    const [recentNotes, setRecentNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === 'dark';

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadData();
    }, [isAuthenticated, navigate]);

    const loadData = async () => {
        try {
            const [myNotes, allNotes] = await Promise.all([
                noteService.getUserNotes(),
                noteService.getAll({ per_page: 5 }),
            ]);
            setUserNotes(myNotes);
            setRecentNotes(allNotes.notes || []);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalViews = userNotes.reduce((acc, n) => acc + n.view_count, 0);
    const publishedNotes = userNotes.filter(n => n.is_published).length;

    const statCards = [
        { label: 'Notes Created', value: userNotes.length, icon: FileText, color: '#3b82f6' },
        { label: 'Published', value: publishedNotes, icon: TrendingUp, color: '#10b981' },
        { label: 'Total Views', value: totalViews, icon: Eye, color: '#8b5cf6' },
    ];

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '24px',
    };

    if (!isAuthenticated) return null;

    return (
        <div style={{ padding: '32px 0', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                        Welcome back, {user?.full_name}! 👋
                    </h1>
                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Here's your learning dashboard overview.
                    </p>
                </div>

                {/* Admin Link */}
                {user?.is_admin && (
                    <Link
                        to="/admin"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #ef4444, #f97316)',
                            color: 'white',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            marginBottom: '24px',
                        }}
                    >
                        🛡️ Go to Admin Panel
                    </Link>
                )}

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
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

                {/* Two Column Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {/* My Notes */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827' }}>
                                My Notes
                            </h2>
                            <Link to="/profile" style={{ color: '#3b82f6', fontSize: '14px', textDecoration: 'none' }}>
                                View all →
                            </Link>
                        </div>
                        <div style={cardStyle}>
                            {loading ? (
                                <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Loading...</p>
                            ) : userNotes.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {userNotes.slice(0, 4).map((note) => (
                                        <Link key={note.id} to={`/notes/${note.id}`} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px',
                                            backgroundColor: isDark ? '#374151' : '#f9fafb',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                        }}>
                                            <div>
                                                <p style={{ fontWeight: 500, color: isDark ? '#f9fafb' : '#111827', marginBottom: '4px' }}>
                                                    {note.title.substring(0, 30)}...
                                                </p>
                                                <p style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                                    {note.topic || 'General'}
                                                </p>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '13px',
                                                color: isDark ? '#9ca3af' : '#6b7280',
                                            }}>
                                                <Eye size={14} /> {note.view_count}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '24px' }}>
                                    <FileText style={{ width: '32px', height: '32px', color: isDark ? '#6b7280' : '#9ca3af', margin: '0 auto 12px' }} />
                                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '12px' }}>
                                        No notes yet
                                    </p>
                                    {user?.is_admin && (
                                        <Link to="/admin/notes/create" style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            color: '#3b82f6',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                        }}>
                                            <Plus size={16} /> Create your first note
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Notes */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827' }}>
                                Recent Notes
                            </h2>
                            <Link to="/subjects" style={{ color: '#3b82f6', fontSize: '14px', textDecoration: 'none' }}>
                                Browse all →
                            </Link>
                        </div>
                        <div style={cardStyle}>
                            {loading ? (
                                <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Loading...</p>
                            ) : recentNotes.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {recentNotes.map((note) => (
                                        <Link key={note.id} to={`/notes/${note.id}`} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px',
                                            backgroundColor: isDark ? '#374151' : '#f9fafb',
                                            borderRadius: '10px',
                                            textDecoration: 'none',
                                        }}>
                                            <div>
                                                <p style={{ fontWeight: 500, color: isDark ? '#f9fafb' : '#111827', marginBottom: '4px' }}>
                                                    {note.title.substring(0, 30)}...
                                                </p>
                                                <p style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                                    {note.topic || 'General'}
                                                </p>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '13px',
                                                color: isDark ? '#9ca3af' : '#6b7280',
                                            }}>
                                                <Clock size={14} /> {new Date(note.created_at).toLocaleDateString()}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', textAlign: 'center', padding: '24px' }}>
                                    No recent notes
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ marginTop: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '16px' }}>
                        Quick Actions
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <Link to="/subjects" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                            color: isDark ? '#60a5fa' : '#1d4ed8',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}>
                            <BookOpen size={18} /> Browse Subjects
                        </Link>
                        <Link to="/search" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: isDark ? '#4c1d95' : '#ede9fe',
                            color: isDark ? '#a78bfa' : '#6d28d9',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}>
                            🔍 Search Notes
                        </Link>
                        <Link to="/profile" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: isDark ? '#064e3b' : '#d1fae5',
                            color: isDark ? '#34d399' : '#047857',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}>
                            👤 My Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
