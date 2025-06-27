/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const urlToken = searchParams.get("token");
        if (urlToken) {
            setToken(urlToken);
        } else {
            setError("Reset token not found in URL.");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!token) {
            setError("Token is missing. Cannot reset password.");
            return;
        }
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post("/api/users/resetpassword", { token, newPassword });
            setMessage(response.data.message + " Redirecting to login...");
            setTimeout(() => router.push("/login"), 3000); // Redirect after 3 seconds
        } catch (err: any) {
            setError(err.response?.data?.error || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
                <label htmlFor="newPassword">New Password</label>
                <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
                />
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
                />
                <button
                    type="submit"
                    disabled={loading || !token}
                    className="p-2 border border-gray-300 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
             {message && <p className="text-green-500 mt-4">{message}</p>}
             {error && <p className="text-red-500 mt-4">{error}</p>}
             {message && <Link href="/login" className="text-blue-500 mt-6">Login Now</Link>}
        </div>
    );
}

// Next.js 13+ requires Suspense for useSearchParams
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}