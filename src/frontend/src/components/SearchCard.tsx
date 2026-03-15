import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Airport } from "@/data/airports";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Anchor,
  Bookmark,
  ExternalLink,
  Hotel,
  Loader2,
  Plane,
  Search,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AirportSelector } from "./AirportSelector";
import { DateRangePicker } from "./DateRangePicker";
import { PassengerSelector, type Passengers } from "./PassengerSelector";

const AFFILIATE_BASE = "https://www.expedia.com";
const MARKER = "708777";

type Tab = "flights" | "hotels" | "cruises";

interface SimResult {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  rating: number;
  logo: string;
  type: Tab;
}

const FLIGHT_PROVIDERS = [
  {
    name: "Air France",
    logo: "✈",
    price: "$1,240",
    priceNum: 1240,
    rating: 4.5,
  },
  {
    name: "British Airways",
    logo: "✈",
    price: "$1,090",
    priceNum: 1090,
    rating: 4.3,
  },
  { name: "Emirates", logo: "✈", price: "$1,580", priceNum: 1580, rating: 4.8 },
  {
    name: "Lufthansa",
    logo: "✈",
    price: "$1,320",
    priceNum: 1320,
    rating: 4.4,
  },
];

const HOTEL_PROVIDERS = [
  {
    name: "Four Seasons",
    logo: "🏨",
    price: "$680/night",
    priceNum: 680,
    rating: 4.9,
  },
  {
    name: "The Ritz-Carlton",
    logo: "🏨",
    price: "$540/night",
    priceNum: 540,
    rating: 4.8,
  },
  {
    name: "Marriott Bonvoy",
    logo: "🏨",
    price: "$320/night",
    priceNum: 320,
    rating: 4.3,
  },
  {
    name: "Park Hyatt",
    logo: "🏨",
    price: "$490/night",
    priceNum: 490,
    rating: 4.7,
  },
];

