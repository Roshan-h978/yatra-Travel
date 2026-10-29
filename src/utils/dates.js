// Date helpers for "YYYY-MM-DD" strings (the format the API and <input type="date"> use).

// Today's date in the visitor's timezone (toISOString alone would give the UTC date).
export function localToday() {

  const d = new Date();

  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

}

// "2026-11-10" -> "Nov 10, 2026" (in the visitor's locale).
export function formatDate(value) {

  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric",
  });

}

// Whole days from `from` to `to` (0 when they are the same day).
export function daysBetween(from, to) {

  return Math.round((new Date(`${to}T00:00:00`) - new Date(`${from}T00:00:00`)) / 86400000);

}

// Days a trip covers, counting both the pickup and the return day.
export function tripDays(pickup, ret) {

  if (!pickup || !ret || ret < pickup) return 0;

  return daysBetween(pickup, ret) + 1;

}
