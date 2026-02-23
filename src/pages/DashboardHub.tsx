import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Users, Building2, CalendarSync, IndianRupee } from "lucide-react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    LineChart,
} from "recharts";

export function DashboardHub() {
    const { data, isLoading } = useDashboardStats();

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <h2 className="text-xl font-semibold text-muted-foreground animate-pulse">Loading Analytics...</h2>
            </div>
        );
    }

    const statCards = [
        { title: "Total Users", value: data.totalUsers.toLocaleString(), icon: Users, desc: data.totalUsersDelta },
        { title: "Verified Clubs", value: data.activeClubs.toLocaleString(), icon: Building2, desc: data.activeClubsDelta },
        { title: "Events Hosted", value: data.eventsHosted.toLocaleString(), icon: CalendarSync, desc: data.eventsHostedDelta },
        { title: "Platform Revenue", value: `₹${data.totalRevenue.toLocaleString()}`, icon: IndianRupee, desc: data.totalRevenueDelta },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="bebas text-[32px] md:text-[40px] tracking-wide text-black">
                    Dashboard Overview
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((stat, i) => {
                    // Match the specific icon colors from moa_clubs based on stats
                    let iconColor = "text-blue-600";
                    if (stat.title === "Total Users") iconColor = "text-blue-600";
                    if (stat.title === "Verified Clubs") iconColor = "text-indigo-600";
                    if (stat.title === "Events Hosted") iconColor = "text-purple-600";
                    if (stat.title === "Platform Revenue") iconColor = "text-green-600";

                    return (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-[110px]">
                            <div className={`flex items-center gap-2 ${iconColor}`}>
                                <stat.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{stat.title}</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-4">
                    <div className="flex flex-col space-y-1.5 mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Revenue Metrics</h3>
                        <p className="text-xs text-gray-500">Monthly ticket sales revenue across all events.</p>
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.revenueData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total" fill="#2C333D" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm col-span-3">
                    <div className="flex flex-col space-y-1.5 mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">New User Registrations</h3>
                        <p className="text-xs text-gray-500">Daily users joining the platform over the last 7 days.</p>
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.userGrowthData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#F9FFA1" strokeWidth={4} dot={{ r: 4, fill: '#2C333D' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
