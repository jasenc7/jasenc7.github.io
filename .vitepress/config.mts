import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  appearance: "dark",
  title: "Jasen Carroll",
  description: "Bespoke software",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Projects", link: "/pyr" },
    ],

    sidebar: [
      {
        text: "Projects",
        items: [{ text: "pyr", link: "/pyr" }],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/jasenc7/" }],
  },
});
