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
  showPrompt = false,
  copyLabels,
  className,
}: {
  code: string;
  lang: SupportedCodeLang;
  label?: string;
  footerStep?: string;
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
      {footerStep ? (
        <div className="code-block-footer">
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
    </div>
  );
}
