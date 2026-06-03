"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface DarkSelectProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export function DarkSelect<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: DarkSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.indexOf(value)),
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function selectOption(nextValue: T) {
    onChange(nextValue);
    setOpen(false);
  }

  function toggleOpen() {
    setActiveIndex(Math.max(0, options.indexOf(value)));
    setOpen((current) => !current);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        return (current + direction + options.length) % options.length;
      });
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) {
        selectOption(options[activeIndex]);
      } else {
        setActiveIndex(Math.max(0, options.indexOf(value)));
        setOpen(true);
      }
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="dark-select">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={`dark-select-trigger ${open ? "dark-select-trigger-open" : ""}`}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-indigo-100" : "text-white/70"}`}
        />
      </button>

      {open && (
        <div id={listboxId} role="listbox" className="dark-select-menu">
          {options.map((option, index) => {
            const selected = option === value;
            const active = index === activeIndex;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                className={`dark-select-option ${selected ? "dark-select-option-selected" : ""} ${active ? "dark-select-option-active" : ""}`}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
              >
                <span>{option}</span>
                {selected && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
