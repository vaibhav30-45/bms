export const BRANCHES = [
  { id: 1, name: "Mumbai Main Branch", city: "Mumbai", state: "Maharashtra" },
  { id: 2, name: "Delhi Central Branch", city: "Delhi", state: "Delhi" },
  {
    id: 3,
    name: "Hyderabad Main Branch",
    city: "Hyderabad",
    state: "Telangana",
  },
  {
    id: 4,
    name: "Bengaluru Tech Branch",
    city: "Bengaluru",
    state: "Karnataka",
  },
  { id: 5, name: "Chennai Anna Nagar", city: "Chennai", state: "Tamil Nadu" },
  { id: 6, name: "Kolkata Park Street", city: "Kolkata", state: "West Bengal" },
  { id: 7, name: "Pune Koregaon Branch", city: "Pune", state: "Maharashtra" },
  { id: 8, name: "Ahmedabad CG Road", city: "Ahmedabad", state: "Gujarat" },
];

// Generate all time slots for a day
export function generateDaySlots() {
  const slots = [];
  let hour = 10;
  let minute = 0;

  while (hour < 17) {
    const endMinute = minute + 15;
    const endHour = endMinute >= 60 ? hour + 1 : hour;
    const endMin = endMinute >= 60 ? endMinute - 60 : endMinute;

    const pad = (n) => String(n).padStart(2, "0");

    slots.push({
      id: `${pad(hour)}:${pad(minute)}`,
      startTime: `${pad(hour)}:${pad(minute)}:00`,
      endTime: `${pad(endHour)}:${pad(endMin)}:00`,
      label: formatSlotLabel(hour, minute, endHour, endMin),
    });

    minute += 15;
    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }
  return slots;
}

function formatSlotLabel(sH, sM, eH, eM) {
  const fmt = (h, m) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };
  return `${fmt(sH, sM)} – ${fmt(eH, eM)}`;
}

// Get available dates (today + next 6 days, skip Sunday)
export function getAvailableDates() {
  const dates = [];
  const today = new Date();
  let count = 0;
  let d = new Date(today);

  while (dates.length < 7) {
    if (d.getDay() !== 0) {
      // skip Sunday
      dates.push({
        dateStr: d.toISOString().split("T")[0],
        display: d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        isToday: count === 0,
        dayName: d.toLocaleDateString("en-IN", { weekday: "long" }),
      });
    }
    count++;
    d = new Date(today);
    d.setDate(today.getDate() + count);
  }
  return dates;
}

// Simulate booked slots for a given branch + date
export function getBookedSlots(branchId, dateStr) {
  // Use branchId + date as seed for deterministic fake bookings
  const seed = branchId * 7 + new Date(dateStr).getDate();
  const total = generateDaySlots().length; // 28 slots
  const booked = new Set();

  // Randomly book ~40% of slots based on seed
  for (let i = 0; i < total; i++) {
    if ((seed * (i + 3)) % 5 === 0) booked.add(i);
  }

  // Always mark past slots as unavailable for today
  const now = new Date();
  const isToday = dateStr === now.toISOString().split("T")[0];
  if (isToday) {
    const slots = generateDaySlots();
    slots.forEach((s, i) => {
      const [h, m] = s.id.split(":").map(Number);
      if (
        h < now.getHours() ||
        (h === now.getHours() && m <= now.getMinutes())
      ) {
        booked.add(i);
      }
    });
  }

  return booked; // Set of booked slot indexes
}
