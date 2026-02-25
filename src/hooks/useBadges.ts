import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { badgesApi, BadgeCreateData, BadgeUpdateData } from "@/api/badges";

export function useAdminBadges() {
    return useQuery({
        queryKey: ["badges", "admin"],
        queryFn: () => badgesApi.getAdminBadges(),
    });
}

export function useCreateBadge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BadgeCreateData) => badgesApi.createBadge(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["badges", "admin"] });
        },
    });
}

export function useUpdateBadge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: BadgeUpdateData }) => badgesApi.updateBadge(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["badges", "admin"] });
        },
    });
}
