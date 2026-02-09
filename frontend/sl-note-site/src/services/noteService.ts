import api from './api';
import type { Note, NoteCreate, NoteUpdate, NoteListResponse, SearchResponse } from '../types';

export const noteService = {
    // Get notes list with pagination
    async getAll(params?: {
        subject_id?: number;
        exam_type?: 'OL' | 'AL';
        topic?: string;
        page?: number;
        per_page?: number;
    }): Promise<NoteListResponse> {
        const response = await api.get<NoteListResponse>('/notes', { params });
        // Calculate pages if not provided
        const data = response.data;
        if (!data.pages && data.total && data.per_page) {
            data.pages = Math.ceil(data.total / data.per_page);
        }
        return data;
    },

    // Get single note
    async getById(id: number): Promise<Note> {
        const response = await api.get<Note>(`/notes/${id}`);
        return response.data;
    },

    // Create note
    async create(data: NoteCreate): Promise<Note> {
        const response = await api.post<Note>('/notes', data);
        return response.data;
    },

    // Update note
    async update(id: number, data: NoteUpdate): Promise<Note> {
        const response = await api.put<Note>(`/notes/${id}`, data);
        return response.data;
    },

    // Delete note
    async delete(id: number): Promise<void> {
        await api.delete(`/notes/${id}`);
    },

    // Get current user's notes
    async getUserNotes(): Promise<Note[]> {
        const response = await api.get<Note[]>('/notes/user/me');
        return response.data;
    },

    // Search notes
    async search(query: string, params?: {
        exam_type?: 'OL' | 'AL';
        subject_id?: number;
        limit?: number;
    }): Promise<Note[]> {
        const response = await api.get<SearchResponse>('/search', {
            params: { q: query, ...params },
        });
        return response.data.notes;
    },

    // Upload file for note
    async uploadFile(file: File, noteId?: number): Promise<{ file_url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        if (noteId) {
            formData.append('note_id', noteId.toString());
        }

        const response = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};

export default noteService;
