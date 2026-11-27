"use client";

import { useEffect, useRef, useState } from "react";

export type CopyButtonLabels = {
  copy: string;
  copied: string;
  ariaLabel: string;
};

export function CopyButton({
  code,
  labels,
}: {
  code: string;
  labels: CopyButtonLabels;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    let copiedText = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        copiedText = true;
      }
    } catch {
      copiedText = false;
    }

    if (!copiedText) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        copiedText = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        copiedText = false;
      }
    }

    if (copiedText) {
      setCopied(true);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } else {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className="copy-button"
      onClick={handleCopy}
      aria-label={copied ? labels.copied : labels.ariaLabel}
      data-copied={copied ? "true" : "false"}
    >
      {copied ? (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="5.5" y="5.5" width="7.5" height="8" rx="1.5" />
          <path d="M10.5 5.5V3.75A1.25 1.25 0 0 0 9.25 2.5H3.75A1.25 1.25 0 0 0 2.5 3.75v6A1.25 1.25 0 0 0 3.75 11h1.75" />
        </svg>
      )}
      <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
    </button>
  );
}
