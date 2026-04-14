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
      { text: "Projects", link: "/python-project-manager" },
    ],

    sidebar: [
      {
        text: "Projects",
        items: [
          { text: "Python Project Manager", link: "/python-project-manager" },
          { text: "How pyr Works", link: "/how-pyr-works" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/jasenc7/" }],
  },
});
