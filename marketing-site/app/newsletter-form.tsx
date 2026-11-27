"use client";

import { useState, type FormEvent } from "react";

const KIT_FORM_ACTION = "https://app.kit.com/forms/10091348/subscriptions";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "verify"; url: string }
  | { status: "error" };

type KitResponse = {
  status?: string;
  url?: string;
  subscription?: unknown;
};

function isValidKitGuardUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "app.kit.com";
  } catch {
    return false;
  }
}

export function NewsletterForm({
  emailLabel,
  emailPlaceholder,
  subscribeButton,
  submittingButton,
  subscribeSuccess,
  subscribeVerifyPrompt,
  subscribeVerifyAction,
  subscribeError,
}: {
  emailLabel: string;
  emailPlaceholder: string;
  subscribeButton: string;
  submittingButton: string;
  subscribeSuccess: string;
  subscribeVerifyPrompt: string;
  subscribeVerifyAction: string;
  subscribeError: string;
}) {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setSubmitState({ status: "submitting" });

    try {
      const body = new FormData();
      body.set("email_address", trimmed);

      const response = await fetch(KIT_FORM_ACTION, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body,
      });

      if (!response.ok) {
        setSubmitState({ status: "error" });
        return;
      }

      const data = (await response.json()) as KitResponse;
      if (data.status === "success" || Boolean(data.subscription)) {
        setEmail("");
        setSubmitState({ status: "success" });
        return;
      }

      if (data.status === "quarantined" && isValidKitGuardUrl(data.url)) {
        setEmail("");
        setSubmitState({ status: "verify", url: data.url });
        return;
      }

      setSubmitState({ status: "error" });
    } catch {
      setSubmitState({ status: "error" });
    }
  }

  const isSubmitting = submitState.status === "submitting";

  return (
    <div className="newsletter-form-wrap">
      <form
        className="newsletter-form"
        action={KIT_FORM_ACTION}
        method="post"
        onSubmit={handleSubmit}
      >
        <input
          className="newsletter-input"
          type="email"
          name="email_address"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (submitState.status !== "idle") {
              setSubmitState({ status: "idle" });
            }
          }}
          aria-label={emailLabel}
          placeholder={emailPlaceholder}
          autoComplete="email"
          required
          disabled={isSubmitting}
        />
        <button
          className="newsletter-submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingButton : subscribeButton}
        </button>
      </form>

      {submitState.status === "success" ? (
        <p className="newsletter-feedback is-success" role="status">
          {subscribeSuccess}
        </p>
      ) : null}

      {submitState.status === "verify" ? (
        <p className="newsletter-feedback is-success" role="status">
          {subscribeVerifyPrompt}{" "}
          <a
            href={submitState.url}
            target="_blank"
            rel="noreferrer noopener"
            className="newsletter-verify-link"
          >
            {subscribeVerifyAction}
          </a>
        </p>
      ) : null}

      {submitState.status === "error" ? (
        <p className="newsletter-feedback is-error" role="alert">
          {subscribeError}
        </p>
      ) : null}
    </div>
  );
}
