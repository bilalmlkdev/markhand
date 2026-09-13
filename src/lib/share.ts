import type { Stroke } from "../types";
import { generateId } from "./id";

const MAX_SHARED_STROKES = 5000;
const MAX_SHARED_POINTS = 100_000;
const MAX_SHARED_URL_LENGTH = 100_000;

type CompactStroke = [
  color: string,
  width: number,
  points: Array<[x: number, y: number]>,
];

interface CompactDrawing {
  v: 2;
  s: CompactStroke[];
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64ToBytes(value: string): Uint8Array {
  let base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function encodePayload(payload: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return bytesToBase64(bytes);
}

function decodePayload(encoded: string): unknown {
  const json = new TextDecoder().decode(base64ToBytes(encoded));
  return JSON.parse(json) as unknown;
}

function isFinitePoint(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

function isValidColor(color: unknown): color is string {
  return typeof color === "string" && /^#[0-9a-fA-F]{3,8}$/.test(color);
}

function isSafeStroke(stroke: unknown): stroke is Stroke {
  if (!stroke || typeof stroke !== "object") return false;

  const candidate = stroke as Partial<Stroke>;
  if (
    !Array.isArray(candidate.points) ||
    !isValidColor(candidate.color) ||
    typeof candidate.width !== "number" ||
    !Number.isFinite(candidate.width) ||
    candidate.width < 0.5 ||
    candidate.width > 64
  ) {
    return false;
  }

  return (
    candidate.points.length <= MAX_SHARED_POINTS &&
    candidate.points.every(
      (point) =>
        point &&
        typeof point === "object" &&
        typeof point.x === "number" &&
        typeof point.y === "number" &&
        Number.isFinite(point.x) &&
        Number.isFinite(point.y) &&
        Math.abs(point.x) <= 100_000 &&
        Math.abs(point.y) <= 100_000,
    )
  );
}

function validateStrokes(value: unknown): Stroke[] | null {
  if (!Array.isArray(value) || value.length > MAX_SHARED_STROKES) return null;

  let pointCount = 0;
  const strokes: Stroke[] = [];

  for (const item of value) {
    if (!isSafeStroke(item)) return null;
    pointCount += item.points.length;
    if (pointCount > MAX_SHARED_POINTS) return null;
    strokes.push({
      id:
        typeof (item as Partial<Stroke>).id === "string"
          ? (item as Partial<Stroke>).id!
          : generateId(),
      points: item.points.map((point) => ({ x: point.x, y: point.y })),
      color: item.color,
      width: item.width,
    });
  }

  return strokes;
}

function decodeCompactDrawing(value: unknown): Stroke[] | null {
  if (
    !value ||
    typeof value !== "object" ||
    (value as CompactDrawing).v !== 2 ||
    !Array.isArray((value as CompactDrawing).s) ||
    (value as CompactDrawing).s.length > MAX_SHARED_STROKES
  ) {
    return null;
  }

  let pointCount = 0;
  const strokes: Stroke[] = [];

  for (let i = 0; i < (value as CompactDrawing).s.length; i++) {
    const item = (value as CompactDrawing).s[i];
    if (
      !Array.isArray(item) ||
      item.length !== 3 ||
      !isValidColor(item[0]) ||
      typeof item[1] !== "number" ||
      !Number.isFinite(item[1]) ||
      item[1] < 0.5 ||
      item[1] > 64 ||
      !Array.isArray(item[2]) ||
      item[2].length > MAX_SHARED_POINTS
    ) {
      return null;
    }

    pointCount += item[2].length;
    if (pointCount > MAX_SHARED_POINTS) return null;

    const points: { x: number; y: number }[] = [];
    for (const point of item[2]) {
      if (
        !isFinitePoint(point) ||
        Math.abs(point[0]) > 1_000_000 ||
        Math.abs(point[1]) > 1_000_000
      ) {
        return null;
      }
      points.push({
        x: point[0] / 10,
        y: point[1] / 10,
      });
    }

    strokes.push({
      id: `shared-${i}-${Math.random().toString(36).slice(2, 8)}`,
      points,
      color: item[0],
      width: item[1],
    });
  }

  return strokes;
}

// Compact, versioned, URL-safe stroke encoding.
// Coordinates are quantized to 0.1px and stroke IDs are omitted because they
// are implementation details, not part of a drawing's visual state.
export function encodeStrokes(strokes: Stroke[]): string {
  try {
    const payload: CompactDrawing = {
      v: 2,
      s: strokes
        .slice(0, MAX_SHARED_STROKES)
        .map((stroke) => [
          stroke.color,
          stroke.width,
          stroke.points
            .slice(0, MAX_SHARED_POINTS)
            .map((point) => [
              Math.round(point.x * 10),
              Math.round(point.y * 10),
            ]),
        ]),
    };

    return encodePayload(payload);
  } catch {
    return "";
  }
}

// Decode the current compact format and the older Markhand format for
// backwards-compatible links.
export function decodeStrokes(encoded: string): Stroke[] | null {
  if (!encoded || encoded.length > MAX_SHARED_URL_LENGTH) return null;

  try {
    const payload = decodePayload(encoded);
    const compact = decodeCompactDrawing(payload);
    if (compact) return compact;
    return validateStrokes(payload);
  } catch {
    return null;
  }
}

export function getShareUrl(strokes: Stroke[]): string {
  const encoded = encodeStrokes(strokes);
  if (!encoded) return "";

  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("draw", encoded);
  return url.toString();
}

export function getStrokesFromUrl(): Stroke[] | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("draw");
  if (!encoded) return null;
  return decodeStrokes(encoded);
}

export function cleanUrl(): void {
  const url = new URL(window.location.href);
  url.search = "";
  window.history.replaceState({}, "", url.toString());
}
