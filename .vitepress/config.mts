import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [
    [
      "script",
      {
        defer: "",
        src: "https://static.cloudflareinsights.com/beacon.min.js",
        "data-cf-beacon": '{"token": "b728e1cb68824e8bb039eac45bfc1568"}',
      },
    ],
  ],
  appearance: "dark",
  title: "Jasen Carroll",
  description: "Bespoke software",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Writing", link: "/python-project-manager" },
    ],

    sidebar: [
      {
        text: "Writing",
        items: [
          { text: "Python Project Manager", link: "/python-project-manager" },
          { text: "How pyr Works", link: "/how-pyr-works" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/jasenc7/" }],
  },
});
