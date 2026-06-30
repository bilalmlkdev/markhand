import type { Stroke } from '../types';

type RelativeStroke = Omit<Stroke, 'points'> & { points: { x: number; y: number }[] };

export interface DoodleSet {
  name: string;
  strokes: RelativeStroke[];
}

export const doodles: DoodleSet[] = [
  {
    name: 'Sun',
    strokes: [
      {
        id: 'd1-face',
        color: '#1c1917',
        width: 4,
        points: [
          { x: 0.32, y: 0.5 },
          { x: 0.33, y: 0.38 },
          { x: 0.4, y: 0.28 },
          { x: 0.5, y: 0.24 },
          { x: 0.62, y: 0.27 },
          { x: 0.69, y: 0.37 },
          { x: 0.7, y: 0.5 },
          { x: 0.67, y: 0.62 },
          { x: 0.58, y: 0.7 },
          { x: 0.46, y: 0.71 },
          { x: 0.36, y: 0.64 },
          { x: 0.32, y: 0.5 },
        ],
      },
      {
        id: 'd1-ray-top',
        color: '#f08c00',
        width: 4,
        points: [
          { x: 0.5, y: 0.21 },
          { x: 0.5, y: 0.06 },
        ],
      },
      {
        id: 'd1-ray-bottom',
        color: '#f08c00',
        width: 4,
        points: [
          { x: 0.5, y: 0.74 },
          { x: 0.5, y: 0.89 },
        ],
      },
      {
        id: 'd1-ray-left',
        color: '#f08c00',
        width: 4,
        points: [
          { x: 0.29, y: 0.5 },
          { x: 0.12, y: 0.5 },
        ],
      },
      {
        id: 'd1-ray-right',
        color: '#f08c00',
        width: 4,
        points: [
          { x: 0.73, y: 0.5 },
          { x: 0.9, y: 0.5 },
        ],
      },
      {
        id: 'd1-ray-tl',
        color: '#f08c00',
        width: 4,
        points: [
          { x: 0.37, y: 0.31 },
          { x: 0.24, y: 0.18 },
        ],
      },
      {
        id: 'd1-ray-tr',
        color: '#f08c00',
        width: 4,
        points: [
          { x: 0.64, y: 0.3 },
          { x: 0.77, y: 0.17 },
        ],
      },
      {
        id: 'd1-ray-bl',
        color: '#f08c00',
        width: 4,
        points: [
          { x: 0.36, y: 0.67 },
          { x: 0.22, y: 0.79 },
        ],
      },
      {
        id: 'd1-ray-br',
        color: '#f08c00',
        width: 4,
        points: [
          { x: 0.63, y: 0.68 },
          { x: 0.78, y: 0.81 },
        ],
      },
      {
        id: 'd1-eye-left',
        color: '#1c1917',
        width: 3,
        points: [
          { x: 0.43, y: 0.47 },
          { x: 0.44, y: 0.48 },
        ],
      },
      {
        id: 'd1-eye-right',
        color: '#1c1917',
        width: 3,
        points: [
          { x: 0.57, y: 0.47 },
          { x: 0.58, y: 0.48 },
        ],
      },
      {
        id: 'd1-smile',
        color: '#1c1917',
        width: 3,
        points: [
          { x: 0.42, y: 0.57 },
          { x: 0.47, y: 0.62 },
          { x: 0.53, y: 0.62 },
          { x: 0.58, y: 0.57 },
        ],
      },
    ],
  },
  {
    name: 'House on a Hill',
    strokes: [
      {
        id: 'd2-hill',
        color: '#2f9e44',
        width: 3,
        points: [
          { x: 0.04, y: 0.85 },
          { x: 0.2, y: 0.75 },
          { x: 0.38, y: 0.82 },
          { x: 0.55, y: 0.72 },
          { x: 0.72, y: 0.8 },
          { x: 0.88, y: 0.74 },
          { x: 0.96, y: 0.85 },
        ],
      },
      {
        id: 'd2-walls',
        color: '#1c1917',
        width: 4,
        points: [
          { x: 0.26, y: 0.52 },
          { x: 0.25, y: 0.83 },
          { x: 0.75, y: 0.84 },
          { x: 0.76, y: 0.5 },
        ],
      },
      {
        id: 'd2-roof',
        color: '#1c1917',
        width: 4,
        points: [
          { x: 0.16, y: 0.56 },
          { x: 0.5, y: 0.16 },
          { x: 0.85, y: 0.55 },
        ],
      },
      {
        id: 'd2-roof-line',
        color: '#1c1917',
        width: 3,
        points: [
          { x: 0.2, y: 0.52 },
          { x: 0.8, y: 0.51 },
        ],
      },
      {
        id: 'd2-chimney',
        color: '#e03131',
        width: 4,
        points: [
          { x: 0.64, y: 0.32 },
          { x: 0.64, y: 0.16 },
          { x: 0.73, y: 0.16 },
          { x: 0.73, y: 0.39 },
        ],
      },
      {
        id: 'd2-smoke',
        color: '#a8a29e',
        width: 2,
        points: [
          { x: 0.69, y: 0.13 },
          { x: 0.74, y: 0.08 },
          { x: 0.68, y: 0.03 },
          { x: 0.73, y: 0.0 },
        ],
      },
      {
        id: 'd2-door',
        color: '#6b4226',
        width: 3,
        points: [
          { x: 0.44, y: 0.84 },
          { x: 0.44, y: 0.62 },
          { x: 0.56, y: 0.62 },
          { x: 0.56, y: 0.84 },
        ],
      },
      {
        id: 'd2-doorknob',
        color: '#6b4226',
        width: 3,
        points: [
          { x: 0.53, y: 0.73 },
          { x: 0.54, y: 0.74 },
        ],
      },
      {
        id: 'd2-window-left',
        color: '#1971c2',
        width: 3,
        points: [
          { x: 0.32, y: 0.6 },
          { x: 0.32, y: 0.72 },
          { x: 0.41, y: 0.72 },
          { x: 0.41, y: 0.6 },
          { x: 0.32, y: 0.6 },
        ],
      },
      {
        id: 'd2-window-right',
        color: '#1971c2',
        width: 3,
        points: [
          { x: 0.59, y: 0.6 },
          { x: 0.59, y: 0.72 },
          { x: 0.68, y: 0.72 },
          { x: 0.68, y: 0.6 },
          { x: 0.59, y: 0.6 },
        ],
      },
    ],
  },
  {
    name: 'Sleepy Cat',
    strokes: [
      {
        id: 'd3-body',
        color: '#1c1917',
        width: 4,
        points: [
          { x: 0.14, y: 0.78 },
          { x: 0.12, y: 0.62 },
          { x: 0.2, y: 0.5 },
          { x: 0.32, y: 0.46 },
          { x: 0.44, y: 0.5 },
          { x: 0.52, y: 0.58 },
          { x: 0.62, y: 0.52 },
          { x: 0.74, y: 0.5 },
          { x: 0.86, y: 0.56 },
          { x: 0.9, y: 0.68 },
          { x: 0.84, y: 0.78 },
          { x: 0.14, y: 0.78 },
        ],
      },
      {
        id: 'd3-ear-left',
        color: '#1c1917',
        width: 4,
        points: [
          { x: 0.2, y: 0.5 },
          { x: 0.18, y: 0.34 },
          { x: 0.31, y: 0.46 },
        ],
      },
      {
        id: 'd3-ear-right',
        color: '#1c1917',
        width: 4,
        points: [
          { x: 0.4, y: 0.48 },
          { x: 0.42, y: 0.32 },
          { x: 0.5, y: 0.46 },
        ],
      },
      {
        id: 'd3-eye',
        color: '#1c1917',
        width: 3,
        points: [
          { x: 0.27, y: 0.6 },
          { x: 0.34, y: 0.6 },
        ],
      },
      {
        id: 'd3-nose',
        color: '#e03131',
        width: 3,
        points: [
          { x: 0.21, y: 0.66 },
          { x: 0.25, y: 0.66 },
          { x: 0.23, y: 0.69 },
          { x: 0.21, y: 0.66 },
        ],
      },
      {
        id: 'd3-whiskers1',
        color: '#1c1917',
        width: 1,
        points: [
          { x: 0.2, y: 0.68 },
          { x: 0.04, y: 0.65 },
        ],
      },
      {
        id: 'd3-whiskers2',
        color: '#1c1917',
        width: 1,
        points: [
          { x: 0.2, y: 0.71 },
          { x: 0.04, y: 0.73 },
        ],
      },
      {
        id: 'd3-tail',
        color: '#1c1917',
        width: 4,
        points: [
          { x: 0.84, y: 0.74 },
          { x: 0.95, y: 0.62 },
          { x: 0.92, y: 0.46 },
          { x: 0.8, y: 0.4 },
        ],
      },
      {
        id: 'd3-zzz',
        color: '#a8a29e',
        width: 2,
        points: [
          { x: 0.5, y: 0.32 },
          { x: 0.57, y: 0.32 },
          { x: 0.5, y: 0.24 },
          { x: 0.57, y: 0.24 },
        ],
      },
    ],
  },
  {
    name: 'Big Tree',
    strokes: [
      {
        id: 'd4-trunk',
        color: '#6b4226',
        width: 6,
        points: [
          { x: 0.45, y: 0.92 },
          { x: 0.47, y: 0.7 },
          { x: 0.43, y: 0.5 },
          { x: 0.5, y: 0.68 },
          { x: 0.55, y: 0.5 },
          { x: 0.53, y: 0.92 },
        ],
      },
      {
        id: 'd4-branch-left',
        color: '#6b4226',
        width: 4,
        points: [
          { x: 0.46, y: 0.6 },
          { x: 0.3, y: 0.5 },
        ],
      },
      {
        id: 'd4-branch-right',
        color: '#6b4226',
        width: 4,
        points: [
          { x: 0.53, y: 0.58 },
          { x: 0.68, y: 0.48 },
        ],
      },
      {
        id: 'd4-canopy',
        color: '#2f9e44',
        width: 4,
        points: [
          { x: 0.16, y: 0.48 },
          { x: 0.1, y: 0.32 },
          { x: 0.18, y: 0.16 },
          { x: 0.32, y: 0.07 },
          { x: 0.46, y: 0.03 },
          { x: 0.5, y: 0.05 },
          { x: 0.56, y: 0.03 },
          { x: 0.7, y: 0.07 },
          { x: 0.84, y: 0.16 },
          { x: 0.91, y: 0.32 },
          { x: 0.85, y: 0.48 },
          { x: 0.72, y: 0.56 },
          { x: 0.56, y: 0.6 },
          { x: 0.4, y: 0.58 },
          { x: 0.26, y: 0.55 },
          { x: 0.16, y: 0.48 },
        ],
      },
      {
        id: 'd4-leaf-detail1',
        color: '#2f9e44',
        width: 2,
        points: [
          { x: 0.3, y: 0.25 },
          { x: 0.36, y: 0.3 },
        ],
      },
      {
        id: 'd4-leaf-detail2',
        color: '#2f9e44',
        width: 2,
        points: [
          { x: 0.6, y: 0.22 },
          { x: 0.66, y: 0.27 },
        ],
      },
      {
        id: 'd4-grass',
        color: '#2f9e44',
        width: 2,
        points: [
          { x: 0.08, y: 0.94 },
          { x: 0.92, y: 0.94 },
        ],
      },
    ],
  },
  {
    name: 'Big Fish',
    strokes: [
      {
        id: 'd5-body',
        color: '#1971c2',
        width: 4,
        points: [
          { x: 0.14, y: 0.5 },
          { x: 0.2, y: 0.32 },
          { x: 0.38, y: 0.22 },
          { x: 0.58, y: 0.24 },
          { x: 0.74, y: 0.36 },
          { x: 0.8, y: 0.5 },
          { x: 0.74, y: 0.64 },
          { x: 0.58, y: 0.76 },
          { x: 0.38, y: 0.78 },
          { x: 0.2, y: 0.68 },
          { x: 0.14, y: 0.5 },
        ],
      },
      {
        id: 'd5-tail',
        color: '#1971c2',
        width: 4,
        points: [
          { x: 0.14, y: 0.5 },
          { x: 0.0, y: 0.3 },
          { x: 0.04, y: 0.5 },
          { x: 0.0, y: 0.7 },
          { x: 0.14, y: 0.5 },
        ],
      },
      {
        id: 'd5-fin-top',
        color: '#1971c2',
        width: 3,
        points: [
          { x: 0.42, y: 0.23 },
          { x: 0.46, y: 0.08 },
          { x: 0.56, y: 0.22 },
        ],
      },
      {
        id: 'd5-fin-bottom',
        color: '#1971c2',
        width: 3,
        points: [
          { x: 0.4, y: 0.77 },
          { x: 0.43, y: 0.92 },
          { x: 0.53, y: 0.78 },
        ],
      },
      {
        id: 'd5-gill',
        color: '#1c1917',
        width: 2,
        points: [
          { x: 0.6, y: 0.38 },
          { x: 0.6, y: 0.6 },
        ],
      },
      {
        id: 'd5-eye',
        color: '#1c1917',
        width: 4,
        points: [
          { x: 0.66, y: 0.42 },
          { x: 0.67, y: 0.43 },
        ],
      },
      {
        id: 'd5-bubble1',
        color: '#a8a29e',
        width: 2,
        points: [
          { x: 0.86, y: 0.4 },
          { x: 0.87, y: 0.41 },
        ],
      },
      {
        id: 'd5-bubble2',
        color: '#a8a29e',
        width: 2,
        points: [
          { x: 0.9, y: 0.3 },
          { x: 0.91, y: 0.31 },
        ],
      },
    ],
  },
];

export function getRandomDoodle(): DoodleSet {
  const index = Math.floor(Math.random() * doodles.length);
  return doodles[index] ?? doodles[0]!;
}
