import { sortedHotelLocations } from "@/data/hotelLocations";
import { ChevronDown } from "lucide-react";

interface HotelLocationSelectorProps {
  country: string;
  region: string;
  city: string;
  onCountryChange: (country: string) => void;
  onRegionChange: (region: string) => void;
  onCityChange: (city: string) => void;
}

export function HotelLocationSelector({
  country,
  region,
  city,
  onCountryChange,
  onRegionChange,
  onCityChange,
}: HotelLocationSelectorProps) {
  const selectedCountryData = sortedHotelLocations.find(
    (c) => c.country === country,
  );
  const selectedRegionData = selectedCountryData?.regions.find(
    (r) => r.name === region,
  );

  function handleCountryChange(val: string) {
    onCountryChange(val);
    onRegionChange("");
    onCityChange("");
  }

  function handleRegionChange(val: string) {
    onRegionChange(val);
    onCityChange("");
  }

  const selectBase =
    "w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm text-midnight font-medium focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      {/* Country */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="hotel-country"
          className="text-xs font-semibold text-midnight/60 uppercase tracking-wider"
        >
          Country
        </label>
        <div className="relative">
          <select
            id="hotel-country"
            data-ocid="hotels.country_select"
            value={country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className={selectBase}
          >
            <option value="">Select country</option>
            {sortedHotelLocations.map((c) => (
              <option key={c.country} value={c.country}>
                {c.country}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
        </div>
      </div>

      {/* Region / State */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="hotel-region"
          className="text-xs font-semibold text-midnight/60 uppercase tracking-wider"
        >
          Region / State
        </label>
        <div className="relative">
          <select
            id="hotel-region"
            data-ocid="hotels.region_select"
            value={region}
            onChange={(e) => handleRegionChange(e.target.value)}
            disabled={!country}
            className={selectBase}
          >
            <option value="">Select region</option>
            {selectedCountryData?.regions.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
        </div>
      </div>

      {/* City / Hotel Area */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="hotel-city"
          className="text-xs font-semibold text-midnight/60 uppercase tracking-wider"
        >
          City / Hotel Area
        </label>
        <div className="relative">
          <select
            id="hotel-city"
            data-ocid="hotels.city_select"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={!region}
            className={selectBase}
          >
            <option value="">Select city / hotel area</option>
            {selectedRegionData?.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
        </div>
      </div>
    </div>
  );
}
