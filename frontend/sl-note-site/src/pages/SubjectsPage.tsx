import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, GraduationCap, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { subjectService } from '../services/subjectService';
import type { Subject } from '../types';

const SubjectsPage: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { theme } = useTheme();

    const isDark = theme === 'dark';
    const examType = searchParams.get('type') || 'all';

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const data = await subjectService.getAll();
                setSubjects(data);
            } catch (error) {
                console.error('Failed to load subjects:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSubjects();
    }, []);

    const filteredSubjects = subjects.filter((s) => {
        const matchesType = examType === 'all' || s.exam_type === examType;
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '24px',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
    };

    const tabStyle = (active: boolean): React.CSSProperties => ({
        padding: '12px 24px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: active ? (isDark ? '#3b82f6' : '#3b82f6') : (isDark ? '#374151' : '#f3f4f6'),
        color: active ? 'white' : (isDark ? '#d1d5db' : '#4b5563'),
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
    });

    return (
        <div style={{ padding: '48px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '16px' }}>
                        Browse Subjects
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: isDark ? '#9ca3af' : '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
                        Find study notes for your O/L and A/L subjects
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    marginBottom: '40px',
                    alignItems: 'center',
                }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={tabStyle(examType === 'all')} onClick={() => setSearchParams({})}>
                            All Subjects
                        </button>
                        <button style={tabStyle(examType === 'OL')} onClick={() => setSearchParams({ type: 'OL' })}>
                            O/L
                        </button>
                        <button style={tabStyle(examType === 'AL')} onClick={() => setSearchParams({ type: 'AL' })}>
                            A/L
                        </button>
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 48px',
                                border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                                borderRadius: '12px',
                                backgroundColor: isDark ? '#374151' : '#ffffff',
                                color: isDark ? '#f9fafb' : '#111827',
                                fontSize: '16px',
                                outline: 'none',
                            }}
                        />
                    </div>
                </div>

                {/* Subjects Grid */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{ ...cardStyle, height: '160px', backgroundColor: isDark ? '#374151' : '#e5e7eb' }} />
                        ))}
                    </div>
                ) : filteredSubjects.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                        {filteredSubjects.map((subject) => (
                            <Link key={subject.id} to={`/subjects/${subject.id}/notes`} style={{ textDecoration: 'none' }}>
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            background: subject.exam_type === 'OL'
                                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                                : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {subject.exam_type === 'OL'
                                                ? <BookOpen style={{ width: '24px', height: '24px', color: 'white' }} />
                                                : <GraduationCap style={{ width: '24px', height: '24px', color: 'white' }} />
                                            }
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827' }}>
                                                {subject.name}
                                            </h3>
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                color: subject.exam_type === 'OL' ? '#10b981' : '#8b5cf6',
                                            }}>
                                                {subject.exam_type === 'OL' ? 'Ordinary Level' : 'Advanced Level'}
                                            </span>
                                        </div>
                                    </div>
                                    {subject.description && (
                                        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>
                                            {subject.description.length > 100 ? subject.description.substring(0, 100) + '...' : subject.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '1.125rem' }}>
                            No subjects found. {searchQuery && 'Try a different search term.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectsPage;
