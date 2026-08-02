"use client";

import { useRef, useState } from "react";

export default function CarouselBlock({ images }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = (images || []).filter((img) => img.src);

  if (slides.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-charcoal-700 text-sm text-charcoal-300">
        No slides yet — add images in the panel on the right
      </div>
    );
  }

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(index);
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-xl scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.id}
            src={img.src}
            alt={img.alt || ""}
            className="h-72 w-full shrink-0 snap-center object-cover sm:h-96"
          />
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal-950/70 text-white hover:bg-charcoal-950"
          >
            ‹
          </button>
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-charcoal-950/70 text-white hover:bg-charcoal-950"
          >
            ›
          </button>
          <div className="mt-3 flex justify-center gap-1.5">
            {slides.map((img, i) => (
              <button
                key={img.id}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === activeIndex ? "bg-gold-500" : "bg-charcoal-600"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
