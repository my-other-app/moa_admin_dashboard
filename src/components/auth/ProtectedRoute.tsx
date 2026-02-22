import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";

export function ProtectedRoute() {
    const { isAuthenticated, token, checkAuth } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            if (token) {
                try {
                    await checkAuth();
                } catch (error) {
                    console.error("Session expired or invalid token on reload", error);
                }
            }
            setIsChecking(false);
        };
        verifyAuth();
    }, [token, checkAuth]);

    if (isChecking) {
        return <div className="flex h-screen items-center justify-center">Loading dashboard...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
