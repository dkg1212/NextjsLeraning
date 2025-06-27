/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post("/api/users/forgotpassword", { email });
            setMessage(response.data.message);
        } catch (err: any) {
            setError(err.response?.data?.error || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
                <label htmlFor="email" className="text-gray-700">Email Address</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="p-2 border border-gray-300 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
            {message && <p className="text-green-500 mt-4">{message}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <Link href="/login" className="text-blue-500 mt-6">Back to Login</Link>
        </div>
    );
}