/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { User, Mail, LogOut, LoaderCircle, Home as HomeIcon, CheckCircle, Eye, EyeOff } from "lucide-react";

// --- THEME-AWARE HEADER COMPONENT ---
const Header = () => {
    const pathname = usePathname();
    const navItems = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 dark:bg-background/80 backdrop-blur-lg border-b border-black/10 dark:border-white/10">
            <nav className="container mx-auto px-4">
                <div className="flex justify-center items-center h-16">
                    <div className="flex space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                                    ${pathname === item.href
                                        ? 'text-white bg-sky-600 shadow-md'
                                        : 'text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'
                                    }`}
                            >
                                <item.icon className="mr-2 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
};

// --- USER DATA TYPE ---
interface UserData {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
}

// --- THEME-AWARE SKELETON LOADER ---
const ProfileSkeleton = () => (
    <div className="w-full max-w-md p-8 space-y-6 bg-background/60 dark:bg-slate-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 animate-pulse">
        <div className="flex flex-col items-center space-y-4">
            <div className="w-28 h-28 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded-md w-48"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-32"></div>
        </div>
        <hr className="my-6 border-black/10 dark:border-white/10" />
        <div className="space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
        </div>
        <div className="pt-6">
             <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
        </div>
    </div>
);

export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [showId, setShowId] = useState(false); // State for ID visibility

    const logout = async () => {
        setLoggingOut(true);
        try {
            await axios.get("/api/users/logout");
            toast.success("Logout successful!");
            router.push("/login");
        } catch (error: any) {
            console.error(error.message);
            toast.error(error.message);
            setLoggingOut(false);
        }
    };

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const res = await axios.get("/api/users/me");
                setUserData(res.data.data);
            } catch (error: any) {
                console.error("Failed to fetch user details:", error.message);
                toast.error("Your session may have expired. Please log in again.");
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        getUserDetails();
    }, [router]);

    const cardVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                {loading ? (
                    <ProfileSkeleton />
                ) : userData ? (
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-md p-8 space-y-6 bg-background/60 dark:bg-slate-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/10 dark:border-white/10"
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <motion.div variants={itemVariants}>
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                    {userData.username.charAt(0).toUpperCase()}
                                </div>
                            </motion.div>
                            <motion.h1 variants={itemVariants} className="text-3xl font-bold text-foreground">
                                {userData.username}
                            </motion.h1>
                            
                            <AnimatePresence mode="wait">
                                {showId && (
                                    <motion.p
                                        key="id"
                                        variants={itemVariants}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-xs text-foreground/50"
                                    >
                                        User ID: {userData._id}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                        <hr className="my-6 border-black/10 dark:border-white/10" />
                        <motion.div variants={itemVariants} className="space-y-4 text-sm">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-foreground/50" />
                                <span className="text-foreground">{userData.email}</span>
                            </div>
                             <div className="flex items-center space-x-3">
                                <CheckCircle className={`h-5 w-5 ${userData.isVerified ? 'text-green-500' : 'text-yellow-500'}`} />
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                    userData.isVerified 
                                    ? 'bg-green-500/10 text-green-500' 
                                    : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                    {userData.isVerified ? "Verified Account" : "Verification Pending"}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-6 space-y-4">
                            <button
                                onClick={() => setShowId(!showId)}
                                className="w-full flex justify-center items-center py-2 px-4 border rounded-lg text-sm font-medium text-foreground/70
                                          border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {showId ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                                {showId ? 'Hide User ID' : 'Show User ID'}
                            </button>

                            <button
                                onClick={logout}
                                disabled={loggingOut}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                                          bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-900
                                          disabled:bg-gray-400 disabled:saturate-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {loggingOut ? <LoaderCircle className="animate-spin h-5 w-5" /> : ( <> <LogOut className="mr-2 h-5 w-5" /> Logout </> )}
                            </button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <div className="text-center p-8 bg-background/60 rounded-xl">
                        <h2 className="text-xl font-semibold text-red-500">Could not load profile.</h2>
                        <p className="text-foreground/70">Please try logging in again.</p>
                        <button onClick={() => router.push('/login')} className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Go to Login
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}