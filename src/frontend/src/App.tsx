import { SearchCard } from "@/components/SearchCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  ChevronDown,
  Globe2,
  Loader2,
  LogOut,
  MapPin,
  Plane,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const LEXICON = [
  {
    term: "Pied dans l'eau",
    definition:
      "A property with direct water access, typically a villa or suite with private beach or dock",
  },
  {
    term: "Quiet Luxury",
    definition:
      "A travel philosophy emphasizing understated elegance over conspicuous opulence",
  },
  {
    term: "Open-Jaw Flight",
    definition:
      "A flight itinerary where you fly into one city and depart from another",
  },
  {
    term: "Codeshare",
    definition: "A flight marketed by one airline but operated by another",
  },
  {
    term: "Interline Agreement",
    definition:
      "A commercial agreement allowing airlines to handle passengers on each other's flights",
  },
  {
    term: "Hub-and-Spoke",
    definition:
      "An airline route model using a central hub airport connecting to smaller destinations",
  },
  {
    term: "Deadhead",
    definition: "A crew member traveling as a passenger to reposition for duty",
  },
  {
    term: "IATA",
    definition:
      "International Air Transport Association, the trade association for the world's airlines",
  },
  {
    term: "CRS",
    definition:
      "Computer Reservation System used by travel agents to access travel data",
  },
  {
    term: "GDS",
    definition:
      "Global Distribution System, a computerized network for booking travel",
  },
  {
    term: "Yield Management",
    definition:
      "A strategy airlines use to optimize revenue by varying prices based on demand",
  },
  {
    term: "Overbooking",
    definition: "The practice of selling more tickets than available seats",
  },
  {
    term: "Bulkhead Seat",
    definition:
      "A seat in the first row of a cabin section, often with extra legroom",
  },
  {
    term: "Red-Eye Flight",
    definition:
      "An overnight flight, typically departing late and arriving early",
  },
  {
    term: "Positioning Flight",
    definition: "A flight to reposition an aircraft to a different airport",
  },
  {
    term: "Wet Lease",
    definition:
      "An aircraft leasing arrangement that includes crew, maintenance, and insurance",
  },
  {
    term: "Dry Lease",
    definition: "An aircraft lease without crew or operational services",
  },
  {
    term: "ETOPS",
    definition: "Extended-range Twin-engine Operational Performance Standards",
  },
  {
    term: "Slot",
    definition:
      "A specific time permission for an aircraft to take off or land at a congested airport",
  },
  {
    term: "Turnaround",
    definition:
      "The process of preparing an aircraft for its next flight after landing",
  },
  {
    term: "IROP",
    definition:
      "Irregular Operations, disruptions outside normal airline operations",
  },
  {
    term: "Boarding Pass",
    definition: "A document permitting a passenger to board an aircraft",
  },
  {
    term: "PNR",
    definition:
      "Passenger Name Record, a booking reference in the airline's reservation system",
  },
  {
    term: "Fare Basis",
    definition:
      "A code identifying the rules and restrictions of an airline ticket",
  },
  {
    term: "FBO",
    definition:
      "Fixed Base Operator, a service center at airports for private aviation",
  },
  {
    term: "VVIP Terminal",
    definition:
      "A private terminal offering exclusive services for high-profile travelers",
  },
  {
    term: "Tarmac",
    definition: "The paved surface of an airport used for aircraft movement",
  },
  {
    term: "Jetway",
    definition:
      "The enclosed bridge connecting the terminal gate to the aircraft door",
  },
  {
    term: "Concierge Medicine",
    definition:
      "Travel health services including on-call physicians for luxury travelers",
  },
  {
    term: "Demi-Pension",
    definition:
      "A hotel arrangement including breakfast and one main meal daily",
  },
  {
    term: "Full Board",
    definition: "A hotel plan including all three daily meals",
  },
  {
    term: "Half Board",
    definition: "A hotel plan including breakfast and dinner",
  },
  { term: "Room Only", definition: "A hotel rate excluding meals" },
  {
    term: "Rack Rate",
    definition: "The published, undiscounted hotel room rate",
  },
  {
    term: "RevPAR",
    definition: "Revenue Per Available Room, a key hotel performance metric",
  },
  {
    term: "Turndown Service",
    definition: "An evening hotel service preparing the room for sleep",
  },
  {
    term: "Butler Service",
    definition: "Personalized, dedicated service by a trained hotel butler",
  },
  {
    term: "Suite Night Award",
    definition:
      "A benefit allowing elite members to upgrade to suites using points",
  },
  {
    term: "Guaranteed Late Checkout",
    definition: "A confirmed late departure from a hotel room",
  },
  {
    term: "Early Check-In",
    definition: "Confirmed access to a hotel room before standard arrival time",
  },
  {
    term: "Day Rate",
    definition: "A hotel rate for using a room during daytime hours only",
  },
  {
    term: "Villa Rental",
    definition: "A private property rental offering full amenities and staff",
  },
  {
    term: "Charter Flight",
    definition: "An aircraft hired for exclusive use by a group or individual",
  },
  {
    term: "Private Terminal",
    definition: "A dedicated facility for private jet passengers",
  },
  {
    term: "Airside",
    definition: "The secure area of an airport beyond passport control",
  },
  {
    term: "Landside",
    definition:
      "The public area of an airport before security and passport control",
  },
  {
    term: "Transit Visa",
    definition: "A visa allowing passage through a country without full entry",
  },
  {
    term: "Biometric Passport",
    definition:
      "A passport containing an electronic chip with personal and biometric data",
  },
  {
    term: "Frequent Flyer Program",
    definition:
      "An airline loyalty program rewarding passengers with miles or points",
  },
  {
    term: "Aspirational Redemption",
    definition:
      "Using loyalty points for a premium experience significantly above normal value",
  },
];

