"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

export function Dropdown({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  placeholder = "Select",
}: {
  label?: string;
  icon?: LucideIcon;
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      {label && (
        <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-1.5 flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3" />} {label}
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all",
          "bg-white/5 hover:bg-white/10 text-white border border-white/10",
          open && "ring-2 ring-pitch-500/40 border-pitch-500/40"
        )}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn("w-4 h-4 shrink-0 opacity-70 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1.5 w-full max-h-72 overflow-y-auto rounded-xl bg-pitch-950 border border-white/10 shadow-glass animate-slide-up p-1"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition text-left",
                  active
                    ? "bg-pitch-500/20 text-white font-semibold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="truncate">{o.label}</span>
                {active && <Check className="w-4 h-4 text-pitch-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
