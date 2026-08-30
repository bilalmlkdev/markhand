// Ink colors offered in the pen picker, paired index-for-index between the
// light-background and dark-background variants. When the canvas theme
// changes from light to dark (or back), any stroke or pen color matching
// one side of a pair is remapped to the other side, so drawings stay
// visible instead of vanishing against a background of similar value.
export const LIGHT_BG_INK_COLORS = [
  "#1c1917",
  "#e03131",
  "#2f9e44",
  "#1971c2",
  "#f08c00",
  "#9c36b5",
  "#0c8599",
  "#c92a2a",
] as const;

export const DARK_BG_INK_COLORS = [
  "#ffffff",
  "#ff6b6b",
  "#69db7c",
  "#74c0fc",
  "#ffd43b",
  "#da77f2",
  "#66d9e8",
  "#ff8787",
] as const;

// Robust isLight that handles #rgb, #rrggbb, and #rrggbbaa.
export function isLightColor(hex: string): boolean {
  let r = 0,
    g = 0,
    b = 0;
  const c = hex.replace("#", "");
  if (c.length === 3) {
    r = parseInt(c[0] + c[0], 16);
    g = parseInt(c[1] + c[1], 16);
    b = parseInt(c[2] + c[2], 16);
  } else if (c.length >= 6) {
    r = parseInt(c.slice(0, 2), 16);
    g = parseInt(c.slice(2, 4), 16);
    b = parseInt(c.slice(4, 6), 16);
  }
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

// Given a color and the background it's about to be shown on, return the
// color it should become to stay visible (or the same color if it's
// already a fine fit, or not one of the recognized palette entries).
export function remapInkColorForBackground(
  color: string,
  bgIsLight: boolean,
): string {
  const lightIndex = LIGHT_BG_INK_COLORS.indexOf(
    color as (typeof LIGHT_BG_INK_COLORS)[number],
  );
  const darkIndex = DARK_BG_INK_COLORS.indexOf(
    color as (typeof DARK_BG_INK_COLORS)[number],
  );

  if (bgIsLight) {
    // Background is light: a dark-palette color is already fine; a
    // light-palette color (meant for dark backgrounds) needs remapping.
    if (darkIndex !== -1) return LIGHT_BG_INK_COLORS[darkIndex]!;
    return color;
  } else {
    if (lightIndex !== -1) return DARK_BG_INK_COLORS[lightIndex]!;
    return color;
  }
}
