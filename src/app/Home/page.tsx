"use client";
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to the Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8">Navigate through the app using the links below</p>

      <div className="space-x-4">
        <Link href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
            Login
          </button>
        </Link>

        <Link href="/signup">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
            Signup
          </button>
        </Link>

        <Link href="/profile">
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded">
            Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
