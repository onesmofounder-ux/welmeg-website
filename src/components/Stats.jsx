"use client";
import { useEffect, useRef, useState } from "react";

const statsData = [
  { end: 6, suffix: "+", label: "Business Divisions" },
  { end: 4, suffix: "+", label: "Core Services" },
  { end: 100, suffix: "%", label: "Commitment to Quality" },
  { end: 1, suffix: "", label: "Unified Vision" },
];

function useCountUp(end, start, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return value;
}

function StatItem({ end, suffix, label, start }) {
  const value = useCountUp(end, start);
  return (
    <div className="stat-item">
      <div className="stat-number">
        {value}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Stats() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-container">
        {statsData.map((s, i) => (
          <StatItem key={i} {...s} start={visible} />
        ))}
      </div>
    </section>
  );
}