import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/c2.mp4";

const ScrollVideoScrub: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    let scrollTriggerInstance: ScrollTrigger | undefined;
    let animationFrameId: number;
    let targetTime = 0;
    let currentTime = 0;
    let isFirstFrame = true;

    const initScrub = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;

      // Create ScrollTrigger to track the scroll progress
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          if (video.duration) {
            targetTime = self.progress * video.duration;
          }
        },
      });

      // Smooth seek rendering loop utilizing requestAnimationFrame
      const render = () => {
        const diff = targetTime - currentTime;

        if (isFirstFrame) {
          // Snap immediately on first frame load to avoid jumping from 0
          currentTime = targetTime;
          video.currentTime = targetTime;
          isFirstFrame = false;
        } else if (!video.seeking && Math.abs(diff) > 0.005) {
          // Lerp smoothly towards targetTime (0.10 factor for a buttery catch-up transition)
          currentTime += diff * 0.1; 

          // Keep within bounds
          if (currentTime < 0) currentTime = 0;
          if (currentTime > video.duration) currentTime = video.duration;

          video.currentTime = currentTime;
        }

        animationFrameId = requestAnimationFrame(render);
      };

      render();
    };

    // Ensure metadata is loaded to access video duration
    if (video.readyState >= 1) {
      initScrub();
    } else {
      const onLoadedMetadata = () => {
        initScrub();
      };
      
      video.addEventListener("loadedmetadata", onLoadedMetadata);

      // Fallback timer (some browsers fail to fire loadedmetadata if file is cached)
      const fallbackTimeout = setTimeout(() => {
        if (!scrollTriggerInstance) {
          initScrub();
        }
      }, 2000);

      return () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        clearTimeout(fallbackTimeout);
        scrollTriggerInstance?.kill();
        cancelAnimationFrame(animationFrameId);
      };
    }

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
