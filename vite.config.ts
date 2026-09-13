import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Markhand - Draw Freely",
        short_name: "Markhand",
        description:
          "A fluid drawing canvas with customizable pens, guide patterns, and export options. Runs entirely in your browser.",
        start_url: "/",
        display: "standalone",
        background_color: "#f5f4f0",
        theme_color: "#f5f4f0",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Precache every real hashed build asset automatically, so
        // strokes drawn offline still have a working shell to load into
        // (drawing data itself lives in localStorage, not here).
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "/index.html",
        // The WebGL shader background is the heaviest single asset the
        // canvas view depends on; cache it and everything else that's
        // already been visited so a return visit works offline.
        runtimeCaching: [
          {
            urlPattern: ({ sameOrigin }) => sameOrigin,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "markhand-runtime",
            },
          },
        ],
      },
    }),
  ],
});
