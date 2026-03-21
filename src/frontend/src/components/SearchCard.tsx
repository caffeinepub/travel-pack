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
import { HotelLocationSelector } from "./HotelLocationSelector";
import { PassengerSelector, type Passengers } from "./PassengerSelector";

const AFFILIATE_BASE = "https://www.expedia.com";
const MARKER = "708777";

type Tab = "flights" | "hotels" | "cruises";
type CabinClass = "economy" | "business" | "first";

const CABIN_OPTIONS: { value: CabinClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" },
];

interface SimResult {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  rating: number;
  logo: string;
  type: Tab;
  availableCabins: CabinClass[];
}

const FLIGHT_PROVIDERS = [
  {
    name: "Air France",
    logo: "✈",
    price: "$1,240",
    priceNum: 1240,
    rating: 4.5,
    availableCabins: ["economy", "business", "first"] as CabinClass[],
  },
  {
    name: "British Airways",
    logo: "✈",
    price: "$1,090",
    priceNum: 1090,
    rating: 4.3,
    availableCabins: ["economy", "business"] as CabinClass[],
  },
  {
    name: "Emirates",
    logo: "✈",
    price: "$1,580",
    priceNum: 1580,
    rating: 4.8,
    availableCabins: ["economy", "business", "first"] as CabinClass[],
  },
  {
    name: "Lufthansa",
    logo: "✈",
    price: "$1,320",
    priceNum: 1320,
    rating: 4.4,
    availableCabins: ["economy"] as CabinClass[],
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

const CABIN_LABEL: Record<CabinClass, string> = {
  economy: "Economy",
  business: "Business",
  first: "First Class",
};

const CABIN_COLOR: Record<CabinClass, string> = {
  economy: "bg-slate-100 text-slate-600",
  business: "bg-blue-50 text-blue-700",
  first: "bg-amber-50 text-amber-700 font-semibold",
};

function buildExpediaUrl(
  tab: Tab,
  origin: Airport | null,
  destination: Airport | null,
  fromDate: Date | undefined,
  toDate: Date | undefined,
  passengers: Passengers,
  cabin: string,
  hotelCountry: string,
  hotelRegion: string,
  hotelCity: string,
) {
  const totalPax = passengers.adults + passengers.seniors + passengers.kids;
  const dep = fromDate ? fromDate.toISOString().split("T")[0] : "";
  const ret = toDate ? toDate.toISOString().split("T")[0] : "";
  if (tab === "hotels") {
    const dest = hotelCity || hotelRegion || hotelCountry;
    return `${AFFILIATE_BASE}/Hotel-Search?destination=${encodeURIComponent(dest)}&startDate=${dep}&endDate=${ret}&adults=${totalPax}&marker=${MARKER}`;
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
  const [cabin, setCabin] = useState<CabinClass>("economy");
  const [results, setResults] = useState<SimResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Hotel location state
  const [hotelCountry, setHotelCountry] = useState("");
  const [hotelRegion, setHotelRegion] = useState("");
  const [hotelCity, setHotelCity] = useState("");

  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  function generateResults(): SimResult[] {
    if (tab === "hotels") {
      return HOTEL_PROVIDERS.map((p, i) => ({
        id: `${tab}-${i}-${Date.now()}`,
        name: p.name,
        price: p.price,
        priceNum: p.priceNum,
        rating: p.rating,
        logo: p.logo,
        type: tab,
        availableCabins: [],
      }));
    }
    return FLIGHT_PROVIDERS.filter((p) =>
      p.availableCabins.includes(cabin),
    ).map((p, i) => ({
      id: `${tab}-${i}-${Date.now()}`,
      name: p.name,
      price: p.price,
      priceNum: p.priceNum,
      rating: p.rating,
      logo: p.logo,
      type: tab,
      availableCabins: p.availableCabins,
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
    const destLabel =
      tab === "hotels"
        ? hotelCity || hotelRegion || hotelCountry || "Unknown"
        : destination?.city || destination?.iata || "Unknown";
    setSavingId(result.id);
    try {
      await actor.saveTrip({
        id: result.id,
        destination: destLabel,
        origin: departure?.city || departure?.iata || "Unknown",
        cabinClass: cabin,
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

        {/* Flights: Departure + Destination airport selectors */}
        {tab === "flights" && (
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

        {/* Cabin Class selector (flights only) */}
        {tab === "flights" && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-midnight/50 uppercase tracking-wider mb-2">
              Cabin Class
            </p>
            <div className="flex gap-2">
              {CABIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  data-ocid={`search.cabin_${opt.value}`}
                  onClick={() => {
                    setCabin(opt.value);
                    setResults(null);
                  }}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-semibold border transition-all",
                    cabin === opt.value
                      ? "bg-midnight text-white border-midnight shadow-sm"
                      : "bg-white text-midnight/60 border-slate-200 hover:border-midnight/30 hover:text-midnight",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hotels: cascading country > region > city selector */}
        {tab === "hotels" && (
          <HotelLocationSelector
            country={hotelCountry}
            region={hotelRegion}
            city={hotelCity}
            onCountryChange={setHotelCountry}
            onRegionChange={setHotelRegion}
            onCityChange={setHotelCity}
          />
        )}

        {/* Cruises info panel */}
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
                  {tab === "flights" && (
                    <span className="ml-2 text-xs font-normal text-midnight/40">
                      — {CABIN_LABEL[cabin]} class
                    </span>
                  )}
                </p>
                <span className="text-xs text-midnight/40">
                  Powered by Expedia
                </span>
              </div>

              {results.length === 0 && tab === "flights" && (
                <div className="text-center py-8 text-midnight/50 text-sm">
                  No flights available in {CABIN_LABEL[cabin]} class for this
                  route.
                  <br />
                  <button
                    type="button"
                    onClick={() => {
                      setCabin("economy");
                      setResults(null);
                    }}
                    className="mt-2 text-gold underline hover:no-underline"
                  >
                    Try Economy class
                  </button>
                </div>
              )}

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
                    cabin,
                    hotelCountry,
                    hotelRegion,
                    hotelCity,
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

                      {/* Available cabin class badges (flights only) */}
                      {result.availableCabins.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {result.availableCabins.map((c) => (
                            <span
                              key={c}
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs",
                                CABIN_COLOR[c],
                                c === cabin &&
                                  "ring-1 ring-offset-1 ring-gold/60",
                              )}
                            >
                              {CABIN_LABEL[c]}
                            </span>
                          ))}
                        </div>
                      )}

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
