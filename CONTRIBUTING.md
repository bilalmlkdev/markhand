# Contributing to Markhand

Thanks for wanting to make Markhand better. Markhand is a fully
client-side drawing studio, so most contributions are small, focused,
and easy to test in a browser.

## Getting started

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/markhand.git
   cd markhand
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:5173`.

## Before you open a pull request

- Run `npm run lint` and fix anything it reports.
- Run `npm run build` and make sure it passes. Note this runs
  `tsc -b` first, so TypeScript errors fail the build.
- Test your change with a real drawing: draw with each tool you
  touched, try the eraser, and switch canvas themes to check
  recoloring.
- If your change touches export code, export a PNG and an SVG and
  open both.

## What makes a good contribution

- Bug fixes with clear reproduction steps (tell us the input device:
  mouse, touch, or pen)
- Accessibility improvements (keyboard navigation, focus states,
  screen reader labels)
- New canvas themes (see "Adding a New Theme" in the README, it is a
  two-step process)
- Export improvements (formats, fidelity, print layout)
- Performance work on the drawing or erasing path
- Documentation fixes

For larger changes (new tools, changes to the stroke/erase model,
new dependencies), open an issue first so we can agree on the
direction before you build it.

## Project layout

- `src/components/canvas/` - drawing canvas and the bottom toolbar
- `src/components/controls/` - pen and theme controls
- `src/components/exports/` - export modal (PNG/SVG/copy/print)
- `src/components/gallery/` - My Drawings gallery and thumbnails
- `src/components/landing/` - the landing page
- `src/components/layout/` - share, instructions, product tour
- `src/components/ui/` - shared UI pieces (Button, ColorPicker, Slider)
- `src/hooks/` - `useDraw` (drawing/erasing) and keyboard shortcuts
- `src/lib/` - smoothing, themes, storage, sharing, cursors
- `src/types/` - shared TypeScript definitions

Deeper architecture notes live in the README under "Project
Structure" and "Directory Overview".

## Commit messages

Keep them short and prefixed when it fits:

- `fix:` bug fixes
- `feat:` new features
- `perf:` performance work
- `refactor:` code changes with no behavior change
- `docs:` documentation only
- `style:` styling only

## Code style

- TypeScript with React function components and hooks
- Tailwind CSS v4 utility classes
- Match the formatting of the file you are editing
- Do not add new npm dependencies without asking first

## Reporting issues

Use the GitHub issue templates. Include the browser you used, your
input device (mouse, touch, pen), and steps to reproduce.

## License

By contributing, you agree that your contributions are licensed under
the MIT License, the same license that covers the project.
