// export interface Point {
//   x: number;
//   y: number;
// }

// export interface Stroke {
//   id: string;
//   points: Point[];
//   color: string;
//   width: number;
// }

// export interface Signature {
//   id: string;
//   strokes: Stroke[];
//   createdAt: number;
//   name: string;
// }

// export type ExportFormat = 'png' | 'svg' | 'pdf';

// export type GuideType = 'none' | 'dots' | 'grid' | 'lines';

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

export interface Signature {
  id: string;
  strokes: Stroke[];
  createdAt: number;
  name: string;
}

export type ExportFormat = 'png' | 'svg' | 'pdf';

export type GuideType = 'none' | 'dots' | 'grid' | 'lines';

export type CanvasTheme = 'default' | 'warm' | 'cool' | 'dark';

export interface ThemeConfig {
  name: string;
  bg: string;
  dot: string;
  surface: string;
}
