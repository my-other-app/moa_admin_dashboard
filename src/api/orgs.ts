import apiClient from "./client";

export interface Organization {
    id: number;
    name: string;
    type: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: { filename: string; bytes: any };
    is_verified?: boolean;
    is_blocked?: boolean;
}

export const orgsApi = {
    getOrgs: async () => {
        const response = await apiClient.get<Organization[]>("/api/v1/orgs/list");
        return response.data || [];
    },

    createOrg: async (data: any) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });
        const response = await apiClient.post("/api/v1/orgs/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    updateOrg: async (id: number, data: any) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });
        const response = await apiClient.put(`/api/v1/orgs/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    deleteOrg: async (id: number) => {
        const response = await apiClient.delete(`/api/v1/orgs/delete/${id}`);
        return response.data;
    },

    blockOrg: async (id: number) => {
        const response = await apiClient.put(`/api/v1/orgs/block/${id}`);
        return response.data;
    },

    importOrgs: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post("/api/v1/orgs/import", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    getOrgAnalytics: async (id: number) => {
        const response = await apiClient.get(`/api/v1/orgs/admin/${id}/analytics`);
        return response.data;
    },
};
