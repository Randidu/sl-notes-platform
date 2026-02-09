import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { noteService } from '../../services/noteService';
import { subjectService } from '../../services/subjectService';
import type { Subject, NoteCreate } from '../../types';

const CreateNote: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<NoteCreate>({
        title: '',
        content: '',
        subject_id: 0,
        topic: '',
        is_published: true,
    });
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, subject_id: data[0].id }));
            }
        } catch (error) {
            console.error('Failed to load subjects:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let fileUrl: string | undefined;

            // Upload file first if present
            if (file) {
                const uploadResult = await noteService.uploadFile(file);
                fileUrl = uploadResult.file_url;
            }

            // Create note
            await noteService.create({
                ...formData,
                file_url: fileUrl,
            });

            setSuccess('Note created successfully!');
            setTimeout(() => navigate('/admin/notes'), 1500);
        } catch (error: any) {
            setError(error.response?.data?.detail || 'Failed to create note');
        } finally {
            setLoading(false);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderRadius: '16px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        padding: '32px',
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
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
                <Link to="/admin/notes" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>
                    <ArrowLeft size={20} /> Back to Notes Management
                </Link>

                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isDark ? '#f9fafb' : '#111827', marginBottom: '32px' }}>
                    Create New Note
                </h1>

                <div style={cardStyle}>
                    {error && (
                        <div style={{ padding: '12px 16px', backgroundColor: isDark ? '#7f1d1d' : '#fee2e2', color: '#ef4444', borderRadius: '10px', marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ padding: '12px 16px', backgroundColor: isDark ? '#064e3b' : '#d1fae5', color: '#10b981', borderRadius: '10px', marginBottom: '20px' }}>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Enter note title"
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>
                                        Subject *
                                    </label>
                                    <select
                                        value={formData.subject_id}
                                        onChange={(e) => setFormData({ ...formData, subject_id: parseInt(e.target.value) })}
                                        style={inputStyle}
                                        required
                                    >
                                        {subjects.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.exam_type})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>
                                        Topic
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        style={inputStyle}
                                        placeholder="e.g., Algebra, Mechanics"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>
                                    Content *
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '300px', resize: 'vertical', fontFamily: 'inherit' }}
                                    placeholder="Write your note content here..."
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: isDark ? '#d1d5db' : '#374151' }}>
                                    Attachment (PDF)
                                </label>
                                <div style={{
                                    border: `2px dashed ${isDark ? '#4b5563' : '#d1d5db'}`,
                                    borderRadius: '10px',
                                    padding: '24px',
                                    textAlign: 'center',
                                }}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        style={{ display: 'none' }}
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                                        <Upload style={{ width: '32px', height: '32px', color: isDark ? '#9ca3af' : '#6b7280', margin: '0 auto 8px' }} />
                                        <p style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                                            {file ? file.name : 'Click to upload or drag and drop'}
                                        </p>
                                        <p style={{ fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                            PDF up to 10MB
                                        </p>
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input
                                    type="checkbox"
                                    id="publish"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <label htmlFor="publish" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                                    Publish immediately
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '14px 28px',
                                    background: loading ? '#6b7280' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                }}
                            >
                                <Save size={20} />
                                {loading ? 'Creating...' : 'Create Note'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateNote;
