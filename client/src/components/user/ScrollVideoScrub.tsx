import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/Perfume_box_opening_revealing_bo…_202607131129.mp4";

// One entry per narrative phase of the scroll-scrubbed video
const PHASES = [
  {
    eyebrow: "Handcrafted Beginnings",
    heading: "Crafted in Small Batches",
    subheading: "Each bottle numbered by hand, from first pour to final seal.",
  },
  {
    eyebrow: "The Reveal",
    heading: "An Amber-Gold Accord",
    subheading: "Poured into glass, capturing light the way it captures scent.",
  },
  {
    eyebrow: "The Lasting Impression",
    heading: "Notes That Linger",
    subheading: "Long after the moment has passed, the story stays with you.",
  },
];

const ScrollVideoScrub: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    let scrollTriggerInstance: ScrollTrigger | undefined;
    let animationFrameId: number;
    let scrollProgress = 0;
    let currentTime = 0;
    let isFirstFrame = true;

    // 1. Initialize ScrollTrigger immediately to track viewport scroll position
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    // 2. Start requestAnimationFrame loop immediately
    const render = () => {
      const duration = video.duration;

      // 3. Dynamically read video duration as soon as it becomes available
      if (duration && !Number.isNaN(duration)) {
        const targetTime = scrollProgress * duration;
        const diff = targetTime - currentTime;

        if (isFirstFrame) {
          // Snap immediately on load to prevent transition jumps
          currentTime = targetTime;
          video.currentTime = targetTime;
          isFirstFrame = false;
        } else if (!video.seeking && Math.abs(diff) > 0.005) {
          // Lerp seek interpolation for absolute smooth catch-up
          currentTime += diff * 0.1;

          if (currentTime < 0) currentTime = 0;
          if (currentTime > duration) currentTime = duration;

          video.currentTime = currentTime;
        }
      }

      // Map scroll progress to a narrative phase for the text overlay
      const newPhase = Math.min(
        PHASES.length - 1,
        Math.floor(scrollProgress * PHASES.length)
      );
      if (newPhase !== phaseRef.current) {
        phaseRef.current = newPhase;
        setPhase(newPhase);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      scrollTriggerInstance?.kill();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const current = PHASES[phase];

  return (
    <div ref={wrapperRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Base vignette — keeps navbar and overall frame readable regardless of video brightness */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10 pointer-events-none" />
        {/* Mobile: bottom-anchored text needs a strong bottom-up gradient */}
        <div className="absolute inset-0 sm:hidden bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
        {/* Desktop: left-anchored text needs a strong left-to-right gradient */}
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-black/75 via-black/15 to-transparent pointer-events-none" />

        {/* Text overlay */}
        <div className="absolute inset-0 z-10 flex items-end sm:items-center px-6 sm:px-16 pb-16 sm:pb-0 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-xl text-center sm:text-left"
            >
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-luxury-gold mb-3"
              >
                {current.eyebrow}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-logo text-3xl sm:text-5xl font-bold text-luxury-cream mb-3"
              >
                {current.heading}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-sm sm:text-lg text-luxury-cream/80"
              >
                {current.subheading}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ScrollVideoScrub;
