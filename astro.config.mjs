// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Archivo",
        cssVariable: "--font-archivo",
        weights: ["700"],
      },
      {
        provider: fontProviders.google(),
        name: "Raleway",
        cssVariable: "--font-raleway",
        weights: ["400 500"],
      },
    ],
  },
});
