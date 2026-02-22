import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.myotherapp.com"; // Fallback for env missing

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to inject the admin bearer token
apiClient.interceptors.request.use(
    (config) => {
        // In a real app, this might come from Zustand state or standard localStorage
        const token = localStorage.getItem("admin_access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle global 401 Unauthorized responses
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Admin unauthorized. Logging out...");
            // Handle logout logic, like Zustand store reset and redirect to /login
            localStorage.removeItem("admin_access_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;
