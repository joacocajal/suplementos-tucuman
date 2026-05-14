import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PromoCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length]);

  if (images.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  function onTouchStart(e) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#111111]">
      {/* Track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((src, i) => (
          <div key={i} className="flex-shrink-0 w-full">
            <img
              src={src}
              alt={`Promo ${i + 1}`}
              draggable={false}
              className="w-full object-cover select-none"
              style={{ height: "clamp(200px, 42vw, 560px)" }}
            />
          </div>
        ))}
      </div>

      {/* Flecha izquierda */}
      {images.length > 1 && (
        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-0 top-0 bottom-0 px-3 sm:px-5 flex items-center bg-gradient-to-r from-black/30 to-transparent hover:from-black/50 transition-colors group"
        >
          <ChevronLeft
            size={40}
            className="text-white drop-shadow-md group-hover:scale-110 transition-transform"
          />
        </button>
      )}

      {/* Flecha derecha */}
      {images.length > 1 && (
        <button
          onClick={next}
          aria-label="Siguiente"
          className="absolute right-0 top-0 bottom-0 px-3 sm:px-5 flex items-center bg-gradient-to-l from-black/30 to-transparent hover:from-black/50 transition-colors group"
        >
          <ChevronRight
            size={40}
            className="text-white drop-shadow-md group-hover:scale-110 transition-transform"
          />
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir a slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-7 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
