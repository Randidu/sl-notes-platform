import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, GraduationCap, Search, Filter, Grid3x3, List, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { subjectService } from '../services/subjectService';
import type { Subject } from '../types';

const ModernSubjectsPage: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [typedText, setTypedText] = useState('');
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

    // Typing animation effect
    useEffect(() => {
        const text = 'Study Subject';
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
            if (currentIndex <= text.length) {
                setTypedText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, []);

    const filteredSubjects = subjects.filter((s) => {
        const matchesType = examType === 'all' || s.exam_type === examType;
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const olSubjects = filteredSubjects.filter(s => s.exam_type === 'OL');
    const alSubjects = filteredSubjects.filter(s => s.exam_type === 'AL');

    const tabStyle = (active: boolean): React.CSSProperties => ({
        padding: '14px 28px',
        borderRadius: '12px',
        border: 'none',
        background: active
            ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
            : (isDark ? '#1e293b' : '#f3f4f6'),
        color: active ? 'white' : (isDark ? '#d1d5db' : '#4b5563'),
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontSize: '15px',
        boxShadow: active ? '0 4px 16px rgba(59, 130, 246, 0.3)' : 'none',
    });

    const SubjectCard = ({ subject }: { subject: Subject }) => (
        <Link to={`/subjects/${subject.id}/notes`} style={{ textDecoration: 'none' }}>
            <div style={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderRadius: '20px',
                border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                padding: '28px',
                transition: 'all 0.3s',
                cursor: 'pointer',
                boxShadow: isDark
                    ? '0 4px 24px rgba(0,0,0,0.3)'
                    : '0 2px 16px rgba(0,0,0,0.04)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    const color = subject.exam_type === 'OL' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)';
                    e.currentTarget.style.boxShadow = isDark
                        ? `0 12px 40px ${color}`
                        : `0 12px 40px ${color}`;
                    e.currentTarget.style.borderColor = subject.exam_type === 'OL' ? '#10b981' : '#8b5cf6';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isDark
                        ? '0 4px 24px rgba(0,0,0,0.3)'
                        : '0 2px 16px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = isDark ? '#1e293b' : '#e5e7eb';
                }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: subject.exam_type === 'OL'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: subject.exam_type === 'OL'
                            ? '0 8px 24px rgba(16, 185, 129, 0.25)'
                            : '0 8px 24px rgba(139, 92, 246, 0.25)',
                    }}>
                        {subject.exam_type === 'OL'
                            ? <BookOpen style={{ width: '28px', height: '28px', color: 'white' }} />
                            : <GraduationCap style={{ width: '28px', height: '28px', color: 'white' }} />
                        }
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: isDark ? '#f9fafb' : '#111827',
                            marginBottom: '6px',
                            lineHeight: 1.3,
                        }}>
                            {subject.name}
                        </h3>
                        <span style={{
                            display: 'inline-block',
                            fontSize: '13px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '100px',
                            backgroundColor: subject.exam_type === 'OL'
                                ? (isDark ? '#064e3b' : '#d1fae5')
                                : (isDark ? '#3730a3' : '#ede9fe'),
                            color: subject.exam_type === 'OL' ? '#10b981' : '#8b5cf6',
                        }}>
                            {subject.exam_type === 'OL' ? 'O/L' : 'A/L'}
                        </span>
                    </div>
                </div>
                {subject.description && (
                    <p style={{
                        color: isDark ? '#9ca3af' : '#6b7280',
                        fontSize: '15px',
                        lineHeight: 1.6,
                        marginBottom: '20px',
                        flex: 1,
                    }}>
                        {subject.description.length > 100 ? subject.description.substring(0, 100) + '...' : subject.description}
                    </p>
                )}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: subject.exam_type === 'OL' ? '#10b981' : '#8b5cf6',
                    fontWeight: 600,
                    fontSize: '15px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                }}>
                    View Notes <ArrowRight size={18} />
                </div>
            </div>
        </Link>
    );

    const SubjectListItem = ({ subject }: { subject: Subject }) => (
        <Link to={`/subjects/${subject.id}/notes`} style={{ textDecoration: 'none' }}>
            <div style={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderRadius: '16px',
                border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                padding: '24px',
                transition: 'all 0.3s',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    const color = subject.exam_type === 'OL' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)';
                    e.currentTarget.style.boxShadow = `0 8px 32px ${color}`;
                    e.currentTarget.style.borderColor = subject.exam_type === 'OL' ? '#10b981' : '#8b5cf6';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = isDark ? '#1e293b' : '#e5e7eb';
                }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: subject.exam_type === 'OL'
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    {subject.exam_type === 'OL'
                        ? <BookOpen style={{ width: '32px', height: '32px', color: 'white' }} />
                        : <GraduationCap style={{ width: '32px', height: '32px', color: 'white' }} />
                    }
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: isDark ? '#f9fafb' : '#111827',
                        }}>
                            {subject.name}
                        </h3>
                        <span style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '100px',
                            backgroundColor: subject.exam_type === 'OL'
                                ? (isDark ? '#064e3b' : '#d1fae5')
                                : (isDark ? '#3730a3' : '#ede9fe'),
                            color: subject.exam_type === 'OL' ? '#10b981' : '#8b5cf6',
                        }}>
                            {subject.exam_type === 'OL' ? 'Ordinary Level' : 'Advanced Level'}
                        </span>
                    </div>
                    {subject.description && (
                        <p style={{
                            color: isDark ? '#9ca3af' : '#6b7280',
                            fontSize: '15px',
                            lineHeight: 1.6,
                        }}>
                            {subject.description}
                        </p>
                    )}
                </div>
                <ArrowRight size={24} color={subject.exam_type === 'OL' ? '#10b981' : '#8b5cf6'} />
            </div>
        </Link>
    );

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: isDark ? '#0a0a0a' : '#f9fafb',
        }}>
            {/* Hero Header */}
            <section style={{
                background: isDark
                    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)'
                    : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
                padding: '80px 0',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    background: 'radial-gradient(circle at 20% 50%, rgba(147, 197, 253, 0.3) 0%, transparent 50%)',
                }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(10px)',
                        padding: '10px 24px',
                        borderRadius: '100px',
                        marginBottom: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <Sparkles size={16} color="#fbbf24" />
                        <span style={{ fontSize: '14px', color: 'white', fontWeight: 600 }}>EXPLORE SUBJECTS</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 900,
                        color: 'white',
                        marginBottom: '16px',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                    }}>
                        Find Your Perfect
                        <br />
                        <span style={{
                            background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #f0abfc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block',
                            minHeight: '1.2em',
                        }}>
                            {typedText}
                            <span style={{
                                borderRight: '3px solid #a78bfa',
                                animation: 'blink 1s step-end infinite',
                                marginLeft: '2px',
                            }} />
                        </span>
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255,255,255,0.85)',
                        maxWidth: '600px',
                        lineHeight: 1.6,
                    }}>
                        Access comprehensive study materials for O/L and A/L subjects. Choose your subject and start learning today.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div style={{ maxWidth: '1200px', margin: '-40px auto 0', padding: '0 2rem 80px', position: 'relative', zIndex: 2 }}>
                {/* Filters Card */}
                <div style={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderRadius: '24px',
                    border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                    padding: '32px',
                    marginBottom: '48px',
                    boxShadow: isDark
                        ? '0 20px 60px rgba(0,0,0,0.4)'
                        : '0 20px 60px rgba(0,0,0,0.08)',
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '24px',
                        alignItems: 'center',
                    }}>
                        {/* Left: Tabs */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <button
                                style={tabStyle(examType === 'all')}
                                onClick={() => setSearchParams({})}
                                onMouseEnter={(e) => {
                                    if (examType !== 'all') {
                                        e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#e5e7eb';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (examType !== 'all') {
                                        e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f3f4f6';
                                    }
                                }}
                            >
                                All Subjects
                            </button>
                            <button
                                style={tabStyle(examType === 'OL')}
                                onClick={() => setSearchParams({ type: 'OL' })}
                                onMouseEnter={(e) => {
                                    if (examType !== 'OL') {
                                        e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#e5e7eb';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (examType !== 'OL') {
                                        e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f3f4f6';
                                    }
                                }}
                            >
                                O/L Subjects
                            </button>
                            <button
                                style={tabStyle(examType === 'AL')}
                                onClick={() => setSearchParams({ type: 'AL' })}
                                onMouseEnter={(e) => {
                                    if (examType !== 'AL') {
                                        e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#e5e7eb';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (examType !== 'AL') {
                                        e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f3f4f6';
                                    }
                                }}
                            >
                                A/L Subjects
                            </button>
                        </div>

                        {/* Right: View Toggle - Hidden on mobile */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            backgroundColor: isDark ? '#1e293b' : '#f3f4f6',
                            padding: '6px',
                            borderRadius: '12px',
                        }}
                            className="view-toggle-desktop">
                            <button
                                onClick={() => setViewMode('grid')}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: viewMode === 'grid' ? (isDark ? '#3b82f6' : '#3b82f6') : 'transparent',
                                    color: viewMode === 'grid' ? 'white' : (isDark ? '#9ca3af' : '#6b7280'),
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontWeight: 600,
                                }}
                            >
                                <Grid3x3 size={18} />
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: viewMode === 'list' ? (isDark ? '#3b82f6' : '#3b82f6') : 'transparent',
                                    color: viewMode === 'list' ? 'white' : (isDark ? '#9ca3af' : '#6b7280'),
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontWeight: 600,
                                }}
                            >
                                <List size={18} />
                                List
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div style={{ position: 'relative', marginTop: '24px' }}>
                        <Search style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '22px',
                            height: '22px',
                            color: '#9ca3af'
                        }} />
                        <input
                            type="text"
                            placeholder="Search subjects by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '18px 20px 18px 56px',
                                border: `2px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                                borderRadius: '16px',
                                backgroundColor: isDark ? '#1e293b' : '#f9fafb',
                                color: isDark ? '#f9fafb' : '#111827',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.3s',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#3b82f6';
                                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = isDark ? '#334155' : '#e5e7eb';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </div>

                {/* Results Count */}
                {!loading && (
                    <div style={{
                        marginBottom: '32px',
                        color: isDark ? '#9ca3af' : '#6b7280',
                        fontSize: '15px',
                        fontWeight: 500,
                    }}>
                        {filteredSubjects.length} {filteredSubjects.length === 1 ? 'subject' : 'subjects'} found
                        {searchQuery && ` for "${searchQuery}"`}
                    </div>
                )}

                {/* Subjects Display */}
                {loading ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: viewMode === 'grid'
                            ? 'repeat(auto-fill, minmax(320px, 1fr))'
                            : '1fr',
                        gap: '24px'
                    }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{
                                height: viewMode === 'grid' ? '240px' : '120px',
                                backgroundColor: isDark ? '#1e293b' : '#e5e7eb',
                                borderRadius: '20px',
                            }} />
                        ))}
                    </div>
                ) : filteredSubjects.length > 0 ? (
                    <>
                        {examType === 'all' ? (
                            <>
                                {/* O/L Section */}
                                {olSubjects.length > 0 && (
                                    <div style={{ marginBottom: '56px' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            marginBottom: '28px',
                                        }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <BookOpen size={24} color="white" />
                                            </div>
                                            <div>
                                                <h2 style={{
                                                    fontSize: '1.75rem',
                                                    fontWeight: 800,
                                                    color: isDark ? '#f9fafb' : '#111827',
                                                    marginBottom: '4px',
                                                }}>
                                                    O/L Subjects
                                                </h2>
                                                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>
                                                    Ordinary Level - {olSubjects.length} subjects
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: viewMode === 'grid'
                                                ? 'repeat(auto-fill, minmax(320px, 1fr))'
                                                : '1fr',
                                            gap: '24px'
                                        }}>
                                            {olSubjects.map((subject) => (
                                                viewMode === 'grid'
                                                    ? <SubjectCard key={subject.id} subject={subject} />
                                                    : <SubjectListItem key={subject.id} subject={subject} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* A/L Section */}
                                {alSubjects.length > 0 && (
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            marginBottom: '28px',
                                        }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <GraduationCap size={24} color="white" />
                                            </div>
                                            <div>
                                                <h2 style={{
                                                    fontSize: '1.75rem',
                                                    fontWeight: 800,
                                                    color: isDark ? '#f9fafb' : '#111827',
                                                    marginBottom: '4px',
                                                }}>
                                                    A/L Subjects
                                                </h2>
                                                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>
                                                    Advanced Level - {alSubjects.length} subjects
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: viewMode === 'grid'
                                                ? 'repeat(auto-fill, minmax(320px, 1fr))'
                                                : '1fr',
                                            gap: '24px'
                                        }}>
                                            {alSubjects.map((subject) => (
                                                viewMode === 'grid'
                                                    ? <SubjectCard key={subject.id} subject={subject} />
                                                    : <SubjectListItem key={subject.id} subject={subject} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: viewMode === 'grid'
                                    ? 'repeat(auto-fill, minmax(320px, 1fr))'
                                    : '1fr',
                                gap: '24px'
                            }}>
                                {filteredSubjects.map((subject) => (
                                    viewMode === 'grid'
                                        ? <SubjectCard key={subject.id} subject={subject} />
                                        : <SubjectListItem key={subject.id} subject={subject} />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 32px',
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderRadius: '24px',
                        border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: isDark ? '#1e293b' : '#f3f4f6',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}>
                            <Search size={36} color={isDark ? '#60a5fa' : '#3b82f6'} />
                        </div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: isDark ? '#f9fafb' : '#111827',
                            marginBottom: '12px',
                        }}>
                            No subjects found
                        </h3>
                        <p style={{
                            color: isDark ? '#9ca3af' : '#6b7280',
                            fontSize: '1.125rem',
                            marginBottom: '32px',
                        }}>
                            {searchQuery
                                ? `We couldn't find any subjects matching "${searchQuery}". Try a different search term.`
                                : 'No subjects available for the selected filter.'
                            }
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                style={{
                                    padding: '14px 28px',
                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                                }}
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernSubjectsPage;