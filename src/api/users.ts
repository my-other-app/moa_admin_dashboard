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
        const response = await apiClient.get<PaginatedUsersResponse>("/api/v1/user/admin/list", {
            params: {
                offset: (page - 1) * size, // Typical translation of page/size to fastAPI limit/offset
                limit: size,
                search
            },
        });
        const totalItems = response.data.total || response.data.items?.length || 0;
        return {
            items: response.data.items || [],
            total: totalItems,
            page,
            size,
            pages: Math.ceil(totalItems / size) || 1
        };
    },

    // Example of an admin action
    banUser: async (userId: number) => {
        const response = await apiClient.post(`/api/v1/users/${userId}/ban`);
        return response.data;
    },
};
