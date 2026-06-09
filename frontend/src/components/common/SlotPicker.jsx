import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import {
  getAvailableDates,
  generateDaySlots,
  getBookedSlots,
} from "../../utils/branchData";

export default function SlotPicker({
  branchId,
  onSlotSelect,
  selectedSlot,
  disabled = false,
}) {
  const availableDates = useMemo(() => getAvailableDates(), []);
  const allSlots = useMemo(() => generateDaySlots(), []);
  const [selectedDate, setDate] = useState(availableDates[0]?.dateStr ?? "");
  const [weekOffset, setOffset] = useState(0);

  // Booked slots for selected branch + date
  const bookedIndexes = useMemo(() => {
    if (!branchId || !selectedDate) return new Set();
    return getBookedSlots(Number(branchId), selectedDate);
  }, [branchId, selectedDate]);

  // Clear selection when branch or date changes
  useEffect(() => {
    onSlotSelect(null);
  }, [branchId, selectedDate]);

  // Visible week dates (7 at a time)
  const visibleDates = availableDates.slice(weekOffset, weekOffset + 7);

  // Group slots into morning / afternoon / evening
  const GROUPS = [
    {
      label: "Morning",
      range: "10:00 AM – 12:00 PM",
      filter: (s) => {
        const h = parseInt(s.id.split(":")[0]);
        return h >= 10 && h < 12;
      },
    },
    {
      label: "Afternoon",
      range: "12:00 PM – 3:00 PM",
      filter: (s) => {
        const h = parseInt(s.id.split(":")[0]);
        return h >= 12 && h < 15;
      },
    },
    {
      label: "Evening",
      range: "3:00 PM – 5:00 PM",
      filter: (s) => {
        const h = parseInt(s.id.split(":")[0]);
        return h >= 15;
      },
    },
  ];

  if (!branchId) {
    return (
      <div
        className="flex flex-col items-center gap-3 py-10
                      text-center"
      >
        <div
          className="w-12 h-12 rounded-2xl bg-gray-100
                        dark:bg-gray-800 flex items-center
                        justify-center"
        >
          <Calendar size={22} className="text-gray-400" />
        </div>
        <p
          className="text-sm font-semibold text-gray-500
                      dark:text-gray-400"
        >
          Select a branch to view available slots
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-4 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* ── Date picker ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-sm font-bold text-gray-700
                        dark:text-gray-300 flex items-center gap-2"
          >
            <Calendar size={15} className="text-[#1a3c5e] dark:text-blue-400" />
            Select Date
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOffset((p) => Math.max(0, p - 1))}
              disabled={weekOffset === 0}
              className="p-1.5 rounded-lg text-gray-400
                         hover:text-gray-600 hover:bg-gray-100
                         dark:hover:bg-gray-800 disabled:opacity-30
                         transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() =>
                setOffset((p) => Math.min(availableDates.length - 7, p + 1))
              }
              disabled={weekOffset >= availableDates.length - 7}
              className="p-1.5 rounded-lg text-gray-400
                         hover:text-gray-600 hover:bg-gray-100
                         dark:hover:bg-gray-800 disabled:opacity-30
                         transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {visibleDates.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            const booked = getBookedSlots(Number(branchId), d.dateStr);
            const available = allSlots.length - booked.size;
            const isFull = available === 0;

            return (
              <button
                key={d.dateStr}
                type="button"
                disabled={isFull}
                onClick={() => setDate(d.dateStr)}
                className={`
                  flex flex-col items-center gap-0.5 py-2.5 px-1
                  rounded-xl text-center transition-all duration-150
                  ${
                    isSelected
                      ? "bg-[#1a3c5e] text-white shadow-md"
                      : isFull
                        ? "bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-[#1a3c5e]/10 dark:hover:bg-blue-400/10"
                  }
                `}
              >
                <span
                  className={`text-[10px] font-bold uppercase
                                  tracking-wide
                  ${isSelected ? "text-white/70" : "text-gray-400"}`}
                >
                  {d.display.split(" ")[0]}
                </span>
                <span
                  className={`text-base font-black leading-none
                  ${isSelected ? "text-white" : ""}`}
                >
                  {d.display.split(" ")[1]}
                </span>
                <span
                  className={`text-[10px] font-semibold
                  ${
                    isSelected
                      ? "text-white/60"
                      : isFull
                        ? "text-red-400"
                        : "text-emerald-500"
                  }`}
                >
                  {isFull ? "Full" : `${available}`}
                </span>
                {d.isToday && (
                  <span
                    className={`text-[8px] font-black uppercase
                                    px-1 rounded-full leading-none py-0.5
                    ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#1a3c5e]/10 text-[#1a3c5e] dark:bg-blue-400/10 dark:text-blue-400"
                    }`}
                  >
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-gray-400">
              Available slots count
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-[10px] text-gray-400">Fully booked</span>
          </div>
        </div>
      </div>

      {/* ── Time slot grid ── */}
      {selectedDate && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <p
              className="text-sm font-bold text-gray-700
                          dark:text-gray-300 flex items-center gap-2"
            >
              <Clock size={15} className="text-[#1a3c5e] dark:text-blue-400" />
              Select Time Slot
              <span className="text-xs font-normal text-gray-400">
                ({allSlots.length - bookedIndexes.size} slots available)
              </span>
            </p>

            {GROUPS.map(({ label, range, filter }) => {
              const groupSlots = allSlots
                .map((s, i) => ({ ...s, index: i }))
                .filter(({}) => filter(allSlots[0]) || true)
                .filter(({ index: _, ...s }) => filter(s));

              // Re-filter with index
              const indexedSlots = allSlots
                .map((s, i) => ({ ...s, index: i }))
                .filter(({ index: _, ...s }) => filter(s));

              if (indexedSlots.length === 0) return null;

              return (
                <div key={label}>
                  <div className="flex items-center gap-2 mb-2">
                    <p
                      className="text-xs font-black text-gray-500
                                  dark:text-gray-400 uppercase
                                  tracking-wide"
                    >
                      {label}
                    </p>
                    <span className="text-xs text-gray-400">{range}</span>
                  </div>
                  <div
                    className="grid grid-cols-3 sm:grid-cols-4
                                  md:grid-cols-5 lg:grid-cols-4
                                  xl:grid-cols-5 gap-2"
                  >
                    {indexedSlots.map(
                      ({ id, startTime, endTime, label: slotLabel, index }) => {
                        const isBooked = bookedIndexes.has(index);
                        const isSelected =
                          selectedSlot?.startTime === startTime &&
                          selectedSlot?.dateStr === selectedDate;

                        return (
                          <button
                            key={id}
                            type="button"
                            disabled={isBooked}
                            onClick={() =>
                              onSlotSelect({
                                startTime,
                                endTime,
                                label: slotLabel,
                                dateStr: selectedDate,
                              })
                            }
                            className={`
                            relative flex flex-col items-center
                            py-2.5 px-2 rounded-xl text-xs font-bold
                            transition-all duration-150 border-2
                            ${
                              isBooked
                                ? "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-gray-300 dark:text-gray-600 cursor-not-allowed line-through"
                                : isSelected
                                  ? "border-[#1a3c5e] bg-[#1a3c5e] text-white shadow-md shadow-[#1a3c5e]/20"
                                  : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-[#1a3c5e] hover:text-[#1a3c5e] dark:hover:border-blue-400 dark:hover:text-blue-400"
                            }
                          `}
                          >
                            {/* Selected check */}
                            {isSelected && (
                              <div
                                className="absolute -top-1.5 -right-1.5
                                            w-4 h-4 rounded-full
                                            bg-emerald-500 flex items-center
                                            justify-center"
                              >
                                <CheckCircle2
                                  size={10}
                                  className="text-white"
                                />
                              </div>
                            )}

                            {/* Booked indicator */}
                            {isBooked && (
                              <div
                                className="absolute -top-1 -right-1
                                            w-3 h-3 rounded-full
                                            bg-red-400"
                              />
                            )}

                            <span
                              className="text-center leading-tight
                                           whitespace-nowrap text-[11px]"
                            >
                              {slotLabel.split("–")[0].trim()}
                            </span>
                            <span
                              className={`text-[10px] mt-0.5
                            ${
                              isSelected
                                ? "text-white/70"
                                : isBooked
                                  ? "text-gray-300"
                                  : "text-gray-400"
                            }`}
                            >
                              {isBooked ? "Booked" : "Free"}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              );
            })}

            {/* Selected slot summary */}
            <AnimatePresence>
              {selectedSlot && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl
                             bg-[#1a3c5e]/5 dark:bg-blue-400/10
                             border border-[#1a3c5e]/20
                             dark:border-blue-400/20"
                >
                  <CheckCircle2
                    size={16}
                    className="text-[#1a3c5e] dark:text-blue-400
                                           flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p
                      className="text-xs font-bold text-[#1a3c5e]
                                  dark:text-blue-400"
                    >
                      Selected Slot
                    </p>
                    <p
                      className="text-sm font-black text-gray-900
                                  dark:text-white truncate"
                    >
                      {new Date(selectedSlot.dateStr).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        },
                      )}{" "}
                      · {selectedSlot.label}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
