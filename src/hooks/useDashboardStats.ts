import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";

export interface DashboardStats {
    totalUsers: number;
    totalUsersDelta: string;
    activeClubs: number;
    activeClubsDelta: string;
    eventsHosted: number;
    eventsHostedDelta: string;
    totalRevenue: number;
    totalRevenueDelta: string;
    revenueData: { name: string; total: number }[];
    userGrowthData: { name: string; users: number }[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/api/v1/admin/analytics");
    const data = response.data;

    return {
        totalUsers: data.total_users || 0,
        totalUsersDelta: data.total_users_delta || "+0% from last month",
        activeClubs: data.verified_clubs || 0,
        activeClubsDelta: data.verified_clubs_delta || "+0 new this week",
        eventsHosted: data.events_hosted || 0,
        eventsHostedDelta: data.events_hosted_delta || "+0 this month",
        totalRevenue: data.platform_revenue || 0,
        totalRevenueDelta: data.platform_revenue_delta || "+0% from last month",
        revenueData: data.revenue_data || [],
        userGrowthData: data.user_growth_data || [],
    };
};

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: fetchDashboardStats,
    });
}
