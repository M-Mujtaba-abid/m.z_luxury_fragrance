import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Flame, Layers, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/Generated Video July 17, 2026 - 12_20PM.mp4";

export const AppleShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    const cta = ctaRef.current;

    if (!container || !video) return;

    let scrollProgress = 0;
    let currentTime = 0;
    let isFirstFrame = true;
    let animationFrameId: number;

    // 1. GSAP ScrollTrigger timeline to handle pinned page and text animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=1200",
        scrub: 1,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          scrollProgress = self.progress;
        },
      },
    });

    // Timeline steps for fading text cards in/out over the background video
    tl.fromTo(
      card1,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .to(card1, { opacity: 0, y: -40, duration: 1 }, "+=0.5")

      .fromTo(
        card2,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 }
      )
      .to(card2, { opacity: 0, y: -40, duration: 1 }, "+=0.5")

      .fromTo(
        card3,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 }
      )
      .to(card3, { opacity: 0, y: -40, duration: 1 }, "+=0.5")

      .fromTo(
        cta,
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1 }
      );

    // 2. RequestAnimationFrame Lerped seeking loop to match video scrub to scroll progress
    const render = () => {
      const duration = video.duration;

      if (duration && !Number.isNaN(duration)) {
        const targetTime = scrollProgress * duration;
        const diff = targetTime - currentTime;

        if (isFirstFrame) {
          // Snap instantly to start time
          currentTime = targetTime;
          video.currentTime = targetTime;
          isFirstFrame = false;
        } else if (!video.seeking && Math.abs(diff) > 0.005) {
          // Smooth Lerping seeking interpolation
          currentTime += diff * 0.15;

          if (currentTime < 0) currentTime = 0;
          if (currentTime > duration) currentTime = duration;

          video.currentTime = currentTime;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[200vh] bg-black text-white overflow-hidden">
      {/* Sticky Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">

        {/* Scrubbing Background Video */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Ambient Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 pointer-events-none" />

        <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center justify-center">

          {/* Left Cards Column */}
          <div className="absolute left-8 lg:left-24 z-20 flex flex-col gap-6 max-w-sm">

            {/* Card 1: Heritage */}
            <div
              ref={card1Ref}
              className="p-6 rounded-2xl bg-neutral-950/70 border border-neutral-900 backdrop-blur-md space-y-3 opacity-0"
            >
              <Award className="w-8 h-8 text-amber-400" />
              <h3 className="text-xl font-light tracking-wide">French Craftsmanship</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Handcrafted by top-tier Parisian perfumers, selecting only rare organic petals and exotic spices.
              </p>
            </div>

            {/* Card 3: Longevity */}
            <div
              ref={card3Ref}
              className="p-6 rounded-2xl bg-neutral-950/70 border border-neutral-900 backdrop-blur-md space-y-3 opacity-0"
            >
              <Flame className="w-8 h-8 text-rose-500" />
              <h3 className="text-xl font-light tracking-wide">24-Hour Active Sillage</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                An intense, high-concentration molecular blend designed to linger elegantly throughout day and night.
              </p>
            </div>

          </div>

          {/* Right Cards Column */}
          <div className="absolute right-8 lg:right-24 z-20 flex flex-col gap-6 max-w-sm">

            {/* Card 2: Glass Composition */}
            <div
              ref={card2Ref}
              className="p-6 rounded-2xl mt-[150px] bg-neutral-950/70 border border-neutral-900 backdrop-blur-md space-y-3 opacity-0"
            >
              <Layers className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-light tracking-wide">Refractive Crystal Vessel</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Housed in a thick-bottomed custom crystal bottle that plays with light refraction, evoking gold liquid art.
              </p>
            </div>

            {/* Final CTA Card */}
            <div
              ref={ctaRef}
              className="p-8 rounded-3xl bg-neutral-950/90 border border-neutral-900 backdrop-blur-lg space-y-5 opacity-0 flex flex-col items-start"
            >
              <span className="text-[10px] tracking-[0.2em] font-bold text-amber-500 uppercase">
                Ready to Experience
              </span>
              <h3 className="text-2xl font-light tracking-wide">Oud Impérial</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Claim your standard bottle pack and experience a sensory impression that defines modern royalty.
              </p>
              <div className="flex gap-2">
                <span className="text-lg font-bold text-white">Rs. 8,500</span>
                <span className="text-xs text-neutral-400 line-through self-end mb-0.5">Rs. 12,000</span>
              </div>
              <button
                onClick={() => {
                  const productsSection = document.getElementById("featured-products") || document.getElementById("new-arrivals");
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/web/all-products";
                  }
                }}
                className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-semibold text-xs tracking-widest uppercase rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2"
              >
                <ShieldCheck size={14} />
                <span>Reserve Bottle</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AppleShowcase;
