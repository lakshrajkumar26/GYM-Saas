"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./ui/button";

export default function Hero() {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!textRef.current) return;

        gsap.fromTo(
            textRef.current,
            {
                scale: 1,
                y: 0,
                opacity: 1,
            },
            {
                scale: 1.6,
                y: -120,
                opacity: 0.2,
                ease: "none",
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top center",
                    end: "bottom top",
                    scrub: true,
                },
            }
        );
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden">

            {/* 🎥 Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute w-full h-full object-cover"
            >
                <source src="/videos/gym.mp4" type="video/mp4" />
            </video>

            {/* dark overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/*  Animated Text */}
            <div className="relative z-10 flex items-end justify-center h-full text-center px-6 pb-24">
                <div ref={textRef}>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                        We Are Your
                        <span className="block text-red-600 text-[120px]">
                        Fit ness Partner
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-white">
                        Fitness is not a destination it's a way of life
                    </p>

                    <Button className="mt-8 px-12 py-6 text-lg font-bold bg-red-600 hover:bg-red-700 rounded-xl shadow-lg">
                        Explore Us
                    </Button>
                </div>
            </div>
        </section>
    );
}