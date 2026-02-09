// TypeScript types matching backend schemas

// User types
export interface User {
    id: number;
    full_name: string;
    email: string;
    is_verified: boolean;
    is_admin?: boolean;
}

export interface UserCreate {
    full_name: string;
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

// Auth types
export interface Token {
    access_token: string;
    token_type: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Subject types
export interface Subject {
    id: number;
    name: string;
    exam_type: 'OL' | 'AL';
    description: string | null;
    is_active: boolean;
    created_at: string;
}

export interface SubjectCreate {
    name: string;
    exam_type: 'OL' | 'AL';
    description?: string;
}

// Note types
export interface Note {
    id: number;
    title: string;
    content: string;
    subject_id: number;
    topic: string | null;
    author_id: number;
    author?: User;
    file_url: string | null;
    is_published: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
}

export interface NoteCreate {
    title: string;
    content: string;
    subject_id: number;
    topic?: string;
    is_published?: boolean;
    file_url?: string;
}

export interface NoteUpdate {
    title?: string;
    content?: string;
    topic?: string;
    is_published?: boolean;
    file_url?: string;
}

export interface NoteListResponse {
    notes: Note[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
}

export interface SearchResponse {
    notes: Note[];
    total: number;
    query: string;
}

// API Response types
export interface MessageResponse {
    message: string;
    detail?: string;
}
