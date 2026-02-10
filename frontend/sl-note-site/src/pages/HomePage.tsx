import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, ArrowRight, FileText, Users, TrendingUp, Sparkles, Award, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { subjectService } from '../services/subjectService';
import { noteService } from '../services/noteService';
import type { Subject, Note } from '../types';

// Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const counterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let startTime: number | null = null;

                    const animate = (currentTime: number) => {
                        if (!startTime) startTime = currentTime;
                        const progress = Math.min((currentTime - startTime) / duration, 1);

                        // Easing function for smooth animation
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        setCount(Math.floor(easeOutQuart * end));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return <div ref={counterRef}>{count}{suffix}</div>;
};

const ModernHomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [recentNotes, setRecentNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [typedText, setTypedText] = useState('');
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === 'dark';

    // Typing animation effect
    useEffect(() => {
        const text = 'Expert Study Notes';
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
            if (currentIndex <= text.length) {
                setTypedText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100); // Speed of typing (100ms per character)

        return () => clearInterval(typingInterval);
    }, []);

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

    return (
        <div style={{ backgroundColor: isDark ? '#0a0a0a' : '#ffffff', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                background: isDark
                    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)'
                    : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
                padding: 'clamp(60px, 10vw, 100px) 0 clamp(80px, 12vw, 140px)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Animated background elements */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    background: 'radial-gradient(circle at 20% 50%, rgba(147, 197, 253, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(196, 181, 253, 0.3) 0%, transparent 50%)',
                }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    {/* Floating badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(10px)',
                        padding: '10px 24px',
                        borderRadius: '100px',
                        marginBottom: '32px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }}>
                        <Sparkles size={16} color="#fbbf24" />
                        <span style={{ fontSize: '14px', color: 'white', fontWeight: 600 }}>Sri Lanka's #1 Study Platform</span>
                    </div>

                    {/* Main heading */}
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 900,
                        color: 'white',
                        marginBottom: '24px',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                    }}>
                        Master Your Exams With
                        <br />
                        <span style={{
                            background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #f0abfc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
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

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        color: 'rgba(255,255,255,0.85)',
                        maxWidth: '650px',
                        margin: '0 auto 48px',
                        lineHeight: 1.6,
                        padding: '0 1rem',
                    }}>
                        Comprehensive O/L and A/L preparation materials curated by Sri Lanka's top educators and high-achievers.
                    </p>

                    {/* Enhanced Search Bar */}
                    <form onSubmit={handleSearch} style={{ maxWidth: '680px', margin: '0 auto 64px' }}>
                        <div style={{
                            display: 'flex',
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '6px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                                <Search style={{ width: '22px', height: '22px', color: '#6b7280', marginRight: '14px' }} />
                                <input
                                    type="text"
                                    placeholder="Search subjects, topics, chapters..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '16px 0',
                                        border: 'none',
                                        outline: 'none',
                                        fontSize: '16px',
                                        color: '#1f2937',
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            </div>
                            <button type="submit" style={{
                                padding: '16px 36px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontSize: '16px',
                                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 130, 246, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
                                }}>
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: 'clamp(12px, 3vw, 24px)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        padding: '0 1rem',
                    }}>
                        {[
                            { icon: <FileText size={28} />, end: 500, suffix: '+', label: 'Study Notes', color: '#60a5fa' },
                            { icon: <BookOpen size={28} />, end: 20, suffix: '+', label: 'Subjects', color: '#a78bfa' },
                            { icon: <Users size={28} />, end: 10, suffix: 'k+', label: 'Students', color: '#f472b6' },
                            { icon: <Award size={28} />, end: 95, suffix: '%', label: 'Success Rate', color: '#34d399' },
                        ].map((stat, i) => (
                            <div key={i} style={{
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(10px)',
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <div style={{ color: stat.color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
                                    <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2500} />
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 500 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subject Categories */}
            <section style={{ padding: '100px 0', backgroundColor: isDark ? '#0a0a0a' : '#f9fafb' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '8px 20px',
                            backgroundColor: isDark ? '#1e293b' : '#ede9fe',
                            color: isDark ? '#a78bfa' : '#7c3aed',
                            borderRadius: '50px',
                            fontSize: '14px',
                            fontWeight: 600,
                            marginBottom: '16px',
                        }}>
                            EXPLORE SUBJECTS
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: '16px',
                            color: isDark ? '#f9fafb' : '#111827',
                            letterSpacing: '-0.02em',
                        }}>
                            Choose Your Path to Success
                        </h2>
                        <p style={{
                            fontSize: '1.125rem',
                            color: isDark ? '#9ca3af' : '#6b7280',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Select your exam level and dive into comprehensive study materials
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
                        {/* O/L Card */}
                        <div style={{
                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                            boxShadow: isDark
                                ? '0 4px 24px rgba(0,0,0,0.3)'
                                : '0 4px 24px rgba(0,0,0,0.06)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = isDark
                                    ? '0 12px 40px rgba(16, 185, 129, 0.2)'
                                    : '0 12px 40px rgba(16, 185, 129, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = isDark
                                    ? '0 4px 24px rgba(0,0,0,0.3)'
                                    : '0 4px 24px rgba(0,0,0,0.06)';
                            }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                padding: '40px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-50px',
                                    right: '-50px',
                                    width: '200px',
                                    height: '200px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '50%',
                                }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backdropFilter: 'blur(10px)',
                                    }}>
                                        <BookOpen style={{ width: '32px', height: '32px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>O/L Subjects</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Ordinary Level</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '32px' }}>
                                {loading ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} style={{
                                                height: '52px',
                                                backgroundColor: isDark ? '#1e293b' : '#f3f4f6',
                                                borderRadius: '12px',
                                                animation: 'pulse 1.5s ease-in-out infinite',
                                            }} />
                                        ))}
                                    </div>
                                ) : olSubjects.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {olSubjects.slice(0, 6).map((subject) => (
                                            <Link
                                                key={subject.id}
                                                to={`/subjects/${subject.id}/notes`}
                                                style={{
                                                    padding: '16px',
                                                    backgroundColor: isDark ? '#1e293b' : '#f9fafb',
                                                    borderRadius: '12px',
                                                    color: isDark ? '#e5e7eb' : '#1f2937',
                                                    textDecoration: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '14px',
                                                    border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                                                    transition: 'all 0.2s',
                                                    textAlign: 'center',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#10b981';
                                                    e.currentTarget.style.color = 'white';
                                                    e.currentTarget.style.borderColor = '#10b981';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f9fafb';
                                                    e.currentTarget.style.color = isDark ? '#e5e7eb' : '#1f2937';
                                                    e.currentTarget.style.borderColor = isDark ? '#334155' : '#e5e7eb';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                {subject.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280', textAlign: 'center', padding: '32px 0', fontSize: '15px' }}>
                                        No O/L subjects available yet.
                                    </p>
                                )}
                                <Link
                                    to="/subjects?type=OL"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginTop: '24px',
                                        color: '#10b981',
                                        textDecoration: 'none',
                                        fontWeight: 700,
                                        fontSize: '15px',
                                    }}
                                >
                                    View all O/L subjects <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* A/L Card */}
                        <div style={{
                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                            boxShadow: isDark
                                ? '0 4px 24px rgba(0,0,0,0.3)'
                                : '0 4px 24px rgba(0,0,0,0.06)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = isDark
                                    ? '0 12px 40px rgba(139, 92, 246, 0.2)'
                                    : '0 12px 40px rgba(139, 92, 246, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = isDark
                                    ? '0 4px 24px rgba(0,0,0,0.3)'
                                    : '0 4px 24px rgba(0,0,0,0.06)';
                            }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                padding: '40px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-50px',
                                    right: '-50px',
                                    width: '200px',
                                    height: '200px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '50%',
                                }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backdropFilter: 'blur(10px)',
                                    }}>
                                        <GraduationCap style={{ width: '32px', height: '32px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>A/L Subjects</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Advanced Level</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '32px' }}>
                                {loading ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} style={{
                                                height: '52px',
                                                backgroundColor: isDark ? '#1e293b' : '#f3f4f6',
                                                borderRadius: '12px',
                                            }} />
                                        ))}
                                    </div>
                                ) : alSubjects.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        {alSubjects.slice(0, 6).map((subject) => (
                                            <Link
                                                key={subject.id}
                                                to={`/subjects/${subject.id}/notes`}
                                                style={{
                                                    padding: '16px',
                                                    backgroundColor: isDark ? '#1e293b' : '#f9fafb',
                                                    borderRadius: '12px',
                                                    color: isDark ? '#e5e7eb' : '#1f2937',
                                                    textDecoration: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '14px',
                                                    border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                                                    transition: 'all 0.2s',
                                                    textAlign: 'center',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#8b5cf6';
                                                    e.currentTarget.style.color = 'white';
                                                    e.currentTarget.style.borderColor = '#8b5cf6';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f9fafb';
                                                    e.currentTarget.style.color = isDark ? '#e5e7eb' : '#1f2937';
                                                    e.currentTarget.style.borderColor = isDark ? '#334155' : '#e5e7eb';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                {subject.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: isDark ? '#9ca3af' : '#6b7280', textAlign: 'center', padding: '32px 0', fontSize: '15px' }}>
                                        No A/L subjects available yet.
                                    </p>
                                )}
                                <Link
                                    to="/subjects?type=AL"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginTop: '24px',
                                        color: '#8b5cf6',
                                        textDecoration: 'none',
                                        fontWeight: 700,
                                        fontSize: '15px',
                                    }}
                                >
                                    View all A/L subjects <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Notes */}
            <section style={{ padding: '100px 0', backgroundColor: isDark ? '#111827' : '#ffffff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '56px', flexWrap: 'wrap', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)',
                            }}>
                                <TrendingUp style={{ width: '28px', height: '28px', color: 'white' }} />
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                                    fontWeight: 800,
                                    color: isDark ? '#f9fafb' : '#111827',
                                    marginBottom: '4px',
                                    letterSpacing: '-0.02em',
                                }}>
                                    Latest Study Materials
                                </h2>
                                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '15px' }}>Fresh notes added by our community</p>
                            </div>
                        </div>
                        <Link
                            to="/subjects"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                backgroundColor: isDark ? '#1e293b' : '#f3f4f6',
                                color: isDark ? '#60a5fa' : '#3b82f6',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontWeight: 700,
                                border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#3b82f6';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f3f4f6';
                                e.currentTarget.style.color = isDark ? '#60a5fa' : '#3b82f6';
                                e.currentTarget.style.borderColor = isDark ? '#334155' : '#e5e7eb';
                            }}
                        >
                            View all <ArrowRight size={18} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{
                                    height: '220px',
                                    backgroundColor: isDark ? '#1e293b' : '#f3f4f6',
                                    borderRadius: '20px',
                                }} />
                            ))}
                        </div>
                    ) : recentNotes.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
                            {recentNotes.map((note) => (
                                <Link key={note.id} to={`/notes/${note.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                        borderRadius: '20px',
                                        border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                                        padding: '28px',
                                        cursor: 'pointer',
                                        boxShadow: isDark
                                            ? '0 4px 24px rgba(0,0,0,0.3)'
                                            : '0 2px 16px rgba(0,0,0,0.04)',
                                        transition: 'all 0.3s',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-6px)';
                                            e.currentTarget.style.boxShadow = isDark
                                                ? '0 12px 40px rgba(59, 130, 246, 0.15)'
                                                : '0 12px 40px rgba(59, 130, 246, 0.1)';
                                            e.currentTarget.style.borderColor = isDark ? '#3b82f6' : '#93c5fd';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = isDark
                                                ? '0 4px 24px rgba(0,0,0,0.3)'
                                                : '0 2px 16px rgba(0,0,0,0.04)';
                                            e.currentTarget.style.borderColor = isDark ? '#1e293b' : '#e5e7eb';
                                        }}>
                                        {note.topic && (
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '8px 16px',
                                                backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                                                color: isDark ? '#60a5fa' : '#1e40af',
                                                borderRadius: '100px',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                marginBottom: '16px',
                                                width: 'fit-content',
                                            }}>
                                                {note.topic}
                                            </span>
                                        )}
                                        <h3 style={{
                                            fontSize: '1.25rem',
                                            fontWeight: 700,
                                            color: isDark ? '#f9fafb' : '#111827',
                                            marginBottom: '12px',
                                            lineHeight: 1.3,
                                        }}>
                                            {note.title}
                                        </h3>
                                        <p style={{
                                            color: isDark ? '#9ca3af' : '#6b7280',
                                            fontSize: '15px',
                                            lineHeight: 1.6,
                                            marginBottom: '20px',
                                            flex: 1,
                                        }}>
                                            {note.content.substring(0, 120)}...
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            gap: '20px',
                                            paddingTop: '20px',
                                            borderTop: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                                            color: isDark ? '#9ca3af' : '#6b7280',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Clock size={16} />
                                                {new Date(note.created_at).toLocaleDateString()}
                                            </span>
                                            <span>👁 {note.view_count} views</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                            borderRadius: '24px',
                            border: `1px solid ${isDark ? '#1e293b' : '#e5e7eb'}`,
                            padding: '64px 32px',
                            textAlign: 'center',
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
                                <FileText size={36} color={isDark ? '#60a5fa' : '#3b82f6'} />
                            </div>
                            <p style={{
                                color: isDark ? '#9ca3af' : '#6b7280',
                                marginBottom: '32px',
                                fontSize: '1.125rem',
                                fontWeight: 500,
                            }}>
                                No notes available yet. Be the first to contribute!
                            </p>
                            <Link to="/register" style={{
                                display: 'inline-block',
                                padding: '16px 36px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                color: 'white',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '16px',
                                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                                transition: 'transform 0.2s',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                Sign up to contribute
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                background: isDark
                    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)'
                    : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
                padding: '100px 0',
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
                    background: 'radial-gradient(circle at 30% 50%, rgba(147, 197, 253, 0.4) 0%, transparent 50%)',
                }} />
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(10px)',
                        padding: '10px 20px',
                        borderRadius: '100px',
                        marginBottom: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <Sparkles size={16} color="#fbbf24" />
                        <span style={{ fontSize: '14px', color: 'white', fontWeight: 600 }}>JOIN OUR COMMUNITY</span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 900,
                        color: 'white',
                        marginBottom: '20px',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                    }}>
                        Ready to Excel in Your Exams?
                    </h2>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '40px',
                        lineHeight: 1.6,
                    }}>
                        Join thousands of Sri Lankan students achieving their academic goals with our comprehensive study materials.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{
                            padding: '18px 40px',
                            backgroundColor: 'white',
                            color: '#1e40af',
                            borderRadius: '14px',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                            }}>
                            Get Started Free →
                        </Link>
                        <Link to="/subjects" style={{
                            padding: '18px 40px',
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderRadius: '14px',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.borderColor = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                            }}>
                            Browse Subjects
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ModernHomePage;