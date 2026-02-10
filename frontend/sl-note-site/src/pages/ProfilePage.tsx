import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, FileText, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { noteService } from '../services/noteService';
import type { Note } from '../types';

const ProfilePage: React.FC = () => {
    const [userNotes, setUserNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === 'dark';

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const loadNotes = async () => {
            try {
                const data = await noteService.getUserNotes();
                setUserNotes(data);
            } catch (error) {
                console.error('Failed to load notes:', error);
            } finally {
                setLoading(false);
            }
        };
        loadNotes();
    }, [isAuthenticated, navigate]);

    const handleDelete = async (noteId: number) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            await noteService.delete(noteId);
            setUserNotes(userNotes.filter((n) => n.id !== noteId));
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        overflow: 'hidden',
    };

    if (!isAuthenticated) return null;

    return (
        <div style={{ padding: '48px 0' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
                {/* Profile Card */}
                <div style={{ ...cardStyle, marginBottom: '32px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        padding: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <User style={{ width: '40px', height: '40px', color: 'white' }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                                {user?.full_name}
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={16} /> {user?.email}
                            </p>
                        </div>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', gap: '32px' }}>
                        <div>
                            <p style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827' }}>{userNotes.length}</p>
                            <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Notes Created</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827' }}>
                                {userNotes.reduce((acc, n) => acc + n.view_count, 0)}
                            </p>
                            <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Total Views</p>
                        </div>
                    </div>
                    <div style={{ padding: '0 24px 24px', borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to sign out?')) {
                                    logout();
                                }
                            }}
                            style={{
                                width: '100%',
                                padding: '12px 24px',
                                backgroundColor: isDark ? '#7f1d1d' : '#fee2e2',
                                color: isDark ? '#fca5a5' : '#dc2626',
                                border: `1px solid ${isDark ? '#991b1b' : '#fecaca'}`,
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? '#991b1b' : '#fecaca';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? '#7f1d1d' : '#fee2e2';
                            }}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* My Notes Section */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '24px' }}>
                        My Notes
                    </h2>

                    {loading ? (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} style={{ ...cardStyle, height: '100px', backgroundColor: isDark ? '#374151' : '#e5e7eb' }} />
                            ))}
                        </div>
                    ) : userNotes.length > 0 ? (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {userNotes.map((note) => (
                                <div key={note.id} style={{ ...cardStyle, padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <Link to={`/notes/${note.id}`} style={{ textDecoration: 'none' }}>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                                                    {note.title}
                                                </h3>
                                            </Link>
                                            <div style={{ display: 'flex', gap: '16px', color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Calendar size={14} /> {new Date(note.created_at).toLocaleDateString()}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    👁 {note.view_count} views
                                                </span>
                                                <span style={{
                                                    padding: '2px 10px',
                                                    borderRadius: '12px',
                                                    backgroundColor: note.is_published ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#78350f' : '#fef3c7'),
                                                    color: note.is_published ? '#10b981' : '#f59e0b',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                }}>
                                                    {note.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => navigate(`/notes/${note.id}/edit`)}
                                                style={{
                                                    padding: '8px',
                                                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    color: '#3b82f6',
                                                }}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                style={{
                                                    padding: '8px',
                                                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    color: '#ef4444',
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ ...cardStyle, padding: '48px', textAlign: 'center' }}>
                            <FileText style={{ width: '48px', height: '48px', color: isDark ? '#6b7280' : '#9ca3af', margin: '0 auto 16px' }} />
                            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '1.125rem' }}>
                                You haven't created any notes yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
