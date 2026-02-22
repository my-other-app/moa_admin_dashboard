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
    // 1. Fetch real numerical totals from our new Admin Analytics API
    const response = await apiClient.get("/api/v1/admin/analytics");
    const data = response.data;

    // 2. Return the hybrid payload (Real Backend counts + Mock Charts until Rechart API is built)
    return {
        totalUsers: data.total_users || 0,
        activeClubs: data.verified_clubs || 0,
        eventsHosted: data.events_hosted || 0,
        totalRevenue: data.platform_revenue || 0,
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
};

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: fetchDashboardStats,
    });
}
