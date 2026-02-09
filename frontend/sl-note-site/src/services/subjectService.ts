import api from './api';
import type { Subject, SubjectCreate } from '../types';

export const subjectService = {
    // Get all subjects
    async getAll(examType?: 'OL' | 'AL'): Promise<Subject[]> {
        const params = examType ? { exam_type: examType } : {};
        const response = await api.get<Subject[]>('/subjects', { params });
        return response.data;
    },

    // Get single subject
    async getById(id: number): Promise<Subject> {
        const response = await api.get<Subject>(`/subjects/${id}`);
        return response.data;
    },

    // Create subject (admin only)
    async create(data: SubjectCreate): Promise<Subject> {
        const response = await api.post<Subject>('/subjects', data);
        return response.data;
    },

    // Update subject (admin only)
    async update(id: number, data: Partial<SubjectCreate>): Promise<Subject> {
        const response = await api.put<Subject>(`/subjects/${id}`, data);
        return response.data;
    },

    // Delete subject (admin only)
    async delete(id: number): Promise<void> {
        await api.delete(`/subjects/${id}`);
    },

    // Search subjects
    async search(query: string): Promise<Subject[]> {
        const response = await api.get<Subject[]>('/search/subjects', {
            params: { q: query },
        });
        return response.data;
    },
};

export default subjectService;
