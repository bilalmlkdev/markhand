export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
}

export interface DrawingMeta {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  strokeCount: number;
  theme: CanvasTheme;
}

export type GuideType = 'none' | 'dots' | 'grid';

export type CanvasTheme = 'default' | 'white' | 'warm' | 'cool' | 'paper' | 'graphite' | 'dark';

export type CursorStyle = 'crosshair' | 'pencil' | 'dot' | 'brush' | 'pen';

export interface ThemeConfig {
  name: string;
  bg: string;
  dot: string;
  surface: string;
}
