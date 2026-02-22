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
        { title: "Total Users", value: data.totalUsers.toLocaleString(), icon: Users, desc: "+12% from last month" },
        { title: "Verified Clubs", value: data.activeClubs.toLocaleString(), icon: Building2, desc: "+3 new this week" },
        { title: "Events Hosted", value: data.eventsHosted.toLocaleString(), icon: CalendarSync, desc: "+48 this month" },
        { title: "Platform Revenue", value: `₹${data.totalRevenue.toLocaleString()}`, icon: IndianRupee, desc: "+24% from last month" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                    Welcome to the MOA Admin Dashboard. View system analytics and recent activity here.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => (
                    <div key={i} className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between h-36">
                        <div className="flex items-center justify-between">
                            <h3 className="tracking-tight text-sm font-medium">{stat.title}</h3>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 col-span-4">
                    <div className="flex flex-col space-y-1.5 mb-4">
                        <h3 className="font-semibold leading-none tracking-tight">Revenue Metrics</h3>
                        <p className="text-sm text-muted-foreground">Monthly ticket sales revenue across all events.</p>
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
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 col-span-3">
                    <div className="flex flex-col space-y-1.5 mb-4">
                        <h3 className="font-semibold leading-none tracking-tight">Active Usage Growth</h3>
                        <p className="text-sm text-muted-foreground">Daily active users engaging with the platform.</p>
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
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
