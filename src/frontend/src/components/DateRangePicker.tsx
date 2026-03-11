import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { CalendarDays, X } from "lucide-react";
import { useState } from "react";

interface DateRangePickerProps {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  onFromChange: (d: Date | undefined) => void;
  onToChange: (d: Date | undefined) => void;
  fromOcid?: string;
  toOcid?: string;
}

function formatDate(d: Date | undefined): string {
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DateRangePicker({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  fromOcid,
  toOcid,
}: DateRangePickerProps) {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const isMobile = useIsMobile();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleFromSelect(d: Date | undefined) {
    onFromChange(d);
    if (d && toDate && toDate <= d) {
      onToChange(undefined);
    }
    setFromOpen(false);
  }

  function handleToSelect(d: Date | undefined) {
    onToChange(d);
    setToOpen(false);
  }

  const triggerClass = (isOpen: boolean) =>
    cn(
      "w-full flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-left transition-all",
      "bg-white hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
      isOpen ? "border-gold shadow-md" : "border-slate-200",
    );

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Departure Date */}
      <div>
        <div className="mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-midnight/60">
            Departure Date
          </span>
        </div>

        {isMobile ? (
          <>
            <button
              type="button"
              data-ocid="departure.open_modal_button"
              onClick={() => setFromOpen(true)}
              className={triggerClass(fromOpen)}
            >
              <CalendarDays className="w-4 h-4 text-gold flex-shrink-0" />
              <span
                className={cn(
                  "text-sm",
                  fromDate ? "font-medium text-midnight" : "text-midnight/40",
                )}
              >
                {fromDate ? formatDate(fromDate) : "Select date"}
              </span>
            </button>

            <Sheet open={fromOpen} onOpenChange={setFromOpen}>
              <SheetContent
                side="bottom"
                data-ocid="departure.sheet"
                className="h-[88vh] rounded-t-2xl px-0 pb-0 flex flex-col"
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full bg-slate-300" />
                </div>

                <SheetHeader className="px-6 pb-2 flex-shrink-0">
                  <SheetTitle className="text-xs font-semibold uppercase tracking-widest text-midnight/60 text-left">
                    Select Departure Date
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start px-4">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={handleFromSelect}
                    disabled={(d) => d < today}
                    className="w-full max-w-sm"
                    initialFocus
                  />
                </div>

                <div className="px-6 py-5 flex-shrink-0">
                  <button
                    type="button"
                    data-ocid="departure.close_button"
                    onClick={() => setFromOpen(false)}
                    className="w-full py-4 rounded-2xl font-light text-base tracking-wide transition-all bg-gold text-white hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: "#D4AF37", color: "#191970" }}
                  >
                    Done
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                data-ocid={fromOcid ?? "departure.open_modal_button"}
                className={triggerClass(fromOpen)}
              >
                <CalendarDays className="w-4 h-4 text-gold flex-shrink-0" />
                <span
                  className={cn(
                    "text-sm",
                    fromDate ? "font-medium text-midnight" : "text-midnight/40",
                  )}
                >
                  {fromDate ? formatDate(fromDate) : "Select date"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-slate-200 shadow-card-lg rounded-2xl overflow-hidden"
              align="start"
            >
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={handleFromSelect}
                disabled={(d) => d < today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Return Date */}
      <div>
        <div className="mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-midnight/60">
            Return Date
          </span>
        </div>

        {isMobile ? (
          <>
            <button
              type="button"
              data-ocid="return.open_modal_button"
              onClick={() => setToOpen(true)}
              className={triggerClass(toOpen)}
            >
              <CalendarDays className="w-4 h-4 text-gold flex-shrink-0" />
              <span
                className={cn(
                  "text-sm",
                  toDate ? "font-medium text-midnight" : "text-midnight/40",
                )}
              >
                {toDate ? formatDate(toDate) : "Select date"}
              </span>
            </button>

            <Sheet open={toOpen} onOpenChange={setToOpen}>
              <SheetContent
                side="bottom"
                data-ocid="return.sheet"
                className="h-[88vh] rounded-t-2xl px-0 pb-0 flex flex-col"
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full bg-slate-300" />
                </div>

                <SheetHeader className="px-6 pb-2 flex-shrink-0">
                  <SheetTitle className="text-xs font-semibold uppercase tracking-widest text-midnight/60 text-left">
                    Select Return Date
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start px-4">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={handleToSelect}
                    disabled={(d) => !fromDate || d <= fromDate}
                    className="w-full max-w-sm"
                    initialFocus
                  />
                </div>

                <div className="px-6 py-5 flex-shrink-0">
                  <button
                    type="button"
                    data-ocid="return.close_button"
                    onClick={() => setToOpen(false)}
                    className="w-full py-4 rounded-2xl font-light text-base tracking-wide transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: "#D4AF37", color: "#191970" }}
                  >
                    Done
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <Popover open={toOpen} onOpenChange={setToOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                data-ocid={toOcid ?? "return.open_modal_button"}
                className={triggerClass(toOpen)}
              >
                <CalendarDays className="w-4 h-4 text-gold flex-shrink-0" />
                <span
                  className={cn(
                    "text-sm",
                    toDate ? "font-medium text-midnight" : "text-midnight/40",
                  )}
                >
                  {toDate ? formatDate(toDate) : "Select date"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-slate-200 shadow-card-lg rounded-2xl overflow-hidden"
              align="start"
            >
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={handleToSelect}
                disabled={(d) => !fromDate || d <= fromDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
