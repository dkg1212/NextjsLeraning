 
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, LoaderCircle, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [validation, setValidation] = useState({
        usernameValid: false,
        emailValid: false,
        passwordValid: false,
    });
    
    // State to hold specific error messages for display
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
    });

    // Detect theme from the <html> element on mount
    useEffect(() => {
        document.documentElement.classList.contains('dark');
    }, []);

    // Derived state for the button, simplifies logic
    const isButtonDisabled = !validation.usernameValid || !validation.emailValid || !validation.passwordValid || loading;

    // --- Real-time Validation Logic ---
    useEffect(() => {
        const newErrors = { username: "", email: "", password: "" };
        const newValidation = { usernameValid: false, emailValid: false, passwordValid: false };

        // Username validation
        if (user.username.length > 0) {
            if (user.username.length < 3) {
                newErrors.username = "Must be at least 3 characters long.";
            } else {
                newValidation.usernameValid = true;
            }
        }
        
        // Email validation
        if (user.email.length > 0) {
            if (!/\S+@\S+\.\S+/.test(user.email)) {
                newErrors.email = "Please enter a valid email address.";
            } else {
                newValidation.emailValid = true;
            }
        }

        // Password validation
        if (user.password.length > 0) {
            if (user.password.length < 6) {
                newErrors.password = "Must be at least 6 characters long.";
            } else {
                newValidation.passwordValid = true;
            }
        }

        setErrors(newErrors);
        setValidation(newValidation);
    }, [user]);

    const onSignup = async () => {
        if (isButtonDisabled) return;

        try {
            setLoading(true);
            await axios.post("/api/users/signup", user);
            toast.success("Account created! Please check your email to verify.");
            router.push("/login");
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Signup failed. Please try again.";
            console.log("Signup failed", error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUser({ ...user, [id]: value });
    };

    const getInputClassName = (field: 'username' | 'email' | 'password') => {
        const hasValue = user[field].length > 0;
        const isValid = validation[`${field}Valid`];
        let borderColor = 'border-gray-300 dark:border-slate-600';

        if (hasValue) {
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
                <motion.div variants={itemVariants} className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-foreground">
                        Create an Account
                    </h1>
                    <p className="mt-2 text-sm text-foreground/70">
                        Join us and start your journey!
                    </p>
                </motion.div>
                
                {/* --- Username Input --- */}
                <motion.div variants={itemVariants}>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                        <input
                            id="username"
                            type="text"
                            value={user.username}
                            onChange={handleInputChange}
                            placeholder="your_username"
                            className={getInputClassName('username')}
                            autoComplete="username"
                            required
                        />
                        <AnimatePresence>
                            {user.username.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {validation.usernameValid ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                </motion.div>

                {/* --- Email Input --- */}
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
                            {user.email.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {validation.emailValid ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </motion.div>

                {/* --- Password Input --- */}
                <motion.div variants={itemVariants}>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            className={getInputClassName('password')}
                            autoComplete="new-password"
                            required
                        />
                        <AnimatePresence>
                            {user.password.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {validation.passwordValid ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </motion.div>
                
                {/* --- Submit Button --- */}
                <motion.div variants={itemVariants} className="pt-2">
                    <button
                        onClick={onSignup}
                        disabled={isButtonDisabled}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                                  bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700
                                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900
                                  disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:saturate-50
                                  transition-all duration-300 transform active:scale-[0.98]"
                    >
                        {loading ? <LoaderCircle className="animate-spin h-5 w-5" /> : "Sign Up"}
                    </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="text-center">
                    <Link href="/login" className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline">
                        Already have an account? Log in
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}