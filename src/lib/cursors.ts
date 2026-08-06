import type { CursorStyle } from "../types";

/**
 * Returns the CSS `cursor` value for the given cursor style and color.
 * @param style - The cursor style.
 * @param color - The fill color (hex string) to use for SVG cursors.
 * @returns The CSS `cursor` property value.
 */
export function getCursorCss(
  style: CursorStyle,
  color: string = "#1c1917",
): string {
  switch (style) {
    case "crosshair":
      return "crosshair";
    case "pencil":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E") 0 24, auto`;
    case "dot":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E") 6 6, auto`;
    case "brush":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a1 1 0 0 0-1.41 0L9 12.25 11.75 15l8.96-8.96a1 1 0 0 0 0-1.41z' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E") 0 24, auto`;
    case "pen":
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath d='M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3a1 1 0 0 0-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E") 2 22, auto`;
    default:
      return "crosshair";
  }
}
