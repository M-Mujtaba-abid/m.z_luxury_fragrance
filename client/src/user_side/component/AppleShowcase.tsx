import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Flame, Layers, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Prevents pinned sections from glitching when mobile browsers
// resize the viewport on scroll (address bar show/hide).
ScrollTrigger.config({ ignoreMobileResize: true });

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
        end: "bottom bottom",
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

    // Content above/below this section (product grids, async-loaded images)
    // keeps reflowing after mount, which leaves the pin's start/end pixel
    // positions stale — refresh whenever the document's height actually changes.
    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-luxury-ink overflow-hidden"
      style={{ height: "2200px" }}
    >
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
          <div className="contents md:absolute md:left-8 lg:left-24 md:z-20 md:flex md:flex-col md:gap-6 md:max-w-sm">

            {/* Card 1: Heritage */}
            <div
              ref={card1Ref}
              className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none md:static md:translate-y-0 md:pointer-events-auto p-6 rounded-2xl bg-luxury-elevated/80 border border-luxury-gold/10 backdrop-blur-md space-y-3 opacity-0"
            >
              <Award className="w-8 h-8 text-luxury-gold" />
              <h3 className="font-logo text-xl font-light tracking-wide text-luxury-cream">French Craftsmanship</h3>
              <p className="text-xs text-luxury-cream/70 leading-relaxed">
                Handcrafted by top-tier Parisian perfumers, selecting only rare organic petals and exotic spices.
              </p>
            </div>

            {/* Card 3: Longevity */}
            <div
              ref={card3Ref}
              className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none md:static md:translate-y-0 md:pointer-events-auto p-6 rounded-2xl bg-luxury-elevated/80 border border-luxury-gold/10 backdrop-blur-md space-y-3 opacity-0"
            >
              <Flame className="w-8 h-8 text-luxury-gold-bright" />
              <h3 className="font-logo text-xl font-light tracking-wide text-luxury-cream">24-Hour Active Sillage</h3>
              <p className="text-xs text-luxury-cream/70 leading-relaxed">
                An intense, high-concentration molecular blend designed to linger elegantly throughout day and night.
              </p>
            </div>

          </div>

          {/* Right Cards Column */}
          <div className="contents md:absolute md:right-8 lg:right-24 md:z-20 md:flex md:flex-col md:gap-6 md:max-w-sm">

            {/* Card 2: Glass Composition */}
            <div
              ref={card2Ref}
              className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none md:static md:translate-y-0 md:pointer-events-auto md:mt-[150px] p-6 rounded-2xl bg-luxury-elevated/80 border border-luxury-gold/10 backdrop-blur-md space-y-3 opacity-0"
            >
              <Layers className="w-8 h-8 text-luxury-gold" />
              <h3 className="font-logo text-xl font-light tracking-wide text-luxury-cream">Refractive Crystal Vessel</h3>
              <p className="text-xs text-luxury-cream/70 leading-relaxed">
                Housed in a thick-bottomed custom crystal bottle that plays with light refraction, evoking gold liquid art.
              </p>
            </div>

            {/* Final CTA Card */}
            <div
              ref={ctaRef}
              className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-20 md:static md:translate-y-0 p-8 rounded-3xl bg-luxury-elevated/90 border border-luxury-gold/15 backdrop-blur-lg space-y-5 opacity-0 flex flex-col items-start"
            >
              <span className="text-[10px] tracking-[0.2em] font-bold text-luxury-gold uppercase">
                Ready to Experience
              </span>
              <h3 className="font-logo text-2xl font-light tracking-wide text-luxury-cream">Oud Impérial</h3>
              <p className="text-xs text-luxury-cream/70 leading-relaxed">
                Claim your standard bottle pack and experience a sensory impression that defines modern royalty.
              </p>
              <div className="flex gap-2">
                <span className="text-lg font-bold text-luxury-gold">Rs. 8,500</span>
                <span className="text-xs text-luxury-cream/40 line-through self-end mb-0.5">Rs. 12,000</span>
              </div>
              <button
                onClick={() => {
                  const productsSection = document.getElementById("featured-products") || document.getElementById("new-arrivals");
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/all-products";
                  }
                }}
                className="w-full py-3 bg-luxury-gold hover:bg-luxury-gold-bright text-luxury-ink font-semibold text-xs tracking-widest uppercase rounded-lg shadow-lg transition-colors duration-300 flex items-center justify-center gap-2"
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
