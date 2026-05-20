"use client";

import { useEffect } from "react";

export function ScrollRevealProvider() {
  useEffect(() => {
    const selectors =
      ".profileCard, .infoCard, .categoryCard, .previewCard";
    const elements =
      document.querySelectorAll<HTMLElement>(selectors);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const siblings = Array.from(
              el.parentElement?.children ?? []
            );
            const idx = siblings.indexOf(el);
            setTimeout(
              () => el.classList.add("card-visible"),
              idx * 90
            );
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.06 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
