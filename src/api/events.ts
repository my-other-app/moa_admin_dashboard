import apiClient from "./client";

export interface EventInfo {
    id: number;
    name: string;
    description: string;
    event_datetime: string;
    location_name: string;
    status: "published" | "draft" | "cancelled";
    club_id: number;
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
        const response = await apiClient.get<PaginatedEventsResponse>("/api/v1/events", {
            params: {
                page,
                size,
                search,
            },
        });
        return response.data;
    },

    cancelEvent: async (eventId: number) => {
        const response = await apiClient.post(`/api/v1/events/${eventId}/cancel`);
        return response.data;
    },
};
