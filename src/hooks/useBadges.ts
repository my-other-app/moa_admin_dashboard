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

export function useBadgeRecipients(badgeId: number | null) {
    return useQuery({
        queryKey: ["badges", "recipients", badgeId],
        queryFn: () => badgesApi.getRecipients(badgeId!),
        enabled: !!badgeId,
    });
}

export function useBadgeStats(badgeId: number | null) {
    return useQuery({
        queryKey: ["badges", "stats", badgeId],
        queryFn: () => badgesApi.getStats(badgeId!),
        enabled: !!badgeId,
    });
}

export function useAwardBadge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ badgeId, entityId }: { badgeId: number; entityId: number }) =>
            badgesApi.awardBadge(badgeId, entityId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["badges", "recipients", variables.badgeId] });
            queryClient.invalidateQueries({ queryKey: ["badges", "stats", variables.badgeId] });
            queryClient.invalidateQueries({ queryKey: ["badges", "admin"] });
        },
    });
}

export function useRevokeBadge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ badgeId, entityId }: { badgeId: number; entityId: number }) =>
            badgesApi.revokeBadge(badgeId, entityId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["badges", "recipients", variables.badgeId] });
            queryClient.invalidateQueries({ queryKey: ["badges", "stats", variables.badgeId] });
            queryClient.invalidateQueries({ queryKey: ["badges", "admin"] });
        },
    });
}
