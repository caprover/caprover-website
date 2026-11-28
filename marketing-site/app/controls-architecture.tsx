"use client";

import { useState, type ReactNode } from "react";

type StageIconKind = "https" | "nginx" | "swarm" | "replicas";

export type ArchitectureStage = {
  id: string;
  label: string;
  secondaryLabel?: string;
  meta: string;
  icon: StageIconKind;
  cardIndex?: number;
};

function StageIcon({ kind }: { kind: StageIconKind }) {
  if (kind === "https") {
    return (
      <svg className="arch-node-icon" viewBox="0 0 20 20" aria-hidden="true">
        <rect x="4.5" y="9" width="11" height="7.5" rx="1.8" />
        <path d="M7 9V6.8a3 3 0 0 1 6 0V9" />
      </svg>
    );
  }
  if (kind === "nginx") {
    return (
      <svg className="arch-node-icon" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3 10h5l2.5-4.5L13 10h4" />
        <path d="M10.5 14.5 13 10" />
        <circle cx="10.5" cy="14.5" r="1.5" />
      </svg>
    );
  }
  if (kind === "swarm") {
    return (
      <svg className="arch-node-icon" viewBox="0 0 20 20" aria-hidden="true">
        <polygon points="10 2.5 16.5 6.2 10 9.9 3.5 6.2" />
        <path d="m3.5 10.2 6.5 3.7 6.5-3.7" />
        <path d="m3.5 14 6.5 3.5 6.5-3.5" />
      </svg>
    );
  }
  return (
    <svg className="arch-node-icon" viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2.75" y="3.25" width="6.25" height="6.25" rx="1.2" />
      <rect x="11" y="3.25" width="6.25" height="6.25" rx="1.2" />
      <rect x="2.75" y="11" width="6.25" height="6.25" rx="1.2" />
      <ellipse cx="14.1" cy="12.6" rx="3.1" ry="1.4" />
      <path d="M11 12.6v3.1c0 .77 1.39 1.4 3.1 1.4s3.1-.63 3.1-1.4v-3.1" />
    </svg>
  );
}

function FlowConnector() {
  return (
    <span className="arch-connector" aria-hidden="true">
      <svg className="arch-arrow-horizontal" viewBox="0 0 24 16">
        <path d="M2 8h19M16 3.5 21 8l-5 4.5" />
      </svg>
      <svg className="arch-arrow-vertical" viewBox="0 0 16 24">
        <path d="M8 2v19M3.5 16 8 21l4.5-5" />
      </svg>
    </span>
  );
}

export function ControlsArchitecture({
  ariaLabel,
  eyebrow,
  stages,
  cards,
}: {
  ariaLabel: string;
  eyebrow: string;
  stages: ArchitectureStage[];
  cards: { id: string; content: ReactNode }[];
}) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const activeCard = hoveredCard ?? selectedCard;

  return (
    <div
      className="controls-architecture"
      data-active-card={activeCard !== null ? String(activeCard) : undefined}
    >
      <div className="architecture-strip" role="region" aria-label={ariaLabel}>
        <div className="architecture-strip-eyebrow">{eyebrow}</div>
        <ol className="architecture-flow">
          {stages.map((stage, index) => {
            const linkedIndex = stage.cardIndex;
            const isLinked = typeof linkedIndex === "number";
            const isActive = isLinked && activeCard === linkedIndex;

            const inner = (
              <>
                <span className="arch-node-head">
                  <StageIcon kind={stage.icon} />
                  <span className="arch-node-title">
                    {stage.label}
                    {stage.secondaryLabel ? (
                      <>
                        <span className="arch-node-plus" aria-hidden="true">
                          {" "}
                          +{" "}
                        </span>
                        {stage.secondaryLabel}
                      </>
                    ) : null}
                  </span>
                </span>
                <span className="arch-node-meta">{stage.meta}</span>
              </>
            );

            return (
              <li className="architecture-step" key={stage.id}>
                {isLinked ? (
                  <button
                    type="button"
                    className="arch-node arch-node-interactive"
                    data-active={isActive ? "true" : undefined}
                    data-card-index={linkedIndex}
                    aria-pressed={selectedCard === linkedIndex}
                    onMouseEnter={() => setHoveredCard(linkedIndex)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onFocus={() => setHoveredCard(linkedIndex)}
                    onBlur={() => setHoveredCard(null)}
                    onClick={() =>
                      setSelectedCard((current) =>
                        current === linkedIndex ? null : linkedIndex,
                      )
                    }
                  >
                    {inner}
                  </button>
                ) : (
                  <div className="arch-node arch-node-entry">{inner}</div>
                )}
                {index < stages.length - 1 ? <FlowConnector /> : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="control-cards">
        {cards.map((card, index) => {
          const isActive = activeCard === index;
          return (
            <article
              className="control-card"
              key={card.id}
              data-active={isActive ? "true" : undefined}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onFocusCapture={() => setHoveredCard(index)}
              onBlurCapture={(event) => {
                if (
                  !event.currentTarget.contains(event.relatedTarget as Node)
                ) {
                  setHoveredCard(null);
                }
              }}
            >
              {card.content}
            </article>
          );
        })}
      </div>
    </div>
  );
}
