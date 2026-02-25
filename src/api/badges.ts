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

export interface BadgeRecipient {
    id: number;
    entity_id: number;
    entity_name: string;
    entity_email: string | null;
    awarded_at: string;
}

export interface BadgeRecipientsResponse {
    badge: BadgeAdmin;
    recipients: BadgeRecipient[];
    total: number;
}

export interface BadgeStats {
    badge: BadgeAdmin;
    total_awarded: number;
    recent_awards: BadgeRecipient[];
    awards_last_30_days: number;
    awards_last_7_days: number;
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

    getRecipients: async (badgeId: number): Promise<BadgeRecipientsResponse> => {
        const response = await apiClient.get<BadgeRecipientsResponse>(`/api/v1/badges/admin/${badgeId}/recipients`);
        return response.data;
    },

    getStats: async (badgeId: number): Promise<BadgeStats> => {
        const response = await apiClient.get<BadgeStats>(`/api/v1/badges/admin/${badgeId}/stats`);
        return response.data;
    },

    awardBadge: async (badgeId: number, entityId: number): Promise<BadgeRecipient> => {
        const response = await apiClient.post<BadgeRecipient>(`/api/v1/badges/admin/${badgeId}/award`, { entity_id: entityId });
        return response.data;
    },

    revokeBadge: async (badgeId: number, entityId: number): Promise<void> => {
        await apiClient.delete(`/api/v1/badges/admin/${badgeId}/revoke/${entityId}`);
    },
};
