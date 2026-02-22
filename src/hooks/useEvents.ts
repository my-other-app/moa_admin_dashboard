import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "@/api/events";

export function useEvents(page: number = 1, size: number = 20, search: string = "") {
    return useQuery({
        queryKey: ["events", page, size, search],
        queryFn: () => eventsApi.getEvents(page, size, search),
        placeholderData: (prev) => prev,
    });
}

export function useCancelEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: number) => eventsApi.cancelEvent(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}
