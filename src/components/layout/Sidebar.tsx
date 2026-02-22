import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Building2, CalendarSync, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Clubs", href: "/clubs", icon: Building2 },
    { name: "Events", href: "/events", icon: CalendarSync },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-background px-4 py-6">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xl">M</span>
                </div>
                <span className="text-xl font-bold tracking-tight">MOA Admin</span>
            </div>

            <nav className="flex-1 space-y-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto px-2 border-t pt-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-semibold">AD</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-none">Admin User</span>
                        <span className="text-xs text-muted-foreground leading-tight mt-1">Superadmin</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
