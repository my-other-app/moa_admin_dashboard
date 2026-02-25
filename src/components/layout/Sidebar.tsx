import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Building2, CalendarSync, Settings, LogOut, Briefcase, Image as ImageIcon, Award } from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Clubs", href: "/clubs", icon: Building2 },
    { name: "Events", href: "/events", icon: CalendarSync },
    { name: "Organizations", href: "/organizations", icon: Briefcase },
    { name: "Avatars", href: "/avatars", icon: ImageIcon },
    { name: "Badges", href: "/badges", icon: Award },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const location = useLocation();

    const getButtonClasses = (path: string) => {
        // Base route exact match, otherwise prefix match
        const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

        if (isActive) {
            return "bg-[#F9FFA1] text-[#2C333D]";
        }
        return "bg-[#4A5568] text-white hover:bg-[#5A6578]";
    };

    return (
        <aside className="fixed top-0 left-0 h-screen bg-[#2C333D] w-[72px] flex flex-col items-center py-8 z-40">
            {/* Navigation Icons */}
            <nav className="flex flex-col items-center gap-4 flex-1 mt-4">
                {navigation.map((item) => (
                    <Link key={item.name} to={item.href} title={item.name}>
                        <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors ${getButtonClasses(
                                item.href
                            )}`}
                        >
                            <item.icon size={20} />
                        </div>
                    </Link>
                ))}
            </nav>

            {/* Logout button at bottom */}
            <button
                className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors bg-[#4A5568] text-white hover:bg-red-500"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
        </aside>
    );
}
