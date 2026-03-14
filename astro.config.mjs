import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://sirlisko.com",
	integrations: [react(), sitemap()],
	trailingSlash: "never",
});
