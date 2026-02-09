import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { subjectService } from '../../services/subjectService';
import type { Subject, SubjectCreate } from '../../types';

const SubjectsManagement: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<SubjectCreate>({ name: '', exam_type: 'OL', description: '' });
    const { user, isAuthenticated } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === 'dark';

    useEffect(() => {
        if (!isAuthenticated || !user?.is_admin) {
            navigate('/');
            return;
        }
        loadSubjects();
    }, [isAuthenticated, user, navigate]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await subjectService.update(editingId, formData);
            } else {
                await subjectService.create(formData);
            }
            loadSubjects();
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', exam_type: 'OL', description: '' });
        } catch (error) {
            console.error('Failed to save subject:', error);
        }
    };

    const startEdit = (subject: Subject) => {
        setFormData({ name: subject.name, exam_type: subject.exam_type, description: subject.description || '' });
        setEditingId(subject.id);
        setShowForm(true);
    };

    const deleteSubject = async (id: number) => {
        if (!confirm('Are you sure you want to delete this subject?')) return;
        try {
            await subjectService.delete(id);
            setSubjects(subjects.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete subject:', error);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '24px',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
        backgroundColor: isDark ? '#374151' : '#ffffff',
        color: isDark ? '#f9fafb' : '#111827',
        fontSize: '16px',
        outline: 'none',
    };

    if (!user?.is_admin) return null;

    return (
        <div style={{ padding: '32px 0', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
                <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
                    <ArrowLeft size={20} /> Back to Admin Dashboard
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '8px' }}>
                            Subjects Management
                        </h1>
                        <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                            Add, edit, and manage subjects for O/L and A/L.
                        </p>
                    </div>
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', exam_type: 'OL', description: '' }); }}
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
                        <Plus size={20} /> Add Subject
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div style={{ ...cardStyle, marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '20px' }}>
                            {editingId ? 'Edit Subject' : 'Add New Subject'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>Exam Type</label>
                                    <select
                                        value={formData.exam_type}
                                        onChange={(e) => setFormData({ ...formData, exam_type: e.target.value as 'OL' | 'AL' })}
                                        style={inputStyle}
                                    >
                                        <option value="OL">O/L (Ordinary Level)</option>
                                        <option value="AL">A/L (Advanced Level)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" style={{
                                        padding: '12px 24px',
                                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}>
                                        {editingId ? 'Update' : 'Create'}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} style={{
                                        padding: '12px 24px',
                                        backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                        color: isDark ? '#d1d5db' : '#4b5563',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Subjects Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} style={{ ...cardStyle, height: '120px', backgroundColor: isDark ? '#374151' : '#e5e7eb' }} />
                        ))
                    ) : subjects.length > 0 ? (
                        subjects.map((subject) => (
                            <div key={subject.id} style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 600, color: isDark ? '#f9fafb' : '#111827', marginBottom: '4px' }}>{subject.name}</h3>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            backgroundColor: subject.exam_type === 'OL' ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#4c1d95' : '#ede9fe'),
                                            color: subject.exam_type === 'OL' ? '#10b981' : '#8b5cf6',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                        }}>
                                            {subject.exam_type}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => startEdit(subject)} style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                            color: '#3b82f6',
                                            cursor: 'pointer',
                                        }}>
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => deleteSubject(subject.id)} style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            backgroundColor: isDark ? '#374151' : '#f3f4f6',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                        }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                    {subject.description || 'No description'}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}>
                            No subjects found. Create one to get started.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectsManagement;
