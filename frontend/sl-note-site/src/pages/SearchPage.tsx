import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, FileText, Eye, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { noteService } from '../services/noteService';
import type { Note } from '../types';

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === 'dark';
    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (query) {
            setSearchQuery(query);
            searchNotes(query);
        }
    }, [query]);

    const searchNotes = async (q: string) => {
        setLoading(true);
        try {
            const data = await noteService.search(q);
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '24px',
        transition: 'transform 0.3s, box-shadow 0.3s',
    };

    return (
        <div style={{ padding: '48px 0' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
                {/* Search Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '16px' }}>
                        Search Notes
                    </h1>

                    {/* Search Form */}
                    <form onSubmit={handleSearch}>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            borderRadius: '16px',
                            padding: '8px',
                            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                        }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                                <Search style={{ width: '20px', height: '20px', color: '#9ca3af', marginRight: '12px' }} />
                                <input
                                    type="text"
                                    placeholder="Search for notes, topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '16px',
                                        backgroundColor: 'transparent',
                                        color: isDark ? '#f9fafb' : '#111827',
                                    }}
                                />
                            </div>
                            <button type="submit" style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}>
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {query && (
                    <div>
                        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px' }}>
                            {loading ? 'Searching...' : `Found ${results.length} results for "${query}"`}
                        </p>

                        {loading ? (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} style={{ ...cardStyle, height: '140px', backgroundColor: isDark ? '#374151' : '#e5e7eb' }} />
                                ))}
                            </div>
                        ) : results.length > 0 ? (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {results.map((note) => (
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
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                                                {note.title}
                                            </h3>
                                            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
                                                {note.content.substring(0, 150)}...
                                            </p>
                                            <div style={{ display: 'flex', gap: '16px', color: isDark ? '#9ca3af' : '#6b7280', fontSize: '13px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Calendar size={14} /> {new Date(note.created_at).toLocaleDateString()}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Eye size={14} /> {note.view_count}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px' }}>
                                <FileText style={{ width: '48px', height: '48px', color: isDark ? '#6b7280' : '#9ca3af', margin: '0 auto 16px' }} />
                                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '1.125rem' }}>
                                    No notes found. Try a different search term.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
