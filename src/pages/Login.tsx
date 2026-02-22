import { useState } from "react";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const login = useAuthStore((state: any) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(username, password);
            navigate("/"); // Redirect to dashboard on success
        } catch (err: any) {
            setError(err.message || "Failed to login. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2C333D] flex flex-col justify-center items-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#2C333D] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-white bebas text-3xl mt-1">MOA</span>
                    </div>
                    <h1 className="bebas text-4xl text-center text-gray-900 tracking-wide">
                        Admin Portal
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 text-center">
                        Sign in to securely manage the My Other App ecosystem.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F9FFA1] focus:border-[#2C333D] transition-all bg-gray-50 focus:bg-white"
                            placeholder="admin@myotherapp.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F9FFA1] focus:border-[#2C333D] transition-all bg-gray-50 focus:bg-white"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#2C333D] hover:bg-black text-[#F9FFA1] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-[#F9FFA1] border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Sign In to Dashboard</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
