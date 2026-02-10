import api from './api';

// Admin service for admin panel operations
export const adminService = {
    // Get dashboard stats
    async getStats() {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    // Get all users
    async getUsers() {
        const response = await api.get('/admin/users');
        return response.data;
    },

    // Update user
    async updateUser(userId: number, data: { is_verified?: boolean; is_admin?: boolean }) {
        const response = await api.put(`/admin/users/${userId}`, data);
        return response.data;
    },

    // Delete user
    async deleteUser(userId: number) {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // Get all notes (including unpublished)
    async getAllNotes() {
        const response = await api.get('/admin/notes');
        return response.data;
    },

    // Toggle note publish status
    async toggleNotePublish(noteId: number) {
        const response = await api.put(`/admin/notes/${noteId}/publish`);
        return response.data;
    },
};

export default adminService;