function buildExpediaUrl(
  tab: Tab,
  origin: Airport | null,
  destination: Airport | null,
  fromDate: Date | undefined,
  toDate: Date | undefined,
  passengers: Passengers,
  cabin: string,
) {
  const totalPax = passengers.adults + passengers.seniors + passengers.kids;
  const dep = fromDate ? fromDate.toISOString().split("T")[0] : "";
  const ret = toDate ? toDate.toISOString().split("T")[0] : "";
  if (tab === "hotels") {
    return `${AFFILIATE_BASE}/Hotel-Search?destination=${encodeURIComponent(destination?.city || "")}&startDate=${dep}&endDate=${ret}&adults=${totalPax}&marker=${MARKER}`;
  }
  if (tab === "cruises") {
    return `${AFFILIATE_BASE}/?marker=${MARKER}`;
  }
  return `${AFFILIATE_BASE}/Flights-Search?trip=roundtrip&leg1=from%3A${origin?.iata || ""}%2Cto%3A${destination?.iata || ""}%2Cdeparture%3A${dep}&passengers=adults%3A${totalPax}&cabin=${encodeURIComponent(cabin)}&marker=${MARKER}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "w-3 h-3",
            s <= Math.round(rating)
              ? "fill-gold text-gold"
              : "fill-slate-200 text-slate-200",
          )}
        />
      ))}
      <span className="text-xs text-midnight/50 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export function SearchCard() {
  const [tab, setTab] = useState<Tab>("flights");
  const [departure, setDeparture] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState<Passengers>({
    adults: 1,
    kids: 0,
    seniors: 0,
  });
  const [results, setResults] = useState<SimResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  function generateResults(): SimResult[] {
    const providers = tab === "hotels" ? HOTEL_PROVIDERS : FLIGHT_PROVIDERS;
    return providers.map((p, i) => ({
      id: `${tab}-${i}-${Date.now()}`,
      name: p.name,
      price: p.price,
      priceNum: p.priceNum,
      rating: p.rating,
      logo: p.logo,
      type: tab,
    }));
  }

  function handleSearch() {
    if (tab === "cruises") {
      window.open(
        `${AFFILIATE_BASE}/?marker=${MARKER}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    setSearching(true);
    setTimeout(() => {
      setResults(generateResults());
      setSearching(false);
    }, 1200);
  }

  async function handleSave(result: SimResult) {
    if (!isLoggedIn || !actor) return;
    const totalPax = passengers.adults + passengers.seniors + passengers.kids;
    const dep = fromDate ? fromDate.toISOString().split("T")[0] : "";
    const ret = toDate ? toDate.toISOString().split("T")[0] : "";
    setSavingId(result.id);
    try {
      await actor.saveTrip({
        id: result.id,
        destination: destination?.city || destination?.iata || "Unknown",
        origin: departure?.city || departure?.iata || "Unknown",
        cabinClass: "economy",
        tripType: result.type === "hotels" ? "hotel" : "flight",
        departureDate: dep,
        returnDate: ret,
        passengers: BigInt(totalPax),
        savedAt: BigInt(Date.now()),
        providerName: result.name,
        price: result.price,
      });
      setSavedIds((prev) => new Set([...prev, result.id]));
      queryClient.invalidateQueries({ queryKey: ["savedTrips"] });
      toast.success(`${result.name} saved to your trips!`);
    } catch {
      toast.error("Failed to save trip. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  const searchLabel =
    tab === "flights"
      ? "Search Flights"
      : tab === "hotels"
        ? "Search Hotels"
        : "Explore Cruises";

  return (
    <TooltipProvider>
      <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-card-lg p-6 md:p-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-slate-50 rounded-xl w-fit">
          <button
            type="button"
            data-ocid="search.flights_tab"
            onClick={() => {
              setTab("flights");
              setResults(null);
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
              tab === "flights"
                ? "bg-white text-midnight shadow-xs border-b-2 border-gold"
                : "text-midnight/50 hover:text-midnight",
            )}
          >
            <Plane className="w-4 h-4" />
            Flights
          </button>
          <button
            type="button"
            data-ocid="search.hotels_tab"
            onClick={() => {
              setTab("hotels");
              setResults(null);
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
              tab === "hotels"
                ? "bg-white text-midnight shadow-xs border-b-2 border-gold"
                : "text-midnight/50 hover:text-midnight",
            )}
          >
            <Hotel className="w-4 h-4" />
            Hotels
          </button>
          <button
            type="button"
            data-ocid="search.cruises_tab"
            onClick={() => {
              setTab("cruises");
              setResults(null);
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
              tab === "cruises"
                ? "bg-white text-midnight shadow-xs border-b-2 border-gold"
                : "text-midnight/50 hover:text-midnight",
            )}
          >
            <Anchor className="w-4 h-4" />
            Cruises
          </button>
        </div>

        {/* Location */}
        {tab !== "cruises" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <AirportSelector
              label="Departure"
              value={departure}
              onChange={setDeparture}
              placeholder="From where?"
              data-ocid="search.departure_select"
            />
            <AirportSelector
              label="Destination"
              value={destination}
              onChange={setDestination}
              placeholder="Where to?"
              data-ocid="search.destination_select"
            />
          </div>
        )}

        {tab === "cruises" && (
          <div className="mb-4 rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-midnight/60">
            <p className="font-semibold text-midnight mb-1">
              Discover Luxury Cruises
            </p>
            <p>
              Explore ocean liners, river cruises, and expedition voyages across
              the world's most beautiful destinations.
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="mb-4">
          <DateRangePicker
            fromDate={fromDate}
            toDate={toDate}
            onFromChange={setFromDate}
            onToChange={setToDate}
            fromOcid="search.from_input"
            toOcid="search.to_input"
          />
        </div>

        {/* Passengers */}
        <div className="mb-6">
          <PassengerSelector
            value={passengers}
            onChange={setPassengers}
            data-ocid="search.passenger_button"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          data-ocid="search.submit_button"
          className="w-full btn-gold flex items-center justify-center gap-3 py-4 rounded-xl text-base font-bold tracking-wide disabled:opacity-70"
        >
          {searching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {searching ? "Searching..." : searchLabel}
        </button>

        {/* Results */}
        <AnimatePresence>
          {searching && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 space-y-3"
              data-ocid="results.loading_state"
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 p-4 space-y-2 animate-pulse"
                >
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </motion.div>
          )}

          {results && !searching && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-midnight">
                  {results.length} results found
                </p>
                <span className="text-xs text-midnight/40">
                  Powered by Expedia
                </span>
              </div>
              <div className="space-y-3">
                {results.map((result, idx) => {
                  const isSaved = savedIds.has(result.id);
                  const isSaving = savingId === result.id;
                  const expediaUrl = buildExpediaUrl(
                    tab,
                    departure,
                    destination,
                    fromDate,
                    toDate,
                    passengers,
                    "economy",
                  );
                  return (
                    <motion.div
                      key={result.id}
                      data-ocid={`results.item.${idx + 1}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      className="rounded-2xl border border-slate-100 hover:border-gold/30 hover:shadow-sm transition-all p-4 bg-white"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-midnight">
                            {result.name}
                          </p>
                          <StarRating rating={result.rating} />
                        </div>
                        <span className="text-lg font-bold text-gold">
                          {result.price}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <a
                          href={expediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid={`results.book_button.${idx + 1}`}
                          className="btn-gold flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Book Now
                        </a>

                        {isLoggedIn ? (
                          <button
                            type="button"
                            data-ocid={`results.save_button.${idx + 1}`}
                            onClick={() => handleSave(result)}
                            disabled={isSaving || isSaved}
                            className={cn(
                              "w-10 h-9 flex items-center justify-center rounded-lg border transition-all",
                              isSaved
                                ? "border-gold/40 bg-gold/10 text-gold"
                                : "border-slate-200 text-midnight/40 hover:border-gold/40 hover:text-gold hover:bg-gold/5",
                            )}
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Bookmark
                                className={cn(
                                  "w-4 h-4",
                                  isSaved && "fill-gold",
                                )}
                              />
                            )}
                          </button>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                data-ocid={`results.save_button.${idx + 1}`}
                                className="w-10 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-midnight/30 cursor-not-allowed"
                              >
                                <Bookmark className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Sign in to save trips</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
