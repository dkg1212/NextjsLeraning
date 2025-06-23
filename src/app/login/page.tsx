'use client';

import React from "react";
import { useRouter } from "next/navigation"; // use `next/router` if you're using the pages directory
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: ""
  });

  const onLogin= async () => {
    try {
      console.log("User signing up:", user);
      // Example: Send request to your API
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        alert("Signup successful!");
        router.push("/login"); // redirect to login page
      } else {
        const data = await res.json();
        alert(`Signup failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="flex flex-col w-full max-w-md gap-4 bg-white p-6 rounded shadow">


        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="p-2 border border-gray-300 rounded"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />

        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="p-2 border border-gray-300 rounded"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />

        <button
          onClick={onLogin}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Log In
        </button>

        <p className="text-sm mt-2">
           new to this ?{" "}
          <Link href="/signup" className="text-blue-500 underline">
            signup here
          </Link>
        </p>
      </div>
    </div>
  );
}
