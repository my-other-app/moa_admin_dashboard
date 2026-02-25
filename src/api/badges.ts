import apiClient from "./client";

export interface BadgeAdmin {
    id: number;
    slug: string;
    name: string;
    description: string;
    emoji: string;
    badge_type: 'user' | 'club';
    trigger_metric: string;
    threshold: number;
    claimed_count: number;
}

export interface BadgeCreateData {
    slug: string;
    name: string;
    description: string;
    emoji: string;
    badge_type: string;
    trigger_metric: string;
    threshold: number;
}

export interface BadgeUpdateData {
    slug?: string;
    name?: string;
    description?: string;
    emoji?: string;
    trigger_metric?: string;
    threshold?: number;
}

export const badgesApi = {
    getAdminBadges: async (): Promise<BadgeAdmin[]> => {
        const response = await apiClient.get<BadgeAdmin[]>("/api/v1/badges/admin");
        return response.data || [];
    },

    createBadge: async (data: BadgeCreateData): Promise<BadgeAdmin> => {
        const response = await apiClient.post<BadgeAdmin>("/api/v1/badges/admin", data);
        return response.data;
    },

    updateBadge: async (id: number, data: BadgeUpdateData): Promise<BadgeAdmin> => {
        const response = await apiClient.put<BadgeAdmin>(`/api/v1/badges/admin/${id}`, data);
        return response.data;
    },
};
