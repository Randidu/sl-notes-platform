import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Eye, Calendar, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { noteService } from '../services/noteService';
import { subjectService } from '../services/subjectService';
import type { Note, Subject } from '../types';

const NotesPage: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const [notes, setNotes] = useState<Note[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [subject, setSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();

    const isDark = theme === 'dark';

    useEffect(() => {
        const loadData = async () => {
            if (!subjectId) return;
            try {
                const [subjectData, notesData] = await Promise.all([
                    subjectService.getById(parseInt(subjectId)),
                    noteService.getAll({ subject_id: parseInt(subjectId), page, per_page: 12 }),
                ]);
                setSubject(subjectData);
                setNotes(notesData.notes);
                setFilteredNotes(notesData.notes);
                setTotalPages(notesData.pages);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [subjectId, page]);

    // Filter notes based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredNotes(notes);
        } else {
            const filtered = notes.filter(note =>
                note.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredNotes(filtered);
        }
    }, [searchQuery, notes]);

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '24px',
        transition: 'transform 0.3s, box-shadow 0.3s',
    };

    return (
        <div style={{ padding: '48px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                {/* Back Link */}
                <Link to="/subjects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
                    <ArrowLeft size={20} /> Back to Subjects
                </Link>

                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                        {subject?.name || 'Loading...'}
                    </h1>
                    {subject && (
                        <span style={{
                            display: 'inline-block',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            backgroundColor: subject.exam_type === 'OL' ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#4c1d95' : '#ede9fe'),
                            color: subject.exam_type === 'OL' ? '#10b981' : '#8b5cf6',
                            fontSize: '14px',
                            fontWeight: 500,
                        }}>
                            {subject.exam_type === 'OL' ? 'Ordinary Level' : 'Advanced Level'}
                        </span>
                    )}
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ position: 'relative', maxWidth: '500px' }}>
                        <Search style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            color: isDark ? '#9ca3af' : '#6b7280'
                        }} />
                        <input
                            type="text"
                            placeholder="Search notes by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                paddingLeft: '48px',
                                paddingRight: '16px',
                                paddingTop: '12px',
                                paddingBottom: '12px',
                                border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                                borderRadius: '12px',
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                color: isDark ? '#f9fafb' : '#111827',
                                outline: 'none',
                                fontSize: '15px',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = isDark ? '#374151' : '#d1d5db';
                            }}
                        />
                    </div>
                    {searchQuery && (
                        <p style={{
                            marginTop: '12px',
                            fontSize: '14px',
                            color: isDark ? '#9ca3af' : '#6b7280'
                        }}>
                            Found {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Notes Grid */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ ...cardStyle, height: '200px', backgroundColor: isDark ? '#374151' : '#e5e7eb' }} />
                        ))}
                    </div>
                ) : notes.length > 0 ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                            {filteredNotes.map((note) => (
                                <Link key={note.id} to={`/notes/${note.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={cardStyle}>
                                        {note.topic && (
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                                                color: isDark ? '#60a5fa' : '#1d4ed8',
                                                borderRadius: '16px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                marginBottom: '12px',
                                            }}>
                                                {note.topic}
                                            </span>
                                        )}
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                                            {note.title}
                                        </h3>
                                        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
                                            {note.content.substring(0, 100)}...
                                        </p>
                                        <div style={{ display: 'flex', gap: '16px', paddingTop: '16px', borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, color: isDark ? '#9ca3af' : '#6b7280', fontSize: '13px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={14} /> {new Date(note.created_at).toLocaleDateString()}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Eye size={14} /> {note.view_count}
                                            </span>
                                            {note.file_url && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6' }}>
                                                    <FileText size={14} /> PDF
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: page === i + 1 ? '#3b82f6' : (isDark ? '#374151' : '#f3f4f6'),
                                            color: page === i + 1 ? 'white' : (isDark ? '#d1d5db' : '#4b5563'),
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '1.125rem' }}>
                            No notes available for this subject yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesPage;
