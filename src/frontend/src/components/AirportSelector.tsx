import { type Airport, searchAirports } from "@/data/airports";
import { cn } from "@/lib/utils";
import { ChevronDown, MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AirportSelectorProps {
  label: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder?: string;
  "data-ocid"?: string;
}

export function AirportSelector({
  label,
  value,
  onChange,
  placeholder = "Search airports...",
  "data-ocid": dataOcid,
}: AirportSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>(() => searchAirports(""));
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResults(searchAirports(query));
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpen() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleSelect(airport: Airport) {
    onChange(airport);
    setOpen(false);
    setQuery("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
  }

  return (
    <div ref={containerRef} className="relative" data-ocid={dataOcid}>
      <div className="mb-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-midnight/60">
          {label}
        </span>
      </div>
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "w-full flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-left transition-all",
          "bg-white hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
          open ? "border-gold shadow-md" : "border-slate-200",
        )}
      >
        <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {value ? (
            <div>
              <span className="text-sm font-bold text-midnight">
                {value.iata}
              </span>
              <span className="text-xs text-midnight/60 ml-2 truncate">
                {value.city}, {value.country}
              </span>
            </div>
          ) : (
            <span className="text-sm text-midnight/40">{placeholder}</span>
          )}
        </div>
        {value ? (
          <X
            className="w-4 h-4 text-midnight/30 hover:text-midnight flex-shrink-0"
            onClick={handleClear}
          />
        ) : (
          <ChevronDown className="w-4 h-4 text-midnight/30 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-card-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
            <Search className="w-4 h-4 text-gold flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type IATA code, city, or country..."
              className="flex-1 text-sm bg-transparent outline-none text-midnight placeholder:text-midnight/30"
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-midnight/40">
                No airports found
              </div>
            ) : (
              results.map((airport) => (
                <button
                  key={airport.iata}
                  type="button"
                  onClick={() => handleSelect(airport)}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gold/5 transition-colors text-left"
                >
                  <span className="text-sm font-bold text-gold w-10 flex-shrink-0 mt-0.5">
                    {airport.iata}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-midnight truncate">
                      {airport.name}
                    </div>
                    <div className="text-xs text-midnight/50">
                      {airport.city}, {airport.region} - {airport.country}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
