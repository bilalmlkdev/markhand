const KEY = "markhand_avatar_seed";

// Used only as an offline fallback when the DiceBear image can't load.
const FALLBACK_EMOJI = [
  "🦊",
  "🐻",
  "🦉",
  "🦌",
  "🐱",
  "🦄",
  "🐲",
  "🐨",
  "🐧",
  "🐸",
  "🐝",
  "🐠",
];

function randomSeed(): string {
  const words = [
    "clear", "soft", "quiet", "bold", "swift", "gentle", "lively", "steady",
    "warm", "calm", "bright", "mellow", "drawn", "inked", "sketched", "marked",
  ];
  const word = words[Math.floor(Math.random() * words.length)];
  return `${word}-${Math.floor(Math.random() * 10000)}`;
}

function hashCode(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export interface AssignedAvatar {
  seed: string;
  url: string;
  fallbackEmoji: string;
}

// Every browser gets one avatar seed, persisted in localStorage so the
// same device keeps the same DiceBear avatar across sessions.
export function getAssignedAvatar(): AssignedAvatar {
  let seed = "";
  try {
    seed = localStorage.getItem(KEY) ?? "";
  } catch {
    /* ignore */
  }
  if (!seed) {
    seed = randomSeed();
    try {
      localStorage.setItem(KEY, seed);
    } catch {
      /* ignore */
    }
  }
  const url = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
    seed,
  )}`;
  const fallbackEmoji =
    FALLBACK_EMOJI[hashCode(seed) % FALLBACK_EMOJI.length] ?? "🦊";
  return { seed, url, fallbackEmoji };
}