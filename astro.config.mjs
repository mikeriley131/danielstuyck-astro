// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "PT Serif",
      cssVariable: "--font-pt-serif",
      styles: ["normal"],
      weights: ["400", "700"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Amaranth",
      cssVariable: "--font-amaranth",
      styles: ["normal"],
      weights: ["400"],
    },
  ],
  // image: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "admin.wordpresssite.com",
  //     },
  //   ],
  // },
});
