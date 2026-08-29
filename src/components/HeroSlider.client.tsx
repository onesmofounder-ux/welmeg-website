"use client";

import { useEffect, useState } from "react";

export default function HeroSlider() {
  const heroImages = [
    "/images/optimized/hero-1600.webp",
    "/images/optimized/construction-1600.webp",
    "/images/optimized/logistics-1600.webp",
    "/images/optimized/agriculture-1600.webp",
    "/images/optimized/team-1600.webp",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((current) =>
        (current + 1) % heroImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(
          rgba(5, 15, 30, 0.62),
          rgba(5, 15, 30, 0.62)
        ), url(${heroImages[currentImage]})`,
      }}
    >
      <h1>WELMEG Solution Company Limited</h1>

      <h2>Building New Vision, Building New World</h2>

      <p>
        Professional construction, project management,
        property development and consultancy solutions
        built to turn ideas into lasting results.
      </p>

      <div className="hero-buttons">
        <a href="/client-portal" className="btn-primary">
          Start Your Project
        </a>

        <a href="/projects" className="btn-secondary">
          Explore Our Work
        </a>
      </div>
    </section>
  );
}
