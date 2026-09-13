// Light/dark ink pairs, indexed so colors remap 1:1 on theme change.
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

// Handles #rgb, #rrggbb, and #rrggbbaa.
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

// Remap to the opposite palette side, unless already suited to the background.
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
    // Light-palette color meant for dark backgrounds needs remapping.
    if (darkIndex !== -1) return LIGHT_BG_INK_COLORS[darkIndex]!;
    return color;
  } else {
    if (lightIndex !== -1) return DARK_BG_INK_COLORS[lightIndex]!;
    return color;
  }
}
