"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = {
  id: string;
  imageUrl: string;
  caption?: string;
};

type HeroSlideshowProps = {
  slides: Slide[];
};

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[activeIndex];

  return (
    <div className="relative h-96 w-full shrink-0 overflow-hidden sm:h-104 lg:h-128 lg:w-xl lg:max-w-none">
      {slides.length === 1 ? (
        <Image
          src={currentSlide.imageUrl}
          alt={currentSlide.caption || "Alumni Portal"}
          fill
          sizes="(min-width: 1024px) 576px, (min-width: 640px) 100vw, 100vw"
          className="object-contain object-center"
          priority
        />
      ) : (
        <>
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                idx === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.caption || `Slide ${idx + 1}`}
                fill
                sizes="(min-width: 1024px) 576px, (min-width: 640px) 100vw, 100vw"
                className="object-contain object-center"
                priority={idx === 0}
              />
            </div>
          ))}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
