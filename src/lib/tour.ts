const TOUR_SEEN_KEY = "markhand_tour_seen";

export function hasSeenTour(): boolean {
  try {
    return localStorage.getItem(TOUR_SEEN_KEY) === "true";
  } catch {
    return false;
  }
}

export function markTourSeen(): void {
  try {
    localStorage.setItem(TOUR_SEEN_KEY, "true");
  } catch {}
}
