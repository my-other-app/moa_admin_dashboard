import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/users";

export function useUsers(page: number = 1, size: number = 20, search: string = "") {
    return useQuery({
        queryKey: ["users", page, size, search],
        queryFn: () => usersApi.getUsers(page, size, search),
        // Optional: Keep previous data while fetching new pages for smoother UI transitions
        placeholderData: (prev) => prev,
    });
}

export function useBanUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => usersApi.banUser(userId),
        onSuccess: () => {
            // Invalidate the users query so the table re-fetches and shows updated state
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
