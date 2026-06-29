import type { Stroke } from '../types';

// All doodles use 0-1 relative coordinates, will be scaled to canvas size at render time
type RelativeStroke = Omit<Stroke, 'points'> & { points: { x: number; y: number }[] };

export const doodles: RelativeStroke[][] = [
  // 1. Signature swoop
  [
    {
      id: 'd1',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.1, y: 0.55 },
        { x: 0.14, y: 0.48 },
        { x: 0.2, y: 0.42 },
        { x: 0.27, y: 0.38 },
        { x: 0.35, y: 0.36 },
        { x: 0.44, y: 0.38 },
        { x: 0.52, y: 0.42 },
        { x: 0.6, y: 0.48 },
        { x: 0.67, y: 0.55 },
        { x: 0.73, y: 0.52 },
        { x: 0.8, y: 0.44 },
        { x: 0.85, y: 0.36 },
        { x: 0.88, y: 0.3 },
        { x: 0.92, y: 0.28 },
        { x: 0.95, y: 0.32 },
        { x: 0.98, y: 0.44 },
      ],
    },
  ],

  // 2. Heart
  [
    {
      id: 'd2',
      color: '#e03131',
      width: 3,
      points: [
        { x: 0.5, y: 0.7 },
        { x: 0.47, y: 0.64 },
        { x: 0.42, y: 0.56 },
        { x: 0.37, y: 0.5 },
        { x: 0.32, y: 0.46 },
        { x: 0.28, y: 0.44 },
        { x: 0.26, y: 0.46 },
        { x: 0.25, y: 0.5 },
        { x: 0.26, y: 0.56 },
        { x: 0.3, y: 0.62 },
        { x: 0.36, y: 0.68 },
        { x: 0.43, y: 0.72 },
        { x: 0.5, y: 0.74 },
        { x: 0.57, y: 0.72 },
        { x: 0.64, y: 0.68 },
        { x: 0.7, y: 0.62 },
        { x: 0.74, y: 0.56 },
        { x: 0.75, y: 0.5 },
        { x: 0.74, y: 0.46 },
        { x: 0.72, y: 0.44 },
        { x: 0.68, y: 0.46 },
        { x: 0.63, y: 0.5 },
        { x: 0.58, y: 0.56 },
        { x: 0.53, y: 0.64 },
        { x: 0.5, y: 0.7 },
      ],
    },
  ],

  // 3. Star
  [
    {
      id: 'd3',
      color: '#f08c00',
      width: 3,
      points: [
        { x: 0.5, y: 0.32 },
        { x: 0.52, y: 0.4 },
        { x: 0.6, y: 0.41 },
        { x: 0.54, y: 0.47 },
        { x: 0.56, y: 0.55 },
        { x: 0.5, y: 0.51 },
        { x: 0.44, y: 0.55 },
        { x: 0.46, y: 0.47 },
        { x: 0.4, y: 0.41 },
        { x: 0.48, y: 0.4 },
        { x: 0.5, y: 0.32 },
      ],
    },
  ],

  // 4. Wave
  [
    {
      id: 'd4',
      color: '#1971c2',
      width: 3,
      points: [
        { x: 0.08, y: 0.6 },
        { x: 0.14, y: 0.48 },
        { x: 0.22, y: 0.4 },
        { x: 0.3, y: 0.48 },
        { x: 0.38, y: 0.6 },
        { x: 0.46, y: 0.48 },
        { x: 0.54, y: 0.4 },
        { x: 0.62, y: 0.48 },
        { x: 0.7, y: 0.6 },
        { x: 0.78, y: 0.48 },
        { x: 0.86, y: 0.4 },
        { x: 0.92, y: 0.48 },
      ],
    },
  ],

  // 5. Spiral
  [
    {
      id: 'd5',
      color: '#9c36b5',
      width: 2,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 120; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const r = 0.02 + i * 0.004;
          pts.push({ x: 0.5 + Math.cos(angle) * r, y: 0.5 + Math.sin(angle) * r });
        }
        return pts;
      })(),
    },
  ],

  // 6. Arrow
  [
    {
      id: 'd6',
      color: '#2f9e44',
      width: 4,
      points: [
        { x: 0.2, y: 0.5 },
        { x: 0.5, y: 0.5 },
        { x: 0.72, y: 0.5 },
        { x: 0.78, y: 0.5 },
        { x: 0.74, y: 0.46 },
        { x: 0.78, y: 0.5 },
        { x: 0.74, y: 0.54 },
      ],
    },
  ],

  // 7. Infinity
  [
    {
      id: 'd7',
      color: '#0c8599',
      width: 3,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 100; i++) {
          const t = (i / 99) * Math.PI * 2;
          pts.push({
            x: 0.5 + (0.3 * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t)),
            y: 0.5 + (0.22 * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t)),
          });
        }
        return pts;
      })(),
    },
  ],

  // 8. Checkmark
  [
    {
      id: 'd8',
      color: '#2f9e44',
      width: 4,
      points: [
        { x: 0.3, y: 0.54 },
        { x: 0.38, y: 0.64 },
        { x: 0.52, y: 0.46 },
        { x: 0.72, y: 0.36 },
      ],
    },
  ],

  // 9. Flower
  [
    {
      id: 'd9',
      color: '#e03131',
      width: 2,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 200; i++) {
          const angle = (i / 200) * Math.PI * 2;
          const r = 0.12 + 0.06 * Math.sin(angle * 6);
          pts.push({ x: 0.5 + Math.cos(angle) * r, y: 0.5 + Math.sin(angle) * r });
        }
        return pts;
      })(),
    },
  ],

  // 10. Mountain
  [
    {
      id: 'd10',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.08, y: 0.7 },
        { x: 0.22, y: 0.5 },
        { x: 0.36, y: 0.64 },
        { x: 0.5, y: 0.34 },
        { x: 0.64, y: 0.58 },
        { x: 0.78, y: 0.42 },
        { x: 0.92, y: 0.7 },
      ],
    },
  ],

  // 11. Bird
  [
    {
      id: 'd11',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.38, y: 0.52 },
        { x: 0.42, y: 0.44 },
        { x: 0.48, y: 0.4 },
        { x: 0.54, y: 0.42 },
        { x: 0.6, y: 0.48 },
        { x: 0.62, y: 0.5 },
        { x: 0.54, y: 0.48 },
        { x: 0.48, y: 0.46 },
        { x: 0.42, y: 0.5 },
        { x: 0.38, y: 0.52 },
      ],
    },
  ],

  // 12. Sun
  [
    {
      id: 'd12',
      color: '#f08c00',
      width: 2,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 120; i++) {
          const angle = (i / 120) * Math.PI * 2;
          const r = 0.1 + 0.03 * Math.sin(angle * 12);
          pts.push({ x: 0.5 + Math.cos(angle) * r, y: 0.5 + Math.sin(angle) * r });
        }
        return pts;
      })(),
    },
  ],

  // 13. Lightning
  [
    {
      id: 'd13',
      color: '#f08c00',
      width: 3,
      points: [
        { x: 0.48, y: 0.28 },
        { x: 0.52, y: 0.4 },
        { x: 0.49, y: 0.44 },
        { x: 0.54, y: 0.56 },
        { x: 0.5, y: 0.6 },
        { x: 0.55, y: 0.72 },
      ],
    },
  ],

  // 14. Music note
  [
    {
      id: 'd14',
      color: '#9c36b5',
      width: 3,
      points: [
        { x: 0.44, y: 0.72 },
        { x: 0.44, y: 0.46 },
        { x: 0.5, y: 0.4 },
        { x: 0.5, y: 0.5 },
        { x: 0.44, y: 0.52 },
        { x: 0.44, y: 0.42 },
        { x: 0.5, y: 0.36 },
      ],
    },
    {
      id: 'd14b',
      color: '#9c36b5',
      width: 3,
      points: [
        { x: 0.42, y: 0.7 },
        { x: 0.52, y: 0.7 },
      ],
    },
  ],

  // 15. Moon
  [
    {
      id: 'd15',
      color: '#1c1917',
      width: 2,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 100; i++) {
          const angle = (i / 99) * Math.PI * 2;
          pts.push({ x: 0.5 + 0.14 * Math.cos(angle), y: 0.5 + 0.14 * Math.sin(angle) });
        }
        return pts;
      })(),
    },
  ],

  // 16. Fish
  [
    {
      id: 'd16',
      color: '#1971c2',
      width: 3,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 80; i++) {
          const angle = (i / 79) * Math.PI * 2;
          pts.push({ x: 0.5 + 0.16 * Math.cos(angle), y: 0.5 + 0.08 * Math.sin(angle) });
        }
        return pts;
      })(),
    },
    {
      id: 'd16b',
      color: '#1971c2',
      width: 3,
      points: [
        { x: 0.66, y: 0.5 },
        { x: 0.74, y: 0.44 },
        { x: 0.76, y: 0.5 },
        { x: 0.74, y: 0.56 },
      ],
    },
  ],

  // 17. Diamond
  [
    {
      id: 'd17',
      color: '#0c8599',
      width: 3,
      points: [
        { x: 0.5, y: 0.28 },
        { x: 0.72, y: 0.5 },
        { x: 0.5, y: 0.72 },
        { x: 0.28, y: 0.5 },
        { x: 0.5, y: 0.28 },
      ],
    },
  ],

  // 18. Tree
  [
    {
      id: 'd18',
      color: '#2f9e44',
      width: 3,
      points: [
        { x: 0.5, y: 0.74 },
        { x: 0.5, y: 0.56 },
        { x: 0.42, y: 0.56 },
        { x: 0.5, y: 0.4 },
        { x: 0.34, y: 0.48 },
        { x: 0.5, y: 0.32 },
        { x: 0.44, y: 0.28 },
        { x: 0.5, y: 0.22 },
        { x: 0.56, y: 0.28 },
        { x: 0.5, y: 0.32 },
        { x: 0.66, y: 0.48 },
        { x: 0.5, y: 0.4 },
        { x: 0.58, y: 0.56 },
        { x: 0.5, y: 0.56 },
      ],
    },
  ],

  // 19. Eye
  [
    {
      id: 'd19',
      color: '#1c1917',
      width: 3,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 100; i++) {
          const angle = (i / 99) * Math.PI * 2;
          pts.push({ x: 0.5 + 0.16 * Math.cos(angle), y: 0.5 + 0.1 * Math.sin(angle) });
        }
        return pts;
      })(),
    },
    {
      id: 'd19b',
      color: '#1c1917',
      width: 3,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 40; i++) {
          const angle = (i / 39) * Math.PI * 2;
          pts.push({ x: 0.5 + 0.04 * Math.cos(angle), y: 0.5 + 0.04 * Math.sin(angle) });
        }
        return pts;
      })(),
    },
  ],

  // 20. Flag
  [
    {
      id: 'd20',
      color: '#e03131',
      width: 3,
      points: [
        { x: 0.36, y: 0.74 },
        { x: 0.36, y: 0.32 },
        { x: 0.66, y: 0.36 },
        { x: 0.36, y: 0.46 },
        { x: 0.54, y: 0.5 },
        { x: 0.36, y: 0.56 },
      ],
    },
  ],

  // 21. Cat
  [
    {
      id: 'd21',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.4, y: 0.56 },
        { x: 0.38, y: 0.4 },
        { x: 0.42, y: 0.32 },
        { x: 0.48, y: 0.4 },
        { x: 0.5, y: 0.52 },
        { x: 0.52, y: 0.4 },
        { x: 0.58, y: 0.32 },
        { x: 0.62, y: 0.4 },
        { x: 0.6, y: 0.56 },
      ],
    },
  ],

  // 22. Cloud
  [
    {
      id: 'd22',
      color: '#1971c2',
      width: 3,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 160; i++) {
          const angle = (i / 159) * Math.PI * 2;
          const r = 0.08 + 0.04 * Math.sin(angle * 5) * Math.cos(angle * 3);
          pts.push({ x: 0.5 + Math.cos(angle) * r * 2, y: 0.5 + Math.sin(angle) * r });
        }
        return pts;
      })(),
    },
  ],

  // 23. House
  [
    {
      id: 'd23',
      color: '#1c1917',
      width: 3,
      points: [
        { x: 0.5, y: 0.26 },
        { x: 0.32, y: 0.44 },
        { x: 0.68, y: 0.44 },
        { x: 0.5, y: 0.26 },
        { x: 0.68, y: 0.44 },
        { x: 0.68, y: 0.72 },
        { x: 0.32, y: 0.72 },
        { x: 0.32, y: 0.44 },
        { x: 0.44, y: 0.72 },
        { x: 0.44, y: 0.56 },
        { x: 0.56, y: 0.56 },
        { x: 0.56, y: 0.72 },
      ],
    },
  ],

  // 24. Abstract loop
  [
    {
      id: 'd24',
      color: '#f08c00',
      width: 3,
      points: (() => {
        const pts = [];
        for (let i = 0; i < 150; i++) {
          const t = (i / 149) * Math.PI * 4;
          pts.push({
            x: 0.5 + (0.12 + 0.06 * Math.sin(t * 3)) * Math.cos(t),
            y: 0.5 + (0.08 + 0.05 * Math.cos(t * 2)) * Math.sin(t),
          });
        }
        return pts;
      })(),
    },
  ],
];

export function getRandomDoodle(): RelativeStroke[] {
  const index = Math.floor(Math.random() * doodles.length);
  return doodles[index] ?? doodles[0]!;
}
