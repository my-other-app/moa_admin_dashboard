import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-[#2C333D] overflow-hidden relative font-sans">
            <Sidebar />
            <div className="w-[72px] flex-shrink-0" /> {/* Spacer for fixed sidebar */}
            <main className="flex-1 p-6 md:p-8">
                <div className="bg-white rounded-2xl p-6 md:p-10 min-h-[calc(100vh-4rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
