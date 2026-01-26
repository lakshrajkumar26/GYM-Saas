"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover"
        src="/hero.mp4"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold">
            TRANSFORM <span className="text-red-500">YOUR BODY</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Premium training. Expert coaches. Real results.
          </p>

          <div className="mt-8 flex gap-4 justify-center">
            <button className="bg-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-700">
              Join Now
            </button>

            <a
              href="/auth"
              className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black"
            >
              Login
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
