import { cn } from "@/lib/utils";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface Passengers {
  adults: number;
  kids: number;
  seniors: number;
}

interface PassengerSelectorProps {
  value: Passengers;
  onChange: (p: Passengers) => void;
  "data-ocid"?: string;
}

function CounterRow({
  label,
  description,
  count,
  onDecrement,
  onIncrement,
  min = 0,
}: {
  label: string;
  description: string;
  count: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-semibold text-midnight">{label}</div>
        <div className="text-xs text-midnight/50">{description}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={count <= min}
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
            count <= min
              ? "border-slate-200 text-slate-300 cursor-not-allowed"
              : "border-gold text-gold hover:bg-gold hover:text-white",
          )}
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-sm font-bold text-midnight">
          {count}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="w-8 h-8 rounded-full border-2 border-gold text-gold flex items-center justify-center hover:bg-gold hover:text-white transition-all"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export function PassengerSelector({
  value,
  onChange,
  "data-ocid": dataOcid,
}: PassengerSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const total = value.adults + value.kids + value.seniors;

  const summary = [
    `${value.adults} Adult${value.adults !== 1 ? "s" : ""}`,
    value.kids > 0 ? `${value.kids} Kid${value.kids !== 1 ? "s" : ""}` : null,
    value.seniors > 0
      ? `${value.seniors} Senior${value.seniors !== 1 ? "s" : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <div ref={containerRef} className="relative">
      <div className="mb-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-midnight/60">
          Passengers
        </span>
      </div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        data-ocid={dataOcid}
        className={cn(
          "w-full flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-left transition-all",
          "bg-white hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
          open ? "border-gold shadow-md" : "border-slate-200",
        )}
      >
        <Users className="w-4 h-4 text-gold flex-shrink-0" />
        <span className="flex-1 text-sm font-medium text-midnight">
          {total} {total === 1 ? "Traveler" : "Travelers"}
        </span>
        <span className="text-xs text-midnight/40 hidden sm:block">
          {summary}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-midnight/30 flex-shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-card-lg p-4">
          <CounterRow
            label="Adults"
            description="18 years and over"
            count={value.adults}
            min={1}
            onDecrement={() =>
              onChange({ ...value, adults: Math.max(1, value.adults - 1) })
            }
            onIncrement={() => onChange({ ...value, adults: value.adults + 1 })}
          />
          <div className="border-t border-slate-100" />
          <CounterRow
            label="Kids"
            description="Ages 2-17"
            count={value.kids}
            onDecrement={() =>
              onChange({ ...value, kids: Math.max(0, value.kids - 1) })
            }
            onIncrement={() => onChange({ ...value, kids: value.kids + 1 })}
          />
          <div className="border-t border-slate-100" />
          <CounterRow
            label="Senior Travelers"
            description="65 years and over"
            count={value.seniors}
            onDecrement={() =>
              onChange({ ...value, seniors: Math.max(0, value.seniors - 1) })
            }
            onIncrement={() =>
              onChange({ ...value, seniors: value.seniors + 1 })
            }
          />
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-midnight/40 text-center">
            Total: {total} traveler{total !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
