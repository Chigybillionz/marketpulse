import React, { useState, useEffect, useRef } from "react";

const DEFAULT_IMAGES = [
  "/login-welcome-bg.png",
  "/auth-vendor-peppers.jpg",
  "/auth-store-clerk.jpg",
];

export default function AuthImageSlider({
  icon,
  title,
  subtitle,
  images = DEFAULT_IMAGES,
  intervalMs = 2000,
}) {
  // Append first image at the end for an infinite seamless right-to-left loop
  const slides = [...images, images[0]];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timerRef = useRef(null);

  // Preload all slide images on mount
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Advance slide every intervalMs (2 seconds)
  useEffect(() => {
    const startTimer = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
      }, intervalMs);
    };

    startTimer();

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(timerRef.current);
      } else {
        startTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [intervalMs, images.length]);

  // When transition ends on the cloned first slide, silently snap back to index 0
  const handleTransitionEnd = () => {
    if (currentIndex >= images.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
      // Re-enable transitions on subsequent frames so it's ready for the next tick
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  // Determine active dot (maps clone back to 0)
  const activeDotIndex = currentIndex >= images.length ? 0 : currentIndex;

  return (
    <div
      style={{
        width: "100%",
        height: 330,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        backgroundColor: "#EAECEF",
      }}
    >
      {/* ─── Sliding Image Track (Right-to-Left) ─── */}
      <div
        onTransitionEnd={handleTransitionEnd}
        style={{
          display: "flex",
          width: `${slides.length * 100}%`,
          height: "100%",
          transform: `translateX(-${(currentIndex * 100) / slides.length}%)`,
          transition: isTransitioning
            ? "transform 650ms cubic-bezier(0.25, 1, 0.5, 1)"
            : "none",
          willChange: "transform",
        }}
      >
        {slides.map((src, idx) => (
          <div
            key={idx}
            style={{
              width: `${100 / slides.length}%`,
              height: "100%",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
                opacity: 0.68,
                filter: "contrast(1.12) saturate(1.3) brightness(1.02)",
                pointerEvents: "none",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* ─── Soft Natural Gradient Overlay ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(238,241,245,0.1) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.65) 80%, #ffffff 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ─── Top Layer: Icon, Title, Subtitle & Indicator Pills ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {/* Rounded Icon */}
        {icon && (
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              backgroundColor: "#1B3D2F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 24px rgba(0,0,0,0.30)",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}

        {/* Text Container */}
        <div style={{ textAlign: "center", padding: "0 32px", width: "100%" }}>
          <h1
            style={{
              fontSize: 27,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.5px",
              marginBottom: 6,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 14.5,
              color: "#374151",
              lineHeight: 1.5,
              maxWidth: 250,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Subtle Slide Indicator Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 2,
          }}
        >
          {images.map((_, dotIdx) => {
            const isActive = dotIdx === activeDotIndex;
            return (
              <span
                key={dotIdx}
                style={{
                  height: 4,
                  width: isActive ? 20 : 6,
                  borderRadius: 4,
                  backgroundColor: isActive ? "#1B3D2F" : "rgba(0, 0, 0, 0.22)",
                  transition: "all 350ms ease",
                  display: "inline-block",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
