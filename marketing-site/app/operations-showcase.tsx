"use client";

import { useState } from "react";

export type OperationsItem = {
  id: string;
  title: string;
  description: string;
  viewTitle: string;
  viewMeta: string;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  caption: string;
};

export function OperationsShowcase({
  switcherAriaLabel,
  items,
}: {
  switcherAriaLabel: string;
  items: OperationsItem[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] ?? items[0];

  return (
    <div className="operations-layout">
      <div
        className="operations-list"
        role="group"
        aria-label={switcherAriaLabel}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const stepNumber = String(index + 1).padStart(2, "0");

          return (
            <button
              key={item.id}
              type="button"
              className="operations-item"
              data-active={isActive ? "true" : undefined}
              aria-pressed={isActive}
              aria-controls="operations-bento-stage"
              onClick={() => setActiveIndex(index)}
            >
              <span className="operations-item-head">
                <span className="operations-step-index" aria-hidden="true">
                  {stepNumber}
                </span>
                <span className="operations-item-title">{item.title}</span>
              </span>
              <span className="operations-item-desc">{item.description}</span>
            </button>
          );
        })}
      </div>

      <div className="operations-stage" id="operations-bento-stage">
        <figure className="operations-bento-frame">
          <div className="specimen-bar">
            <span className="specimen-bar-title">
              <span className="specimen-status-dot" aria-hidden="true" />
              {activeItem.viewTitle}
            </span>
            <code className="specimen-bar-meta">{activeItem.viewMeta}</code>
          </div>

          <div className="operations-screenshot-surface">
            <img
              key={activeItem.id}
              src={activeItem.imageSrc}
              width={activeItem.imageWidth}
              height={activeItem.imageHeight}
              loading="lazy"
              alt={activeItem.imageAlt}
            />
          </div>

          <figcaption className="operations-caption">
            {activeItem.caption}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
