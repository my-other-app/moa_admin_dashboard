import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/api/client", () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        defaults: { headers: { common: {} as Record<string, string> } },
    },
}));

import apiClient from "@/api/client";
import useAuthStore from "./authStore";

describe("authStore.login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
    });

    it("surfaces a specific message on 429 rather than a generic one", async () => {
        (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
            response: { status: 429, data: { message: "rate limited" } },
        });

        await expect(useAuthStore.getState().login("user", "pass")).rejects.toThrow(
            "Too many login attempts. Please wait a moment and try again."
        );
    });

    it("reads the error message from the backend's flat { message } shape, not a nested detail field", async () => {
        (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
            response: { status: 401, data: { message: "Incorrect username or password" } },
        });

        await expect(useAuthStore.getState().login("user", "wrong")).rejects.toThrow(
            "Incorrect username or password"
        );
    });

    it("falls back to a generic message when the response has no message field", async () => {
        (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValueOnce({
            response: { status: 500, data: {} },
        });

        await expect(useAuthStore.getState().login("user", "pass")).rejects.toThrow(
            "Invalid credentials."
        );
    });

    it("sets token and isAuthenticated on successful login", async () => {
        (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            data: { access_token: "abc123" },
        });
        (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            data: { user_type: "admin", id: 1, username: "user", email: "a@b.com" },
        });

        await useAuthStore.getState().login("user", "pass");

        expect(useAuthStore.getState().token).toBe("abc123");
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
});
