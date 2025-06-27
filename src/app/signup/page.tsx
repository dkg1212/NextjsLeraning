/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

// A simple spinner component for the loading state
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);


export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });
    
    // State to hold validation errors
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    // --- Real-time Validation Logic ---
    useEffect(() => {
        const validate = () => {
            const newErrors = { username: "", email: "", password: "" };
            let isFormValid = true;

            // Username validation
            if (user.username.length > 0 && user.username.length < 3) {
                newErrors.username = "Username must be at least 3 characters long.";
                isFormValid = false;
            }

            // Email validation
            if (user.email.length > 0 && !/\S+@\S+\.\S+/.test(user.email)) {
                newErrors.email = "Please enter a valid email address.";
                isFormValid = false;
            }

            // Password validation
            if (user.password.length > 0 && user.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters long.";
                isFormValid = false;
            }

            // Check if any fields are empty
            if (!user.username || !user.email || !user.password) {
                isFormValid = false;
            }

            setErrors(newErrors);
            setButtonDisabled(!isFormValid);
        };

        validate();
    }, [user]);

    const onSignup = async () => {
        // Final check before submitting
        if (buttonDisabled || loading) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            toast.success("Signup successful! Redirecting to login...");
            router.push("/login");
            
        } catch (error: any) {
            // Provide more specific feedback from the API if available
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create an Account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Join us and start your journey!
                    </p>
                </div>
                
                {/* --- Username Input --- */}
                <div>
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input 
                        className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm shadow-sm placeholder-gray-400
                                  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                                  transition-colors duration-200
                                  ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        id="username"
                        type="text"
                        value={user.username}
                        onChange={handleInputChange}
                        placeholder="your_cool_username"
                    />
                    {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                </div>
                
                {/* --- Email Input --- */}
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input 
                        className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm shadow-sm placeholder-gray-400
                                  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                                  transition-colors duration-200
                                  ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* --- Password Input --- */}
                <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input 
                        className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm shadow-sm placeholder-gray-400
                                  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                                  transition-colors duration-200
                                  ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        id="password"
                        type="password"
                        value={user.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>
                
                {/* --- Submit Button --- */}
                <button
                    onClick={onSignup}
                    disabled={buttonDisabled || loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                              bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                              disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {loading ? <Spinner /> : "Sign Up"}
                </button>
                
                <div className="text-center">
                    <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
                        Already have an account? Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}