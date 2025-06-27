/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
// Import Variants type from framer-motion
import { motion, Variants } from "framer-motion";
import { User, Mail, LogOut, LoaderCircle, Home as HomeIcon } from "lucide-react";

// --- Reusable Header Component ---
const Header = () => {
    const pathname = usePathname();
    const navItems = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <header className="w-full bg-white shadow-sm">
            <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-16">
                    <div className="flex space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                    ${pathname === item.href
                                        ? 'text-white bg-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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

// Define a type for our user data for better TypeScript support
interface UserData {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
}

// A beautiful skeleton loader component
const ProfileSkeleton = () => (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg animate-pulse">
        <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="h-6 bg-gray-300 rounded-md w-40"></div>
            <div className="h-4 bg-gray-300 rounded-md w-52"></div>
        </div>
        <hr className="my-6 border-gray-200" />
        <div className="space-y-4">
            <div className="h-5 bg-gray-300 rounded-md w-full"></div>
            <div className="h-5 bg-gray-300 rounded-md w-full"></div>
        </div>
        <div className="pt-6">
             <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
        </div>
    </div>
);


export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

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
                toast.error("Could not fetch user data.");
            } finally {
                setLoading(false);
            }
        };
        getUserDetails();
    }, []);

    // Animation variants for Framer Motion, now with the correct 'Variants' type
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                {loading ? (
                    <ProfileSkeleton />
                ) : userData ? (
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"
                    >
                        {/* The rest of the profile card JSX is the same */}
                        <div className="flex flex-col items-center space-y-2">
                            <motion.div variants={itemVariants}>
                                <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                                    {userData.username.charAt(0).toUpperCase()}
                                </div>
                            </motion.div>
                            <motion.h1 variants={itemVariants} className="text-2xl font-bold text-gray-900">
                                {userData.username}
                            </motion.h1>
                            <motion.p variants={itemVariants} className="text-sm text-gray-500">
                               User ID: {userData._id}
                            </motion.p>
                        </div>
                        <hr className="my-6 border-gray-200" />
                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <span className="text-gray-700">{userData.email}</span>
                            </div>
                             <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    userData.isVerified 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {userData.isVerified ? "Verified Account" : "Not Verified"}
                                </span>
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="pt-6">
                            <button
                                onClick={logout}
                                disabled={loggingOut}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                                          bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                                          disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {loggingOut ? <LoaderCircle className="animate-spin h-5 w-5" /> : ( <> <LogOut className="mr-2 h-5 w-5" /> Logout </> )}
                            </button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-red-600">Could not load profile.</h2>
                        <p className="text-gray-500">Please try logging in again.</p>
                        <button onClick={() => router.push('/login')} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                            Go to Login
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}