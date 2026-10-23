import { useState } from "react";

/** Renders `backtick` spans in plain text as inline code. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded-sm bg-bss-800 px-1 py-0.5 font-mono text-[0.85em] text-bss-100">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (insecure context, permissions); the code is still selectable.
    }
  };

  return (
    <div className="min-w-0 border border-bss-700 bg-bss-950">
      <div className="flex items-center justify-between border-b border-bss-700 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-bss-400">{label}</span>
        <button type="button" onClick={copy} className="font-mono text-xs uppercase tracking-wider text-bss-300 transition-colors hover:text-white">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-bss-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
