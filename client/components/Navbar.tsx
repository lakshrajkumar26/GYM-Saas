"use client";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-black/70 backdrop-blur">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">IRON GYM</h1>

        <div className="space-x-6 hidden md:block">
          <a className="hover:text-red-500" href="#">Home</a>
          <a className="hover:text-red-500" href="#plans">Plans</a>
          <a className="hover:text-red-500" href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}
