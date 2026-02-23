import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orgsApi } from "@/api/orgs";

export function useOrgs() {
    return useQuery({
        queryKey: ["orgs"],
        queryFn: () => orgsApi.getOrgs(),
        placeholderData: (prev) => prev,
    });
}

export function useCreateOrg() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => orgsApi.createOrg(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orgs"] }),
    });
}

export function useUpdateOrg() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => orgsApi.updateOrg(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orgs"] }),
    });
}

export function useDeleteOrg() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => orgsApi.deleteOrg(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orgs"] }),
    });
}

export function useBlockOrg() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => orgsApi.blockOrg(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orgs"] }),
    });
}

export function useImportOrgs() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => orgsApi.importOrgs(file),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orgs"] }),
    });
}
