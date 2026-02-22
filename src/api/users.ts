import apiClient from "./client";

export interface User {
    id: number;
    email: string;
    full_name: string;
    auth_provider: string;
    organization_id?: number | null;
    created_at: string;
    updated_at: string;
}

export interface PaginatedUsersResponse {
    items: User[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export const usersApi = {
    getUsers: async (page = 1, size = 50, search = "") => {
        // In a real scenario, this matches the Python FastAPI endpoint:
        // /api/v1/users/admin/list or similar
        const response = await apiClient.get<PaginatedUsersResponse>("/api/v1/users", {
            params: {
                page,
                size,
                search,
            },
        });
        return response.data;
    },

    // Example of an admin action
    banUser: async (userId: number) => {
        const response = await apiClient.post(`/api/v1/users/${userId}/ban`);
        return response.data;
    },
};
