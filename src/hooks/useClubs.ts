import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clubsApi } from "@/api/clubs";

export function useClubs(page: number = 1, size: number = 20, search: string = "", status?: string) {
    return useQuery({
        queryKey: ["clubs", page, size, search, status],
        queryFn: () => clubsApi.getClubs(page, size, search, status),
        placeholderData: (prev) => prev,
    });
}

export function useApproveClub() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clubId: number) => clubsApi.approveClub(clubId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
        },
    });
}

export function useRejectClub() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clubId: number) => clubsApi.rejectClub(clubId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
        },
    });
}
