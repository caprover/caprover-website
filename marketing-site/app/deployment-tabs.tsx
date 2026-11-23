"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from "react";

const ROTATION_MS = 4_000;
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

type DeploymentMethod = {
  id: string;
  label: string;
  summary: string;
  preview: ReactNode;
};

export function DeploymentTabs({
  title,
  footer,
  methods,
}: {
  title: string;
  footer: ReactNode;
  methods: DeploymentMethod[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const section = useRef<HTMLElement>(null);
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    });
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (interacted || reducedMotion || hovering || !inView) return;
    const timeout = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % methods.length);
    }, ROTATION_MS);
    return () => window.clearTimeout(timeout);
  }, [
    activeIndex,
    hovering,
    inView,
    interacted,
    methods.length,
    reducedMotion,
  ]);

  function select(index: number) {
    setInteracted(true);
    setActiveIndex(index);
  }

  function handleTabKeys(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = methods.length - 1;
    const destinations: Record<string, number> = {
      ArrowDown: (index + 1) % methods.length,
      ArrowUp: (index + last) % methods.length,
      Home: 0,
      End: last,
    };
    const next = destinations[event.key];
    if (typeof next !== "number") return;
    event.preventDefault();
    select(next);
    tabButtons.current[next]?.focus();
  }

  return (
    <section
      ref={section}
      className="deployment-examples shell"
      aria-labelledby="deployment-examples-title"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovering(true);
      }}
      onPointerLeave={() => setHovering(false)}
    >
      <h2 id="deployment-examples-title">{title}</h2>
      <div className="deployment-tab-layout">
        <div
          className="deployment-tab-list"
          role="tablist"
          aria-orientation="vertical"
          aria-labelledby="deployment-examples-title"
          onFocus={() => setInteracted(true)}
        >
          {methods.map(({ id, label, summary }, index) => (
            <button
              ref={(button) => {
                tabButtons.current[index] = button;
              }}
              key={id}
              id={`deployment-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls={`deployment-panel-${id}`}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => handleTabKeys(event, index)}
            >
              <span>{label}</span>
              <small>{summary}</small>
            </button>
          ))}
        </div>
        <div className="deployment-preview" onFocus={() => setInteracted(true)}>
          {methods.map(({ id, preview }, index) => (
            <div
              key={id}
              id={`deployment-panel-${id}`}
              role="tabpanel"
              aria-labelledby={`deployment-tab-${id}`}
              aria-hidden={index !== activeIndex}
              inert={index !== activeIndex}
              tabIndex={index === activeIndex ? 0 : -1}
            >
              {preview}
            </div>
          ))}
        </div>
      </div>
      {footer}
    </section>
  );
}
