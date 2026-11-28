import { createHighlighter, type Highlighter } from "shiki";
import { CopyButton, type CopyButtonLabels } from "./copy-button";

export type SupportedCodeLang = "nginx" | "yaml" | "dockerfile" | "bash";

let highlighterPromise: Promise<Highlighter> | undefined;

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: ["nginx", "yaml", "dockerfile", "bash"],
  });
  return highlighterPromise;
}

export async function CodeBlock({
  code,
  lang,
  label,
  footerStep,
  footerStatus,
  showPrompt = false,
  copyLabels,
  className,
}: {
  code: string;
  lang: SupportedCodeLang;
  label?: string;
  footerStep?: string;
  footerStatus?: string;
  showPrompt?: boolean;
  copyLabels: CopyButtonLabels;
  className?: string;
}) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  });

  const isTerminalStep = footerStep?.startsWith("$ ");
  const stepText = isTerminalStep ? footerStep!.slice(2) : footerStep;

  return (
    <div
      className={className ? `code-block ${className}` : "code-block"}
      data-lang={lang}
      data-prompt={showPrompt ? "true" : undefined}
    >
      <div className="code-block-header">
        <span className="code-block-label">{label ?? lang}</span>
        <CopyButton code={code} labels={copyLabels} />
      </div>
      <div
        className="code-block-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {footerStep || footerStatus ? (
        <div className="code-block-footer">
          {footerStep ? (
            <div className="code-block-footer-step">
              {isTerminalStep ? (
                <>
                  <span className="terminal-prompt" aria-hidden="true">
                    $
                  </span>{" "}
                  <span>{stepText}</span>
                </>
              ) : (
                <span>{stepText}</span>
              )}
            </div>
          ) : null}
          {footerStatus ? (
            <div className="code-block-footer-status">
              <span className="code-block-status-check" aria-hidden="true">
                ✓
              </span>{" "}
              <span>{footerStatus}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
