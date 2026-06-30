import type { Stroke } from '../types';

// All doodles use 0-1 relative coordinates, will be scaled to canvas size at render time.
// Each one is built from several rough freehand-style strokes (food / animals / buildings),
// not clean geometric shapes — slight wobble and asymmetry is intentional.
type RelativeStroke = Omit<Stroke, 'points'> & { points: { x: number; y: number }[] };

export const doodles: RelativeStroke[][] = [
  // 1. Coffee cup with steam
  [
    {
      id: 'd1-cup',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.36, y: 0.42 },
        { x: 0.35, y: 0.5 },
        { x: 0.36, y: 0.6 },
        { x: 0.39, y: 0.66 },
        { x: 0.44, y: 0.68 },
        { x: 0.52, y: 0.685 },
        { x: 0.58, y: 0.67 },
        { x: 0.62, y: 0.62 },
        { x: 0.635, y: 0.54 },
        { x: 0.63, y: 0.45 },
        { x: 0.62, y: 0.41 },
        { x: 0.5, y: 0.405 },
        { x: 0.42, y: 0.41 },
        { x: 0.36, y: 0.42 },
      ],
    },
    {
      id: 'd1-handle',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.63, y: 0.46 },
        { x: 0.71, y: 0.46 },
        { x: 0.74, y: 0.5 },
        { x: 0.73, y: 0.56 },
        { x: 0.69, y: 0.585 },
        { x: 0.63, y: 0.58 },
      ],
    },
    {
      id: 'd1-saucer',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.3, y: 0.685 },
        { x: 0.42, y: 0.71 },
        { x: 0.56, y: 0.71 },
        { x: 0.67, y: 0.69 },
      ],
    },
    {
      id: 'd1-steam1',
      color: '#a8a29e',
      width: 2,
      points: [
        { x: 0.43, y: 0.38 },
        { x: 0.41, y: 0.33 },
        { x: 0.45, y: 0.29 },
        { x: 0.42, y: 0.24 },
        { x: 0.45, y: 0.2 },
      ],
    },
    {
      id: 'd1-steam2',
      color: '#a8a29e',
      width: 2,
      points: [
        { x: 0.54, y: 0.39 },
        { x: 0.52, y: 0.34 },
        { x: 0.56, y: 0.29 },
        { x: 0.53, y: 0.24 },
        { x: 0.56, y: 0.19 },
      ],
    },
  ],

  // 2. Pizza slice
  [
    {
      id: 'd2-outline',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.32, y: 0.32 },
        { x: 0.68, y: 0.34 },
        { x: 0.51, y: 0.72 },
        { x: 0.32, y: 0.32 },
      ],
    },
    {
      id: 'd2-crust',
      color: '#f08c00',
      width: 3,
      points: [
        { x: 0.32, y: 0.32 },
        { x: 0.4, y: 0.27 },
        { x: 0.5, y: 0.29 },
        { x: 0.6, y: 0.27 },
        { x: 0.68, y: 0.34 },
      ],
    },
    {
      id: 'd2-pep1',
      color: '#e03131',
      width: 4,
      points: [
        { x: 0.44, y: 0.42 },
        { x: 0.45, y: 0.43 },
      ],
    },
    {
      id: 'd2-pep2',
      color: '#e03131',
      width: 4,
      points: [
        { x: 0.53, y: 0.48 },
        { x: 0.54, y: 0.49 },
      ],
    },
    {
      id: 'd2-pep3',
      color: '#e03131',
      width: 4,
      points: [
        { x: 0.46, y: 0.56 },
        { x: 0.47, y: 0.57 },
      ],
    },
  ],

  // 3. Ice cream cone
  [
    {
      id: 'd3-cone',
      color: '#c2410c',
      width: 3,
      points: [
        { x: 0.42, y: 0.5 },
        { x: 0.5, y: 0.78 },
        { x: 0.58, y: 0.5 },
      ],
    },
    {
      id: 'd3-cone-lines1',
      color: '#c2410c',
      width: 2,
      points: [
        { x: 0.45, y: 0.55 },
        { x: 0.56, y: 0.6 },
      ],
    },
    {
      id: 'd3-cone-lines2',
      color: '#c2410c',
      width: 2,
      points: [
        { x: 0.46, y: 0.63 },
        { x: 0.55, y: 0.67 },
      ],
    },
    {
      id: 'd3-scoop',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.41, y: 0.5 },
        { x: 0.39, y: 0.43 },
        { x: 0.42, y: 0.36 },
        { x: 0.48, y: 0.33 },
        { x: 0.5, y: 0.36 },
        { x: 0.54, y: 0.32 },
        { x: 0.6, y: 0.35 },
        { x: 0.61, y: 0.42 },
        { x: 0.59, y: 0.49 },
        { x: 0.5, y: 0.52 },
        { x: 0.41, y: 0.5 },
      ],
    },
    {
      id: 'd3-cherry',
      color: '#e03131',
      width: 4,
      points: [
        { x: 0.5, y: 0.31 },
        { x: 0.5, y: 0.31 },
      ],
    },
  ],

  // 4. Cat face
  [
    {
      id: 'd4-face',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.36, y: 0.42 },
        { x: 0.33, y: 0.5 },
        { x: 0.34, y: 0.58 },
        { x: 0.4, y: 0.64 },
        { x: 0.5, y: 0.66 },
        { x: 0.6, y: 0.64 },
        { x: 0.66, y: 0.58 },
        { x: 0.67, y: 0.5 },
        { x: 0.64, y: 0.42 },
      ],
    },
    {
      id: 'd4-ear-left',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.36, y: 0.42 },
        { x: 0.34, y: 0.3 },
        { x: 0.44, y: 0.38 },
      ],
    },
    {
      id: 'd4-ear-right',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.64, y: 0.42 },
        { x: 0.67, y: 0.3 },
        { x: 0.57, y: 0.38 },
      ],
    },
    {
      id: 'd4-eye-left',
      color: '#1c1917',
      width: 2,
      points: [
        { x: 0.43, y: 0.5 },
        { x: 0.46, y: 0.5 },
      ],
    },
    {
      id: 'd4-eye-right',
      color: '#1c1917',
      width: 2,
      points: [
        { x: 0.54, y: 0.5 },
        { x: 0.57, y: 0.5 },
      ],
    },
    {
      id: 'd4-nose',
      color: '#e03131',
      width: 2,
      points: [
        { x: 0.48, y: 0.56 },
        { x: 0.52, y: 0.56 },
        { x: 0.5, y: 0.59 },
        { x: 0.48, y: 0.56 },
      ],
    },
    {
      id: 'd4-whiskers-left',
      color: '#1c1917',
      width: 1,
      points: [
        { x: 0.4, y: 0.58 },
        { x: 0.26, y: 0.56 },
      ],
    },
    {
      id: 'd4-whiskers-left2',
      color: '#1c1917',
      width: 1,
      points: [
        { x: 0.4, y: 0.61 },
        { x: 0.26, y: 0.62 },
      ],
    },
    {
      id: 'd4-whiskers-right',
      color: '#1c1917',
      width: 1,
      points: [
        { x: 0.6, y: 0.58 },
        { x: 0.74, y: 0.56 },
      ],
    },
    {
      id: 'd4-whiskers-right2',
      color: '#1c1917',
      width: 1,
      points: [
        { x: 0.6, y: 0.61 },
        { x: 0.74, y: 0.62 },
      ],
    },
  ],

  // 5. Dog (sitting, side profile)
  [
    {
      id: 'd5-body',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.3, y: 0.7 },
        { x: 0.29, y: 0.58 },
        { x: 0.33, y: 0.48 },
        { x: 0.4, y: 0.4 },
        { x: 0.44, y: 0.32 },
        { x: 0.5, y: 0.28 },
        { x: 0.56, y: 0.3 },
        { x: 0.58, y: 0.36 },
        { x: 0.55, y: 0.4 },
        { x: 0.6, y: 0.44 },
        { x: 0.64, y: 0.52 },
        { x: 0.65, y: 0.6 },
        { x: 0.63, y: 0.7 },
        { x: 0.3, y: 0.7 },
      ],
    },
    {
      id: 'd5-ear',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.45, y: 0.33 },
        { x: 0.4, y: 0.24 },
        { x: 0.46, y: 0.27 },
      ],
    },
    {
      id: 'd5-tail',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.63, y: 0.66 },
        { x: 0.7, y: 0.58 },
        { x: 0.7, y: 0.48 },
      ],
    },
    {
      id: 'd5-eye',
      color: '#1c1917',
      width: 2,
      points: [
        { x: 0.52, y: 0.36 },
        { x: 0.53, y: 0.37 },
      ],
    },
    {
      id: 'd5-nose',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.42, y: 0.37 },
        { x: 0.4, y: 0.38 },
      ],
    },
  ],

  // 6. House with chimney smoke
  [
    {
      id: 'd6-walls',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.32, y: 0.48 },
        { x: 0.32, y: 0.72 },
        { x: 0.68, y: 0.72 },
        { x: 0.68, y: 0.46 },
      ],
    },
    {
      id: 'd6-roof',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.27, y: 0.5 },
        { x: 0.5, y: 0.28 },
        { x: 0.73, y: 0.49 },
      ],
    },
    {
      id: 'd6-chimney',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.6, y: 0.36 },
        { x: 0.6, y: 0.26 },
        { x: 0.66, y: 0.26 },
        { x: 0.66, y: 0.41 },
      ],
    },
    {
      id: 'd6-smoke',
      color: '#a8a29e',
      width: 2,
      points: [
        { x: 0.63, y: 0.24 },
        { x: 0.66, y: 0.2 },
        { x: 0.62, y: 0.16 },
        { x: 0.65, y: 0.12 },
      ],
    },
    {
      id: 'd6-door',
      color: '#1c1917',
      width: 2,
      points: [
        { x: 0.46, y: 0.72 },
        { x: 0.46, y: 0.58 },
        { x: 0.55, y: 0.58 },
        { x: 0.55, y: 0.72 },
      ],
    },
    {
      id: 'd6-window',
      color: '#1c1917',
      width: 2,
      points: [
        { x: 0.37, y: 0.56 },
        { x: 0.37, y: 0.63 },
        { x: 0.43, y: 0.63 },
        { x: 0.43, y: 0.56 },
        { x: 0.37, y: 0.56 },
      ],
    },
  ],

  // 7. Tree
  [
    {
      id: 'd7-trunk',
      color: '#6b4226',
      width: 4,
      points: [
        { x: 0.47, y: 0.74 },
        { x: 0.48, y: 0.6 },
        { x: 0.46, y: 0.5 },
        { x: 0.5, y: 0.6 },
        { x: 0.52, y: 0.74 },
      ],
    },
    {
      id: 'd7-canopy',
      color: '#2f9e44',
      width: 3,
      points: [
        { x: 0.36, y: 0.5 },
        { x: 0.3, y: 0.4 },
        { x: 0.35, y: 0.3 },
        { x: 0.44, y: 0.26 },
        { x: 0.5, y: 0.2 },
        { x: 0.57, y: 0.25 },
        { x: 0.65, y: 0.28 },
        { x: 0.7, y: 0.38 },
        { x: 0.66, y: 0.48 },
        { x: 0.58, y: 0.53 },
        { x: 0.46, y: 0.54 },
        { x: 0.36, y: 0.5 },
      ],
    },
  ],

  // 8. Fish
  [
    {
      id: 'd8-body',
      color: '#1971c2',
      width: 3,
      points: [
        { x: 0.3, y: 0.5 },
        { x: 0.34, y: 0.42 },
        { x: 0.44, y: 0.38 },
        { x: 0.56, y: 0.4 },
        { x: 0.64, y: 0.46 },
        { x: 0.66, y: 0.5 },
        { x: 0.62, y: 0.56 },
        { x: 0.52, y: 0.61 },
        { x: 0.4, y: 0.6 },
        { x: 0.32, y: 0.55 },
        { x: 0.3, y: 0.5 },
      ],
    },
    {
      id: 'd8-tail',
      color: '#1971c2',
      width: 3,
      points: [
        { x: 0.3, y: 0.5 },
        { x: 0.2, y: 0.42 },
        { x: 0.22, y: 0.5 },
        { x: 0.2, y: 0.58 },
        { x: 0.3, y: 0.5 },
      ],
    },
    {
      id: 'd8-fin',
      color: '#1971c2',
      width: 2,
      points: [
        { x: 0.46, y: 0.42 },
        { x: 0.48, y: 0.32 },
        { x: 0.52, y: 0.4 },
      ],
    },
    {
      id: 'd8-eye',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.58, y: 0.46 },
        { x: 0.59, y: 0.47 },
      ],
    },
  ],

  // 9. Bird
  [
    {
      id: 'd9-body',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.34, y: 0.56 },
        { x: 0.33, y: 0.48 },
        { x: 0.38, y: 0.4 },
        { x: 0.46, y: 0.38 },
        { x: 0.54, y: 0.4 },
        { x: 0.62, y: 0.46 },
        { x: 0.66, y: 0.52 },
        { x: 0.62, y: 0.58 },
        { x: 0.5, y: 0.6 },
        { x: 0.4, y: 0.58 },
        { x: 0.34, y: 0.56 },
      ],
    },
    {
      id: 'd9-wing',
      color: '#1c1917',
      width: 2,
      points: [
        { x: 0.42, y: 0.5 },
        { x: 0.5, y: 0.46 },
        { x: 0.56, y: 0.5 },
        { x: 0.48, y: 0.52 },
        { x: 0.42, y: 0.5 },
      ],
    },
    {
      id: 'd9-beak',
      color: '#f08c00',
      width: 3,
      points: [
        { x: 0.66, y: 0.5 },
        { x: 0.72, y: 0.49 },
        { x: 0.66, y: 0.46 },
      ],
    },
    {
      id: 'd9-eye',
      color: '#1c1917',
      width: 2,
      points: [
        { x: 0.58, y: 0.46 },
        { x: 0.59, y: 0.47 },
      ],
    },
    {
      id: 'd9-legs',
      color: '#1c1917',
      width: 2,
      points: [
        { x: 0.46, y: 0.6 },
        { x: 0.44, y: 0.68 },
        { x: 0.5, y: 0.6 },
        { x: 0.5, y: 0.68 },
      ],
    },
  ],

  // 10. Donut with sprinkles
  [
    {
      id: 'd10-outer',
      color: '#c2410c',
      width: 3,
      points: [
        { x: 0.5, y: 0.3 },
        { x: 0.62, y: 0.33 },
        { x: 0.69, y: 0.43 },
        { x: 0.68, y: 0.55 },
        { x: 0.6, y: 0.64 },
        { x: 0.5, y: 0.67 },
        { x: 0.39, y: 0.64 },
        { x: 0.31, y: 0.55 },
        { x: 0.3, y: 0.43 },
        { x: 0.37, y: 0.33 },
        { x: 0.5, y: 0.3 },
      ],
    },
    {
      id: 'd10-inner',
      color: '#c2410c',
      width: 3,
      points: [
        { x: 0.5, y: 0.43 },
        { x: 0.55, y: 0.45 },
        { x: 0.56, y: 0.5 },
        { x: 0.52, y: 0.54 },
        { x: 0.46, y: 0.53 },
        { x: 0.44, y: 0.47 },
        { x: 0.5, y: 0.43 },
      ],
    },
    {
      id: 'd10-sprinkle1',
      color: '#e03131',
      width: 2,
      points: [
        { x: 0.4, y: 0.37 },
        { x: 0.42, y: 0.39 },
      ],
    },
    {
      id: 'd10-sprinkle2',
      color: '#1971c2',
      width: 2,
      points: [
        { x: 0.47, y: 0.34 },
        { x: 0.49, y: 0.36 },
      ],
    },
    {
      id: 'd10-sprinkle3',
      color: '#2f9e44',
      width: 2,
      points: [
        { x: 0.58, y: 0.36 },
        { x: 0.6, y: 0.38 },
      ],
    },
    {
      id: 'd10-sprinkle4',
      color: '#9c36b5',
      width: 2,
      points: [
        { x: 0.62, y: 0.46 },
        { x: 0.64, y: 0.48 },
      ],
    },
    {
      id: 'd10-sprinkle5',
      color: '#f08c00',
      width: 2,
      points: [
        { x: 0.36, y: 0.5 },
        { x: 0.38, y: 0.52 },
      ],
    },
    {
      id: 'd10-sprinkle6',
      color: '#e03131',
      width: 2,
      points: [
        { x: 0.56, y: 0.58 },
        { x: 0.58, y: 0.6 },
      ],
    },
  ],
];

export function getRandomDoodle(): RelativeStroke[] {
  const index = Math.floor(Math.random() * doodles.length);
  return doodles[index] ?? doodles[0]!;
}
