import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="bg-white dark:bg-black text-black dark:text-white">
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features */}
      <Features />

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
        © {new Date().getFullYear()} Gym Pro. All rights reserved.
      </footer>

    </main>
  );
}