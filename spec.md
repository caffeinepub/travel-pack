# The Travel Vault

## Current State
- Full booking aggregator with multi-step search form (flights/hotels/cruises)
- Results page with simulated cards and deep-link Expedia affiliate URLs
- Authorization (Internet Identity login) already integrated
- User profiles stored per principal in backend

## Requested Changes (Diff)

### Add
- `SavedTrip` type in backend: origin, destination, departure date, return date, cabin class, passengers, price, provider name, trip type (flight/hotel), saved timestamp
- Backend functions: `saveTrip`, `getSavedTrips`, `removeTrip` (per authenticated user)
- "Save" heart/bookmark button on each result card in the results page
- "My Saved Trips" panel/page accessible from the header (visible when logged in)
- Saved trips list showing all bookmarked results with a "Book Now" deep-link and "Remove" button
- Empty state when no trips are saved

### Modify
- Header nav: add "My Saved Trips" link (only visible when logged in)
- SearchCard results: add save/unsave toggle on each card

### Remove
- Nothing removed

## Implementation Plan
1. Add `SavedTrip` type and Map<Principal, [SavedTrip]> storage in main.mo
2. Add `saveTrip`, `getSavedTrips`, `deleteTrip` shared/query functions with authorization checks
3. Frontend: Create `SavedTripsPanel` component showing saved trips list
4. Frontend: Add save button to each result card in SearchCard, wired to backend
5. Frontend: Add "Saved Trips" nav link in header that opens panel, visible when logged in
6. Wire all backend calls through the generated actor bindings