const FEATURES = [
  {
    Icon: Plane,
    title: "Curated Flights",
    desc: "First-class and business-class fares across 500+ airlines, with seamless connections and private jet options on demand.",
  },
  {
    Icon: Star,
    title: "Luxury Stays",
    desc: "Hand-selected properties from leading palace hotels to private villa estates - every stay an experience unto itself.",
  },
  {
    Icon: MapPin,
    title: "Seamless Journeys",
    desc: "From limo transfers to concierge services, every moment between departure and arrival is orchestrated for you.",
  },
];

export default function App() {
  const { login, clear, identity, isLoggingIn, loginStatus } =
    useInternetIdentity();
  const [authOpen, setAuthOpen] = useState(false);

  const isLoggedIn =
    loginStatus !== "initializing" &&
    !!identity &&
    !identity.getPrincipal().isAnonymous();

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : null;

  function handleLogin() {
    login();
    setAuthOpen(false);
  }

  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-gold" />
            <span className="font-display text-xl font-bold tracking-[0.12em] text-midnight uppercase">
              Travel Pack
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-xs text-midnight/50 hidden sm:block font-mono">
                  {shortPrincipal}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="gap-1.5 text-midnight/70 hover:text-midnight"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <button
                type="button"
                data-ocid="header.login_button"
                onClick={() => setAuthOpen(true)}
                className="btn-outline-gold px-5 py-2 rounded-lg text-sm font-semibold tracking-wide"
              >
                Login / Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center pt-16"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-luxury.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/65 via-midnight/40 to-midnight/75" />

        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-10"
          >
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.35em] mb-4">
              First Class Travel Platform
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
              The World,
              <br />
              <em
                className="font-light not-italic"
                style={{ fontStyle: "italic" }}
              >
                Curated for You
              </em>
            </h1>
            <p className="text-white/75 text-lg md:text-xl font-light max-w-xl mx-auto">
              Fly and stay in effortless luxury - every journey tailored to
              perfection
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="w-full max-w-3xl"
          >
            <SearchCard />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.3em] mb-3">
              Why TRAVEL PACK
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-midnight">
              The Art of Effortless Travel
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-start p-8 rounded-2xl border border-slate-100 hover:border-gold/30 hover:shadow-card transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <f.Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-xl font-bold text-midnight mb-3">
                  {f.title}
                </h3>
                <p className="text-midnight/60 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lexicon / Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-midnight mb-3">
              The Traveler&apos;s Lexicon
            </h2>
            <p className="text-midnight/50 text-sm">
              50 essential terms every discerning traveler should know
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-16">
            {LEXICON.map((entry, i) => (
              <motion.div
                key={entry.term}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 9) * 0.04 }}
                className="flex flex-col gap-0.5 p-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-bold text-gold">
                  {entry.term}
                </span>
                <span className="text-sm text-midnight/70 leading-snug">
                  {entry.definition}
                </span>
              </motion.div>
            ))}
          </div>

          <Separator className="mb-8" />

          <div className="text-center text-sm text-midnight/40 space-y-1">
            <p>© {currentYear} TRAVEL PACK. All rights reserved.</p>
            <p>
              Built with ♥ using{" "}
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-midnight">
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-midnight/50">
              Sign in securely to access your member benefits and personalized
              travel services.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 pt-2">
            <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 text-sm text-midnight/70 leading-relaxed">
              <strong className="text-midnight">Member Benefits:</strong>{" "}
              Exclusive rates, priority boarding, suite night awards, and a
              dedicated travel concierge.
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full btn-gold py-3 rounded-xl text-base font-semibold border-0 h-auto"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Sign In with Internet Identity"
              )}
            </Button>

            <p className="text-xs text-center text-midnight/35">
              Secured by the Internet Computer. No passwords required.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
