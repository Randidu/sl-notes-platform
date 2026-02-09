import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, User, FileText, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { noteService } from '../services/noteService';
import type { Note } from '../types';

const NoteDetailPage: React.FC = () => {
    const { noteId } = useParams<{ noteId: string }>();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const isDark = theme === 'dark';

    useEffect(() => {
        const loadNote = async () => {
            if (!noteId) return;
            try {
                const data = await noteService.getById(parseInt(noteId));
                setNote(data);
            } catch (error) {
                console.error('Failed to load note:', error);
            } finally {
                setLoading(false);
            }
        };
        loadNote();
    }, [noteId]);

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '20px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        overflow: 'hidden',
    };

    if (loading) {
        return (
            <div style={{ padding: '48px 0' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
                    <div style={{ ...cardStyle, height: '400px', backgroundColor: isDark ? '#374151' : '#e5e7eb' }} />
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '1.125rem' }}>Note not found.</p>
                <Link to="/subjects" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
                    Back to Subjects
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '48px 0' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
                {/* Back Link */}
                <Link
                    to={note.subject_id ? `/subjects/${note.subject_id}/notes` : '/subjects'}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}
                >
                    <ArrowLeft size={20} /> Back to Notes
                </Link>

                {/* Main Card */}
                <div style={cardStyle}>
                    {/* Header */}
                    <div style={{ padding: '32px', borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                        {note.topic && (
                            <span style={{
                                display: 'inline-block',
                                padding: '6px 16px',
                                backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                                color: isDark ? '#60a5fa' : '#1d4ed8',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '16px',
                            }}>
                                {note.topic}
                            </span>
                        )}
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '16px' }}>
                            {note.title}
                        </h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={16} /> {note.author?.full_name || 'Unknown'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={16} /> {new Date(note.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Eye size={16} /> {note.view_count} views
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '32px' }}>
                        <div style={{
                            color: isDark ? '#d1d5db' : '#374151',
                            fontSize: '16px',
                            lineHeight: 1.8,
                            whiteSpace: 'pre-wrap',
                        }}>
                            {note.content}
                        </div>

                        {/* Attachment */}
                        {note.file_url && (
                            <div style={{
                                marginTop: '32px',
                                padding: '20px',
                                backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FileText style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                                    <div>
                                        <p style={{ fontWeight: 500, color: isDark ? '#f9fafb' : '#111827' }}>Attachment</p>
                                        <p style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>PDF Document</p>
                                    </div>
                                </div>
                                <a
                                    href={note.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 20px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                    }}
                                >
                                    <Download size={18} /> Download
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetailPage;
