import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { adminService } from '../../services/adminService';
import { noteService } from '../../services/noteService';
import type { Note } from '../../types';

const NotesManagement: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
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
        loadNotes();
    }, [isAuthenticated, user, navigate]);

    const loadNotes = async () => {
        try {
            const data = await adminService.getAllNotes();
            setNotes(data);
        } catch (error) {
            console.error('Failed to load notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (noteId: number) => {
        try {
            await adminService.toggleNotePublish(noteId);
            setNotes(notes.map(n => n.id === noteId ? { ...n, is_published: !n.is_published } : n));
        } catch (error) {
            console.error('Failed to toggle publish:', error);
        }
    };

    const deleteNote = async (noteId: number) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            await noteService.delete(noteId);
            setNotes(notes.filter(n => n.id !== noteId));
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

    if (!user?.is_admin) return null;

    return (
        <div style={{ padding: '32px 0', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                <AdminNavbar />
                <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
                    <ArrowLeft size={20} /> Back to Admin Dashboard
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                            Notes Management
                        </h1>
                        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                            Review, publish, and manage all notes.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/notes/create')}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <Plus size={20} /> Create Note
                    </button>
                </div>

                {/* Notes Table */}
                <div style={cardStyle}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}>
                                    <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#d1d5db' : '#374151', fontWeight: 600 }}>Title</th>
                                    <th style={{ padding: '16px', textAlign: 'left', color: isDark ? '#d1d5db' : '#374151', fontWeight: 600 }}>Topic</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: isDark ? '#d1d5db' : '#374151', fontWeight: 600 }}>Views</th>
                                    <th style={{ padding: '16px', textAlign: 'center', color: isDark ? '#d1d5db' : '#374151', fontWeight: 600 }}>Status</th>
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
                                ) : notes.length > 0 ? (
                                    notes.map((note) => (
                                        <tr key={note.id} style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                                            <td style={{ padding: '16px' }}>
                                                <Link to={`/notes/${note.id}`} style={{ color: isDark ? '#f9fafb' : '#111827', textDecoration: 'none', fontWeight: 500 }}>
                                                    {note.title}
                                                </Link>
                                                <div style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                                    {new Date(note.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px', color: isDark ? '#d1d5db' : '#4b5563' }}>
                                                {note.topic || '-'}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center', color: isDark ? '#d1d5db' : '#4b5563' }}>
                                                {note.view_count}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '16px',
                                                    backgroundColor: note.is_published ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#78350f' : '#fef3c7'),
                                                    color: note.is_published ? '#10b981' : '#f59e0b',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                }}>
                                                    {note.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                    <button
                                                        onClick={() => togglePublish(note.id)}
                                                        style={{
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                                            color: note.is_published ? '#f59e0b' : '#10b981',
                                                            cursor: 'pointer',
                                                        }}
                                                        title={note.is_published ? 'Unpublish' : 'Publish'}
                                                    >
                                                        {note.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteNote(note.id)}
                                                        style={{
                                                            padding: '8px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                                            color: '#ef4444',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                            No notes found.
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

export default NotesManagement;
