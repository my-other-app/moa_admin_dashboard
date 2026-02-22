import apiClient from "./client";

export interface Club {
    id: number;
    name: string;
    description: string;
    owner_id: number;
    created_at: string;
    // Admin-specific fields
    is_verified?: boolean;
    status?: "pending" | "approved" | "rejected";
}

export interface PaginatedClubsResponse {
    items: Club[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export const clubsApi = {
    getClubs: async (page = 1, size = 50, search = "", status?: string) => {
        const params: Record<string, string | number> = { page, size, search };
        if (status) params.status = status;

        const response = await apiClient.get<PaginatedClubsResponse>("/api/v1/clubs", {
            params,
        });
        return response.data;
    },

    approveClub: async (clubId: number) => {
        const response = await apiClient.post(`/api/v1/clubs/${clubId}/approve`);
        return response.data;
    },

    rejectClub: async (clubId: number) => {
        const response = await apiClient.post(`/api/v1/clubs/${clubId}/reject`);
        return response.data;
    },
};
