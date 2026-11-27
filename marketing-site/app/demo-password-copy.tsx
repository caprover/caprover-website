"use client";

import { useEffect, useRef, useState } from "react";

export function DemoPasswordCopy({
  label,
  password,
  copiedLabel,
  copyAriaLabel,
}: {
  label: string;
  password: string;
  copiedLabel: string;
  copyAriaLabel: string;
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
        await navigator.clipboard.writeText(password);
        copiedText = true;
      }
    } catch {
      copiedText = false;
    }

    if (!copiedText) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = password;
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
    <p className="demo-access">
      <span>{label}</span>{" "}
      <button
        type="button"
        className="demo-password-chip"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : copyAriaLabel}
        data-copied={copied ? "true" : "false"}
      >
        <code>{password}</code>
        <span className="demo-password-icon" aria-hidden="true">
          {copied ? (
            <svg viewBox="0 0 16 16">
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16">
              <rect x="5.5" y="5.5" width="7.5" height="8" rx="1.5" />
              <path d="M10.5 5.5V3.75A1.25 1.25 0 0 0 9.25 2.5H3.75A1.25 1.25 0 0 0 2.5 3.75v6A1.25 1.25 0 0 0 3.75 11h1.75" />
            </svg>
          )}
        </span>
        <span className="demo-password-status" aria-live="polite">
          {copied ? copiedLabel : null}
        </span>
      </button>
    </p>
  );
}
