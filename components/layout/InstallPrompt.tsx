"use client";

import { useEffect, useState } from "react";
import { Download, X, Trophy } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "wc_install_dismissed";
const DISMISS_DAYS = 7;

export function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Skip if previously dismissed within window or already installed.
    const dismissed = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissed && Date.now() - dismissed < DISMISS_DAYS * 86_400_000) return;
    // Standalone check (already installed)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const choice = await evt.userChoice;
    if (choice.outcome === "accepted") setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100vw-1rem)] max-w-md animate-slide-up">
      <div className="card bg-pitch-950 text-white border-pitch-500/30 shadow-glass p-4 flex items-center gap-3">
        <span className="grid place-items-center w-11 h-11 rounded-xl bg-gold-shine shrink-0">
          <Trophy className="w-5 h-5 text-pitch-950" strokeWidth={2.4} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight">Install WorldCup26</p>
          <p className="text-xs text-white/60 mt-0.5">
            Add to home screen for instant access.
          </p>
        </div>
        <button
          onClick={install}
          className="px-3 py-2 rounded-lg bg-pitch-500 hover:bg-pitch-600 transition text-sm font-bold inline-flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-4 h-4" /> Install
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
