/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, LoaderCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    
    const [validation, setValidation] = useState({
        emailValid: false,
        passwordValid: false
    });

    useEffect(() => {
        const emailIsValid = user.email.length > 0 && /\S+@\S+\.\S+/.test(user.email);
        const passwordIsValid = user.password.length > 0;

        setValidation({
            emailValid: emailIsValid,
            passwordValid: passwordIsValid
        });

        if (emailIsValid && passwordIsValid) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    const onLogin = async () => {
        if (buttonDisabled) return;

        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login successful! Redirecting...");
            router.push("/profile");
        } catch (error: any) {
            console.log("Login failed", error);
            const errorMessage = error.response?.data?.error || "Invalid credentials. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUser({ ...user, [id]: value });
    };

    const getInputClassName = (field: 'email' | 'password') => {
        let borderColor = 'border-gray-300';
        if (user[field].length > 0) {
            borderColor = validation[`${field}Valid`] ? 'border-green-500' : 'border-red-500';
        }
        return `w-full pl-10 pr-3 py-2 border rounded-lg text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                transition-colors duration-200 ${borderColor}`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 relative p-4">
            {/* --- Back to Home Button --- */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Link
                    href="/"
                    className="absolute top-6 left-6 flex items-center p-2 rounded-lg bg-white shadow-md
                               text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome Back!
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to continue to your profile
                    </p>
                </div>
                
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className={getInputClassName('email')}
                        autoComplete="email"
                    />
                </div>

                <div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className={getInputClassName('password')}
                            autoComplete="current-password"
                        />
                    </div>
                    {/* --- Forgot Password Link --- */}
                    <div className="flex justify-end mt-2">
                        <Link href="/forgotpassword" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                <motion.button
                    onClick={onLogin}
                    disabled={buttonDisabled || loading}
                    whileHover={{ scale: buttonDisabled ? 1 : 1.03 }}
                    whileTap={{ scale: buttonDisabled ? 1 : 0.98 }}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                              bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                              disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {loading ? (
                        <LoaderCircle className="animate-spin h-5 w-5" />
                    ) : (
                        "Log In"
                    )}
                </motion.button>
                
                <div className="text-center">
                    <Link href="/signup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                        Don't have an account? Sign up
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}