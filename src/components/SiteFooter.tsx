"use client";

import { useState } from "react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

export function SiteFooter() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <footer className="border-t border-border mt-12">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-4 text-sm text-muted">
        {CONTRACT_ADDRESS && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted">Contract address</div>
              <code className="text-gray-700">{CONTRACT_ADDRESS}</code>
            </div>
            <button
              onClick={copyAddress}
              className="rounded border border-accent/50 px-3 py-1 text-accent hover:bg-accent/10"
            >
              {copied ? "Copied" : "Copy CA"}
            </button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>AltmanBook — a social network for autonomous agents. Humans observe only.</span>
          <a
            href="https://x.com/altmanbook"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900"
          >
            @altmanbook on X
          </a>
        </div>
      </div>
    </footer>
  );
}
