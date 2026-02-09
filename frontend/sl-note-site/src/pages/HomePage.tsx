import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, ArrowRight, FileText, Users, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { subjectService } from '../services/subjectService';
import { noteService } from '../services/noteService';
import type { Subject, Note } from '../types';

const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [recentNotes, setRecentNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === 'dark';

    useEffect(() => {
        const loadData = async () => {
            try {
                const [subjectsData, notesData] = await Promise.all([
                    subjectService.getAll(),
                    noteService.getAll({ per_page: 6 }),
                ]);
                setSubjects(subjectsData);
                setRecentNotes(notesData.notes);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const olSubjects = subjects.filter((s) => s.exam_type === 'OL');
    const alSubjects = subjects.filter((s) => s.exam_type === 'AL');

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
    };

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #7c3aed 100%)',
                padding: '80px 0 120px',
                position: 'relative',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        marginBottom: '24px',
                    }}>
                        <span style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>🎓 Sri Lanka's Premier Study Platform</span>
                    </div>

                    {/* Heading */}
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'white', marginBottom: '24px', lineHeight: 1.2 }}>
                        Your Success Starts With<br />
                        <span style={{ background: 'linear-gradient(90deg, #93c5fd, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Quality Study Notes
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 40px' }}>
                        Comprehensive exam preparation for O/L and A/L students. Access curated notes from top educators.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto 48px' }}>
                        <div style={{
                            display: 'flex',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '8px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                                <Search style={{ width: '20px', height: '20px', color: '#9ca3af', marginRight: '12px' }} />
                                <input
                                    type="text"
                                    placeholder="Search for notes, subjects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '16px',
                                        color: '#374151',
                                    }}
                                />
                            </div>
                            <button type="submit" style={{
                                padding: '14px 28px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}>
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Stats */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
                        {[
                            { icon: <FileText size={24} />, value: '500+', label: 'Study Notes' },
                            { icon: <BookOpen size={24} />, value: '20+', label: 'Subjects' },
                            { icon: <Users size={24} />, value: '10k+', label: 'Students' },
                        ].map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{stat.icon}</span>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>{stat.value}</span>
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subject Categories */}
            <section style={{ padding: '80px 0', backgroundColor: isDark ? '#111827' : '#f9fafb' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '16px', color: isDark ? '#f9fafb' : '#111827' }}>
                        Explore Subjects
                    </h2>
                    <p style={{ textAlign: 'center', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '48px' }}>
                        Choose your exam level and start learning
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {/* O/L Card */}
                        <div style={cardStyle}>
                            <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BookOpen style={{ width: '28px', height: '28px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>O/L Subjects</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Ordinary Level</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                {loading ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} style={{ height: '48px', backgroundColor: isDark ? '#374151' : '#e5e7eb', borderRadius: '8px' }} />
                                        ))}
                                    </div>
                                ) : olSubjects.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {olSubjects.slice(0, 6).map((subject) => (
                                            <Link
                                                key={subject.id}
                                                to={`/subjects/${subject.id}/notes`}
                                                style={{
                                                    padding: '14px',
                                                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                                    borderRadius: '10px',
                                                    color: isDark ? '#d1d5db' : '#374151',
                                                    textDecoration: 'none',
                                                    fontWeight: 500,
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {subject.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280', textAlign: 'center', padding: '24px 0' }}>No O/L subjects available yet.</p>
                                )}
                                <Link to="/subjects?type=OL" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
                                    View all O/L subjects <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* A/L Card */}
                        <div style={cardStyle}>
                            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', padding: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <GraduationCap style={{ width: '28px', height: '28px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>A/L Subjects</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Advanced Level</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                {loading ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} style={{ height: '48px', backgroundColor: isDark ? '#374151' : '#e5e7eb', borderRadius: '8px' }} />
                                        ))}
                                    </div>
                                ) : alSubjects.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {alSubjects.slice(0, 6).map((subject) => (
                                            <Link
                                                key={subject.id}
                                                to={`/subjects/${subject.id}/notes`}
                                                style={{
                                                    padding: '14px',
                                                    backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                                    borderRadius: '10px',
                                                    color: isDark ? '#d1d5db' : '#374151',
                                                    textDecoration: 'none',
                                                    fontWeight: 500,
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {subject.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280', textAlign: 'center', padding: '24px 0' }}>No A/L subjects available yet.</p>
                                )}
                                <Link to="/subjects?type=AL" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: '#8b5cf6', textDecoration: 'none', fontWeight: 600 }}>
                                    View all A/L subjects <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Notes */}
            <section style={{ padding: '80px 0', backgroundColor: isDark ? '#1f2937' : '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <TrendingUp style={{ width: '24px', height: '24px', color: 'white' }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827' }}>Recent Notes</h2>
                                <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Fresh study materials</p>
                            </div>
                        </div>
                        <Link to="/subjects" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
                            View all <ArrowRight size={18} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{ height: '200px', backgroundColor: isDark ? '#374151' : '#e5e7eb', borderRadius: '16px' }} />
                            ))}
                        </div>
                    ) : recentNotes.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                            {recentNotes.map((note) => (
                                <Link key={note.id} to={`/notes/${note.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        ...cardStyle,
                                        padding: '24px',
                                        cursor: 'pointer',
                                    }}>
                                        {note.topic && (
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '6px 12px',
                                                backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                                                color: isDark ? '#60a5fa' : '#1d4ed8',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                marginBottom: '12px',
                                            }}>
                                                {note.topic}
                                            </span>
                                        )}
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>{note.title}</h3>
                                        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>
                                            {note.content.substring(0, 120)}...
                                        </p>
                                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, color: isDark ? '#9ca3af' : '#6b7280', fontSize: '13px' }}>
                                            <span>{new Date(note.created_at).toLocaleDateString()}</span>
                                            <span>👁 {note.view_count}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ ...cardStyle, padding: '48px', textAlign: 'center' }}>
                            <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px', fontSize: '18px' }}>No notes available yet.</p>
                            <Link to="/register" style={{
                                display: 'inline-block',
                                padding: '14px 28px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                color: 'white',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontWeight: 600,
                            }}>
                                Sign up to contribute
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #7c3aed 100%)',
                padding: '80px 0',
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
                        Ready to ace your exams?
                    </h2>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
                        Join thousands of students preparing smarter with SL Notes.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{
                            padding: '16px 32px',
                            backgroundColor: 'white',
                            color: '#1e40af',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '1.125rem',
                        }}>
                            Get Started Free
                        </Link>
                        <Link to="/subjects" style={{
                            padding: '16px 32px',
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '2px solid white',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '1.125rem',
                        }}>
                            Browse Subjects
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
