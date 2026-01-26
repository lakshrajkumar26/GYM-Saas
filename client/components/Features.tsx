"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Modern Equipment",
    desc: "Train with the latest machines & free weights."
  },
  {
    title: "Expert Trainers",
    desc: "Certified trainers to guide every workout."
  },
  {
    title: "Progress Tracking",
    desc: "Track attendance, body stats & performance."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Choose <span className="text-red-500">Iron Gym</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-zinc-900 p-8 rounded-xl text-center"
            >
              <h3 className="text-xl font-semibold mb-4">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
