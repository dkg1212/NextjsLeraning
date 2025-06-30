/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Shield,
  Lock,
  Mail,
  UserCheck,
  RefreshCw,
  LogIn,
  LogOut,
  ArrowRight,
  CheckCircle,
  Moon,
  Sun,
  KeyRound,
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  // This state is still useful for triggering re-renders of icons and conditional UI
  const [darkMode, setDarkMode] = useState(false);

  // This logic is now perfectly aligned with your globals.css
  // It correctly checks system/local storage and sets the .dark class on the <html> element
  useEffect(() => {
    const isDarkModePreferred =
      localStorage.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDarkModePreferred);
    if (isDarkModePreferred) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    localStorage.setItem("darkMode", newDarkModeState.toString());
    // This correctly toggles the class on the <html> element, triggering your CSS variables
    document.documentElement.classList.toggle("dark", newDarkModeState);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/users/me");
        setIsLoggedIn(response.ok);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const features = [
    {
      icon: <UserCheck className="w-8 h-8 text-sky-500" />,
      title: "Seamless Registration",
      description: "Secure signup with email verification and password validation.",
    },
    {
      icon: <LogIn className="w-8 h-8 text-green-500" />,
      title: "Robust Login",
      description: "JWT-based authentication with secure HTTP-only cookies.",
    },
    {
      icon: <LogOut className="w-8 h-8 text-red-500" />,
      title: "Secure Logout",
      description: "Instantly terminate sessions and clear authentication tokens.",
    },
    {
      icon: <Mail className="w-8 h-8 text-purple-500" />,
      title: "Email Verification",
      description: "Activate accounts confidently via secure email links.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-yellow-500" />,
      title: "Effortless Password Reset",
      description: "Forgot password flow with secure, token-based recovery.",
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-500" />,
      title: "Protected Routes",
      description: "Middleware-based guards for both public and private pages.",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    // --- CHANGE: Using the new utility classes from your globals.css ---
    // The body tag already handles the base colors, but this ensures
    // the component's root container also uses the correct variables.
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* --- CHANGE: Nav colors are updated to use background variable for consistency --- */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 dark:bg-background/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
              >
                <Lock className="w-8 h-8 text-sky-600 dark:text-sky-400" />
              </motion.div>
              {/* --- CHANGE: Main nav text now uses the primary foreground color --- */}
              <span className="text-xl font-bold text-foreground">
                NextAuth Pro
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                title="Toggle Dark Mode"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={darkMode ? "moon" : "sun"}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {darkMode ? (
                      <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-800" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {loading ? (
                <div className="w-48 h-10 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"></div>
              ) : isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="font-medium text-foreground/70 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    Profile
                  </Link>
                  <motion.button
                    onClick={async () => {
                      await fetch("/api/users/logout");
                      window.location.reload();
                    }}
                    className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="font-medium text-foreground/70 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/signup"
                      className="inline-flex items-center bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Sign Up Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="relative">
           {/* The aurora glow effect for dark mode */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 m-auto h-[400px] w-full max-w-4xl dark:bg-gradient-to-tr dark:from-sky-900/80 dark:via-background dark:to-background blur-3xl"
          ></div>

          <motion.section
            className="text-center py-16 md:py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-block bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 rounded-full px-4 py-1 text-sm font-semibold mb-4"
              variants={itemVariants}
            >
              <KeyRound className="w-4 h-4 inline-block mr-2" />
              Full-Stack Authentication Toolkit
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight"
              variants={itemVariants}
            >
              The{" "}
              <span className="text-sky-600 dark:text-sky-400 dark:[text-shadow:0_0_12px_theme(colors.sky.400/80%)]">
                Secure
              </span>{" "}
              Foundation <br />
              for Your Next.js App
            </motion.h1>
            <motion.p
              className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/70 dark:text-foreground/70 mb-10"
              variants={itemVariants}
            >
              A production-ready, feature-complete authentication system built
              with Next.js, TypeScript, and MongoDB. Get started in minutes, not
              weeks.
            </motion.p>
            <motion.div variants={itemVariants}>
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Go to Your Profile
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="inline-flex items-center bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <UserCheck className="w-6 h-6 mr-2" />
                  Get Started Now
                </Link>
              )}
            </motion.div>
          </motion.section>
        </div>

        <section className="py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Features At a Glance
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Everything you need for a modern and secure user system.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/50 dark:bg-white/5 p-8 rounded-xl shadow-lg dark:shadow-black/20 transition-all duration-300 border border-black/10 dark:border-white/10 hover:border-sky-500 dark:hover:border-sky-500/80 dark:hover:shadow-[0_0_20px_theme(colors.sky.500/20%)]"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-500/10 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-black/10 dark:border-white/10">
        <div className="container mx-auto px-4 py-6 text-center text-foreground/50">
          <p>© {new Date().getFullYear()} NextAuth Pro. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}