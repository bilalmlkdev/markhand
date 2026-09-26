# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [0.1.0] - 2026-09-26

First public release.

### Added

- Freehand drawing canvas with automatic ink smoothing
- Pixel eraser that splits strokes around the gap instead of wiping
  the whole canvas
- 8 preset colors per theme, a custom color picker, 1px to 12px
  stroke width, and per-tool default line weights (Crosshair, Pencil,
  Dot, Brush, Pen)
- Five cursor styles with Dot Grid, Grid, or no guide
- Six canvas themes (Pure White, Default, Warm, Cool, Paper, Sky)
  with automatic stroke recoloring on switch
- Undo, redo, and clear with keyboard shortcuts
- Export as PNG, SVG, copy to clipboard, print, and shareable URLs
- My Drawings gallery backed by localStorage (no account, no server)
- Unified glass toolbar dock with tooltips
- Product tour and instructions modal for first-time users
- Dark landing page with self-hosted, preloaded fonts (DM Sans and
  Instrument Serif)
- PWA install support, SEO, Open Graph, and Twitter card meta tags
- Error boundary and 404 page

### Fixed

- `crypto.randomUUID()` fallback for older browsers
- Stuck product tour overlay and body scroll lock after the tour
- Header and modal z-index conflicts
- Cursor color not following dark canvas themes
- Export dimensions and guide alignment in the export preview
- Stale portfolio and README links

### Changed

- Comment cleanup across the codebase, keeping only short logic hints
  where they clarify non-obvious algorithms
