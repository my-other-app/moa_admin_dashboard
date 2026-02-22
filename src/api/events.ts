import apiClient from "./client";

export interface EventInfo {
    id: number;
    name: string;
    description: string;
    event_datetime: string;
    location_name: string;
    status: "published" | "draft" | "cancelled";
    club: {
        id: number;
        name: string;
        slug: string;
    };
    interests?: {
        id: number;
        name: string;
    }[];
}

export interface PaginatedEventsResponse {
    items: EventInfo[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export const eventsApi = {
    getEvents: async (page = 1, size = 50, search = "") => {
        const response = await apiClient.get<PaginatedEventsResponse>("/api/v1/events/admin/list", {
            params: {
                offset: (page - 1) * size,
                limit: size,
                search
            },
        });

        return {
            items: response.data.items || [],
            total: response.data.total || response.data.items?.length || 0,
            page,
            size,
            pages: response.data.pages || 1
        };
    },

    cancelEvent: async (eventId: number) => {
        const response = await apiClient.post(`/api/v1/events/${eventId}/cancel`);
        return response.data;
    },
};
