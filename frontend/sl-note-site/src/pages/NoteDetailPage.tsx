import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, User, FileText, Download, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { noteService } from '../services/noteService';
import { API_BASE_URL } from '../services/api';
import type { Note } from '../types';

// Helper function to get full file URL
const getFileUrl = (fileUrl: string | null | undefined): string | null => {
    if (!fileUrl) return null;
    // If it's already a full URL, return as is
    if (fileUrl.startsWith('http')) return fileUrl;
    // Otherwise, prepend the API base URL
    return `${API_BASE_URL}${fileUrl}`;
};

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
                console.log('Note data:', data);
                console.log('File URL:', data.file_url);
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
                        {getFileUrl(note.file_url) && (
                            <div style={{ marginTop: '32px' }}>
                                {/* Action Buttons */}
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginBottom: '20px',
                                    flexWrap: 'wrap',
                                }}>
                                    <a
                                        href={getFileUrl(note.file_url) || '#'}
                                        download
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '12px 24px',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            borderRadius: '12px',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '15px',
                                            transition: 'all 0.2s',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#2563eb';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#3b82f6';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <Download size={18} /> Download PDF
                                    </a>
                                    <a
                                        href={getFileUrl(note.file_url) || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '12px 24px',
                                            backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                            color: isDark ? '#f9fafb' : '#111827',
                                            borderRadius: '12px',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '15px',
                                            transition: 'all 0.2s',
                                            border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = isDark ? '#4b5563' : '#e5e7eb';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <ExternalLink size={18} /> Open in New Tab
                                    </a>
                                </div>

                                {/* PDF Preview */}
                                <div style={{
                                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                    borderRadius: '16px',
                                    border: `2px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                                    overflow: 'hidden',
                                    boxShadow: isDark
                                        ? '0 10px 40px rgba(0,0,0,0.3)'
                                        : '0 10px 40px rgba(0,0,0,0.1)',
                                }}>
                                    <div style={{
                                        padding: '16px 20px',
                                        backgroundColor: isDark ? '#374151' : '#f9fafb',
                                        borderBottom: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                    }}>
                                        <FileText style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                                        <span style={{
                                            fontWeight: 600,
                                            color: isDark ? '#f9fafb' : '#111827',
                                            fontSize: '15px',
                                        }}>
                                            PDF Preview
                                        </span>
                                    </div>
                                    <iframe
                                        src={getFileUrl(note.file_url) || ''}
                                        style={{
                                            width: '100%',
                                            height: '800px',
                                            border: 'none',
                                            display: 'block',
                                        }}
                                        title="PDF Preview"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetailPage;
