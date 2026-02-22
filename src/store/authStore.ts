import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiClient from "@/api/client";

interface User {
    id: number;
    username: string;
    email: string;
    user_type?: "admin" | "user";
    role?: "admin" | "user";
    full_name?: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            login: async (username, password) => {
                try {
                    // Axios uses multipart form-data for the OAuth2PasswordRequestForm standard in FastAPI
                    const formData = new FormData();
                    formData.append("username", username);
                    formData.append("password", password);

                    const response = await apiClient.post("/api/v1/auth/token", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });

                    const { access_token } = response.data;

                    if (access_token) {
                        set({ token: access_token, isAuthenticated: true });
                        // Set standard Axios header for subsequent requests
                        apiClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
                        await get().checkAuth();
                    } else {
                        throw new Error("Invalid login response");
                    }
                } catch (error: any) {
                    // Normalize standard HTTP 401s from the FastAPI backend into human readable validation errors
                    const errMessage = error.response?.data?.detail?.message || error.response?.data?.detail || "Invalid credentials.";
                    throw new Error(errMessage);
                }
            },

            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
                delete apiClient.defaults.headers.common["Authorization"];
            },

            checkAuth: async () => {
                const { token } = get();
                if (!token) {
                    set({ isAuthenticated: false, user: null });
                    return;
                }

                try {
                    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    const response = await apiClient.get("/api/v1/auth/me");

                    // Simple RBAC: Ensure logged in identity is genuinely an admin
                    if (response.data.user_type !== "admin" && response.data.role !== "admin") {
                        get().logout();
                        throw new Error("Unauthorized: Account lacks administrative privileges.");
                    }

                    set({ user: response.data, isAuthenticated: true });
                } catch (error) {
                    get().logout();
                    throw error;
                }
            },
        }),
        {
            name: "moa-admin-auth",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;
