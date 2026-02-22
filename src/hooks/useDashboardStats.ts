import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";

export interface DashboardStats {
    totalUsers: number;
    activeClubs: number;
    eventsHosted: number;
    totalRevenue: number;
    revenueData: { name: string; total: number }[];
    userGrowthData: { name: string; users: number }[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const response = await apiClient.get<DashboardStats>("/api/v1/admin/dashboard-stats");
        return response.data;
    } catch {
        // If the endpoint isn't ready on the backend yet, return realistic mock data for UI development
        console.warn("Real backend endpoint not found. Using structured mock dashboard data.");
        return {
            totalUsers: 12450,
            activeClubs: 84,
            eventsHosted: 342,
            totalRevenue: 48950.0,
            revenueData: [
                { name: "Jan", total: 1500 },
                { name: "Feb", total: 2300 },
                { name: "Mar", total: 3400 },
                { name: "Apr", total: 2900 },
                { name: "May", total: 5600 },
                { name: "Jun", total: 4800 },
                { name: "Jul", total: 6100 },
                { name: "Aug", total: 7200 },
                { name: "Sep", total: 8500 },
                { name: "Oct", total: 9400 },
            ],
            userGrowthData: [
                { name: "Mon", users: 120 },
                { name: "Tue", users: 200 },
                { name: "Wed", users: 150 },
                { name: "Thu", users: 280 },
                { name: "Fri", users: 310 },
                { name: "Sat", users: 450 },
                { name: "Sun", users: 390 },
            ],
        };
    }
};

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: fetchDashboardStats,
    });
}
