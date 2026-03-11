import type { Airport } from "@/data/airports";
import { cn } from "@/lib/utils";
import { Hotel, Plane, Search } from "lucide-react";
import { useState } from "react";
import { AirportSelector } from "./AirportSelector";
import { DateRangePicker } from "./DateRangePicker";
import { PassengerSelector, type Passengers } from "./PassengerSelector";

type Tab = "flights" | "hotels";

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

  function handleSearch() {
    const msg =
      `Searching ${tab === "flights" ? "Flights + Hotels" : "Hotels"}\n` +
      `From: ${departure?.iata ?? "(not set)"} to ${destination?.iata ?? "(not set)"}\n` +
      `Dates: ${fromDate?.toLocaleDateString() ?? "(not set)"} - ${toDate?.toLocaleDateString() ?? "(not set)"}\n` +
      `Travelers: ${passengers.adults} Adult(s), ${passengers.kids} Kid(s), ${passengers.seniors} Senior(s)`;
    alert(msg);
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-card-lg p-6 md:p-8">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-slate-50 rounded-xl w-fit">
        <button
          type="button"
          data-ocid="search.flights_tab"
          onClick={() => setTab("flights")}
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
          onClick={() => setTab("hotels")}
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
      </div>

      {/* Location */}
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
        data-ocid="search.submit_button"
        className="w-full btn-gold flex items-center justify-center gap-3 py-4 rounded-xl text-base font-bold tracking-wide"
      >
        <Search className="w-5 h-5" />
        {tab === "flights" ? "Search Flights & Hotels" : "Search Hotels"}
      </button>
    </div>
  );
}
