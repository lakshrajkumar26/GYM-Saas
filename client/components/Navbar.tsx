"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed top-0 w-full z-50  bg-white/70 dark:bg-black/70 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Brand */}
        <h1 className="text-2xl font-bold text-red-600"> <span className="text-gray-900 dark:text-white">B</span> International GYM</h1>

        {/* Menu */}
        <div className="hidden md:flex gap-8 font-medium">
          <Link href="#">Home</Link>
          <Link href="#">Programs</Link>
          <Link href="#">Trainers</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">Contact</Link>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={toggleTheme}>
            Theme
          </Button>

          <Link href="/login">
            <Button >Login</Button>
          </Link>

          <Link href="/register">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}