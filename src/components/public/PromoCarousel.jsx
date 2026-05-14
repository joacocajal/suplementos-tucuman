import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PromoCarousel({ images = [] }) {
  const scrollRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      goTo((current + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [current, images.length]);

  if (images.length === 0) return null;

  function goTo(index) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * index, behavior: "smooth" });
    setCurrent(index);
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrent(index);
  }

  function onMouseDown(e) {
    setIsDragging(true);
    dragStart.current = e.clientX;
  }

  function onMouseUp(e) {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStart.current - e.clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? Math.min(current + 1, images.length - 1) : Math.max(current - 1, 0));
    }
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#F8F8F8]">
      {/* Slides */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className="flex overflow-x-hidden snap-x snap-mandatory select-none"
        style={{ scrollBehavior: "smooth" }}
      >
        {images.map((src, i) => (
          <div key={i} className="flex-shrink-0 w-full snap-center">
            <img
              src={src}
              alt={`Promoción ${i + 1}`}
              draggable={false}
              className="w-full object-cover"
              style={{ maxHeight: "520px", minHeight: "220px" }}
            />
          </div>
        ))}
      </div>

      {/* Flechas */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => goTo(Math.max(0, current - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#E5E7EB] flex items-center justify-center shadow-md transition-all hover:scale-105"
          >
            <ChevronLeft size={20} className="text-[#111111]" />
          </button>
          <button
            onClick={() => goTo(Math.min(images.length - 1, current + 1))}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#E5E7EB] flex items-center justify-center shadow-md transition-all hover:scale-105"
          >
            <ChevronRight size={20} className="text-[#111111]" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-6 h-2 bg-[#FF6B1A]"
                  : "w-2 h-2 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
