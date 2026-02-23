import apiClient from "./client";

export interface Avatar {
    id: number;
    name: string;
    image?: { filename: string; bytes: any };
}

export const avatarsApi = {
    getAvatars: async () => {
        const response = await apiClient.get<Avatar[]>("/api/v1/user/avatar/list");
        return response.data || [];
    },

    createAvatar: async (name: string, file: File) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("avatar", file);
        const response = await apiClient.post("/api/v1/user/avatar/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    updateAvatar: async (id: number, name?: string, file?: File) => {
        const formData = new FormData();
        if (name) formData.append("name", name);
        if (file) formData.append("avatar", file);
        const response = await apiClient.put(`/api/v1/user/avatar/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    deleteAvatar: async (id: number) => {
        const response = await apiClient.delete(`/api/v1/user/avatar/delete/${id}`);
        return response.data;
    },
};
