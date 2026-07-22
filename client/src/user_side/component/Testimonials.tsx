import { useEffect, useRef, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { usePublicTestimonialsQuery } from "../../queries/testimonialQueries";
import TestimonialFormModal from "../../components/user/TestimonialFormModal";

export const Testimonials = () => {
  const { data: testimonials } = usePublicTestimonialsQuery();
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const manyTestimonials = (testimonials?.length ?? 0) > 3;

  useEffect(() => {
    if (!manyTestimonials) return;
    const track = trackRef.current;
    if (!track) return;

    let frameId: number;
    const step = () => {
      if (!isPaused.current) {
        track.scrollLeft += 0.6;
      }
      // Track renders the list twice back-to-back; loop once either copy fully scrolls by,
      // in whichever direction the user (auto-scroll or manual drag) is moving.
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) {
        track.scrollLeft -= half;
      } else if (track.scrollLeft < 0) {
        track.scrollLeft += half;
      }
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [manyTestimonials]);

  const pauseAutoScroll = () => {
    isPaused.current = true;
  };
  const resumeAutoScroll = () => {
    isPaused.current = false;
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    pauseAutoScroll();
    dragStartX.current = e.pageX;
    dragStartScroll.current = track.scrollLeft;
  };
  const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    track.scrollLeft = dragStartScroll.current - (e.pageX - dragStartX.current);
  };
  const handleDragEnd = () => {
    isDragging.current = false;
    resumeAutoScroll();
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <MessageSquare className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
          <h2 className="font-logo text-3xl font-light text-white tracking-wide mb-5">
            Global Reviews
          </h2>
          <button
            onClick={() => setIsTestimonialModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
          >
            <MessageSquare size={14} />
            Share Your Thoughts
          </button>
        </div>

        {!!testimonials?.length && (
          manyTestimonials ? (
            <div
              ref={trackRef}
              data-lenis-prevent
              onMouseEnter={pauseAutoScroll}
              onMouseLeave={handleDragEnd}
              onTouchStart={pauseAutoScroll}
              onTouchEnd={resumeAutoScroll}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              className="flex gap-6 overflow-x-auto no-scrollbar pb-2 cursor-grab active:cursor-grabbing select-none"
            >
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${idx}`}
                  className="p-6 rounded-xl bg-luxury-card border border-luxury-gold/15 flex flex-col justify-between min-w-[280px] max-w-[280px] flex-shrink-0"
                >
                  <div className="space-y-3">
                    <div className="flex text-luxury-gold gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                      ))}
                    </div>
                    <p className="text-xs text-luxury-cream/80 italic leading-relaxed">
                      "{testimonial.thinking}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-luxury-gold/10 mt-4 flex justify-between items-center text-[11px] text-luxury-cream/60">
                    <span className="font-semibold text-white">{testimonial.name}</span>
                    <span className="text-luxury-gold">{testimonial.country}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-6 rounded-xl bg-luxury-card border border-luxury-gold/15 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-luxury-gold gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" className="stroke-none" />
                      ))}
                    </div>
                    <p className="text-xs text-luxury-cream/80 italic leading-relaxed">
                      "{testimonial.thinking}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-luxury-gold/10 mt-4 flex justify-between items-center text-[11px] text-luxury-cream/60">
                    <span className="font-semibold text-white">{testimonial.name}</span>
                    <span className="text-luxury-gold">{testimonial.country}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <TestimonialFormModal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
      />
    </div>
  );
};

export default Testimonials;
