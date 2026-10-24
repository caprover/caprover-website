"use client";

import { useEffect, useRef } from "react";

export function KitSubscribeForm({
  emailLabel,
  emailPlaceholder,
  subscribeButton,
}: {
  emailLabel: string;
  emailPlaceholder: string;
  subscribeButton: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.async = true;
    script.dataset.uid = "027ad59763";
    script.src = "https://caprover.kit.com/027ad59763/index.js";
    const observer = new MutationObserver(() => {
      const email = container.querySelector<HTMLInputElement>(
        'input[type="email"]',
      );
      if (!email) return;

      email.setAttribute("aria-label", emailLabel);
      email.placeholder = emailPlaceholder;
      const button = container.querySelector<HTMLSpanElement>(
        ".formkit-submit > span",
      );
      if (button) button.textContent = subscribeButton;
      observer.disconnect();
    });
    observer.observe(container, { childList: true, subtree: true });
    container.appendChild(script);

    return () => {
      observer.disconnect();
      container.replaceChildren();
    };
  }, [emailLabel, emailPlaceholder, subscribeButton]);

  return <div className="kit-subscribe" ref={containerRef} />;
}
