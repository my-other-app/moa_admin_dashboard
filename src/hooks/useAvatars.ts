import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { avatarsApi } from "@/api/avatars";

export function useAvatars() {
    return useQuery({
        queryKey: ["avatars"],
        queryFn: () => avatarsApi.getAvatars(),
        placeholderData: (prev) => prev,
    });
}

export function useCreateAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ name, file }: { name: string; file: File }) => avatarsApi.createAvatar(name, file),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["avatars"] }),
    });
}

export function useUpdateAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, name, file }: { id: number; name?: string; file?: File }) => avatarsApi.updateAvatar(id, name, file),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["avatars"] }),
    });
}

export function useDeleteAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => avatarsApi.deleteAvatar(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["avatars"] }),
    });
}
