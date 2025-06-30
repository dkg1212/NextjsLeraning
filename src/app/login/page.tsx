 
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LoaderCircle, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    
    const [validation, setValidation] = useState({
        emailValid: false,
        passwordValid: false
    });

    const [apiErrors, setApiErrors] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        document.documentElement.classList.contains('dark');
    }, []);

    const isButtonDisabled = !validation.emailValid || !validation.passwordValid || loading;

    useEffect(() => {
        const emailIsValid = user.email.length > 0 && /\S+@\S+\.\S+/.test(user.email);
        const passwordIsValid = user.password.length >= 6;

        setValidation({
            emailValid: emailIsValid,
            passwordValid: passwordIsValid
        });
    }, [user]);

    const onLogin = async () => {
        if (isButtonDisabled) return;

        try {
            setLoading(true);
            setApiErrors({ email: "", password: "" }); 
            await axios.post("/api/users/login", user);
            toast.success("Login successful! Redirecting...");
            router.push("/profile");
        } catch (error: any) {
            console.log("Login failed", error);

            // --- THE FIX: Smarter Error Handling Logic ---
            if (error.response && error.response.data) {
                const { error: message, field } = error.response.data;

                // 1. Ideal Case: The backend provides a 'field'.
                if (field === 'email') {
                    setApiErrors(prev => ({ ...prev, email: message }));
                } else if (field === 'password') {
                    setApiErrors(prev => ({ ...prev, password: message }));
                } 
                // 2. Fallback: Guess the field based on the error message text.
                else if (message && message.toLowerCase().includes('password')) {
                    setApiErrors(prev => ({ ...prev, password: message }));
                } else if (message && (message.toLowerCase().includes('email') || message.toLowerCase().includes('user'))) {
                    setApiErrors(prev => ({ ...prev, email: message }));
                } 
                // 3. Last Resort: Show a generic toast if we can't guess.
                else {
                    toast.error(message || "An unexpected error occurred.");
                }
            } else {
                toast.error("Invalid credentials or network issue.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUser({ ...user, [id]: value });
        if (apiErrors[id as keyof typeof apiErrors]) {
            setApiErrors(prev => ({...prev, [id]: ""}));
        }
    };

    const getInputClassName = (field: 'email' | 'password') => {
        const hasValue = user[field].length > 0;
        const isValid = validation[`${field}Valid`];
        const hasApiError = !!apiErrors[field];
        
        let borderColor = 'border-gray-300 dark:border-slate-600';
        if (hasApiError) {
            borderColor = 'border-red-500';
        } else if (hasValue) {
            borderColor = isValid ? 'border-green-500' : 'border-red-500';
        }
        
        return `w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm text-foreground bg-transparent
                placeholder:text-foreground/50
                focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-500
                transition-colors duration-200 ${borderColor}`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, duration: 0.5 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };
    
    const errorVariants = {
        hidden: { opacity: 0, y: -5, height: 0 },
        visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3 } },
        exit: { opacity: 0, y: 5, height: 0, transition: { duration: 0.2 } },
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4 relative overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 h-full w-full dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
            ></div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute top-6 left-6"
            >
                <Link
                    href="/"
                    className="flex items-center p-2 rounded-lg bg-background/60 dark:bg-background/20 shadow-md backdrop-blur-sm
                               text-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Link>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md p-8 space-y-4 bg-background/60 dark:bg-slate-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/10 dark:border-white/10"
            >
                <motion.div variants={itemVariants} className="text-center">
                    <h1 className="text-3xl font-bold text-foreground">
                        Welcome Back!
                    </h1>
                    <p className="mt-2 text-sm text-foreground/70">
                        Sign in to continue to your profile
                    </p>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                        <input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            className={getInputClassName('email')}
                            autoComplete="email"
                            required
                        />
                        <AnimatePresence>
                            {user.email.length > 0 && !apiErrors.email && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {validation.emailValid ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <AnimatePresence>
                        {apiErrors.email && (
                            <motion.p key="email-error" variants={errorVariants} initial="hidden" animate="visible" exit="exit" className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                {apiErrors.email}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={handleInputChange}
                            placeholder="Password (min. 6 characters)"
                            className={getInputClassName('password')}
                            autoComplete="current-password"
                            required
                        />
                         <AnimatePresence>
                            {user.password.length > 0 && !apiErrors.password && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {validation.passwordValid ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <AnimatePresence>
                        {apiErrors.password && (
                            <motion.p key="password-error" variants={errorVariants} initial="hidden" animate="visible" exit="exit" className="mt-1 text-xs text-red-500 flex items-center">
                                <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                {apiErrors.password}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    <div className="flex justify-end mt-2">
                        <Link href="/forgotpassword" className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                    <button
                        onClick={onLogin}
                        disabled={isButtonDisabled}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                                  bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700
                                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900
                                  disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:saturate-50
                                  transition-all duration-300 transform active:scale-[0.98]"
                    >
                        {loading ? <LoaderCircle className="animate-spin h-5 w-5" /> : "Log In"}
                    </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="text-center">
                    <Link href="/signup" className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline">
                        Don't have an account? Sign up
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}