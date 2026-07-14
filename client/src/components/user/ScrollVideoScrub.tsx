import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/Perfume_box_opening_revealing_bo…_202607131129.mp4";

const ScrollVideoScrub: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      scrollTriggerInstance?.kill();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />
      </div>
    </div>
  );
};

export default ScrollVideoScrub;
