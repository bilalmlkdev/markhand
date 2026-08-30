const TOUR_SEEN_KEY = "markhand_tour_seen";

export function hasSeenTour(): boolean {
  return localStorage.getItem(TOUR_SEEN_KEY) === "true";
}

export function markTourSeen(): void {
  localStorage.setItem(TOUR_SEEN_KEY, "true");
}
