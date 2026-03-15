import type { SavedTrip } from "@/backend";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  CalendarDays,
  ExternalLink,
  Hotel,
  PlaneTakeoff,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

interface SavedTripsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function buildExpediaUrl(trip: SavedTrip): string {
  const base = "https://www.expedia.com";
  const marker = "708777";
  if (trip.tripType === "hotel") {
    return `${base}/Hotel-Search?destination=${encodeURIComponent(trip.destination)}&startDate=${trip.departureDate}&endDate=${trip.returnDate}&adults=${trip.passengers}&marker=${marker}`;
  }
  return `${base}/Flights-Search?trip=roundtrip&leg1=from%3A${trip.origin}%2Cto%3A${trip.destination}%2Cdeparture%3A${trip.departureDate}&passengers=adults%3A${trip.passengers}&cabin=${encodeURIComponent(trip.cabinClass)}&marker=${marker}`;
}

export function SavedTripsPanel({ open, onOpenChange }: SavedTripsPanelProps) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const { data: trips, isLoading } = useQuery<SavedTrip[]>({
    queryKey: ["savedTrips"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSavedTrips();
    },
    enabled: !!actor && !isFetching && open && isLoggedIn,
  });

  async function handleDelete(id: string) {
    if (!actor) return;
    setDeletingId(id);
    try {
      await actor.deleteTrip(id);
      queryClient.invalidateQueries({ queryKey: ["savedTrips"] });
    } finally {
      setDeletingId(null);
    }
  }

  const loading = isLoading || isFetching;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        data-ocid="saved_trips.sheet"
        className="w-full sm:max-w-md flex flex-col p-0 bg-white"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl text-midnight flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-gold fill-gold" />
              My Saved Trips
            </SheetTitle>
          </div>
          <p className="text-sm text-midnight/50">
            {isLoggedIn
              ? "Your personally curated travel shortlist."
              : "Sign in to view your saved trips."}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {!isLoggedIn ? (
            <div
              data-ocid="saved_trips.empty_state"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Bookmark className="w-12 h-12 text-slate-200 mb-4" />
              <p className="font-display text-lg text-midnight font-bold mb-2">
                Member Access Required
              </p>
              <p className="text-sm text-midnight/50 max-w-xs">
                Sign in to save and manage your favourite trips.
              </p>
            </div>
          ) : loading ? (
            <div data-ocid="saved_trips.loading_state" className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 p-4 space-y-2"
                >
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : !trips || trips.length === 0 ? (
            <div
              data-ocid="saved_trips.empty_state"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Bookmark className="w-12 h-12 text-slate-200 mb-4" />
              <p className="font-display text-lg text-midnight font-bold mb-2">
                No saved trips yet
              </p>
              <p className="text-sm text-midnight/50 max-w-xs">
                Search and save your favourite results to see them here.
              </p>
            </div>
          ) : (
            trips.map((trip, idx) => (
              <div
                key={trip.id}
                data-ocid={`saved_trips.item.${idx + 1}`}
                className="rounded-2xl border border-slate-100 hover:border-gold/30 hover:shadow-sm transition-all p-4 bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      {trip.tripType === "hotel" ? (
                        <Hotel className="w-4 h-4 text-gold" />
                      ) : (
                        <PlaneTakeoff className="w-4 h-4 text-gold" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-midnight leading-tight">
                        {trip.providerName}
                      </p>
                      <p className="text-xs text-midnight/50 capitalize">
                        {trip.cabinClass}
                      </p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-gold">
                    {trip.price}
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-midnight/60">
                    <PlaneTakeoff className="w-3 h-3" />
                    <span>
                      {trip.origin} → {trip.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-midnight/60">
                    <CalendarDays className="w-3 h-3" />
                    <span>
                      {trip.departureDate}
                      {trip.returnDate ? ` — ${trip.returnDate}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-midnight/60">
                    <Users className="w-3 h-3" />
                    <span>
                      {Number(trip.passengers)}{" "}
                      {Number(trip.passengers) === 1
                        ? "passenger"
                        : "passengers"}
                    </span>
                  </div>
                </div>

                <Separator className="mb-3" />

                <div className="flex gap-2">
                  <a
                    href={buildExpediaUrl(trip)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid={`saved_trips.book_button.${idx + 1}`}
                    className={cn(
                      "btn-gold flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold",
                    )}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Book Now
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    data-ocid={`saved_trips.delete_button.${idx + 1}`}
                    onClick={() => handleDelete(trip.id)}
                    disabled={deletingId === trip.id}
                    className="w-9 h-9 p-0 border-red-100 text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
